import {
  DISPATCH_ACTION_FIELD_NAME,
  EFFECTS_FIELD_NAME,
  defineProperty,
  createValueDescriptor,
  DISPATCH_EFFECTS_FIELD_NAME,
  DEPENDENCY_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  STORES_FIELD_NAME,
} from './utils';
import config from './config';

export default function addInitFields(initObject: any) {
  if (!(DISPATCH_EFFECTS_FIELD_NAME in initObject)) {
    defineProperty(
      initObject,
      DISPATCH_EFFECTS_FIELD_NAME,
      createValueDescriptor(config.dispatchEffects)
    );
    defineProperty(
      initObject,
      DISPATCH_ACTION_FIELD_NAME,
      createValueDescriptor(config.dispatchEffects)
    );

    defineProperty(initObject, EFFECTS_FIELD_NAME, createValueDescriptor(new Map()));

    defineProperty(initObject, DEPENDENCY_FIELD_NAME, createValueDescriptor([]));

    defineProperty(initObject, INJECTED_FROM_FIELD_NAME, createValueDescriptor([]));

    defineProperty(initObject, STORES_FIELD_NAME, createValueDescriptor(null));
  }
}
