import { NextComponentType, NextPageContext } from 'next';
import { Directorr, DirectorrStoresState } from '@nimel/directorr';
import { HistoryActionPayload } from '@nimel/directorr-router';
import { AppContext, AppProps } from 'next/app';

export declare type MakeDirectorr = (
  ctx?: NextPageContext,
  router?: AppContext['router'],
  initialState?: DirectorrStoresState
) => Directorr;

export interface NextWithDirectorrInitialProps {
  initialProps: Record<string, any>;
  initialState?: DirectorrStoresState;
  directorr?: Directorr;
  directorrWrapper?: {
    directorr: Directorr;
    toJSON: () => undefined;
  };
}

export type NextWithDirectorrProps = NextWithDirectorrInitialProps & AppProps;

export interface AppContextWithDirectorr extends AppContext {
  directorr: Directorr;
  Component: DirectorrNextComponent;
}

export type CreateDirectorr = (
  makeDirectorr: MakeDirectorr,
  ctx?: NextPageContext,
  router?: AppContext['router'],
  initialState?: DirectorrStoresState
) => Directorr;

export type DirectorrNextComponent<
  P = Record<string, any>,
  IP = Record<string, any>
> = NextComponentType<NextPageContext, IP, P> & {
  whenServerLoadDirectorr?(
    directorr: Directorr,
    appCtx: AppContextWithDirectorr
  ): void | Promise<any>;
  whenServerDirectorrReady?(
    directorr: Directorr,
    appCtx: AppContextWithDirectorr
  ): void | Promise<any>;
  whenServerDirectorrError?(
    store: any,
    directorr: Directorr,
    appCtx: AppContextWithDirectorr
  ): void | Promise<any>;
};

export interface HistoryChangeActionPayload extends HistoryActionPayload {
  match: boolean;
}
