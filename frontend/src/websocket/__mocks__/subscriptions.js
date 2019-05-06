let _onPollEvent, _onResponseEvent;
const mock = {
  subscribeForPollEvents: jest.fn((_, onEvent) => {
    _onPollEvent = onEvent;
  }),
  subscribeForResponseEvents: jest.fn((_, onEvent) => {
    _onResponseEvent = onEvent;
  }),
  _publishPollEvent: (event) => {
    _onPollEvent(event);
  },
  _publishResponseEvent: (event) => {
    _onResponseEvent(event);
  },
};

export default mock;
