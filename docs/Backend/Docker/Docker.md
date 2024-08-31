> https://docs.docker.com/

## 安装

```shell
sudo yum install -y yum-utils

# 国外镜像仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 阿里云镜像仓库
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 安装docker
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 更新软件包索引
yum makecache fast

# 启动docker
systemctl start docker

# 测试安装成功
docker version

docker run hello-world

# 查看镜像
docker images
```

### 配置镜像加速器

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://1aefdpmy.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 常用命令

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711357196_0.png" alt="image-20230927002410781" style="zoom: 67%;" />

### 帮助命令

- `docker info`：docker 详细信息
- `docker 命令 --help`：帮助命令

### 镜像命令

- `docker images`：显示本地 docker 镜像
  - -a：显示所有镜像
  - -q：只显示镜像 id

- `docker search 镜像名`：搜索镜像
  - -f：过滤搜索结果，如 `-f=STARS=3000` 表示过滤收藏大于 3000 的
- `docker pull 镜像名[:tag]`：拉取镜像，默认最新，tag 指定版本
- `docker rmi -f 镜像id`：删除镜像
  - `docker rmi -f $(docker images -aq)`：删除所有镜像
- `docker save -o 文件名称.tar 镜像名:tag`：保存镜像包
- `docker load -i 文件名称.tar`：加载镜像包

### 容器命令

- `docker run [可选参数] image`：通过镜像创建并运行容器
  - `--name="Name"`：容器名字
  - -d：后台运行
  - -it：使用交互方式运行，进入容器查看内容
  - -p：指定容器端口
    - -p ip: 主机端口: 容器端口
    - -p 主机端口: 容器端口
    - -p 容器端口
  - -P：随机指定端口
  - -e key = value：指定容器的环境变量
  - -v 数据卷名称: 容器内目录：创建数据卷挂载
  - -v 本地目录: 容器内目录：本地目录需要以 / 或 ./ 开头
  - `--network NETWORK`：设置网桥
- `docker ps`：查看当前运行的容器
  - -a：查看历史运行的容器
  - -n =？：显示最近创建的 n 个容器
  - -q：只显示容器 id
  - `--format "展示内容"`

> 设置命令别名：
>
> ```shell
> vi ~/.bashrc
> 
> alias dps='docker ps –format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"'
> ```

- `docker rm 容器id  `：删除容器
  - `docker rm -f $(docker ps -aq)`：删除所有容器
- `exit`：退出容器并停止
  - Ctrl + P + Q：退出容器不停止
- `docker start 容器id`：启动容器(不创建)
- `docker restart 容器id`：重启容器
- `docker stop 容器id`：停止容器
- `docker kill 容器id`：强制停止容器

### 其他命令

- `docker logs [选项] 容器id `：查看日志
  - -f：持续监控 log
  - -t：显示时间
  - -n：显示条数
- `docker top 容器id`：查看容器进程信息
- `docker inspect 容器id`：查看容器元数据
- `docker exec -it 容器id bashShell`：进入当前运行的容器后开启新的终端
  - bashShell：/bin/bash
- `docker attach 容器id`：进入容器正在进行的终端，不会启动新的进程
- `docker cp 容器id:容器内路径 主机目的路径`：拷贝容器内文件到主机

## 数据卷

**数据卷(volume)** 是一个虚拟目录，是 **容器内目录与宿主机目录之间映射的桥梁**

/var/lib/docker/volumes/xx 

### 命令

- `docker volumn create `：创建数据卷
- `docker volumn ls`：查看数据卷
- `docker volumn rm 数据卷`：删除指定数据卷
- `docker volumn inspect 数据卷` ：查看某个数据卷的详情
- `docker volumn prune`：清楚数据卷

## Dockerfile

Dockerfile 文本文件包含一个个指令，用来构建镜像

- `FROM`：指定基础镜像
- `ENV`：设置环境变量
- `COPY`：拷贝本地文件到镜像的指定目录
- `RUN`：运行 shell 命令
- `EXPOSE`：指定容器运行时监听的端口
- `ENTRYPOINT`：镜像中应用的启动命令，容器运行时调用

```dockerfile
FROM ubuntu:16.04
ENV JAVA_DIR=/usr/local
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar
RUN cd $JAVA_DIR \ && tar -xf ./jdk8.tar.gz \ && mv ./jdk1.8.0_144 ./java8
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin
ENTRYPOINT ["java","-jar","/app.jar"]
```

```dockerfile
FROM openjdk:11.0-jre-buster

COPY ./docker-demo.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

`docker build -t myImage:[tag] .` ：Dockerfile 构建命令

## 容器网络

`docker netword 命令`

- `create NETWORK`：创建网络
- `ls`：查看网络
- `rm NETWORK`：删除
- `prune`：删除未使用的网络
- `connect NETWORK CONTAINER`：容器加入网络
- `disconnect NETWORK CONTAINER`：容器离开网络
- `inspect NETWORK`：查看网络

## DockerCompose

docker-compose.yml 定义一组相关联的应用容器

```yml
version: "3.8"

servises:
	containerA:
		image: mysql
		container_name: mysql
		ports:
			- "3306:3306"
		environment:
		volumes:
			- "./mysql/conf:/etc/mysql/conf.d"
		network:
			- hmall
	containerB:
		build:
			context: .
			dockerfile: Dockerfile
		container_namr: hmall
		depends_on:
		 	- mysql
networks:
	hm-net:
		name: hmall
```

`docker compose [OPTIONS] [COMMAND]`

- -f：指定 compose 文件路径和名称
- -p：指定 project 名称
- up：创建并启动所有 service 容器
- down：停止并移除所有容器，网络
- ps/logs/stop/start/restart/top/exec



## 常用命令

- 删除退出容器：`docker rm $(docker ps -q -f status=exited)`

-  删除未使用的镜像：`docker image prune -a`
