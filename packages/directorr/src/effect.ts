import { isFunction, EFFECTS_FIELD_NAME } from './utils';
import { callWithPropNotEquallFunc } from './messages';
import { ActionType, EffectsMap, CreateDecoratorOneArg } from './types';
import decorator from './decorator';
import createBuilderDecorator from './createBuilderDecorator';
import createActionTypeContext from './createActionTypeContext';
import addInitFields from './initFields';

export const MODULE_NAME = 'effect';

export function initializer(
  initObject: any,
  value: any,
  property: string,
  actionType: string,
  addFields = addInitFields
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  addFields(initObject);

  const effectsMap: EffectsMap = initObject[EFFECTS_FIELD_NAME];
  const effects = effectsMap.get(actionType);

  if (effects) {
    effects.push(property);
  } else {
    effectsMap.set(actionType, [property]);
  }

  return value;
}

const effect: CreateDecoratorOneArg<ActionType> = createBuilderDecorator(
  MODULE_NAME,
  decorator,
  initializer,
  createActionTypeContext
);

export default effect;