'use strict';

const puppeteer = require('puppeteer-extra')
const { Cluster } = require('puppeteer-cluster');
const proxyChain = require('proxy-chain');
const mainTask = require('./tasks/main');
const repairTask = require('./tasks/repair');
const config = require('../config');
const createKnex = require('../core/database');
const Captcha = require('./captcha');
const logger = require('../logger');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const TIMEOUT = 1800000;

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

    const args = ['--no-sandbox', '--disable-setuid-sandbox'];
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

    await this.loadState();

    this.cluster.on('taskerror', async (err, data) => {
      logger.error(`error: ${err} ${err.stack}, data: ${data}`);
      await this.saveState();
    });

    this._initialized = true;
  }

  async loadState() {
    const { page } = await this._getState();
    this.page = page;
  }

  async saveState() {
    await this._saveState({ page: this.page });
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

  async run(task) {
    await this.cluster.queue(task(this));
    await this.cluster.idle();
    await this.cluster.close();
    await this.knex.destroy();

    if (this._newProxyUrl) {
      proxyChain.closeAnonymizedProxy(this._newProxyUrl);
    }
  }

  async scrape() {
    await this.run(mainTask);
  }

  async repair() {
    await this.run(repairTask);
  }
}

module.exports = ClusterManager;
