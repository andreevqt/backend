'use stirct';

const BaseVisitor = require('./base-visitor');

class ListVisitor extends BaseVisitor {
  async getLinks() {
    return this._task._page.$$eval('a[href]', (links) => links
      .filter((el) => el.getAttribute('href').match(/^\/film\/\d+\/$/))
      .map((el) => el.href));
  }

  async getLastPage() {
    return this._task._page.$eval('.styles_smaller__SzWsn', (el) => +el.textContent);
  }
}

module.exports = ListVisitor;
