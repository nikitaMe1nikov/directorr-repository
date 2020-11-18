import React from 'react';
import type { renderToStaticMarkup } from 'react-dom/server';
import { NextComponentType, NextPage } from 'next';
import App from 'next/app';
import { isStoreReady, isStoreError, Directorr } from '@nimel/directorr';
import { DirectorrProvider } from '@nimel/directorr-react';
import {
  MakeDirectorr,
  NextWithDirectorrInitialProps,
  NextWithDirectorrProps,
  AppContextWithDirectorr,
  CreateDirectorr,
} from './types';
import { isServer } from './env';

export const toJSON = () => undefined;
export const UNKNOWN = 'Unknown';

export const createMemoDirectorr: CreateDirectorr & { memoDirectorr: Directorr | null } = (
  makeDirectorr,
  ctx?,
  router?,
  initialState?
) => {
  if (isServer && ctx && router) {
    return makeDirectorr(ctx, router, initialState);
  }

  if (!createMemoDirectorr.memoDirectorr)
    createMemoDirectorr.memoDirectorr = makeDirectorr(undefined, undefined, initialState);

  return createMemoDirectorr.memoDirectorr;
};

createMemoDirectorr.memoDirectorr = null;

export default function NextWithDirectorr(
  makeDirectorr: MakeDirectorr,
  createDirectorr: CreateDirectorr = createMemoDirectorr,
  renderOnServer?: typeof renderToStaticMarkup
) {
  return function Wrapper(
    Page: NextPage<NextWithDirectorrProps> | (typeof App & { displayName?: string })
  ) {
    const NextWithDirectorrContainer: NextComponentType<
      AppContextWithDirectorr,
      NextWithDirectorrInitialProps,
      NextWithDirectorrProps
    > = props => (
      <DirectorrProvider
        value={
          props.directorrWrapper?.directorr ||
          createDirectorr(makeDirectorr, undefined, undefined, props.initialState)
        }
      >
        <Page {...props} />
      </DirectorrProvider>
    );

    NextWithDirectorrContainer.displayName = `NextWithDirectorrContainer(${
      Page.displayName || Page.name || UNKNOWN
    })`;

    NextWithDirectorrContainer.getInitialProps = async appCtx => {
      const directorr = createDirectorr(makeDirectorr, appCtx.ctx, appCtx.router);

      const directorrWrapper = {
        directorr,
        toJSON,
      };

      const pageProps = await App.getInitialProps(appCtx);

      if (isServer) {
        const { Component } = appCtx;
        const render = renderOnServer || require('react-dom/server').renderToStaticMarkup; // eslint-disable-line @typescript-eslint/no-var-requires

        render(
          <NextWithDirectorrContainer
            Component={Component}
            pageProps={pageProps}
            directorrWrapper={directorrWrapper}
            router={appCtx.router}
          />
        );

        await Component.whenServerLoadDirectorr?.(directorr, appCtx);

        const waitAllStores = directorr.waitAllStoresState(isStoreReady);
        const waitStoreWithError = directorr.findStoreState(isStoreError);

        const storeWithError = await Promise.race([waitStoreWithError, waitAllStores]);

        if (storeWithError) {
          waitAllStores.cancel();
          await Component.whenServerDirectorrError?.(storeWithError, directorr, appCtx);
        } else {
          waitStoreWithError.cancel();
          await Component.whenServerDirectorrReady?.(directorr, appCtx);
        }
      }

      return {
        directorrWrapper,
        initialState: isServer ? directorr.getHydrateStoresState() : undefined,
        pageProps,
      };
    };

    return NextWithDirectorrContainer;
  };
}
