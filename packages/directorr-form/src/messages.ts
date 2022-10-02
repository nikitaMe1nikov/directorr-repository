export const useWithEffects = (moduleName: string) =>
  `${moduleName}: use only with effect decorator`

export const callWithWrongSchema = (moduleName: string, schema: any) =>
  `${moduleName}: call with arg=${schema} not like yup - ObjectSchema`

export const propNotExistInClass = (moduleName: string, prop: string, store: any) =>
  `${moduleName}: formStore in prop=${prop} not exist in class=${store}`

export const propInClassNotLikeFormStore = (moduleName: string, prop: string, formStore: any) =>
  `${moduleName}: formStore in prop=${prop} not like FormStore=${formStore}`
