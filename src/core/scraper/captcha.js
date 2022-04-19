'use strict';

const axios = require('axios');
const config = require('../../config');
const { timeout } = require('../../utils');
const Queue = require('./queue');
const logger = require('../../logger');

const CAPTCHA_NOT_READY = 'CAPCHA_NOT_READY';
const ERROR_CAPTCHA_UNSOLVABLE = 'ERROR_CAPTCHA_UNSOLVABLE';
const ERROR_NO_SLOT_AVAILABLE = 'ERROR_NO_SLOT_AVAILABLE';
const RESOLVE_INTERVAL = 5000;
const MAX_RESOLVE_TRIES = 3;

class Captcha {
  constructor() {
    const apiKey = config.get('scraper.rucaptchaKey');
    if (!apiKey) {
      throw Error('Rucaptcha key is missing');
    }
    this._apiKey = apiKey;
    this._baseUrl = 'http://rucaptcha.com';
    this._focusQueue = new Queue(1);
  }

  async prepareImage(src) {
    return axios.get(src, { responseType: 'arraybuffer' })
      .then((response) => Buffer.from(response.data, 'binary')
        .toString('base64'));
  }

  async _isCaptcha(page) {
    return page.title().then((title) => title === 'Ой!');
  }

  async _handle(page) {
    logger.info('Captcha challenge started!!');
    await this._focus(page);
    await page.click('input[type="submit"]');

    while (true) {
      await page.waitForSelector('.AdvancedCaptcha-Image');

      const src = await page.$eval('.AdvancedCaptcha-Image', (el) => el.src);
      const result = await this._solve(src);

      await page.type('.Textinput-Control', result);
      await page.click('button[type="submit"]');
      // wait for error message
      try {
        await page.waitForSelector('.Textinput-Hint', { timeout: 5000 });
        await page.click('input[type="submit"]');
        // continue if no error tip element
        continue;
      } catch (err) {
        logger.info('Captcha resolved');
        await this._unfocus(page);
        // no error just break
        break;
      }
    }
  }

  async handle(page) {
    const isCaptcha = await this._isCaptcha(page);
    if (isCaptcha) {
      await this._handle(page);
    }
  }

  async _focus(page) {
    await this._focusQueue.enqueue(page);
    await page.bringToFront();
  }

  async _unfocus() {
    return this._focusQueue.dequeue();
  }

  async _solve(src) {
    let input;
    while (true) {
      input = await this._in(src);
      if (input.status !== 1) {
        if (input.request === ERROR_NO_SLOT_AVAILABLE) {
          await timeout(RESOLVE_INTERVAL);
          continue;
        }
        throw Error(input.request);
      }
      break;
    }
    // wait fo 5 seconds
    await timeout(RESOLVE_INTERVAL);

    let result;
    let unsolvableTries = 0;

    const id = input.request;

    while (true) {
      result = await this._res(id);

      if (result.status === 0) {
        if (result.request === CAPTCHA_NOT_READY) {
          await timeout(RESOLVE_INTERVAL);
          continue;
        }

        if (result.request === ERROR_CAPTCHA_UNSOLVABLE && unsolvableTries < MAX_RESOLVE_TRIES) {
          await timeout(RESOLVE_INTERVAL);
          unsolvableTries++;
          continue;
        }

        throw Error(result.request);
      }

      break;
    }

    return result.request;
  }

  async _in(src) {
    const body = await this.prepareImage(src);
    const result = await axios.post(`${this._baseUrl}/in.php`, {
      key: this._apiKey,
      method: 'base64',
      language: 1,
      lang: 'ru',
      body,
      action: 'get',
      json: 1
    });
    return result.data;
  }

  async _res(id) {
    return axios.get(`${this._baseUrl}/res.php`, {
      params: {
        id,
        json: 1,
        key: this._apiKey,
        action: 'get'
      }
    }).then((response) => response.data);
  }
}

module.exports = Captcha;
