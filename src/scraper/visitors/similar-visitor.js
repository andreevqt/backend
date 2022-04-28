'use stirct';

const BaseVisitor = require('./base-visitor');

class SimilarVisitor extends BaseVisitor {
  async getLinks() {
    return this._task._page.$$eval('a[href]', (links) => links
      .filter((el) => el.getAttribute('href').match(/film|movie/))
      .map((el) => el.href));
  }

  async getLastPage() {
    return 1;
  }
}

module.exports = SimilarVisitor;
