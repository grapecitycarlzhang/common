var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var PACKAGE = require('../package.json');
var config = require("./webpack.base.config");

var plugins = config.plugins;
var modules = config.module;
var paths = config.paths;
var resolve = config.resolve;

module.exports = {
    devtool: "none",
    entry: {
        app: ['./src/app']
    },
    output: {
        path: paths.build,
        publicPath: paths.publicPath,
        filename: '[name].js',
        chunkFilename: '[name]-' + process.env.NODE_ENV + '.js'
    },
    module: modules,
    plugins: plugins,
    resolve: resolve
}
