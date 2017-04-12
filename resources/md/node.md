## [node.js][node] ##

### 使用nvm ###

nvm是node的版本管理工具，并非必要，关于nvm的安装使用，可以参考[https://github.com/creationix/nvm](https://github.com/creationix/nvm)

>例如linux安装可以直接使用命令

	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
	
or
	
	wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
	
配置.bash_profile，增加
	 
	export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

> 测试

	nvm --version
	
> nvm安装node.js

	nvm install node
	node -v

### npm下载慢 ###
>临时解决方案

	npm install -gd express --registry=http://registry.npm.taobao.org
>永久解决方案

	npm config set registry http://registry.npm.taobao.org



[node]:https://nodejs.org/en/