import React from 'react';
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
  createDirectorr: CreateDirectorr = createMemoDirectorr
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

    NextWithDirectorrContainer.displayName = `NextWithDirectorrContainer(${Page.displayName ||
      Page.name ||
      'Unknown'})`;

    NextWithDirectorrContainer.getInitialProps = async appCtx => {
      const directorr = createDirectorr(makeDirectorr, appCtx.ctx, appCtx.router);

      appCtx.directorr = directorr;

      const initialProps = await App.getInitialProps(appCtx);

      if (isServer) {
        const { Component } = appCtx;

        await Component.whenServerLoadDirectorr?.(directorr, appCtx);

        const storeWithError = await Promise.race([
          directorr.findStoreState(isStoreError),
          directorr.waitAllStoresState(isStoreReady),
        ]);

        if (storeWithError) {
          await Component.whenServerDirectorrError?.(storeWithError, directorr, appCtx);
        } else {
          await Component.whenServerDirectorrReady?.(directorr, appCtx);
        }
      }

      return {
        directorrWrapper: {
          directorr,
          toJSON,
        },
        initialState: isServer ? directorr.getHydrateStoresState() : undefined,
        initialProps,
      };
    };

    return NextWithDirectorrContainer;
  };
}
