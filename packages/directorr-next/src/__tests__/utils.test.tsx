import { reloadWindow } from '../utils';

describe('utils', () => {
  it('reloadWindow', () => {
    const reload = jest.fn();

    Object.defineProperty(global, 'window', {
      value: {
        location: {
          reload,
        },
      },
    });

    reloadWindow();

    expect(window.location.reload).toBeCalledTimes(1);
  });
});
