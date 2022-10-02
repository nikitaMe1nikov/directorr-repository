declare namespace ToggleCssNamespace {
  export interface IToggleCss {
    check: string
    container: string
  }
}

declare const ToggleCssModule: ToggleCssNamespace.IToggleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToggleCssNamespace.IToggleCss
}

export = ToggleCssModule
