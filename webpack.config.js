let path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

require('colors')

let NODE_ENV = process.env.NODE_ENV,

    ROOT_PATH = path.resolve(__dirname, ''),
    OUTPUT_PATH = path.resolve(ROOT_PATH, 'dist');

/*debugger*/
[
    NODE_ENV,
    ROOT_PATH,
    OUTPUT_PATH
].map(function (dat, ind) {
    console.info(dat.red);
})
/*debugger...end*/

module.exports = {
    entry: {
        index: './index.js'
    },
    output: {
        filename: './js/[name].js',
        path: OUTPUT_PATH
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: './fonts/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpe?g|gif)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: './img/[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',
        hash: true
    })]
}

if (NODE_ENV === 'development') {
    module.exports.devServer = {
        port: 80
    }
} else if (NODE_ENV === 'production') {

}