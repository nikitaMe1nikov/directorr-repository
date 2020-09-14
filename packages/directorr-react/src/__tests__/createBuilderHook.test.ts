import { createContext } from 'react';
import createBuilderHook from '../createBuilderHook';
import { whenNotReactContext } from '../messages';

describe('createBuilderHook', () => {
  it('createBuilderHook with wrong storeContext', () => {
    const hookBuild = jest.fn();
    const moduleName = 'moduleName';
    const context: any = 1;
    const createHook = createBuilderHook(hookBuild, moduleName);

    expect(() => createHook(context)).toThrowError(whenNotReactContext(moduleName, context));
  });

  it('createBuilderHook with correct storeContext', () => {
    class SomeStore {}
    const initOptions = {};
    const hookBuild = jest.fn();
    const moduleName = 'moduleName';
    const context = createContext(null);
    const createHook = createBuilderHook(hookBuild, moduleName);
    const hook = createHook(context);

    hook(SomeStore, initOptions);

    expect(hookBuild).toHaveBeenCalledTimes(1);
    expect(hookBuild).toHaveBeenLastCalledWith(context, SomeStore, initOptions);
  });
});
