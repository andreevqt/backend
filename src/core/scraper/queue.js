'use strict';

const waitUntil = (condition, ms = 0) => {
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
  constructor(capacity = 10) {
    this._items = [];
    this._capacity = capacity;
  }

  async dequeue() {
    await waitUntil(() => this._items.length !== 0);
    return this._items.shift();
  }

  getLength() {
    return this._items.length;
  }

  async enqueue(item) {
    await waitUntil(() => this._items.length < Math.floor(this._capacity));
    this._items.push(item);
  }
}

module.exports = Queue;
