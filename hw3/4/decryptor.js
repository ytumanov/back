const { Transform } = require('stream');

class Decryptor extends Transform {
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
      //console.log('\n------ Transform on finish');
    });

    this.on('end', () => {
      //console.log('\n------ Transform on end');
    });

    this.on('pipe', () => {
      console.log('\n------ Transform on pipe');
    });
  }

  _validatePayload(obj) {
    const keys = Object.keys(obj);

    if (keys.length !== 3) {
      this.emit('error', `Not valid payload object length`);
      return;
    }

    keys.map(key => {
      if (obj[key] === '' || obj[key] === undefined) {
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

  _validateMeta(obj) {
    const keys = Object.keys(obj);

    if (keys.length !== 1) {
      this.emit('error', `Not valid meta object length`);
      return;
    }

    if (obj['algorithm'] !== 'hex' && obj['algorithm'] !== 'base64') {
      this.emit('error', `Not allowed decryption ${obj['algorithm']} provided, hex and base64 allowed`);
    }
  }

  _transformObject(obj) {
    const decryptor = obj['meta']['algorithm'];
    const customers = obj['payload'];
    const keys = Object.keys(customers);
    
    keys.map(key => {
      if (key === 'email' || key === 'password') {
        customers[key] = Buffer.from(customers[key], decryptor).toString();
      }
    })

    return customers;
  }

  _transform(chunk, encoding, done) {
    this._validatePayload(chunk['payload']);
    this._validateMeta(chunk['meta']);
    const transformed = this._transformObject(chunk);
    this.push(transformed);

    done();
  }
}


module.exports = Decryptor;
