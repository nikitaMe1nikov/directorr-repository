import { isChecker, isConverter } from './utils';
import { callDecoratorWithNotActionChecker, callDecoratorWithNotConvertPayload } from './messages';
import { CreateContext, ConvertPayloadFunction } from './types';

const createCheckerContext: CreateContext = (
  moduleName: string,
  checker: any,
  converter: ConvertPayloadFunction
) => {
  if (!isChecker(checker)) throw new Error(callDecoratorWithNotActionChecker(moduleName, checker));

  if (converter && !isConverter(converter))
    throw new Error(callDecoratorWithNotConvertPayload(moduleName, converter));

  return [checker, converter];
};

export default createCheckerContext;
