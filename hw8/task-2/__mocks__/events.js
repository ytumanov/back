const events = jest.genMockFromModule('events');

events.prototype.emit = jest.fn((event, data) => {
  if (event === 'error') {
      throw data;
  }
});

module.exports = events;