let path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    extractCSS = new ExtractTextPlugin('css/[name].css'),
    extractLESS = new ExtractTextPlugin('css/[name]-less.css'),
    extractSASS = new ExtractTextPlugin('css/[name]-sass.css');

let NODE_ENV = process.env.NODE_ENV,

    ROOT_PATH = path.resolve(__dirname, ''),
    CONTEXT_ROOT = 'dist',
    OUTPUT_PATH = path.resolve(ROOT_PATH, CONTEXT_ROOT);

/*debugger*/
require('colors');
[
    NODE_ENV,
    ROOT_PATH,
    OUTPUT_PATH
].map(function (dat, ind) {
    console.info(ind + "=>" + dat.red);
});
/*debugger...end*/

module.exports = {
    entry: {
        common: ['vue', 'vue-router', 'vue-resource'],
        index: './index.js'
    },
    output: {
        filename: './js/[name].js',
        path: OUTPUT_PATH,
        publicPath: '/' + CONTEXT_ROOT + '/'
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

            router: '.src/js/config/RouterConfig.js',
            vue: 'vue/dist/vue.js'
        }
    },
    externals: {
        // vue: 'vue'
    }
}
;

module.exports.plugins = (module.exports.plugins || []).concat(
    new HtmlWebpackPlugin({
        title: 'hello-vue',
        hash: true
    }),
    extractCSS,
    extractLESS,
    extractSASS
);


if (NODE_ENV === 'development') {
    module.exports.devtool = '#eval-source-map';
    module.exports.devServer = {
        port: 8888
    };
    module.exports.devtool = false;
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.PRODUCTION': JSON.stringify(false),
            'process.env.BASE_PATH': JSON.stringify('http://baismusic.com/')
        })
    ]);
} else if (NODE_ENV === 'production') {
    module.exports.devtool = false;
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.PRODUCTION': JSON.stringify(true),
            'process.env.BASE_PATH': JSON.stringify('http://localhost:8888/')
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
