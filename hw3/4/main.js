'use strict';

const Ui = require('./ui');
const Decryptor = require('./decryptor');
const AccountManager = require('./accountManager');

const customers = [
  {
      payload: {
          name: 'Pitter Black',
          email: '70626c61636b40656d61696c2e636f6d',
          password: '70626c61636b5f313233'
}, meta: {
          algorithm: 'hex'
      }
},
{
  payload: {
      name: 'Oliver White',
      email: 'b3doaXRlQGVtYWlsLmNvbQ==',
      password: 'b3doaXRlXzQ1Ng=='
}, meta: {
      algorithm: 'base64'
  }
}];
const ui = new Ui(customers);

const d_options = {
  readableObjectMode: true,
  writableObjectMode: true,
  decodeStrings: false
};
const decryptor = new Decryptor(d_options);
const manager = new AccountManager();
ui.pipe(decryptor).pipe(manager);
