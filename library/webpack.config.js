const path = require('path');
const webpack = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const config = {
  entry: './src/soundation.js',
  output: {
    path: path.resolve(__dirname, './script'),
    filename: 'soundation.min.js',
    library: 'Soundation',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default',
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ],
};

module.exports = config;
