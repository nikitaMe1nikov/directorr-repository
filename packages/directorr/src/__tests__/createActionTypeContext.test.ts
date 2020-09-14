import createActionTypeContext from '../createActionTypeContext';
import { callDecoratorWithNotActionType } from '../messages';
import { moduleName, actionType } from './mocks';

describe('createActionTypeContext', () => {
  it('createActionTypeContext', () => {
    const wrongActionType: any = 14;

    expect(() => createActionTypeContext(moduleName, wrongActionType)).toThrowError(
      callDecoratorWithNotActionType(moduleName, wrongActionType)
    );

    expect(createActionTypeContext(moduleName, actionType)).toEqual(actionType);
  });
});
