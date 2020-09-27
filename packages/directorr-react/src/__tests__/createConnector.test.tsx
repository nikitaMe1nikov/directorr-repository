import React from 'react';
import { shallow } from 'enzyme';
import { DirectorrMock } from '@nimel/directorr';
import createConnector, { getStoreName, lowercaseFirstLetter } from '../createConnector';

const someProps = {
  someProp: 'someProp',
};

class SomeComponent extends React.Component<typeof someProps> {
  static someStaticProp = 'someStaticProp';
  render() {
    return null;
  }
}

class SomeStore {}

describe('createConnector', () => {
  it('lowercaseFirstLetter', () => {
    const str = 'SomeWord';
    const strLow = 'someWord';

    expect(lowercaseFirstLetter(str)).toEqual(strLow);
    expect(lowercaseFirstLetter(strLow)).toEqual(strLow);
  });

  it('getStoreName', () => {
    class SomeStoreWithStatic extends SomeStore {
      static storeName = 'storeName';
    }

    expect(getStoreName(SomeStore)).toEqual('someStore');
    expect(getStoreName(SomeStoreWithStatic)).toEqual(SomeStoreWithStatic.storeName);
  });

  it('render with store SomeStore', () => {
    const directorr = new DirectorrMock();
    const store = directorr.addStores([SomeStore]);
    const useStoreHook = jest.fn().mockReturnValue(store);
    const Connector = createConnector(useStoreHook)(SomeStore)(SomeComponent);
    const someProps = {
      someProp: 'someProp',
    };

    expect((Connector as any).someStaticProp).toEqual(SomeComponent.someStaticProp);

    const connector = shallow(<Connector {...someProps} />);

    expect(useStoreHook).lastCalledWith(SomeStore);
    expect(connector.find(SomeComponent).props()).toEqual({
      ...someProps,
      [getStoreName(SomeStore)]: store,
    });
  });
});
