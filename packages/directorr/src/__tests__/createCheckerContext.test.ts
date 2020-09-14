import createCheckerContext from '../createCheckerContext';
import { callDecoratorWithNotActionChecker, callDecoratorWithNotConvertPayload } from '../messages';
import { moduleName } from './mocks';

describe('createCheckerContext', () => {
  it('createCheckerContext', () => {
    const wrongArg: any = 14;
    const checker = jest.fn();
    const converter = jest.fn();

    expect(() => createCheckerContext(moduleName, wrongArg)).toThrowError(
      callDecoratorWithNotActionChecker(moduleName, wrongArg)
    );

    expect(() => createCheckerContext(moduleName, checker, wrongArg)).toThrowError(
      callDecoratorWithNotConvertPayload(moduleName, wrongArg)
    );

    expect(createCheckerContext(moduleName, checker, converter)).toEqual([checker, converter]);
  });
});
