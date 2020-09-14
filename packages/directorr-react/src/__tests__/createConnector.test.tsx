import React, { createContext } from 'react';
import { shallow } from 'enzyme';
import { DirectorrMock } from '@nimel/directorr';
import createConnector, { MODULE_NAME, getStoreName } from '../createConnector';
import {
  whenNotFoundStore,
  whenNotStoreConstructor,
  whenContextNotLikeDirrector,
} from '../messages';

class SomeComponent extends React.Component {
  static someProp = 'someProp';
  render() {
    return null;
  }
}

class SomeStore {}

describe('createConnector', () => {
  it('getStoreName', () => {
    class SomeStoreWithStatic extends SomeStore {
      static storeName = 'storeName';
    }

    expect(getStoreName(SomeStore)).toEqual(SomeStore.name);
    expect(getStoreName(SomeStoreWithStatic)).toEqual(SomeStoreWithStatic.storeName);
  });

  it('with wrong StoreConstructor', () => {
    const StoreConstructor: any = 1;
    const context: any = 1;
    const Connector = createConnector(context, StoreConstructor)(SomeComponent);

    expect(() => shallow(<Connector />)).toThrowError(
      whenNotStoreConstructor(MODULE_NAME, StoreConstructor)
    );
  });

  it('with wrong Directorr', () => {
    const directorr = 1;
    const context = createContext<any>(directorr);
    const Connector = createConnector(context, SomeStore)(SomeComponent);

    expect(() => shallow(<Connector />)).toThrowError(
      whenContextNotLikeDirrector(MODULE_NAME, directorr)
    );
  });

  it('when Directorr dont have store for SomeStore', () => {
    const directorr = new DirectorrMock();
    const context = createContext<any>(directorr);
    const Connector = createConnector(context, SomeStore)(SomeComponent);

    expect(() => shallow(<Connector />)).toThrowError(whenNotFoundStore(MODULE_NAME, SomeStore));
  });

  it('render with store SomeStore', () => {
    const directorr = new DirectorrMock();
    const store = directorr.addStores([SomeStore]);
    const context = createContext<any>(directorr);
    const Connector = createConnector(context, SomeStore)(SomeComponent);
    const someProps = {
      someProp: 'someProp',
    };

    expect((Connector as any).someProp).toEqual(SomeComponent.someProp);

    const connector = shallow(<Connector {...someProps} />);

    expect(connector.find(SomeComponent).props()).toEqual({
      ...someProps,
      [getStoreName(SomeStore)]: store,
    });
  });
});
