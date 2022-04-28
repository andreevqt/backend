'use strict';

const cluster = require('./cluster/cluster');
const proxyChain = require('proxy-chain');
const config = require('../config');
const createKnex = require('../core/database');
const Captcha = require('./captcha');
const logger = require('../logger');
const MainTask = require('./tasks/main-task');


class ClusterManager {
  constructor() {
    this.knex = null;
    this.captcha = new Captcha;
    this._initialized = false;
    this.cluster = null;
    this.page = 1;
    this._newProxyUrl = null;
    this._tasks = [];
    this._main = this._main.bind(this);
    this._saveAll = this._saveAll.bind(this);
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
      puppeteerOptions: {
        headless: config.get('scraper.headless'),
        args
      }
    };

    this.cluster = await cluster.launch(clusterConfig);

    /* this.cluster.on('taskerror', async (err, data) => {
      logger.error(`Error: ${err} ${err.stack}, data: ${data}`);
      await this._saveAll();
    }); */

    this._initialized = true;
  }

  async _saveAll() {
    return Promise.all(this._tasks.map((task) => task.saveState()));
  }

  async _loadAll() {
    return Promise.all(this._tasks.map((task) => task.loadState()));
  }

  async addTask(task) {
    this._tasks.push(task);
  }

  async execute(data, task) {
    return this.cluster.execute(data, task);
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

  async _main({ page }) {
    const mainTask = new MainTask(this, page);
    this.addTask(mainTask);

    await this._loadAll();
    await mainTask.run();
  }

  async run() {
    await this.cluster.enqueue(null, this._main);
    await this.cluster.run();
    await this.cluster.close();
    await this.knex.destroy();

    if (this._newProxyUrl) {
      proxyChain.closeAnonymizedProxy(this._newProxyUrl);
    }
  }
}

module.exports = ClusterManager;
