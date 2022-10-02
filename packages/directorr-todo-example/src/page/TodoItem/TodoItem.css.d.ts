declare namespace TodoItemCssNamespace {
  export interface ITodoItemCss {
    button: string
    container: string
    text: string
  }
}

declare const TodoItemCssModule: TodoItemCssNamespace.ITodoItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TodoItemCssNamespace.ITodoItemCss
}

export = TodoItemCssModule
