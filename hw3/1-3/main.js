'use strict';

const Ui = require('./ui');
const Guardian = require('./guardian');
const AccountManager = require('./accountManager');
const Logger = require('./logger');

const customers = [
  {
      name: 'Pitter Black',
      email: 'pblack@email.com',
      password: 'pblack_123'
}, {
      name: 'Oliver White',
      email: 'owhite@email.com',
      password: 'owhite_456'
} ];

const ui = new Ui(customers);

const g_options = {
  readableObjectMode: true,
  writableObjectMode: true,
};
const guardian = new Guardian(g_options);
const manager = new AccountManager();
const logger = new Logger(g_options);

ui.pipe(guardian).pipe(logger).pipe(manager);