import { AppInitStore } from '../index';
import {
  initStoreAction,
  initStoreErrorAction,
  initStoreErrorEffect,
  initStoreSuccessAction,
  initStoreSuccessEffect,
  isReadyAction,
  isReadyEffect,
} from '../decorators';

describe('index', () => {
  it('check exports', () => {
    expect(AppInitStore).not.toBeUndefined();
    expect(initStoreAction).not.toBeUndefined();
    expect(initStoreErrorAction).not.toBeUndefined();
    expect(initStoreErrorEffect).not.toBeUndefined();
    expect(initStoreSuccessAction).not.toBeUndefined();
    expect(initStoreSuccessEffect).not.toBeUndefined();
    expect(isReadyAction).not.toBeUndefined();
    expect(isReadyEffect).not.toBeUndefined();
  });
});
