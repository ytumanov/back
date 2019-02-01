const { Transform } = require('stream');

class Guardian extends Transform {
  constructor(options = {}) {
    super(options);

    this.init();
  }

  init() {
    this.on('close', () => {
      console.log('\n------ Transform on close');
    });

    this.on('drain', () => {
      console.log('\n------ Transform on drain');
    });

    this.on('error', error => {
      console.log('\n------ ERROR: ', error);
    });

    this.on('finish', () => {
      console.log('\n------ Transform on finish');
    });

    this.on('end', () => {
      console.log('\n------ Transform on end');
    });

    this.on('pipe', () => {
      console.log('\n------ Transform on pipe');
    });
  }

  _validateChunk(obj) {
    const keys = Object.keys(obj);

    if (keys.length !== 3) {
      this.emit('error', `Not valid customer object length`);
      return;
    }

    keys.map(key => {
      if (obj[key] === ('' || undefined)) {
        this.emit(
          'error',
          `${key} is required and couldn't be empty`
        );
        return;
      }

      if (!(typeof(obj[key]) === 'string')) {
        this.emit(
          'error',
          `All properties should be string type, but ${typeof(obj[key])} - ${obj[key]} found`
        );
      }
      
    })

  }



  _transform(chunk, encoding, done) {
    this._validateChunk(chunk);

    this.push(chunk);

    
    // chunk.forEach(element => {
      
    // });
    //console.log('bbbb ' + JSON.stringify(chunk));
    done();
  }

_flush(done) {
    done();
}
}


module.exports = Guardian;
