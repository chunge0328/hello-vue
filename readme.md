## 介绍 ##

这个项目是为了记录学习实践

### 准备 ###

- 必要环境

	1. ```git```
	2. ```node.js```
	
### 搭建 ###

- 目录结构
		
	![http://www.baidu.com][to-do]

	> 构建目录
	
		rm -rf hello-vue
		mkdir hello-vue
		cd hello-vue
		rm -rf resources src readme.md .gitignore
		mkdir resources src
		echo -e "## hello-vue ##" > readme.md
		echo -e ".idea\n/node_modules/\n/dist/\n.DS_Store\n*/.DS_Store" > .gitignore

[to-do]:https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491555459137&di=a35f833b910b56fdd6340ee213eeaa61&imgtype=0&src=http%3A%2F%2Fmedia.licdn.com%2Fmpr%2Fmpr%2Fp%2F2%2F000%2F22a%2F36b%2F10502c0.jpg

- 初始化git
		
		git init
		git remote add origin "git@github.com:17717066234/hello-vue.git"

	如果报错```remote origin already exists```

		git remote set-url origin "git@github.com:17717066234/hello-vue.git"

	**注**：此处请使用自己的git地址
	> 测试
		
		git add .
		git commit -m "add"
		git push -u origin master
		
- 初始化package.json

		npm init
	按照提示一步步录入内容

- 使用webpack

	> 安装webpack

		npm i webpack -g
	> 使用webpack配置文件

		touch webpack.config.js
	> 附上webpack.config.js的基本配置

		let path = require('path')

		let ROOT_PATH = path.resolve(__dirname, ''),
		    OUTPUT_PATH  = path.resolve(ROOT_PATH, 'dist')
		
		module.exports = {
		    entry: {
		        index: './index.js'
		    },
		    output: {
		        filename: '[name].js',
		        path: OUTPUT_PATH
		    }
		}

	> 测试
	
		webpack
	观察结果
	
	**注**：entry中的./index.js指的是根目录下的index.js，因此需要自己创建index.js

- 使用npm
	
	> 本项目依赖的插件有vue、vue-resource、vue-router、element-ui，使用npm引入
	
		npm i -S vue vue-resource vue-router element-ui
	> 除此之外，还需要其他具备构建、部署、打包、es6转es5功能的插件

		npm i -D cross-env
		npm i -D webpack-dev-server webpack
		npm i -D html-webpack-plugin
		npm i -D babel-core babel-loader babel-preset-es2015
		npm i -D css-loader vue-template-compiler vue-loader
	观察package.json
	
	**注**：此处引入等默认是最新版本，新版本中可能会有```warning```，甚至报错，按照提示进行修正即可
	1. [cross-env](https://npm.taobao.org/package/cross-env) 

		主要用于提供跨平台环境变量功能，例如通过设置命令行参数```NODE_ENV=development```或者```NODE_ENV=production```来判断当前环境是测试还是生产
		>例：
		
			let NODE_ENV = process.env.NODE_ENV;
			if (NODE_ENV === 'development') {
				// do smt
			} else if (NODE_ENV === 'production') {
				// do other smt
			}
	2. [webpack](https://webpack.js.org)
	
		将css、js、html、img当成一个个模块来管理，默认配置文件为```webpack.config.js```
	3. [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)

		自动生成html、引入js、引入css，在```webpack.config.js```中配置插件
		> 例：
		
			module.exports.plugins = (module.exports.plugins || []).concat(
			    new HtmlWebpackPlugin({
			        title: 'hello-vue',
			        hash: true
			    })
			);
	4. [babel](http://babeljs.cn)

		将es6语法转换成部分落后浏览器可识别的语法
		> 需要增加```.babelrc```文件,```.babelrc```配置示例：
					
			{
				"presets": ["es2015"],
				"plugins": [],
				"comments": false
			}
		
- 配置scripts

	```package.json```中```scripts```增加：
		
		"dev": "cross-env NODE_ENV=development webpack-dev-server",
		"build": "cross-env NODE_ENV=production webpack"

	> 使用```npm run ...```运行```scripts```
	\，此处测试使用```npm run dev```，生产打包使用```npm run build```
	
- index.js

	略
	
### 引入css ###

	npm i -D style-loader
	
> ```webpack.config.js```添加```rules```

	{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    }	
>测试，index.vue中加入：
	
	import 'element-ui/lib/theme-default/index.css'
测试报错，因为css中引入了font字体，所以需要```file-loader```：
	
	npm i -D file-loader
> ```webpack.config.js```添加```rules```

	{
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
    },
    {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
            name: '[name].[ext]?[hash]'
        }
    }

### element-ui ###

[http://element.eleme.io/#/zh-CN](http://element.eleme.io/#/zh-CN)

- 按需引入

	1. 安装```babel-plugin-component```
		
			npm i -D babel-plugin-component
		
	2. ```.babelrc```

			{
			    "presets": [
			        ["es2015", {"modules": false}]
			    ],
			    "plugins": [["component", [
			        {
			            "libraryName": "element-ui",
			            "styleLibraryName": "theme-default"
			        }
			    ]]]
			}
			
	> 效果
	
	打包后生成的js小了很多
	
### 优化打包 ###
为了使用户打开页面后相应速度更快，减少服务器传输，减小js体积就变得重要

- 按需引入

	例如```element-ui```
- 压缩js

	```webpack```官网提供一个方案：
	
		new webpack.optimize.UglifyJsPlugin({
            sourceMap: module.exports.devtool && (module.exports.devtool.indexOf("sourcemap") >= 0 || module.exports.devtool.indexOf("source-map") >= 0)
        })
	把它加到```webpack.config.js```的```module.exports.plugins
	>测试
	
	运行```npm run build```，观察打包后的js体积

- 抽离公共js

	项目中使用到了```vue```、```vue-router```和```vue-resource```，这些js将来可能在cnd引入，而非在服务器引入（主要考虑节省流量），所以将他们作为公共多js放在一个js中，另外的业务逻辑相关的放在另一个js中
		
		#entry
		{
			common: ['vue', 'vue-router', 'vue-resource'],
			index: './index.js'
		}
		#plugins
		new webpack.optimize.CommonsChunkPlugin({
		    name: ['common'].reverse(),
		    filename: 'js/[name].js'
		})
- js、css分离

	默认状态下```import```的css最终打包至一个js中，这样会造成js体积过大，页面初始化加载变慢
	
		npm i -D extract-text-webpack-plugin 
		npm i -D postcss-loader
		npm i -D less less-loader
		npm i -D node-sass sass-loader
		
	> 使用```extract-text-webpack-plugin```
	
		let ExtractTextPlugin = require('extract-text-webpack-plugin'),
			extractCSS = new ExtractTextPlugin('css/[name].css'),
			extractLESS = new ExtractTextPlugin('css/[name]-less.css'),
			extractSASS = new ExtractTextPlugin('css/[name]-sass.css');
		#rules中添加
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
        }
        #plugins中添加
        [extractCSS, extractLESS, extractSASS]
	> 测试
	
	运行```npm run build```，js和css总体积基本不变，但是js体积小了很多
			
### vue-router ###
[https://router.vuejs.org/zh-cn/](https://router.vuejs.org/zh-cn/)

### vue-resource ###

[https://github.com/pagekit/vue-resource](https://github.com/pagekit/vue-resource)
### markdown-js ###

[https://github.com/evilstreak/markdown-js](https://github.com/evilstreak/markdown-js)
	
	npm i -S markdown