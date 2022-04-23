'use strict';

const puppeteer = require('puppeteer-extra')
const { Cluster } = require('puppeteer-cluster');
const proxyChain = require('proxy-chain');
const mainTask = require('./tasks/main');
const config = require('../config');
const createKnex = require('../core/database');
const Captcha = require('./captcha');
const logger = require('../logger');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const TIMEOUT = 0x7FFFFFFF;

class ClusterManager {
  constructor() {
    this.knex = null;
    this.captcha = new Captcha;
    this._initialized = false;
    this.cluster = null;
    this.page = 1;
    this._newProxyUrl = null;
  }

  async init() {
    if (this._initialized) {
      return;
    }

    this.knex = await createKnex();

    const args = [];
    const proxyUrl = config.get('scraper.proxy');
    if (proxyUrl) {
      this._newProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);
      args.push(`--proxy-server=${this._newProxyUrl}`);
      console.log(`Using proxy ${this._newProxyUrl}`);
    }

    const clusterConfig = {
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: config.get('scraper.maxConcurrency'),
      monitor: false,
      timeout: TIMEOUT,
      puppeteerOptions: {
        headless: config.get('scraper.headless'),
        args
      },
      puppeteer
    };

    this.cluster = await Cluster.launch(clusterConfig);

    const { page } = await this._getState();
    this.page = page;

    this.cluster.on('taskerror', async (err, data) => {
      logger.error(`error: ${err} ${err.stack}, data: ${data}`);
      await this._saveState({ page: this.page });
    });

    this._initialized = true;
  }

  async _getState() {
    const defaultValue = { page: 1 };
    const result = await this.knex
      .select('value')
      .from('settings')
      .where('key', 'scrapper')
      .first();
    return result ? JSON.parse(result.value) : defaultValue;
  }

  async _saveState(data) {
    const value = JSON.stringify(data);
    return this.knex('settings')
      .insert({ key: 'scrapper', value })
      .onConflict('key')
      .merge();
  }

  async run() {
    await this.cluster.queue(mainTask(this));
    await this.cluster.idle();
    await this.cluster.close();
    await this.knex.destroy();

    if (this._newProxyUrl) {
      proxyChain.closeAnonymizedProxy(this._newProxyUrl);
    }
  }
}

const run = async () => {
  const manager = new ClusterManager();
  await manager.init();
  await manager.run();
};

module.exports = { run };
