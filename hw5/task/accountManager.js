const { Writable } = require('stream');
const { validate, validateFields } = require('../helpers');

const crypto = require('crypto');

class AccountManager extends Writable {
    constructor(options = {}) {
        super(options);

        this._init();
    }

    _init() {
        this.on('finish', () => {
            console.log('Finished');
        });
    }

    _write(customer, encoding, done) {
        const data = {
            data: customer,
            name: AccountManager.name,
            instance: this
        };

        validateFields(data);
        validate(data);
        this._verify(customer);
        console.log({customer});

        done();
    }

    _verify(customer) {
        const cert = 
        '-----BEGIN CERTIFICATE-----\n' +
        'MIICATCCAWoCCQCuCSyS6Uak9jANBgkqhkiG9w0BAQsFADBFMQswCQYDVQQGEwJB\n' +
        'VTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0\n' +
        'cyBQdHkgTHRkMB4XDTE5MDIwNTA5NDkxOFoXDTE5MDMwNzA5NDkxOFowRTELMAkG\n' +
        'A1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0\n' +
        'IFdpZGdpdHMgUHR5IEx0ZDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAtZi9\n' +
        'jNRmE9q1BjTUB1SXRe08ii2D6oL7/VXznYDw4JvBPHncyZIqdWo38pqzg4NJu1Pe\n' +
        'bFDsNbNa/1mcy3SDx4A8Wyx6w20BFlYHUzNqJI3u6Tzmsez4LoRh3dstlhFxgVDV\n' +
        'xtI0Asn6vN5w5d2MCbjyjaYBD888Ym4PI97LimkCAwEAATANBgkqhkiG9w0BAQsF\n' +
        'AAOBgQBoFLPxmm3TL+PBBcXoOGaRbbvGelwXsXgEZCdr+RxMchmbgcKcjc+2+VGa\n' +
        'eiiF3RMGjmz2KtYwg0uv2R331EqBzvmgRnoNH/1tnWmJPylcF2eCzG+NSc4kWNRN\n' +
        '6ZrCfAkaih1l+niEkWeWMTcRns6hTwJ+yrm/ijs0u8nL1XhAkg==\n' +
        '-----END CERTIFICATE-----';

        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(JSON.stringify(customer.payload));

        const bufferSignature = Buffer.from(customer.meta.signature, 'hex');

        if (!verify.verify(cert, bufferSignature)) {
            this.emit(
                'error',
                new Error(
                    `data received from unknown sender`
                )
            );
        }
    }
}

module.exports = AccountManager;
