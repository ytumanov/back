'use strict';

const Ui = require('./ui');
const Guardian = require('./guardian');

const customers = [
  {
      name: 'Pitter Black',
      email: 'pblack@email.com',
      password: undefined
}, {
      name: 'Oliver White',
      email: 'owhite@email.com',
      password: 'owhite_456'
} ];

const ui = new Ui(customers);

const g_options = {
  readableObjectMode: true,
  writableObjectMode: true,
  decodeStrings: false
};
const guardian = new Guardian(g_options);
// const manager = new AccountManager();

ui.pipe(guardian)//.pipe(manager);