'use strict';

const BaseTask = require('./base-task');

class MainTask extends BaseTask {
  constructor() {
    this._manager =
    super({

    })
  }
  async processLink(link) {
    console.log(link);
  }
}

module.exports = MainTask;
