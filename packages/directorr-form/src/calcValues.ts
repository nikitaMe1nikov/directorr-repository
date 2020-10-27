import FormStore from './FormStore';
import { propNotExistInClass, propInClassNotLikeFormStore } from './messages';

const VALUE_PROP_NAME = 'value';

export function isLikeFormStore(store: any) {
  return !!(VALUE_PROP_NAME in store && store.changeStatusToInvalid && store.changeStatusToValid);
}

export function calcValues(moduleName: string, fields: string[], store: any) {
  const result: { [keys: string]: any } = {};

  for (let i = 0, l = fields.length, prop: string, formStore: FormStore; i < l; ++i) {
    prop = fields[i];
    formStore = store[prop];

    if (!formStore) throw new Error(propNotExistInClass(moduleName, prop, store));

    if (!isLikeFormStore(formStore))
      throw new TypeError(propInClassNotLikeFormStore(moduleName, prop, formStore));

    result[prop] = formStore.value || undefined;
  }

  return result;
}

export default calcValues;
