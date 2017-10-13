var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.env.npm_package_config_isprod == 'yes';

var PROJECT_ROOT = path.resolve(__dirname, '../')
var paths = {
    root: PROJECT_ROOT, // 项目根路径
    src: path.resolve(PROJECT_ROOT, './src'), // 项目源码路径
    build: isProduction ? path.resolve(PROJECT_ROOT, '../ToDoList/ToDoList/wwwroot/js') : path.resolve(PROJECT_ROOT, './dist'), // 产出路径
    buildIndex: isProduction ? path.resolve(PROJECT_ROOT, '../ToDoList/ToDoList/Views/Home') : path.resolve(PROJECT_ROOT, './dist'), // 产出路径
    publicPath: isProduction ? '/js/' : ''
}

var fs = require("fs");
var vendormanifest = path.resolve(paths.build, './vendor-manifest.json'),
    exists = fs.existsSync(vendormanifest);
exists || console.log('\x1B[31m%s\x1B[39m', vendormanifest + ' dose not exist,please be created by cmd "npm run dll:loc | npm run dll:prod"');

console.log('current root', paths.root);
console.log('current src', paths.src);
console.log('current build', paths.build);
console.log('current env: ', process.env.NODE_ENV);

var cdn = "";
var dllReferenceContext = __dirname

if (process.env.CONFIG_FILE === 'dev') {
    cdn = "";
} else if (process.env.CONFIG_FILE === 'uat') {
    cdn = "";
    dllReferenceContext = PROJECT_ROOT
} else if (process.env.CONFIG_FILE === 'pub') {
    cdn = "";
    dllReferenceContext = PROJECT_ROOT
} else if (process.env.CONFIG_FILE === 'dll') {}

module.exports = {
    paths: paths,
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
                ],
                publicPath: paths.cssPublicPath
            })
        }, {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            use: 'url-loader?limit=500000&name=[path][name].[ext]'
        }]
    },
    plugins: [
        new ExtractTextPlugin('app.css'),
        new webpack.DefinePlugin({
            'process.env': {
                "CDN": JSON.stringify(cdn)
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        exists ? new webpack.DllReferencePlugin({
            context: dllReferenceContext,
            manifest: require(path.resolve(paths.build, './vendor-manifest.json'))
        }) : null
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {}
    },
    externals: {}
}
