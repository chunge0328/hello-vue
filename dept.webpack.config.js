let path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    extractCSS = new ExtractTextPlugin('css/[name].css'),
    extractLESS = new ExtractTextPlugin('css/[name]-less.css'),
    extractSASS = new ExtractTextPlugin('css/[name]-sass.css');

const NODE_ENV = process.env.NODE_ENV,
    ROOT_PATH = path.resolve(__dirname, ''),
    CONTEXT_ROOT = NODE_ENV === 'production' ? 'dept' : '',
    CONFIG = {
        'NODE_ENV': NODE_ENV,
        'ROOT_PATH': ROOT_PATH,
        'CONTEXT_ROOT': CONTEXT_ROOT,
        'OUTPUT_PATH': path.resolve(ROOT_PATH, CONTEXT_ROOT),
        'PUBLIC_PATH': (CONTEXT_ROOT == null || CONTEXT_ROOT.length == 0) ? '/' : '/' + CONTEXT_ROOT + '/',
        'INDEX_HTML': NODE_ENV === 'production' ? path.resolve(CONTEXT_ROOT, 'index.html') : 'index.html'
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
        common: ['vue', 'vue-router', 'vue-resource'],
        index: './dept.js'
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

            vue: 'vue/dist/vue.js'
        }
    },
    externals: {
        /*vue: 'vue'*/
    }
}
;

module.exports.plugins = (module.exports.plugins || []).concat(
    new HtmlWebpackPlugin({
        title: 'hello-dept',
        hash: true,
        js: ["index", "common"],
        excludeChunks: ["investigates"],
        filename: CONFIG.INDEX_HTML
    }),
    extractCSS,
    extractLESS,
    extractSASS
);


if (CONFIG.NODE_ENV === 'development') {
    module.exports.devtool = '#eval-source-map';
    module.exports.devServer = {
        host: '0.0.0.0',
        port: 7780,
        disableHostCheck: true
    };
    module.exports.devtool = false;
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.TOPIC_ID': JSON.stringify('785d6441-1e70-41bb-94ae-47b0f5f19b5b'),
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.PRODUCTION': JSON.stringify(false),
            'process.env.BASE_PATH': JSON.stringify('http://localhost:8066/one')
        })
    ]);
} else if (CONFIG.NODE_ENV === 'production') {
    module.exports.devtool = false;
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.TOPIC_ID': JSON.stringify('785d6441-1e70-41bb-94ae-47b0f5f19b5b'),
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.PRODUCTION': JSON.stringify(true),
            'process.env.BASE_PATH': JSON.stringify('http://app.cifm.com/one')
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
