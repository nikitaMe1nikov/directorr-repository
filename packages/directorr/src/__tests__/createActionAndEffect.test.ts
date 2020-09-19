import createActionAndEffect from '../createActionAndEffect';
import { actionType } from '../__mocks__/mocks';

jest.mock('../action', () => {
  const actionDescriptor = jest.fn();

  return actionDescriptor.mockImplementation(() => actionDescriptor);
});

jest.mock('../effect', () => {
  const actionDescriptor = jest.fn();

  return actionDescriptor.mockImplementation(() => actionDescriptor);
});

describe('createActionAndEffect', () => {
  it('createActionAndEffect', () => {
    const [action, effect] = createActionAndEffect(actionType);

    expect(action).toBeCalledTimes(1);
    expect(action).lastCalledWith(actionType);

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith(actionType);
  });
});
