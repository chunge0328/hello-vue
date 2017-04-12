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

### https存储密码 ###

- 默认15分钟

		git config --global credential.helper cache
- 自定义存储时间

		git config credential.helper 'cache --timeout=3600'
-长期存储

		git config --global credential.helper store

### 使用git ###

> 如果忘记命令可使用以下命令：
	
	git --help
- 有些情况下我们可能会在不同地点写代码，比如上班时在公司，下班时在家里，可是我们希望工作能够延续，那么代码的一致就很重要。
[github](https://github.com/)给我们提供了一个仓库，我们可以把代码暂存在[github](https://github.com/)上，同时使用```git```命令帮助我们管理代码，按照一个正常的工作流程...