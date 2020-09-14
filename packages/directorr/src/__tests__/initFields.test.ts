import initFields from '../initFields';
import {
  DISPATCH_ACTION_FIELD_NAME,
  EFFECTS_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  DEPENDENCY_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  STORES_FIELD_NAME,
} from '../utils';
import config from '../config';

describe('initFields', () => {
  it.only('initFields', () => {
    const store: any = {};

    initFields(store);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toEqual(config.dispatchEffects);
    expect(store[DISPATCH_ACTION_FIELD_NAME]).toEqual(config.dispatchEffects);
    expect(store[EFFECTS_FIELD_NAME]).toBeInstanceOf(Map);
    expect(store[EFFECTS_FIELD_NAME].size).toEqual(0);
    expect(store[DEPENDENCY_FIELD_NAME]).toBeInstanceOf(Array);
    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(0);
    expect(store[INJECTED_FROM_FIELD_NAME]).toBeInstanceOf(Array);
    expect(store[INJECTED_FROM_FIELD_NAME]).toHaveLength(0);
    expect(store[STORES_FIELD_NAME]).toEqual(null);
  });
});
