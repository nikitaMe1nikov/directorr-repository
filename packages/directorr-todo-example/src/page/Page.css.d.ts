declare namespace PageCssNamespace {
  export interface IPageCss {
    container: string
    todos: string
  }
}

declare const PageCssModule: PageCssNamespace.IPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PageCssNamespace.IPageCss
}

export = PageCssModule
