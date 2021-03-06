const { Transform } = require('stream');
const { validate, validateFields } = require('../helpers');

const crypto = require('crypto');

class Guardian extends Transform {
    constructor(options = {}) {
        super(options);
    }

    _transform(customer, encoding, done) {
        const {
            payload: { email, password },
            payload,
            meta
        } = customer;

        const encryptedCustomer = {
            meta: {
                source: customer.meta.source
            },
            payload: {
                ...payload,
                email: this._encrypt(email),
                password: this._encrypt(password)
            }
        };

        const signedData = {
            meta: {
                source: encryptedCustomer.meta.source,
                signature: this._signData(encryptedCustomer.payload)
            },
            payload: encryptedCustomer.payload
        }

        const data = {
            data: signedData,
            name: Guardian.name,
            instance: this
        };

        validateFields(data);
        validate(data);

        this.push(signedData);
        done();
    }

    _encrypt(str) {
        const algorithm = 'aes192';
        const password = 'qwerty123';
        const key = crypto.scryptSync(password, 'salt', 24);

        const buf = Buffer.alloc(16);
        const iv = crypto.randomFillSync(buf, 10);

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(str, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    _signData(obj) {
        const sign = crypto.createSign('RSA-SHA256');

        const pk = 
        '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICXQIBAAKBgQC1mL2M1GYT2rUGNNQHVJdF7TyKLYPqgvv9VfOdgPDgm8E8edzJ\n' +
        'kip1ajfymrODg0m7U95sUOw1s1r/WZzLdIPHgDxbLHrDbQEWVgdTM2okje7pPOax\n' +
        '7PguhGHd2y2WEXGBUNXG0jQCyfq83nDl3YwJuPKNpgEPzzxibg8j3suKaQIDAQAB\n' +
        'AoGAA9LniuOeEqT0UuEh5dWeKdbJA4/Zy0Je1ALPUm24pMIi24clYwk046wM6Yrg\n' +
        'ZNCK6OrnMBi0IJ1aOS5F4vLdI3k2tcKmtdHlVHQl3YZZLUBubJF8HPZHyhYlargY\n' +
        'gWYMC8Wi2Z63fllb+A5yVgJZigEowkYzQSg1LS09vkMJL5ECQQDcM3DzC3qvp3AV\n' +
        '6p5uGKFI1nug4Y8XQvQZHRRoZL0UuRnCJZR/4OpI2rjWNXwsYibf7V0PZ3FXPajZ\n' +
        'gkVtnpbLAkEA0x6fxNlOkD6AIgAy4EW26eLRDuh8LSDBG/a2nfdRduMa0PwFglmT\n' +
        'heOmFqD8fJA4bCvhYl/cKCo/cGQmRj2JGwJBAJNmo+8t+fxnWvJw0YjlV+GIIc25\n' +
        '760kln3RJ34SITgkCAgcW+GWT35hW2WY+/xB37/6BldvaUF69vJS7+LHTC0CQCEP\n' +
        'n6d8/E+cagZpD46NfEp+KYzzHVcX1QXjCdANBeXfRLjLbrVt/6ss7jqG9WMwVpWh\n' +
        '/YahSmHD0/FuzYucYVcCQQDOL5EooCObADlMZwW6gkfRUhg8qNpLIKjZqdR2TOef\n' +
        '3MliwMWCHG2zzgsz8h+H/sQ9tWT+RCq8xA0RCJTcc/yk\n' +
        '-----END RSA PRIVATE KEY-----';

        sign.update(JSON.stringify(obj));

        return sign.sign(pk).toString('hex');
    }
}

module.exports = Guardian;
