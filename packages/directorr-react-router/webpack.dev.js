// const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  mode: 'development',
  entry: {
    main: ['./sample/index.tsx'],
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    mainFields: ['module', 'main', 'browser'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    // alias: {
    //   components: path.resolve(__dirname, './src/components/'),
    //   page: path.resolve(__dirname, './src/page/'),
    // },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          '@teamsupercell/typings-for-css-modules-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[path][name]__[local]--[hash:base64:4]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                postcssPresetEnv({
                  stage: 0,
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: /\.(svg|png|jpe?g|jpg|gif|ico)$/,
      //   loader: 'url-loader',
      //   options: {
      //     name: '[name].[ext]',
      //   },
      // },
      // {
      //   test: /\.(ttf|woff|woff2)$/,
      //   loader: 'url-loader',
      //   options: {
      //     name: '[name].[ext]',
      //     limit: 1,
      //   },
      // },
      // {
      //   test: /\.(mp3|wav)$/,
      //   loader: 'file-loader',
      // },
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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BABEL_ENV': JSON.stringify('development'),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      title: 'Sample',
      envProduction: false,
      filename: 'index.html',
      template: './sample/index.template.html',
      inject: 'head',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8000,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    disableHostCheck: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
    },
  },
  bail: false,
  cache: true,
};
