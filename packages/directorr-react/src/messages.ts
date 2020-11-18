export const whenContextNotLikeDirrector = (moduleName: string, context: any) =>
  `${moduleName}: for some reason, context=${context} not like Dirrector instance`;

export const whenNotReactContext = (moduleName: string, context: any) =>
  `${moduleName}: call with arg=${context} not like react context`;

export const whenNotStoreConstructor = (moduleName: string, StoreConstructor: any) =>
  `${moduleName}: call with arg=${StoreConstructor} not like object constuctor or model`;
