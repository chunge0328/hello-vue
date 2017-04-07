## 介绍 ##

这个项目是学习实践成果，目的是为了记录开发过程中的收获。

### 准备 ###

- 必要环境

		git node.js
	
### 搭建 ###

	rm -rf hello-vue
	mkdir hello-vue
	cd hello-vue

- 目录结构
		
	![http://www.baidu.com][to-do]
		
		rm -rf resources src .gitignore
		mkdir resources src
		echo -e "## hello world ##" > readme.md


[to-do]:https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491555459137&di=a35f833b910b56fdd6340ee213eeaa61&imgtype=0&src=http%3A%2F%2Fmedia.licdn.com%2Fmpr%2Fmpr%2Fp%2F2%2F000%2F22a%2F36b%2F10502c0.jpg

- 初始化git

		echo -e "/node_modules/\n/dist/\n.DS_Store\n*/.DS_Store" > .gitignore
		git init
		git remote add origin "https://github.com/17717066234/hello-vue.git"

	如果报错```remote origin already exists```

		git remote set-url origin "https://github.com/17717066234/hello-vue.git"

	**注：此处使用自己的git地址**
	> 测试
		
		git add .
		git commit -m "add"
		git push -u origin master
		
	