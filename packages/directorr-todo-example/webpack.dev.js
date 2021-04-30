const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const postcssInlineSvg = require('postcss-inline-svg');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssPresetEnv = require('postcss-preset-env');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isDevIE = isDev && process.env.BROWSER_ENV === 'ie';

module.exports = {
  mode: 'development',
  target: isDevIE ? ['web', 'es5'] : 'web',
  entry: {
    main: ['./src/index.tsx'],
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    extensions: ['.ts', '.tsx', '.json', '.js'],
    alias: {
      components: path.resolve(__dirname, './src/components/'),
      page: path.resolve(__dirname, './src/page/'),
      decorators: path.resolve(__dirname, './src/decorators'),
      types: path.resolve(__dirname, './src/types'),
      stores: path.resolve(__dirname, './src/stores'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          '@teamsupercell/typings-for-css-modules-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:4]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  postcssInlineSvg(),
                  postcssSimpleVars(),
                  postcssPresetEnv({
                    stage: 0,
                  }),
                ],
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: isDevIE ? [/src/, /node_modules/] : /src/,
        exclude: isDevIE ? /@babel(?:\/|\\{1,2})runtime|core-js/ : undefined,
        use: ['babel-loader'],
      },
      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/].+\.js$/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    moduleIds: 'named',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ToDo',
      filename: 'index.html',
      template: './src/index.template.html',
      inject: 'head',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8000,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    disableHostCheck: true,
    hot: true,
  },
  bail: false,
  cache: true,
  stats: 'minimal',
};
