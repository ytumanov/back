'use strict';

const { Bank } = require('./index');

//jest.mock('events');
let bank;

const firstCustomer = {
  name: 'Ivan',
  balance: 10
}
const firstId = 1;

beforeAll(() => {
  const mockMath = Object.create(global.Math);
  const mockedDate = Object.create(global.Date);
  mockMath.random = () => 0;
  mockedDate.now = () => 1;

  global.Math = mockMath;
  global.Date = mockedDate;
});

beforeEach(() => {
  bank = new Bank();
});

describe('bank', () => {

  test('should have empty customers array by default', () => {
    expect(bank.customers.length).toBe(0)
  });

  test('should allow to register new customer', () => {
    expect(bank.register(firstCustomer)).toBe(1);
    expect(bank.customers.length).toBe(1);
  });

  test('should allow to register new customer with used id', () => {
    const secondCustomer = {
      name: 'Mariya',
      balance: 10
    }
    expect(bank.register(firstCustomer)).toBe(1);
    expect(bank.customers.length).toBe(1);
    expect(bank.register(secondCustomer)).toBe(1);
    expect(bank.customers.length).toBe(2);
  });

  test('should throw if customer with same name will register', () => {
    const sameNameCustomer = {
      name: 'Ivan',
      balance: 10
    }
    expect(bank.register(firstCustomer)).toBe(1);
    expect(bank.customers.length).toBe(1);
    expect(() => bank.register(sameNameCustomer)).toThrow(`duplicated customer for name: '${sameNameCustomer.name}'`);
    expect(bank.customers.length).toBe(1);
  });

  test('should allow to enroll', () => {
    expect(bank.register(firstCustomer)).toBe(1);
    expect(bank.customers[0].balance).toBe(10);
    expect(bank.emit('add', firstId, 15)).toBe(true);
    expect(bank.customers[0].balance).toBe(25);
  });

  test('should throw on enroll if amount is 0', () => {
    expect(bank.register(firstCustomer)).toBe(1);
    expect(bank.customers[0].balance).toBe(10);
    expect(() => bank.emit('add', firstId, 0)).toThrow(`amount should be grater than 0`);
    expect(bank.customers[0].balance).toBe(10);
  });

  test('should throw on enroll if amount is 0', () => {
    expect(() => bank.emit('add', firstId, 10)).toThrow(`customer with id '${firstId}' not found`);
  });
});