import createActionTypeOptionContext from '../createActionTypeOptionContext';
import { callDecoratorWithNotActionType } from '../messages';
import { moduleName, actionType } from './mocks';

describe('createActionTypeOptionContext', () => {
  it('createActionTypeOptionContext', () => {
    const wrongActionType: any = 14;

    expect(createActionTypeOptionContext(moduleName)).toBeUndefined();

    expect(() => createActionTypeOptionContext(moduleName, wrongActionType)).toThrowError(
      callDecoratorWithNotActionType(moduleName, wrongActionType)
    );

    expect(createActionTypeOptionContext(moduleName, actionType)).toEqual(actionType);
  });
});
