/**
 * @file
 * @author huangzongzhe
 * webpack 4.16.1
 */

/* eslint-disable fecs-camelcase */
// const webpack = require('webpack'); // 用于访问内置插件
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 与webpack内置dev-server功能会有重复，所以不推荐混合在一起使用
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 不管用？沃日哦
// let LiveReloadPlugin = require('webpack-livereload-plugin');

// clean-webpack-plugin: https://github.com/johnagan/clean-webpack-plugin
// let pathsToClean = [
//     // 'app/public/js/*.js'
//     'app/public/*'
// ];
// let cleanOptions = {
//     watch: true
// };

// TODO: 热更新，浏览器同步组件
module.exports = {
    // When mode is production or not defined, minimize is enabled. This option automatically adds Uglify plugin.
    // production will remove the 'dead code'. Look at Tree Shaking
    mode: 'production',
    // mode: 'development',
    entry: {
        // wallet: './app/web/js/index.jsx',
        // transactionDetail: './app/web/js/transactionDetail.jsx'
        popup: './app/web/pages/Popup/Popup.js',
        extensionSDK: './app/web/extensionSDK.js'
    },
    output: {
        path: path.resolve(__dirname, 'app'), // equal to __diname + '/build'
        // filename: 'public/js/[name].[hash:5].js'
        filename: 'public/js/[name].js'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react']
                }
            }
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: 'AELF-[path][name]_[local]-[hash:base64:5]'
                        // localIdentName: '[path][name]__[local]--[hash:base64:5]',
                        // getLocalIdent: (context, localIdentName, localName, options) => {
                        // 	console.log('localIdentName', localName);
                        // 	return 'whatever_random_class_name'
                        // }
                    }
                },
                'sass-loader',
                'postcss-loader'
            ]
        }, {
            // 这里用来加载ant-mobile的样式，不做处理。
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.(png|svg|jpg|gif|ico)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: './public/assets/output'
                }
            }]
        }]
    },
    node: {
        fs: 'empty',
        child_process: 'empty'
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: [''],
            template: './app/web/popup.html',
            filename: './public/popup.html'
        }),
        new HtmlWebpackPlugin({
            chunks: [''],
            template: './app/web/background.html',
            filename: './public/background.html'
        }),
        new HtmlWebpackPlugin({
            chunks: [''],
            template: './app/web/options.html',
            filename: './public/options.html'
        }),
        new HtmlWebpackPlugin({
            chunks: [''],
            template: './app/web/bindApp.html',
            filename: './public/bindApp.html'
        }),
        new CopyWebpackPlugin([{
                from: './app/web/manifest.json',
                to: './public/manifest.json',
                toType: 'file'
            },
            {
                from: './app/web/assets',
                to: './public/assets',
                toType: 'dir'
            },
            {
                from: './app/web/_locales',
                to: './public/_locales',
                toType: 'dir'
            }
        ])
        // new HtmlWebpackPlugin({
        //     chunks: ['transactionDetail'],
        //     template: './app/web/page/transactionDetail.tpl',
        //     filename: './view/transactionDetail.tpl'
        // }),
        // new CleanWebpackPlugin(pathsToClean, cleanOptions)
        // ,
        // new BundleAnalyzerPlugin({
        // 	analyzerMode: 'server',
        // 	analyzerHost: '127.0.0.1',
        // 	analyzerPort: 8889,
        // 	reportFilename: 'report.html',
        // 	defaultSizes: 'parsed',
        // 	openAnalyzer: true,
        // 	generateStatsFile: false,
        // 	statsFilename: 'stats.json',
        // 	statsOptions: null,
        // 	logLevel: 'info'
        // })
    ]
};
