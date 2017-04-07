## git ##

### 安装git ###

- mac安装git
		
	1. brew [https://brew.sh/](https://brew.sh/)

			brew install git
	2. Xcode **AppStore搜索安装Xcod**
		
		菜单“Xcode”->“Preferences”，在弹出窗口中找到“Downloads”，选择“Command Line Tools”，点“Install”就可以完成安装了。

- win安装git

	[https://git-for-windows.github.io/](https://git-for-windows.github.io/)下载安装

	win安装完成后，可右键打开“Git Bash Here”，可使用linux命令

### 配置git ###

	git config --global user.name "17717066234"
	git config --global user.email "m17717066234@aliyun.com"

> 查看：

	git config --global --list

> 使用密钥

	ssh-keygen -t rsa -C "m17717066234@aliyun.com"

**注**：报“Could not open a connection to your authentication agent.”，先执```eval `ssh-agent```或者```ssh-agent bash --login -i```

将```~/.ssh/id_rsa.pub```中的内容添加至git官网