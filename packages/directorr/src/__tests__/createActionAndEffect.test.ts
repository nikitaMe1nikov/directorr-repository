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

    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenLastCalledWith(actionType);

    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenLastCalledWith(actionType);
  });
});
