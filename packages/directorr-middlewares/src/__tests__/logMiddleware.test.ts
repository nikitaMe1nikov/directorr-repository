import logMiddleware from '../logMiddleware';

describe('logMiddleware', () => {
  it('log message when payload like object', () => {
    const next = jest.fn();
    const action = {
      type: 'type',
      payload: {} as any,
    };
    jest.spyOn(console, 'log');

    logMiddleware(action, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(action);
    expect(console.log).toBeCalledWith(`log ${action.type} - `, action.payload);
  });

  it('log message when payload like function', () => {
    const next = jest.fn();
    const action = {
      type: 'type',
      payload: () => {},
    };
    jest.spyOn(console, 'log');

    logMiddleware(action, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(action);
    expect(console.log).toBeCalledWith(`log ${action.type} - `, action.payload.name);
  });
});
