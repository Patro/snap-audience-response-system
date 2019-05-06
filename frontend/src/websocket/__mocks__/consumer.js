let _onReceived;
const mock = {
  createSubscription: jest.fn((_, { received }) => {
    _onReceived = received;
  }),
  _receiveData: (data) => (
    _onReceived(data)
  )
};

export default mock;
