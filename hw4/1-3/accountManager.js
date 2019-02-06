const { Writable } = require('stream');

class AccountManager extends Writable {
    constructor(options = {objectMode: true}) {
        super(options);

        this.init();
        this.storage = [];
    }

    init() {
        this.on('drain', () => {
            console.log('\n------ writable on drain');
        });

        this.on('error', error => {
            console.log('\n------ ERROR', error);
        });

        this.on('finish', () => {
            // console.log('\n writable on finish:\n');
            // console.log(this.storage);
        });
    }

    _write(chunk, encoding, done) {
        if (typeof(chunk) !== 'object') {
          this.emit('error', 'Received error is not an object');
        }

        console.log(chunk['payload']);
        this.storage.push(chunk);
        done();
    }
}

module.exports = AccountManager;