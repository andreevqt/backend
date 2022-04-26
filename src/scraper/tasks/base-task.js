'use stict';

const rejectIfTimeout = require('../reject-if-timeout');

class BaseTask {
  constructor({ manager, page, visitor, stateKey }) {
    this._manager = manager;
    this._page = page;
    this._visitor = visitor;
    this._stateKey = stateKey;
    this.processLink = this.processLink.bind(this);
  }

  async handleCaptcha() {
    return this._manager.captcha.handle(this._page);
  }

  async goto(url) {
    return rejectIfTimeout(this._page.goto(url, { waitUntil: 'domcontentloaded' }));
  }

  async saveState() {
    const state = visitor.getState();
    await this._manager.saveState(this._stateKey, state);
  }

  async processLink(link) {
    throw Error('Should implement this');
  }

  async run() {
    this._manager.registerTask(this);
    await this._visitor.visit(this.processLink);
  }
}

module.exports = BaseTask;
