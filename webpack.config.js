const path = require('path');
var webpack = require('webpack');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const config = {
    entry: './src/client/tone.js',
    output: {
        path: path.resolve(__dirname, './src/client/dist'),
        filename: 'test.js'
    },
    devtool: 'eval-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
        new WebpackBuildNotifierPlugin({
            title: "Sound translation",
            logo: path.resolve("./src/client/assets/images/soundation_logo_only.png"),
            suppressSuccess: false
        })
    ]
};

module.exports = config;