let _onEvent;
const mock = {
  subscribeForPollEvents: jest.fn((_, onEvent) => {
    _onEvent = onEvent;
  }),
  _publishPollEvent: (event) => {
    _onEvent(event);
  }
};

export default mock;
