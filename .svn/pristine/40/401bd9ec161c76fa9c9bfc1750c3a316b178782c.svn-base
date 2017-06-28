## mac 使用MYSQL ##

### 卸载 ###

已经安装了mysql的同学们要注意了，卸载mysql不是件容易的事，附上命令：

	sudo rm /usr/local/mysql
	sudo rm -rf /usr/local/mysql*
	sudo rm -rf /Library/StartupItems/MySQLCOM
	sudo rm -rf /Library/PreferencePanes/My*
	sudo rm -rf ~/Library/PreferencePanes/My*
	sudo rm -rf /Library/Receipts/mysql*
	sudo rm -rf /Library/Receipts/MySQL*
	sudo rm -rf /var/db/receipts/*mysql.*
	
最后在调用```vim /etc/hostconfig```，删除 ```MYSQLCOM=-YES```这一行。

### 忘记密码 ###

	vim /etc/my.cnf
	
内容

	[mysqld]
	skip-grant-tables
	
重启mysql
	
	mysql -u root -p
	flush privileges;
	set password for 'root'@'localhost' = password('1234');
	vim /etc/my.cnf
	
内容

	[mysqld]
	#skip-grant-tables
	
重启mysql
	