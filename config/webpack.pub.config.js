var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
var PACKAGE = require('../package.json');
var config = require("./webpack.base.config");

var plugins = config.plugins;
var modules = config.module;
var paths = config.paths;
var resolve = config.resolve;

plugins = plugins.concat([
    new HtmlWebpackPlugin({
        filename: path.resolve(paths.buildIndex, 'Index.cshtml'),
        template: "./src/index.ejs",
        inject: false,
        hash: false,
        minify: {
            removeComments: true,
            collapseWhitespace: false,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        },
        title: PACKAGE.name,
        scripts: [{
            src: paths.publicPath + 'vendor.dll.js',
            type: 'text/javascript'
        }]
    }),
    new ScriptExtHtmlWebpackPlugin({
        custom: [{
            test: /\.js$/,
            attribute: 'asp-append-version',
            value: 'true'
        }]
    }),
    new webpack.BannerPlugin({
        banner: `${PACKAGE.description}\r\n@version v${PACKAGE.version}\r\n@author @copyright 2017 ${PACKAGE.author} \r\n@link https://www.grapecity.com.cn/\r\n@date ${new Date()}`,
        raw: false,
        entryOnly: false
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //     name: ["common"],
    //     chunks: ["app"]
    // }),

]);

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
