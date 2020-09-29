import { reloadWindow, generatePath } from '../utils';

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

  it('generatePath', () => {
    const root = '/';
    const idParam = '[id]';
    const path = '/path';
    const params = {
      id: '12',
    };

    expect(generatePath(root)).toBe(root);
    expect(generatePath(`${path}/${idParam}`)).toBe(path);
    expect(generatePath(`${path}/${idParam}`, params)).toBe(`${path}/${params.id}`);
  });
});
