# CICD

## 后端微服务部署

### DockerCompose 编写

开发环境 DockerCompose

```yml
version: '3'
services:
  mysql:
    image: mysql:8 # 使用的镜像
    container_name: coj-mysql # 启动的实例名称
    environment:
      MYSQL_ROOT_PASSWORD: qq1219533124. # root 用户密码
      TZ: Asia/Shanghai
    ports:
      - "3306:3306" # 端口映射
    volumes:
      - ./.mysql-data:/var/lib/mysql # 将数据目录挂载到本地目录以进行持久化
      - ./mysql-init:/docker-entrypoint-initdb.d # 启动脚本
      - ./mysql-init/mysql.cnf:/etc/mysql/conf.d/mysql.conf   # mysql配置限制内存
    restart: always # 崩溃后自动重启
    networks:
      - mynetwork # 指定网络
  rabbitmq:
    image: rabbitmq:3.12.6-management # 支持管理面板的消息队列
    container_name: coj-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: moriic
      RABBITMQ_DEFAULT_PASS: qq1219533124.
    ports:
      - "5672:5672"
      - "15672:15672" # RabbitMQ Dashboard 端口
    volumes:
      - ./.rabbitmq-data:/var/lib/rabbitmq # 持久化
    networks:
      - mynetwork
  nacos:
    image: nacos/nacos-server:v2.2.0-slim
    container_name: coj-nacos
    ports:
      - "8848:8848"
      - "9848:9848"
      - "9849:9849"
    volumes:
      - ./.nacos-data:/home/nacos/data
    networks:
      - mynetwork
    environment:
      - JVM_XMS=32M
      - JVM_XMX=128M
      - JVM_XMN=16M
      - JVM_MS=32M
      - JVM_MMS=128M
      - MODE=standalone # 单节点模式启动
      - PREFER_HOST_MODE=hostname # 支持 hostname
      - TZ=Asia/Shanghai # 控制时区
networks:
  mynetwork:
    ipam:
      config:
        - subnet: 172.20.0.0/24
          gateway: 172.20.0.1

```

微服务部署 DockerCompose

```yml
services:
  coj-backend-gateway:
    container_name: coj-backend-gateway
    image: moriic/coj-backend-gateway
    ports:
      - "8101:8101"
    networks:
      - mynetwork
  coj-backend-user-service:
    container_name: coj-backend-user-service
    ports:
      - "8102:8102"
    image: moriic/coj-backend-user-service
    depends_on:
      - coj-backend-gateway
    networks:
      - mynetwork
  coj-backend-question-service:
    container_name: coj-backend-question-service
    image: moriic/coj-backend-question-service
    ports:
      - "8103:8103"
    depends_on:
      - coj-backend-user-service
      - coj-backend-gateway
    networks:
      - mynetwork
  coj-backend-judge-service:
    container_name: coj-backend-judge-service
    image: moriic/coj-backend-judge-service
    ports:
      - "8104:8104"
    depends_on:
      - coj-backend-user-service
      - coj-backend-question-service
      - coj-backend-gateway
    networks:
      - mynetwork
networks:
  mynetwork:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/24
          gateway: 172.20.0.1
```

Dockerfile

```dockerfile
# 基础镜像
FROM openjdk:8-jdk-alpine
  
# 指定工作目录
WORKDIR /app
  
# 将 jar 包添加到工作目录，比如 target/coj-backend-user-service-0.0.1-SNAPSHOT.jar
ADD target/coj-backend-user-service-0.0.1-SNAPSHOT.jar .
  
# 暴露端口
EXPOSE 8102
  
# 启动命令
ENTRYPOINT ["java", "-Xms200M", "-Xmx200M", "-jar", "/app/coj-backend-user-service-0.0.1-SNAPSHOT.jar","--spring.profiles.active=prod"]
```

### GithubAction

```yml
name: Deploy with docker

on:
  push:
    branches: [ main ]

jobs:
  compile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4.1.7
      - name: Set up JDK 8
        uses: actions/setup-java@v4.2.2
        with:
          java-version: '8'
          distribution: 'adopt'
      # maven缓存，不加的话每次都会去重新拉取，会影响速度
      - name: Dependencies Cache
        uses: actions/cache@v4.0.2
        with:
          path: ~/.m2/repository
          key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
          restore-keys: |
            ${{ runner.os }}-maven-
      # 编译打包
      - name: Build with Maven
        run: mvn package -Dmaven.test.skip=true
      # 登录Docker Hub
      - name: Login to Docker Hub
        uses: docker/login-action@v3.3.0
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}
      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@v3.6.1
      # build 镜像并push到中央仓库中
      - name: Build and push coj-backend-gateway
        id: docker_build_coj-backend-gateway
        uses: docker/build-push-action@v6.7.0
        with:
          context: ./coj-backend-gateway
          file: ./coj-backend-gateway/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-gateway:latest
      - name: Build and push coj-backend-user-service
        id: docker_build_coj-backend-user-service
        uses: docker/build-push-action@v6.7.0
        with:
          context: ./coj-backend-user-service
          file: ./coj-backend-user-service/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-user-service:latest
      - name: Build and push coj-backend-question-service
        id: docker_build_coj-backend-question-service
        uses: docker/build-push-action@v6.7.0
        with:
          context: ./coj-backend-question-service
          file: ./coj-backend-question-service/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-question-service:latest
      - name: Build and push coj-backend-judge-service
        id: docker_build_coj-backend-judge-service
        uses: docker/build-push-action@v6.7.0
        with:
          context: ./coj-backend-judge-service
          file: ./coj-backend-judge-service/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-judge-service:latest
      # 上传到服务器
      - name: 发布到服务器
        uses:  easingthemes/ssh-deploy@main
        with:
          # SCP参数
          ARGS: "-avzr --delete"
          # 私钥
          SSH_PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          # 源目录
          SOURCE: "docker-compose.service.yml"
          # 服务器ip
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          # 用户
          REMOTE_USER: "root"
          # 目标地址
          TARGET: "/home/coj/docker-compose.service.yml"
      # push后，用ssh连接服务器执行脚本
      - name: SSH
        uses: fifsky/ssh-action@master
        with:
          command: |
            docker ps -a -q --filter "name=coj-backend" | xargs docker rm -f
            docker image prune -a -f
            docker pull ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-gateway:latest
            docker pull ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-user-service:latest
            docker pull ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-question-service:latest
            docker pull ${{ secrets.DOCKER_HUB_USERNAME }}/coj-backend-judge-service:latest
            docker-compose -f /home/coj/docker-compose.service.yml up -d
          user: "root"
          host: ${{ secrets.REMOTE_HOST }}
          key: ${{ secrets.PRIVATE_KEY}}
```

### 限制内存

由于服务器只有 4G，需要限制内存，限制 nacos 内存

```
environment:
  - JVM_XMS=32M
  - JVM_XMX=128M
  - JVM_XMN=16M
  - JVM_MS=32M
  - JVM_MMS=128M
```

限制微服务项目 JVM 内存

```yml
# 启动命令
ENTRYPOINT ["java", "-Xms200M", "-Xmx200M", "-jar", "/app/coj-backend-user-service-0.0.1-SNAPSHOT.jar","--spring.profiles.active=prod"]
```

限制 mysql 内存

```yml
 - ./mysql-init/mysql.cnf:/etc/mysql/conf.d/mysql.conf   # mysql配置限制内存
```

```txt
[mysqld]
performance_schema_max_table_instances=400  
table_definition_cache=400    #缓存
performance_schema=off    #用于监控MySQL server在一个较低级别的运行过程中的资源消耗、资源东西
table_open_cache=64    #打开表的缓存
innodb_buffer_pool_chunk_size=64M    #InnoDB缓冲池大小调整操作的块大小
innodb_buffer_pool_size=64M    #InnoDB 存储引擎的表数据和索引数据的最大内存缓冲区大小
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4
```

## 前端部署

### VitePress 自动化部署

```yaml
name: Sync Blog

on:
  push:
    # push 代码的时候 哪个分支会受到影响 这里是 v1.0.0 分支
    branches:
      - main # 也可以设置为 main 分支

# 推送之后执行一系列的任务
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # 获取代码
      - name: 迁出代码
        # 使用action库 action/checkout获取代码
        uses: actions/checkout@main
      # 安装Node环境

      - name: 安装node.js
        # 使用action库  actions/setup-node安装node
        uses: actions/setup-node@main
        with:
          node-version: lts/*

      # 安装依赖
      - name: 安装依赖
        run: npm install

      # 打包
      - name: 打包
        run: npm run build

      # 发布到 github-page
    
      - name: 发布到 github-page
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.VITEPRESS_TOKEN }}
          exclude_assets: ''
          publish_dir: docs/.vitepress/dist

      # 上传到服务器
      - name: 发布到服务器
        uses: easingthemes/ssh-deploy@main
        env:
          # 私钥
          SSH_PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          # SCP参数
          ARGS: "-avzr --delete"
          # 源目录
          SOURCE: "docs/.vitepress/dist/"
          # 服务器ip
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          # 用户
          REMOTE_USER: "root"
          # 目标地址
          TARGET: "/home/vitepress"
```

服务器需要配置密钥：

```shell
ssh-keygen -m PEM -t rsa -b 4096
```

赋值密钥到变量 PRIVATE_KEY，并设置服务器远程地址 REMOTE_HOST

```shell
cat ~/.ssh/id_rsa
```

### 配置 Nginx

流水线完成后会把打包好的文件上传到服务器上，下面配置 Nginx 进行访问

配置文件地址 /etc/nginx/conf.d/ 下新建 vitepress.conf

```nginx
server{
        listen 80;
        server_name 47.76.180.81 cwcn.xyz www.cwcn.xyz;
        location /{
                root /home/vitepress;
                index index.html;
        }

}

 server {
        listen       443 ssl;
        server_name  cwcn.xyz www.cwcn.xyz;
        error_page 404 /404.html;

        ssl_certificate     /etc/nginx/cert/cwcn.xyz.pem;
        ssl_certificate_key  /etc/nginx/cert/cwcn.xyz.key;

        ssl_session_timeout  5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass http://127.0.0.1;
        }
}
```

重启 nginx

```shell
nginx -s reload
```

### 使用 https

使用阿里云签发免费证书，并下载 Nginx 格式证书，上传到服务器指定路径后重启

### 路由模式页面不显示

history 路由下添加以下配置

```
location /{
        root /home/coj/coj-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
}
```
