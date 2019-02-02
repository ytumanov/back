const { Readable } = require('stream');

class Ui extends Readable {
  constructor(data, options = {objectMode: true}) {
    super(options);
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
