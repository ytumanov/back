
'use strict';

const EventEmitter = require('events');

class DB extends EventEmitter{
  constructor() {
    super();
    this.logs = [];

    this.on('log', log => {
      this.logs.push(log);
    });

    this.on('show', () => {
      console.log(this.logs);
    });
  }
}

module.exports = DB;