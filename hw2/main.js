'use strict';

const Bank = require('./bank');

const bank = new Bank();

bank.on('add', (id, addBalance) => {
  bank.add(id, addBalance);
});

bank.on('withdraw', (id, balanceToRemove) => {
  bank.withdraw(id, balanceToRemove);
});

bank.on('changeLimit', (id, func) => {
  bank.changeLimit(id, func);
});

bank.on('get', (id, func) => {
  bank.get(id, func);
})

bank.on('error', error => {
  throw error;
});

bank.on('send', (idFrom, idTo, value) => {
  bank.send(idFrom, idTo, value);
})


const personId = bank.register({
  name: 'Oliver White',
  balance: 700,
  limit: (amount) => amount < 10
});

const personIdBlack = bank.register({
  name: 'Oliver Black',
  balance: 700,
  limit: (amount) => amount < 10
});

bank.emit('withdraw', personId, 5);
bank.emit('get', personId, (amount, name) => {
  console.log(`${name} has ${amount}₴`); // I have 695₴
});
//Вариант 1
bank.emit('changeLimit', personId, (amount, currentBalance, updatedBalance) => {
  return amount < 100 && updatedBalance > 650;
});
bank.emit('withdraw', personId, 15);
bank.emit('get', personId, (amount, name) => {
  console.log(`${name} has ${amount}₴`); // I have 680₴
});

// Вариант 2
bank.emit('changeLimit', personIdBlack, (amount, currentBalance, updatedBalance) => {
  return amount < 100 && updatedBalance > 700 && currentBalance >
600;
});

//test limit on send
bank.send(personId, personIdBlack, 20);

bank.emit('get', personId, (amount, name) => {
  console.log(`${name} has ${amount}₴`); // I have 660₴
});

bank.emit('get', personIdBlack, (amount, name) => {
  console.log(`${name} has ${amount}₴`); // I have 720₴
});

//test limit on send
bank.send(personId, personIdBlack, 20); // Error , updated balance limit is 650 and it's > new balance 640