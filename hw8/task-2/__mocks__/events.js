const events = jest.genMockFromModule('events');

events.on = jest.fn((event, listener) => {
  //todo HERE
  if (event === 'error') {
    //todo how return message correctly?
    return listener;
  }
})

module.exports = events;