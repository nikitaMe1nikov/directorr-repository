declare namespace IndexCssNamespace {
  export interface IIndexCss {
    container: string;
    page_four: string;
    page_one: string;
    page_three: string;
    page_two: string;
    sub_container: string;
  }
}

declare const IndexCssModule: IndexCssNamespace.IIndexCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexCssNamespace.IIndexCss;
};

export = IndexCssModule;
