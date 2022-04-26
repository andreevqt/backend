'use strict';

const puppeteer = require('puppeteer-extra')
const { Cluster } = require('puppeteer-cluster');
const proxyChain = require('proxy-chain');
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
    this._tasks = [];
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
      await Promise.all(this._tasks.map((task) => task.saveState()));
    });

    this._initialized = true;
  }

  async addTask(task) {
    this._tasks.push(task);
  }

  async getState(key, defaultValue) {
    const result = await this.knex
      .select('value')
      .from('settings')
      .where('key', key)
      .first();
    return result ? JSON.parse(result.value) : defaultValue;
  }

  async saveState(key, data) {
    const value = JSON.stringify(data);
    return this.knex('settings')
      .insert({ key, value })
      .onConflict('key')
      .merge();
  }

  async _main() {

  }

  async run() {
    await this.cluster.queue(this._main);
    await this.cluster.idle();
    await this.cluster.close();
    await this.knex.destroy();

    if (this._newProxyUrl) {
      proxyChain.closeAnonymizedProxy(this._newProxyUrl);
    }
  }
}

module.exports = ClusterManager;
