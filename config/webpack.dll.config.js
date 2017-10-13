const path = require('path');
const webpack = require('webpack');
var PACKAGE = require('../package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = require("./webpack.base.config");

module.exports = {
    entry: {
        vendor: [
            "antd",
            "superagent",
            "moment",
            'react',
            'react-dom',
            "react-router",
            "redux-actions",
            "react-redux",
            "react-intl"
        ]
    },
    output: {
        path: config.paths.build,
        filename: '[name].dll.js',
        // publicPath:config.paths.publicPath,
        /**
         * output.library
         * window.${output.library}
         */
        library: '[name]_library'
    },
    plugins: [
        new ExtractTextPlugin('app.css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DllPlugin({
            path: path.join(config.paths.build, '[name]-manifest.json'),
            name: '[name]_library'
        })
    ],
    module: {
        rules: [{
            test: /\.tsx|\.ts$/,
            exclude: /^node_modules$/,
            use: 'awesome-typescript-loader'

        }, {
            test: /\.(less|css)$/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    "css-loader",
                    "less-loader"
                ]
            })
        }, {
            test: /\.(jpe?g|png|gif|svg)$/,
            use: 'url?limit=10000&name=img/[hash].[ext]'
        }]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
};