## maven笔记 ##

### 参考 ###
- [maven官网](http://maven.apache.org/)
- [nexus官网](http://www.sonatype.org/nexus/)

### 安装maven ###

使用maven必须安装jkd

### maven常用命令 ###

> 打包至项目的```target```目录
	
	mvn package
> 打包至本地仓库
	
	mvn install

> 打包并发布至私服/远程仓库

	mvn deploy
> 清理项目

	mvn clean

> 跳过测试
	
	-DskipTests

### 使用nexus搭建私服 ###

[nexus官网](http://www.sonatype.org/nexus/)

版本不同，使用方法可能会有差异，这里以**3.2.1-01**为例

- 下载及解压

	> 目录结构

	![http://www.baidu.com](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491555459137&di=a35f833b910b56fdd6340ee213eeaa61&imgtype=0&src=http%3A%2F%2Fmedia.licdn.com%2Fmpr%2Fmpr%2Fp%2F2%2F000%2F22a%2F36b%2F10502c0.jpg)
- 修改```/etc/nexus-default.properties```

	> 可以修改端口，项目名等

- 运行

	> 在bin目录下打开命令行，输入
	
		nexus.exe /run

- 通过网页访问后台

	笔者计算机名为```http://qh-lp-712/```，修改```/etc/nexus-default.properties```端口号为```7777```，因此访问地址为```http://qh-lp-712:7777/```

### 使用nexus私服 ###

- 配置```~/.m2/settings.xml```

	> 配置```servers```
		
        <server>
            <id>nexus</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
        <server>
            <id>releases</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
        <server>
            <id>snapshots</id>
            <username>admin</username>
            <password>admin123</password>
        </server>

	> 配置```mirrors```
		
        <mirror>
            <!--This sends everything else to /public -->
            <id>nexus</id>
            <mirrorOf>*</mirrorOf>
            <url>http://qh-lp-712:7777/repository/maven-public/</url>
        </mirror>
        <mirror>
            <!--This sends everything else to /public -->
            <id>releases</id>
            <mirrorOf>*</mirrorOf>
            <url>http://qh-lp-712:7777/repository/maven-releases/</url>
        </mirror>
        <mirror>
            <!--This sends everything else to /public -->
            <id>snapshots</id>
            <mirrorOf>*</mirrorOf>
            <url>http://qh-lp-712:7777/repository/maven-snapshots/</url>
        </mirror>

	> 配置```profiles```
		
        <profile>
            <id>nexus</id>
            <repositories>
                <repository>
                    <id>releases</id>
                    <url>http://releases</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>snapshots</id>
                    <url>http://snapshots</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>releases</id>
                    <url>http://releases</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </pluginRepository>
                <pluginRepository>
                    <id>snapshots</id>
                    <url>http://snapshots</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>

	> 配置```activeProfiles```
		
        <activeProfile>nexus</activeProfile>
        
- 配置项目中的```pom.xml```

		<distributionManagement>
	        <repository>
	            <id>nexus</id>
	            <name>Relteases</name>
	            <url>http://qh-lp-712:7777/repository/maven-releases/</url>
	        </repository>
	        <snapshotRepository>
	            <id>nexus</id>
	            <name>Snapshot</name>
	            <url>http://qh-lp-712:7777/repository/maven-snapshots/</url>
	        </snapshotRepository>
	    </distributionManagement>

- 上传jar包至私服

	- releases版本

			mvn deploy:deploy-file -DgroupId=${groupId} -DartifactId=${artifactId} -Dversion=${version} -Dpackaging=jar -Dfile=${filePath} -Durl=http://qh-lp-712:7777/repository/maven-releases/ -DrepositoryId=releases
	- snapshots版本 
	
			mvn deploy:deploy-file -DgroupId=${groupId} -DartifactId=${artifactId} -Dversion=${version} -Dpackaging=jar -Dfile=${filePath} -Durl=http://qh-lp-712:7777/repository/maven-snapshots/ -DrepositoryId=snapshots