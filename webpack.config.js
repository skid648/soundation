const path = require('path');
const webpack = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const config = {
  entry: './library/src/soundation.js',
  output: {
    path: path.resolve(__dirname, './library/script'),
    filename: 'soundation.min.js',
    library: 'Soundation',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default'
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
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    new WebpackBuildNotifierPlugin({
      title: 'Sound translation',
      logo: path.resolve('./src/client/assets/images/soundation_logo_only.png'),
      suppressSuccess: false,
    })
  ],
};

module.exports = config;
