'use strict';

const chalk = require('chalk');
const ProxyChain = require('proxy-chain');
const config = require('../config');

const loop = () => {
  return new Promise(() => null);
};

class ProxyRotator {
  constructor({ port, frequency, list } = {}) {
    this._list = list || config.get('rotator.proxyList');
    this._port = port || config.get('rotator.port');
    this._frequency = frequency || config.get('rotator.frequency');
    this._server = null;
    this._before = 0;
    this._currentProxy = 0;
    this._handleRequest = this._handleRequest.bind(this);
  }

  _chooseProxy() {
    const now = Date.now();

    if (!this._before) {
      this._before = now;
    }

    const diff = now - this._before;

    if (diff >= this._frequency) {
      if (this._currentProxy < this._list.length - 1) {
        this._currentProxy++;
      } else {
        this._currentProxy = 0;
      }

      this._before = now;
    }

    return this._list[this._currentProxy];
  }

  _handleRequest() {
    const proxy = this._chooseProxy();
    return {
      upstreamProxyUrl: proxy
    };
  }

  async run() {
    this._server = new ProxyChain.Server({
      port: this._port,
      verbose: false,
      prepareRequestFunction: this._handleRequest
    });

    await this._server.listen();
    console.log(`Listening on port ${chalk.green(this._server.port)}. Will rotate proxies every ${this._frequency}ms`);
    await loop();
  }

  async destroy() {
    if (this._server) {
      await this._server.close(true);
    }
  }
}

module.exports = ProxyRotator;
