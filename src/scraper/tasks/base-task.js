'use stict';

const rejectIfTimeout = require('../reject-if-timeout');
const timeout = require('../timeout');
const { extractor } = require('../extractor');

class BaseTask {
  constructor(manager, page, stateKey) {
    this._manager = manager;
    this._page = page;
    this._stateKey = stateKey;
    this.processLink = this.processLink.bind(this);
    this._visitor = this.getVisitor();
  }

  async execute(page, command) {
    return page.evaluate(extractor, command);
  }

  async handleCaptcha() {
    return this._manager.captcha.handle(this._page);
  }

  async goto(url, page = this._page) {
    await timeout();
    await rejectIfTimeout(page.goto(url, { waitUntil: 'domcontentloaded' }));
    await this.handleCaptcha();
  }

  async saveState() {
    const state = this._visitor.getState();
    await this._manager.saveState(this._stateKey, state);
  }

  async loadState() {
    const state = await this._manager.getState(this._stateKey);
    this._visitor.setState(state);
  }

  async processLink(link) {
    throw Error('Should implement this');
  }

  getVisitor() {
    return null;
  }

  async run() {
    await this._visitor.visit(this.processLink);
  }
}

module.exports = BaseTask;
