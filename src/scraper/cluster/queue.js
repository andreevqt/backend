'use strict';

const waitUntil = (condition, ms = 100) => {
  return new Promise((resolve) => {
    const checkCondition = () => {
      if (condition()) {
        resolve();
        return;
      }
      setTimeout(checkCondition, ms)
    };
    setTimeout(checkCondition, ms);
  });
};

class Queue {
  constructor() {
    this._items = [];
  }

  async dequeue() {
    await waitUntil(() => this._items.length > 0);
    return this._items.shift();
  }

  get length() {
    return this._items.length;
  }

  async enqueue(item) {
    this._items.push(item);
  }
}

module.exports = Queue;
