import { object, string } from 'yup';
import { callWithWrongSchema } from '../messages';
import createSchemaContext, {
  isLikeYUPSchema,
  DEFAULT_VALIDATE_OPTIONS,
} from '../createSchemaContext';
import { someValue, someProperty } from '../__mocks__/mocks';

describe('createSchemaContext', () => {
  it('isLikeYUPSchema', () => {
    const likeSchema = {
      fields: [],
    };
    const fakeSchema = {};

    expect(isLikeYUPSchema(fakeSchema)).toBeFalsy();
    expect(isLikeYUPSchema(likeSchema)).toBeTruthy();
  });

  it('createSchemaContext', () => {
    const moduleName = 'moduleName';
    const schema: any = object({
      [someProperty]: string().required(),
    });
    const options = {
      someProperty: someValue,
    };

    expect(() => createSchemaContext(moduleName, someValue)).toThrowError(
      callWithWrongSchema(moduleName, someValue)
    );

    expect(createSchemaContext(moduleName, schema)).toMatchObject([
      schema,
      DEFAULT_VALIDATE_OPTIONS,
      Object.keys(schema.fields),
    ]);
    expect(createSchemaContext(moduleName, schema, options)).toMatchObject([
      schema,
      { ...DEFAULT_VALIDATE_OPTIONS, ...options },
      Object.keys(schema.fields),
    ]);
  });
});
