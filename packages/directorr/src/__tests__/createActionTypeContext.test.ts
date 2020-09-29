import createActionTypeContext from '../createActionTypeContext';
import { callDecoratorWithNotActionType } from '../messages';
import { moduleName, actionType } from '../__mocks__/mocks';

describe('createActionTypeContext', () => {
  it('createActionTypeContext', () => {
    const wrongActionType: any = 14;

    expect(() => createActionTypeContext(moduleName, wrongActionType)).toThrowError(
      callDecoratorWithNotActionType(moduleName, wrongActionType)
    );

    expect(createActionTypeContext(moduleName, actionType)).toBe(actionType);
  });
});
