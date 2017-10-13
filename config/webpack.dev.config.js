var webpack = require('webpack');
var config = require("./webpack.base.config");

var plugins = config.plugins;
var modules = config.module;
var resolve = config.resolve;

plugins.push(new webpack.HotModuleReplacementPlugin());

// var target = 'http://rapapi.org/mockjsdata/25303/';
var target = 'http://localhost:5000/';
var proxy = {
    "/api/*": {
        changeOrigin: true,
        target: target,
        secure: false
    }
};

var port = 8086;

module.exports = {
    devtool: 'source-map',
    entry: {
        app: ['./src/app']
    },
    output: {
        path: "/",
        publicPath: 'http://127.0.0.1:' + port + '/',
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    devServer: {
        hot: true,
        proxy: proxy,
        host: '0.0.0.0',
        port: port
    },
    module: modules,
    plugins: plugins,
    resolve: resolve
}