declare namespace LoaderCssNamespace {
  export interface ILoaderCss {
    ball: string
    ball_1: string
    ball_2: string
    ball_3: string
    container: string
    loader_magnify_ball_bounce: string
  }
}

declare const LoaderCssModule: LoaderCssNamespace.ILoaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoaderCssNamespace.ILoaderCss
}

export = LoaderCssModule
