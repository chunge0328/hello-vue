## 介绍 ##

这个项目是为了记录学习实践

### 准备 ###

- 必要环境

	1. git
	2. node.js
	
### 搭建 ###

- 目录结构
		
	![http://www.baidu.com][to-do]

		rm -rf hello-vue
		mkdir hello-vue
		cd hello-vue
		rm -rf resources src .gitignore
		mkdir resources src
		echo -e "## hello world ##" > readme.md


[to-do]:https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491555459137&di=a35f833b910b56fdd6340ee213eeaa61&imgtype=0&src=http%3A%2F%2Fmedia.licdn.com%2Fmpr%2Fmpr%2Fp%2F2%2F000%2F22a%2F36b%2F10502c0.jpg

- 初始化git

		echo -e ".idea\n/node_modules/\n/dist/\n.DS_Store\n*/.DS_Store" > .gitignore
		git init
		git remote add origin "git@github.com:17717066234/hello-vue.git"

	如果报错```remote origin already exists```

		git remote set-url origin "git@github.com:17717066234/hello-vue.git"

	**注**：此处使用自己的git地址
	> 测试
		
		git add .
		git commit -m "add"
		git push -u origin master
		
- 初始化package.json

		npm init
	按照提示一步步录入即可

- 使用webpack

	> 安装webpack

		npm i webpack -g
	> 使用webpack配置文件

		touch webpack.config.js
	> 附上一个webpack.config.js的基本配置

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

	使用```webpack```命令打包
	
	**注**：这里需要在根目录下创建index.js

- npm安装依赖
	
	> 使用到的js有vue、vue-resource、vue-router、element-ui，这里使用npm方式引入

		npm i -S vue vue-resource vue-router element-ui
	> 除此之外，为了加入环境变量、es6支持、测试和生产分离等等功能，还需要引入其他插件

		npm i -D cross-env webpack webpack-dev-server
		npm i -D html-webpack-plugin
		npm i -D extract-text-webpack-plugin
		npm i -D style-loader css-loader file-loader
		npm i -D vue-template-compiler vue-loader
		npm i -D babel-core babel-loader babel-plugin-component babel-preset-es2015
		npm i -D js-base64

	1. cross-env
		
		
- 测试与生产分离

	package.json中配置“scripts”
		
		"dev": "cross-env NODE_ENV=development webpack-dev-server",
		"build": "cross-env NODE_ENV=production webpack"

