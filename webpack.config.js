/**
 * @file
 * @author huangzongzhe
 * webpack 4.16.1
 */

/* eslint-disable fecs-camelcase */
// const webpack = require('webpack'); // 用于访问内置插件
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 与webpack内置dev-server功能会有重复，所以不推荐混合在一起使用
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 不管用？沃日哦
// let LiveReloadPlugin = require('webpack-livereload-plugin');

// clean-webpack-plugin: https://github.com/johnagan/clean-webpack-plugin
let pathsToClean = [
    // 'app/public/js/*.js'
    'app/public/*'
];
let cleanOptions = {
    watch: true
};

const outputDir = 'public';

// TODO: 热更新，浏览器同步组件
// module.exports =
let config = {
    // When mode is production or not defined, minimize is enabled. This option automatically adds Uglify plugin.
    // production will remove the 'dead code'. Look at Tree Shaking
    mode: 'none',
    devtool: 'eval-source-map', // only dev
    // devtool: 'source-map',
    // mode: 'production',
    // mode: 'development',
    entry: {
        // wallet: './app/web/js/index.jsx',
        // transactionDetail: './app/web/js/transactionDetail.jsx'
        popup: './app/web/pages/Popup/Popup.js',
        prompt: './app/web/pages/Prompt/Prompt.js',
        background: './app/web/background.js',
        extensionSDK: './app/web/extensionSDK.js',
        content: './app/web/content.js',
        inject: './app/web/inject.js'
    },
    output: {
        path: path.resolve(__dirname, 'app'), // equal to __diname + '/build'
        // filename: 'public/js/[name].[hash:5].js'
        filename: `${outputDir}/js/[name].js`
    },

    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
        alias: {
            'aelf-sdk$': 'aelf-sdk/dist/aelf.umd.js'
        }
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/react'
                    ],
                    plugins: [
                        // If missing this one, will throw regeneratorRuntime is not defined
                        // https://babeljs.io/docs/en/babel-plugin-transform-runtime
                        ['@babel/plugin-transform-runtime'],
                        [
                            'import',
                            {
                                libraryName: 'antd-mobile',
                                style: 'css'
                            }
                        ] // `style: true` 会加载 less 文件\
                    ]
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
            // TODO 位置需要调整下，不然拿到的路径不对。
            test: /\.(png|svg|jpg|gif|ico)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    // file output path
                    outputPath: `${outputDir}/assets/output`,
                    // path in css
                    publicPath: './assets/output'
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
            filename: `./${outputDir}/popup.html`
        }),
        new HtmlWebpackPlugin({
            chunks: [''],
            template: './app/web/background.html',
            filename: `./${outputDir}/background.html`
        }),
        new HtmlWebpackPlugin({
            chunks: [''],
            template: './app/web/options.html',
            filename: `./${outputDir}/options.html`
        }),
        new HtmlWebpackPlugin({
            chunks: [''],
            template: './app/web/prompt.html',
            filename: `./${outputDir}/prompt.html`
        }),
        new CopyWebpackPlugin([{
                from: './app/web/manifest.json',
                to: `./${outputDir}/manifest.json`,
                toType: 'file'
            },
            {
                from: './app/web/assets',
                to: `./${outputDir}/assets`,
                toType: 'dir'
            },
            {
                from: './app/web/style',
                to: `./${outputDir}/style`,
                toType: 'dir'
            },
            {
                from: './app/web/_locales',
                to: `./${outputDir}/_locales`,
                toType: 'dir'
            }
        ]),
        // new HtmlWebpackPlugin({
        //     chunks: ['transactionDetail'],
        //     template: './app/web/page/transactionDetail.tpl',
        //     filename: './view/transactionDetail.tpl'
        // }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions)
    ]
};

module.exports = (env, argv) => {

    if (argv.mode === 'production' || config.mode !== 'none') {
        config.plugins.push(
            // new HtmlWebpackPlugin({
            //     chunks: [''],
            //     template: './app/web/popup.html',
            //     filename: `./${outputDir}/popup.html`
            // })
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            })
        );
        // console.log('production: ', config);
    }

    return config;
};
