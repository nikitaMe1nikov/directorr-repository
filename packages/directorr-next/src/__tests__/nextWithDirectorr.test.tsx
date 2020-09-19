import React from 'react';
import { shallow } from 'enzyme';
import { DirectorrProvider } from '@nimel/directorr-react';
import { isStoreReady, isStoreError, DirectorrMock } from '@nimel/directorr';
import NextWithDirectorr, { toJSON, createMemoDirectorr, UNKNOWN } from '../nextWithDirectorr';
import { flushPromises } from '../../../../tests/utils';
import { NextWithDirectorrProps } from '../types';

const env = {
  isServer: true,
  inServer() {
    this.isServer = true;
  },
  inBrowser() {
    this.isServer = false;
  },
};

jest.mock('../env', () => {
  return {
    get isServer() {
      return env.isServer;
    },
  };
});

class SomeComponent extends React.Component<NextWithDirectorrProps> {
  render() {
    return null;
  }
}

const someValue = {};

const props = {
  initialProps: {} as any,
  initialState: {} as any,
  pageProps: {} as any,
  Component: {} as any,
  router: {} as any,
};

describe('nextWithDirectorr', () => {
  it('createMemoDirectorr', () => {
    env.inServer();
    createMemoDirectorr.memoDirectorr = null;
    const makeDirectorr = jest.fn().mockReturnValue(someValue);
    const ctx: any = {};
    const router: any = {};
    const initialState: any = {};

    expect(createMemoDirectorr(makeDirectorr, ctx, router, initialState)).toEqual(someValue);
    expect(makeDirectorr).toBeCalledTimes(1);
    expect(makeDirectorr).lastCalledWith(ctx, router, initialState);
    expect(createMemoDirectorr.memoDirectorr).toEqual(null);
  });

  it('createMemoDirectorr in browser', () => {
    env.inBrowser();
    createMemoDirectorr.memoDirectorr = null;
    const makeDirectorr = jest.fn().mockReturnValue(someValue);
    const ctx: any = {};
    const router: any = {};
    const initialState: any = {};

    expect(createMemoDirectorr(makeDirectorr, ctx, router, initialState)).toEqual(someValue);
    expect(makeDirectorr).toBeCalledTimes(1);
    expect(makeDirectorr).lastCalledWith(undefined, undefined, initialState);
    expect(createMemoDirectorr.memoDirectorr).toEqual(someValue);

    expect(createMemoDirectorr(makeDirectorr, ctx, router, initialState)).toEqual(someValue);
    expect(makeDirectorr).toBeCalledTimes(1);
    expect(makeDirectorr).lastCalledWith(undefined, undefined, initialState);
    expect(createMemoDirectorr.memoDirectorr).toEqual(someValue);
  });

  it('toJSON', () => {
    expect(toJSON()).toBeUndefined();
  });

  it('render', () => {
    env.inServer();
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(someValue);

    expect(() => NextWithDirectorr(makeDirectorr)).not.toThrowError();

    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(SomeComponent);

    const wrapper = shallow(<Container {...props} />);
    const someComponent = wrapper.find(SomeComponent);
    const provider = wrapper.find(DirectorrProvider);

    expect(someComponent).toHaveLength(1);
    expect(someComponent.props()).toEqual(props);
    expect(provider).toHaveLength(1);
    expect(provider.props()).toMatchObject({ value: someValue });
    expect(createDirectorr).toBeCalledTimes(1);
    expect(createDirectorr).lastCalledWith(makeDirectorr, undefined, undefined, props.initialState);
  });

  it('render in browser', () => {
    env.inBrowser();
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(someValue);
    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(SomeComponent);
    const directorr = {};
    const browserProps = {
      ...props,
      directorrWrapper: {
        directorr,
      },
    } as any;

    const wrapper = shallow(<Container {...browserProps} />);
    const someComponent = wrapper.find(SomeComponent);
    const provider = wrapper.find(DirectorrProvider);

    expect(someComponent).toHaveLength(1);
    expect(someComponent.props()).toEqual(browserProps);
    expect(provider).toHaveLength(1);
    expect(provider.props()).toMatchObject({ value: directorr });
    expect(createDirectorr).toBeCalledTimes(0);
  });

  it('displayName', () => {
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(someValue);
    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(SomeComponent);
    const ContainerUnknown = NextWithDirectorr(makeDirectorr, createDirectorr)(() => null);

    expect(Container.displayName).toMatch(SomeComponent.name);
    expect(ContainerUnknown.displayName).toMatch(UNKNOWN);
  });

  it('getInitialProps', async () => {
    env.inServer();
    const directorr = new DirectorrMock();
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(directorr);
    const ctx = {};
    const router = {};
    const appCtx = {
      ctx,
      router,
      Component: SomeComponent,
      directorr: null,
      AppTree: {},
    } as any;
    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(SomeComponent);

    const initialProps = await Container.getInitialProps?.(appCtx);

    await flushPromises();

    expect(initialProps).toEqual({
      directorrWrapper: {
        directorr,
        toJSON,
      },
      initialProps: {
        pageProps: {},
      },
    });

    expect(createDirectorr).toBeCalledTimes(1);
    expect(createDirectorr).lastCalledWith(makeDirectorr, appCtx.ctx, appCtx.router);
    expect(appCtx.directorr).toEqual(directorr);

    expect(directorr.findStoreState).toBeCalledTimes(1);
    expect(directorr.findStoreState).lastCalledWith(isStoreError);
    expect(directorr.waitAllStoresState).toBeCalledTimes(1);
    expect(directorr.waitAllStoresState).lastCalledWith(isStoreReady);
    expect(directorr.getHydrateStoresState).toBeCalledTimes(1);
  });

  it('getInitialProps with static lifemethods', async () => {
    env.inServer();
    class ComponentWithStatic extends SomeComponent {
      static whenServerLoadDirectorr = jest.fn();
      static whenServerDirectorrError = jest.fn();
      static whenServerDirectorrReady = jest.fn();
    }

    const directorr = new DirectorrMock();
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(directorr);
    const ctx = {};
    const router = {};
    const appCtx = {
      ctx,
      router,
      Component: ComponentWithStatic,
      directorr: null,
      AppTree: {},
    } as any;
    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(ComponentWithStatic);

    const initialProps = await Container.getInitialProps?.(appCtx);

    await flushPromises();

    expect(initialProps).toEqual({
      directorrWrapper: {
        directorr,
        toJSON,
      },
      initialProps: {
        pageProps: {},
      },
    });

    expect(createDirectorr).toBeCalledTimes(1);
    expect(createDirectorr).lastCalledWith(makeDirectorr, appCtx.ctx, appCtx.router);
    expect(appCtx.directorr).toEqual(directorr);

    expect(ComponentWithStatic.whenServerLoadDirectorr).toBeCalledTimes(1);
    expect(ComponentWithStatic.whenServerLoadDirectorr).lastCalledWith(directorr, appCtx);
    expect(ComponentWithStatic.whenServerDirectorrReady).toBeCalledTimes(1);
    expect(ComponentWithStatic.whenServerDirectorrReady).lastCalledWith(directorr, appCtx);
    expect(ComponentWithStatic.whenServerDirectorrError).toBeCalledTimes(0);

    expect(directorr.findStoreState).toBeCalledTimes(1);
    expect(directorr.findStoreState).lastCalledWith(isStoreError);
    expect(directorr.waitAllStoresState).toBeCalledTimes(1);
    expect(directorr.waitAllStoresState).lastCalledWith(isStoreReady);
    expect(directorr.getHydrateStoresState).toBeCalledTimes(1);
  });

  it('getInitialProps when find store with isError but dont have lifemethods', async () => {
    env.inServer();
    const storeWithError = {};
    class DirectorrMockWithErrorStore extends DirectorrMock {
      findStoreState = jest.fn().mockImplementationOnce(() => Promise.resolve(storeWithError));
    }
    class ComponentWithStatic extends SomeComponent {
      static whenServerLoadDirectorr = jest.fn();
    }

    const directorr = new DirectorrMockWithErrorStore();
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(directorr);
    const ctx = {};
    const router = {};
    const appCtx = {
      ctx,
      router,
      Component: ComponentWithStatic,
      directorr: null,
      AppTree: {},
    } as any;
    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(ComponentWithStatic);

    const initialProps = await Container.getInitialProps?.(appCtx);

    await flushPromises();

    expect(initialProps).toEqual({
      directorrWrapper: {
        directorr,
        toJSON,
      },
      initialProps: {
        pageProps: {},
      },
    });

    expect(createDirectorr).toBeCalledTimes(1);
    expect(createDirectorr).lastCalledWith(makeDirectorr, appCtx.ctx, appCtx.router);
    expect(appCtx.directorr).toEqual(directorr);

    expect(ComponentWithStatic.whenServerLoadDirectorr).toBeCalledTimes(1);
    expect(ComponentWithStatic.whenServerLoadDirectorr).lastCalledWith(directorr, appCtx);

    expect(directorr.findStoreState).toBeCalledTimes(1);
    expect(directorr.findStoreState).lastCalledWith(isStoreError);
    expect(directorr.waitAllStoresState).toBeCalledTimes(1);
    expect(directorr.waitAllStoresState).lastCalledWith(isStoreReady);
    expect(directorr.getHydrateStoresState).toBeCalledTimes(1);
  });

  it('getInitialProps when find store with isError', async () => {
    env.inServer();
    const storeWithError = {};
    class DirectorrMockWithErrorStore extends DirectorrMock {
      findStoreState = jest.fn().mockImplementationOnce(() => Promise.resolve(storeWithError));
    }
    class ComponentWithStatic extends SomeComponent {
      static whenServerLoadDirectorr = jest.fn();
      static whenServerDirectorrError = jest.fn();
      static whenServerDirectorrReady = jest.fn();
    }

    const directorr = new DirectorrMockWithErrorStore();
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(directorr);
    const ctx = {};
    const router = {};
    const appCtx = {
      ctx,
      router,
      Component: ComponentWithStatic,
      directorr: null,
      AppTree: {},
    } as any;
    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(ComponentWithStatic);

    const initialProps = await Container.getInitialProps?.(appCtx);

    await flushPromises();

    expect(initialProps).toEqual({
      directorrWrapper: {
        directorr,
        toJSON,
      },
      initialProps: {
        pageProps: {},
      },
    });

    expect(createDirectorr).toBeCalledTimes(1);
    expect(createDirectorr).lastCalledWith(makeDirectorr, appCtx.ctx, appCtx.router);
    expect(appCtx.directorr).toEqual(directorr);

    expect(ComponentWithStatic.whenServerLoadDirectorr).toBeCalledTimes(1);
    expect(ComponentWithStatic.whenServerLoadDirectorr).lastCalledWith(directorr, appCtx);
    expect(ComponentWithStatic.whenServerDirectorrError).toBeCalledTimes(1);
    expect(ComponentWithStatic.whenServerDirectorrError).lastCalledWith(
      storeWithError,
      directorr,
      appCtx
    );

    expect(directorr.findStoreState).toBeCalledTimes(1);
    expect(directorr.findStoreState).lastCalledWith(isStoreError);
    expect(directorr.waitAllStoresState).toBeCalledTimes(1);
    expect(directorr.waitAllStoresState).lastCalledWith(isStoreReady);
    expect(directorr.getHydrateStoresState).toBeCalledTimes(1);
  });

  it('getInitialProps in browser', async () => {
    env.inBrowser();
    class ComponentWithStatic extends SomeComponent {
      static whenServerLoadDirectorr = jest.fn();
      static whenServerDirectorrError = jest.fn();
      static whenServerDirectorrReady = jest.fn();
    }

    const directorr = new DirectorrMock();
    const makeDirectorr = jest.fn();
    const createDirectorr = jest.fn().mockReturnValue(directorr);
    const ctx = {};
    const router = {};
    const appCtx = {
      ctx,
      router,
      Component: ComponentWithStatic,
      directorr: null,
      AppTree: {},
    } as any;
    const Container = NextWithDirectorr(makeDirectorr, createDirectorr)(ComponentWithStatic);

    const initialProps = await Container.getInitialProps?.(appCtx);

    await flushPromises();

    expect(initialProps).toEqual({
      directorrWrapper: {
        directorr,
        toJSON,
      },
      initialProps: {
        pageProps: {},
      },
    });

    expect(createDirectorr).toBeCalledTimes(1);
    expect(createDirectorr).lastCalledWith(makeDirectorr, appCtx.ctx, appCtx.router);
    expect(appCtx.directorr).toEqual(directorr);

    expect(ComponentWithStatic.whenServerLoadDirectorr).toBeCalledTimes(0);
    expect(ComponentWithStatic.whenServerDirectorrReady).toBeCalledTimes(0);
    expect(ComponentWithStatic.whenServerDirectorrError).toBeCalledTimes(0);

    expect(directorr.findStoreState).toBeCalledTimes(0);
    expect(directorr.waitAllStoresState).toBeCalledTimes(0);
    expect(directorr.getHydrateStoresState).toBeCalledTimes(0);
  });
});
