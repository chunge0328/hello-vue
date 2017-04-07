### 恒生一体化4.0升级手册 ###

	application
	|
	config
	|
	etc
		|
		apis

### application ###

清空，复制新的war包（修改config中的配置，如下）

### config ###

<source-path>${war.name}</source-path>

### etc ###

大版本变动需要针对性更改配置文件
替换**License.cer** 、 **License.xml**

### apis ###

清空，复制新的zip包（不需解压，启动自动解压）

### 脚本 ###

ecsg-bus-domain/sqlalter/database/public
api库在config/jdbc/测试=*9832*|生产=? 中可以查询(测试地址=fundapi40_DSPDB10.163.130.147_5001)
	
> 生产

	#url
	jdbc:oracle:thin:@10.163.128.90:5001:dspdb1
	#user
	fundapi4

执行当前版本之上的sql脚本