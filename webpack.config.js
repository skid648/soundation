const path = require('path');
var webpack = require('webpack');

const config = {
    entry: './src/client/tone.js',
    output: {
        path: path.resolve(__dirname, './src/client/dist'),
        filename: 'test.js'
    },
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
        })
    ]
};

module.exports = config;