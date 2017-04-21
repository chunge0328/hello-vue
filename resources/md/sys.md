## 常用命令 ##

- 查看端口占用情况并禁用

	- windows

			netstat -ano | findstr 80
			tasklist | findstr ${pid}
			taskkill /f /t /im ${进程}
		
	- centos

			ps aux | grep 80
			kill -9 ${pid}