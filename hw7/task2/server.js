const net = require('net');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const server = net.createServer();
const PORT = 8080;
let users;

server.on('connection', socket => {
    socket.setEncoding('utf8');
    console.log('New client connected!');

    socket.on('data', msg => {
      const clientsFilter = JSON.parse(msg);

      if (!validateFilter(clientsFilter, socket)) {
        return;
      }

      if (!validateTypes(clientsFilter, socket)) {
        return;
      }

      const filteredUsers = filter(clientsFilter);
      socket.write(`Result: ${JSON.stringify(filteredUsers)}`);
    });

    socket.on('error', error => {
      socket.write(`From server, error: ${error}`);
    })

    socket.on('end', () => {
        console.log('Client is disconnected!');
    });
});

server.on('listening', () => {
  readFile(path.join(__dirname, './users.json'))
  .then(file => users = JSON.parse(file));

  console.log(`TCP Server started on port ${PORT}!`);
});

server.listen(PORT);

const filter = (criteria) => {
    return users.filter(user => fits(user, criteria) && fits(user.name, criteria.name) && fits(user.address, criteria.address));
}

const fits = (obj, criteria) => {
  let fits = true;
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
      if (isFilterExist(key, criteria)) {
        if (!obj[key].includes(criteria[key])) {
          fits = false;
        }
      }
    }
  }
  return fits;
}

const isFilterExist = (filter, criteria) => {
  for (const key in criteria) {
    if (criteria.hasOwnProperty(key) && typeof criteria[key] === 'object') {
      if (isFilterExist(filter, criteria[key])) {
        return true;
      };
    } else {
      if (filter === key) {
        return true;
      }
    }
  }
}

const validateFilter = (filter, instance) => {
  const allowedFilters = [
    'name',
    'first',
    'last',
    'phone',
    'address',
    'zip',
    'city',
    'country',
    'street',
    'email'
  ];

  for (const key in filter) {
      if (filter.hasOwnProperty(key) && typeof filter[key] !== 'object') {
          const isExist = allowedFilters.some(field => field === key);

          if (!isExist) {
              instance.emit(
                  'error',
                  new Error(
                      `filter contains not allowed field — ${key}`
                  )
              );
              return false;
          }
      } else {
          const isExist = allowedFilters.some(field => field === key);

          if (!isExist) {
              instance.emit(
                  'error',
                  new Error(
                      `filter contains not allowed field — ${key}`
                  )
              );
              return false;
          }
          if (!validateFilter(filter[key], instance)) {
            return false;
          };
      }
  }

  return true;
};

const validateTypes = (filter, instance) => {
  const { name, address } = filter;

  if (filter && typeof filter !== 'object') {
    instance.emit(
        'error',
        new Error(`filter should be an object`)
    );
    return false;
  }

  if (name && typeof name !== 'object') {
      instance.emit(
          'error',
          new Error(`name should be an object`)
      );
      return false;
  }

  if (name && Object.keys(name).length === 0) {
    instance.emit(
        'error',
        new Error(`name object could not be empty`)
    );
    return false;
  }

  if (address && typeof address !== 'object') {
    instance.emit(
        'error',
        new Error(`address should be an object`)
    );
    return false;
  }

  if (address && Object.keys(address).length === 0) {
    instance.emit(
        'error',
        new Error(`address object could not be empty`)
    );
    return false;
  }

  if (name.first && typeof name.first !== 'string') {
    instance.emit(
        'error',
        new Error(`first name should be a string`)
    );
    return false;
  }

  if (name.last && typeof name.last !== 'string') {
    instance.emit(
        'error',
        new Error(`last name should be a string`)
    );
    return false;
  }

  if (filter.phone && typeof filter.phone !== 'string') {
    instance.emit(
        'error',
        new Error(`phone should be a string`)
    );
    return false;
  }

  if (filter.email && typeof filter.email !== 'string') {
    instance.emit(
        'error',
        new Error(`email should be a string`)
    );
    return false;
  }

  if (address.zip && typeof address.zip !== 'string') {
    instance.emit(
        'error',
        new Error(`zip should be a string`)
    );
    return false;
  }

  if (address.city && typeof address.city !== 'string') {
    instance.emit(
        'error',
        new Error(`city should be a string`)
    );
    return false;
  }

  if (address.country && typeof address.country !== 'string') {
    instance.emit(
        'error',
        new Error(`country should be a string`)
    );
    return false;
  }

  if (address.street && typeof address.street !== 'string') {
    instance.emit(
        'error',
        new Error(`street should be a string`)
    );
    return false;
  }

  return true;
}