'use strict';

class Health {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  publish(data) {
    if (this.listeners.length < 1) {
      return;
    }
    this.listeners.forEach(function(listener) {
      listener(data || {});
    });
  }
}

module.exports = new Health();
