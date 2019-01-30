
'use strict';

const EventEmitter = require('events');

class Bank extends EventEmitter{
  constructor() {
    super();
    this.persons = [];
    this.lastId = 1;
  }

  register(person) {
    this._validateNewPerson(person);
    
    this.persons.push({
      name: person.name,
      balance: person.balance,
      limit: person.limit
    });

    return this.lastId++;
  }

  add(id, balance) {
    this._isValidId(id);
    if (balance <= 0) {
      this.emit('error', `Not valid balance to add provided`);
    }
    const person = this._getPersonById(id);
    person.balance += balance;
  }

  withdraw(id, balanceToRemove) {
    this._isValidId(id);

    const person = this._getPersonById(id);

    if (balanceToRemove <= 0) {
      this.emit('error', `Not valid balance to remove provided`);
    }

    this._isLimitValid(
      person,
      balanceToRemove,
      person.balance,
      person.balance - balanceToRemove,
    );

    if (balanceToRemove > person.balance) {
      this.emit('error', `Balance to remove is more than user has`);
    }
    person.balance -= balanceToRemove;
  }

  send(idFrom, idTo, value) {
    this._isValidId(idFrom);
    this._isValidId(idTo);

    const from = this._getPersonById(idFrom);
    const to = this._getPersonById(idTo);

    if (value <= 0) {
      this.emit('error', `Not valid value to send provided`);
    }

    if (value > from.balance) {
      this.emit('error', `Sender could not send more than his balance`);
    }

    this._isLimitValid(
      from,
      value,
      from.balance,
      from.balance - value,
    );

    //lines 79-84 could be removed, there is no reason to check receiver balance
    this._isLimitValid(
      to,
      value,
      to.balance,
      to.balance + value,
    );
    
    from.balance -= value;
    to.balance += value;
  }

  get(id, func) {
    this._isValidId(id);
    const person = this._getPersonById(id);
    func(person.balance, person.name);
  }

  changeLimit(id, func) {
    this._isValidId(id);

    const person = this._getPersonById(id);
    person.limit = func;
  }

  _isLimitValid(person, ...params) {
    if (!person.limit(...params)) {
      this.emit('error', `Not allowed limit provided`);
    }
  }

  _getPersonById(id) {
    return this.persons[id - 1];
  }

  _isValidId(id) {
    if(this._getPersonById(id) === undefined) {
      this.emit('error', `Person with provided id is not exist`);
    }
  }

  _validateNewPerson(person) {
    this.persons.forEach(p => {
      if (p.name === person.name) {
        this.emit('error', `Name ${person.name} is in use`);
      }
    });

    if (person.balance <= 0) {
      this.emit('error', `Not valid start balance provided`);
    }
  }
}

module.exports = Bank;