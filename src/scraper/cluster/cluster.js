'use strict';

const puppeteer = require('puppeteer-extra');
const pLimit = require('p-limit');
const config = require('../../config');
const TIMEOUT = 1800000;

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

class Cluster {
  constructor({ maxConcurrency, timeout }) {
    this._maxConcurrency = maxConcurrency;
    this._timeout = timeout;
    // data, task, callbacks
    this._queue = [];
    this._browser = null;
    this._limit = pLimit(this._maxConcurrency);
    this._busyTasks = 0;
    this.doWork = this.doWork.bind(this);
    this.work = this.work.bind(this);
    this._intervalId = null;
  }

  async launch(options) {
    this._browser = await puppeteer.launch(options);
    return this;
  }

  enqueue(data, task) {
    this._queue.push({ data, task });
  }

  async execute(data, task) {
    // console.log(data);
    return new Promise((resolve, reject) => {
      const callbacks = { resolve, reject };
      this._queue.push({ data, task, callbacks });
    });
  }

  async doWork(params) {
    console.log(params);
    const { data, task, callbacks } = params;
    this._busyTasks++;

    try {
      const page = await this._browser.newPage();
      await task({ page, data });
      await page.close();
      callbacks && callbacks.resolve();
    } catch (err) {
      if (callbacks) {
        return callbacks.reject(err);
      }
      throw err;
    }
    finally {
      this._busyTasks--;
    }
  }

  async work(resolve) {
    if (!this._queue.length && !this._busyTasks) {
      return resolve();
    }

    let task;
    const tasks = [];
    while (!!(task = this._queue.shift())) {
      console.log(task);
      tasks.push(this._limit(() => this.doWork(task)));
    }

    await Promise.all(tasks);
    setTimeout(this.work, 100);
  }

  async run() {
    return new Promise((resolve) => {
      setTimeout(() => this.work(resolve), 100);
    });
  }

  async close() {
    if (this._browser) {
      return this._browser.close();
    }
  }
}

const defaultConfig = {
  maxConcurrency: config.get('scraper.maxConcurrency'),
  timeout: TIMEOUT,
  pupeteerOptions: {
    headless: config.get('scraper.headless')
  }
};

const launch = async (config = {}) => {
  const cfg = { ...defaultConfig, ...config };
  const { pupeteerOptions, ...rest } = cfg;

  return new Cluster(rest).launch(pupeteerOptions);
};




module.exports.launch = launch;
