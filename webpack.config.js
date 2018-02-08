const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 提取css文件
const autoprefixer = require('autoprefixer');

const config = {
    entry: {
        "babel-polyfill": "babel-polyfill",
        index: path.resolve(__dirname,'src/js/index.js'),
        news: path.resolve(__dirname,'src/js/news.js'),
        vendor: [path.resolve(__dirname,'src/js/jquery.js')],
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'js/[name].js',
        // publicPath: "/"
    },
    resolve:{
        alias: {
            'jquery': path.resolve(__dirname, 'src/js/jquery.js')
        }
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(css|less)$/,
                exclude: /node_modules/,
                // loader: "style-loader!css-loader!postcss-loader!less-loader",
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader', // 当css没有被提取的loader
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'postcss-loader', // 浏览器兼容等
                            options: {
                                plugins: () => [autoprefixer(
                                    { browsers: ['iOS >= 7', 'Android >= 4.1',
                                        'last 10 Chrome versions', 'last 10 Firefox versions',
                                        'Safari >= 6', 'ie > 8']
                                    }
                                )],
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'less-loader',

                        }
                    ]
                })
            },
            {// 转译ejs/tpl文件
                test: /\.ejs/,
                use: [
                    'ejs-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                exclude: /node_modules/,
                use:[
                    'url-loader?limit=10000&name=images/[name].[hash:5].[ext]',
                    {
                        loader: "image-webpack-loader",
                    }
                ],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[hash:5].[ext]'
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ //全局配置加载
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new ExtractTextPlugin('css/[name].[hash:5].css'),

        new webpack.optimize.CommonsChunkPlugin({ //合并公共文件
            name: 'vendor',//对应于上面的entry的key
            // filename:"js/vendor.js",
            minChunks:2
        })
    ],
    devServer:{
        inline: true, //设置为true，代码有变化，浏览器端刷新。
        //设置基本目录结构
        contentBase:path.resolve(__dirname),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717,
        proxy: {
            '/api':{
                target:'http://172.16.100.170:8081'
            }
        }
    }
};

module.exports = config;

let pageArr = [
    {
        title: '首页',
        id:'indexPage',
        filename: 'index.html',
        chunks: ['index','vendor']
    },
    {
        title: '新闻页',
        id:'newsPage',
        filename: 'news.html',
        chunks: ['news','vendor']
    }
]

pageArr.forEach((item) => {
    module.exports.plugins.push(new HtmlWebpackPlugin({
        title: item.title,
        id: item.id,
        filename: item.filename,
        favicon: '',
        template: path.resolve(__dirname,'src/index.html'),
        minify: {
            caseSensitive: false,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
        },
        hash: true,
        cache: true,
        inject:'body',
        chunks: item.chunks
    }))
})

if(process.env.NODE_ENV == "prod") {
    //清空输出目录
    module.exports.plugins.push(new CleanPlugin(["./dist"], {
        "root": path.resolve(__dirname, ""),
        verbose: true,
        dry: false
    }));
    //代码压缩
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        })
    );

}else{
    //热加载插件
    module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
}