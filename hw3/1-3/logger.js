const { Transform } = require('stream');
const DB = require('./db');

class Logger extends Transform {
  constructor(options = {}) {
    super(options);
    this.db = new DB();
    this.init(this.db);
  }

  init() {
    this.on('error', error => {
      console.log('\n------ ERROR: ', error);
    });

    this.on('end', () => {
      console.log('\n------*** LOG RESULT ***------\n');
      this.db.emit('show', {});
    });
  }

  _transform(chunk, encoding, done) {
    this.db.emit('log', {
      source: chunk.meta.source,
      payload: chunk.payload,
      created: new Date()
    })
    this.push(chunk);

    done();
  }
}

module.exports = Logger;
