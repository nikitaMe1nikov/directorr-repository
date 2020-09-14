# directorr-form

>Form logic in directorr

## Why

Each framework should always have its own solution for validating forms.

## Installation

Run `npm install @nimel/directorr-form --save` or `yarn add @nimel/directorr-form`

## API

### class FormStore(FormStoreOptions)

Usually used for binding in frameworks

```javascript
import React, { useCallback } from 'react';
import { FormStore } from "directorr-form";
import TextField from '@material-ui/core/TextField';

const ENTER_CODE = 13;

const TextInput = ({ store, ...props }) => {
  const handleChange = useCallback(
    (e) => {
      store.changeValue(e.target.value.trim());
    },
    [store]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.keyCode === ENTER_CODE) store.submit();
    },
    [store]
  );

  return (
    <TextField
      {...props}
      value={store.value}
      onChange={handleChange}
      onFocus={store.focus}
      onBlur={store.blur}
      onKeyDown={handleKeyDown}
      helperText={store.message}
      error={store.isInvalid}
    />
  );
};

export default observer(TextInput);
```

And then

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { connectStore } from "directorr";
import { validate, FormStore, FORM_ACTIONS } from "directorr-form";
import TextInput from 'components/TextInput';

class MainStore {
  @connectStore() login = new FormStore();
}

const mainStore = new MainStore();

const app = (
  <TextInput store={mainStore.login} />
);


ReactDOM.render(app, document.getElementById('app'));
```

### validate(schema: ObjectSchema<any>)

```javascript
import { connectStore } from "directorr";
import { validate, FormStore, FORM_ACTIONS } from "directorr-form";
import { object, string } from 'yup';

const VALIDATION_SCHEME = object().shape({
  login: string().email().required(),
  password: string().min(8).required(),
});

class MainStore {
  @connectStore() login = new FormStore();
  @connectStore() password = new FormStore();

  @effect([FormStore, FORM_ACTIONS.CHANGE_VALUE])
  @validate(VALIDATION_SCHEME)
  changeLogin = () => {};
}

const mainStore = new MainStore();

mainStore.login.changeValue('newValue');
```

Then the action object will be created and dispatched. The action object will have fields:

```javascript
{
  type: FormStore.FORM_ACTIONS.CHANGE_VALUE,
  payload: {
    value: 'newValue',
    connectStoreProperty: 'login',
  }
}
```

The `validate` decorator validates the` FormStore` instance in `login` prop according to the schema `VALIDATION_SCHEME`.

### validateAll(schema: ObjectSchema<any>)

```javascript
import { connectStore } from "directorr";
import { validateAll, FormStore, FORM_ACTIONS } from "directorr-form";
import { object, string } from 'yup';

const VALIDATION_SCHEME = object().shape({
  login: string().email().required(),
  password: string().min(8).required(),
});

class MainStore {
  @connectStore() login = new FormStore();
  @connectStore() password = new FormStore();

  @action([FormStore, FORM_ACTIONS.SUBMIT])
  submitButton = () => {};

  @effect([FormStore, FORM_ACTIONS.SUBMIT])
  @validateAll(VALIDATION_SCHEME)
  submitLogin = ({ validationError }) => {
    if (!validationError) {
      this.user.login(this.login.value, this.password.value);
    }
  };
}

const mainStore = new MainStore();

mainStore.login.submit();
// or
mainStore.submitButton();
```

Then the action object will be created and dispatched. The action object will have fields:

```javascript
{
  type: FormStore.FORM_ACTIONS.SUBMIT,
  payload: {
    connectStoreProperty: 'login',
  },
  // or
  payload: undefined,
}
```

The `validateAll` decorator validates the` FormStore` instances in `login` and `password` props according to the schema `VALIDATION_SCHEME`.

## License

[MIT](LICENSE)