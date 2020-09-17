import createBuilderPropertyDecorator from '../createBuilderPropertyDecorator';
import decorator from '../decorator';
import { moduleName } from '../__mocks__/mocks';

jest.mock('../createBuilderDecorator', () => {
  const createBuilderDecorator = jest.fn();

  return createBuilderDecorator.mockImplementation(() => createBuilderDecorator);
});

describe('createBuilderPropertyDecorator', () => {
  it('createBuilderPropertyDecorator', () => {
    const initializer = jest.fn();
    const createContext = jest.fn();

    const createBuilderDecorator = createBuilderPropertyDecorator(
      moduleName,
      initializer,
      createContext
    );

    expect(createBuilderDecorator).toHaveBeenCalledTimes(1);
    expect(createBuilderDecorator).toHaveBeenLastCalledWith(
      moduleName,
      decorator,
      initializer,
      createContext
    );
  });
});
