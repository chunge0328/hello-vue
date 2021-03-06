let path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    extractCSS = new ExtractTextPlugin('css/[name].css'),
    extractLESS = new ExtractTextPlugin('css/[name]-less.css'),
    extractSASS = new ExtractTextPlugin('css/[name]-sass.css');

const NODE_ENV = process.env.NODE_ENV,
    ROOT_PATH = path.resolve(__dirname, ''),
    CONTEXT_ROOT = NODE_ENV === 'production' ? 'red' : '',
    CONFIG = {
        'NODE_ENV': NODE_ENV,
        'ROOT_PATH': ROOT_PATH,
        'CONTEXT_ROOT': CONTEXT_ROOT,
        'OUTPUT_PATH': path.resolve(ROOT_PATH, CONTEXT_ROOT),
        'PUBLIC_PATH': (CONTEXT_ROOT == null || CONTEXT_ROOT.length == 0) ? '/' : '/' + CONTEXT_ROOT + '/',
        'INDEX_HTML': NODE_ENV === 'production' ? path.resolve(ROOT_PATH, 'index.html') : 'index.html'
    };

/*debugger*/
require('colors');
for (let i in CONFIG) {
    console.info(i.yellow + " => ".blue + CONFIG[i].red);
}
;
/*debugger...end*/

module.exports = {
    entry: {
        common: ['vue', 'vue-router', 'mint-ui'],
        red: './config/entry/red.js'
    },
    output: {
        filename: './js/[name].js',
        path: CONFIG.OUTPUT_PATH,
        publicPath: CONFIG.PUBLIC_PATH
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader', 'postcss-loader'])/*['style-loader', 'css-loader']*/
            },
            {
                test: /\.less$/i,
                use: extractLESS.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.scss$/,
                use: extractSASS.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'file/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'img/[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            Css: path.resolve(__dirname, 'src/css/'),
            Js: path.resolve(__dirname, 'src/js/'),
            Vue: path.resolve(__dirname, 'src/vue/'),

            vue: 'vue/dist/vue.js',

        }
    },
    externals: {
        /*vue: 'vue'*/
    }
}
;

module.exports.plugins = (module.exports.plugins || []).concat(
    new HtmlWebpackPlugin({
        title: '红包活动',
        hash: true,
        js: ["red", "common"],
        excludeChunks: ["index"],
        filename: CONFIG.INDEX_HTML
    }),
    extractCSS,
    extractLESS,
    extractSASS
);


if (CONFIG.NODE_ENV === 'development') {
    module.exports.devtool = '#eval-source-map';
    module.exports.devServer = {
        port: 7778
    };
    module.exports.devtool = false;
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.PRODUCTION': JSON.stringify(false),
            'process.env.ACTIVITY_ID': JSON.stringify('d0662c1b-29ea-4627-9607-a6265aa4fa67'),
            'process.env.BASE_PATH': JSON.stringify('http://10.169.4.32:8066/one'),
            'process.env.ACTIVITY_HREF': JSON.stringify('http://10.163.134.48:8080/red')
        })
    ]);
} else if (CONFIG.NODE_ENV === 'production') {
    module.exports.devtool = false;
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.PRODUCTION': JSON.stringify(true),
            'process.env.ACTIVITY_ID': JSON.stringify('d0662c1b-29ea-4627-9607-a6265aa4fa67'),
            'process.env.BASE_PATH': JSON.stringify('https://app.cifm.com/one'),
            'process.env.ACTIVITY_HREF': JSON.stringify('https://app.cifm.com/red/')
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: module.exports.devtool && (module.exports.devtool.indexOf("sourcemap") >= 0 || module.exports.devtool.indexOf("source-map") >= 0),
            beautify: false,
            comments: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['common'].reverse(),
            filename: 'js/[name].js'
        })
    ]);
}
