'use strict';

const { validate, validateFields } = require('./');
const name = 'test';

describe('validate', () => {

  test('should validate if all required fields are specified and valid types are provided', () => {
    const data = {
      payload: {
        name: 'testName',
        email: 'test@test.com',
        password: 'qwerty',
      },
      meta: {}
    };
    expect(() => validate({data, name})).not.toThrow();
  });

  test('should throw if payload is not an object', () => {
    const data = {
      payload: 'string',
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload should be an object`);
  });

  test('should throw if payload.name is empty', () => {
    const data = {
      payload: {
        name: '',
        email: 'test@test.com',
        password: 'qwerty',
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload.name should not be empty`);
  });

  test('should throw if payload.name is not a string', () => {
    const data = {
      payload: {
        name: 123,
        email: 'test@test.com',
        password: 'qwerty',
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload.name should should be a string`);
  });

  test('should throw if payload.name is not specified', () => {
    const data = {
      payload: {
        email: 'test@test.com',
        password: 'qwerty',
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload should have required field name`);
  });

  test('should throw if payload.email is not specified', () => {
    const data = {
      payload: {
        name: 'testName',
        password: 'qwerty',
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload should have required field email`);
  });

  test('should throw if payload.email is an empty', () => {
    const data = {
      payload: {
        email: '',
        name: 'testName',
        password: 'qwerty',
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload.email should not be empty`);
  });

  test('should throw if payload.email is not a string', () => {
    const data = {
      payload: {
        name: 'testName',
        email: 123,
        password: 'qwerty',
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload.email should should be a string`);
  });

  test('should throw if payload.password is not specified', () => {
    const data = {
      payload: {
        name: 'testName',
        email: 'test@test.com'
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload should have required field password`);
  });

  test('should throw if payload.password is an empty', () => {
    const data = {
      payload: {
        email: 'test@test.com',
        name: 'testName',
        password: '',
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload.password should not be empty`);
  });

  test('should throw if payload.password is not a string', () => {
    const data = {
      payload: {
        name: 'testName',
        email: 'test@test.com',
        password: 123,
      },
      meta: {}
    };
    expect(() => validate({data, name})).toThrow(`${name}: payload.password should should be a string`);
  });

});

describe('validateFields', () => {
  test('should validateFields if only allowed fields are provided', () => {
    const data = {
      payload: {
        name: 'testName',
        email: 'test@test.com',
        password: 'qwerty'
      },
      meta: {
        algorithm: 'hex'
      }
    };
    expect(() => validateFields({data, name, instance: this})).not.toThrow();
  });

  test('should validateFields if not all allowed fields provided', () => {
    const data = {
      payload: {
        name: 'testName',
        password: 'qwerty'
      },
      meta: {
        algorithm: 'hex'
      }
    };
    expect(() => validateFields({data, name, instance: this})).not.toThrow();
  });

  test('should throw if not allowed string field is provided', () => {
    const data = {
      payload: {
        name: 'testName',
        email: 'test@test.com',
        testNotValid: 'qwerty'
      },
      meta: {
        algorithm: 'hex'
      }
    };
    expect(() => validateFields({data, name, instance: this})).toThrow(`${name}: data contains not allowed field — testNotValid`);
  });

  test('should throw if not allowed object field is provided', () => {
    const data = {
      payloadNotValid: {
        name: 'testName',
        email: 'test@test.com',
        test: 'qwerty'
      },
      meta: {
        algorithm: 'hex'
      }
    };
    expect(() => validateFields({data, name, instance: this})).toThrow(`${name}: data contains not allowed field — payloadNotValid`);
  });
});