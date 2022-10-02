declare namespace TotalCssNamespace {
  export interface ITotalCss {
    buttons: string
    clear_button: string
    container: string
    filter_button: string
    filter_button__active: string
  }
}

declare const TotalCssModule: TotalCssNamespace.ITotalCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TotalCssNamespace.ITotalCss
}

export = TotalCssModule
