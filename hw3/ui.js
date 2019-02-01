const { Readable } = require('stream');

class Ui extends Readable {
  constructor(data) {
    super({objectMode: true});
    this.data = data;
    this.init();
  }

  init() {
    this.on('data', chunk => {
    });

  }

  _read() {
    let data = this.data.shift();
    if (!data) {
      //if data is fully read
      this.push(null);
    } else {
      this.push(data);
    }
  }
}

module.exports = Ui;
