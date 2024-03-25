## 环境配置

### 安装nacos

`docker pull nacos/nacos-server:1.2.0`

`docker run --env MODE=standalone --name nacos --restart=always -d -p 8848:8848 nacos/nacos-server:1.2.0`

- `MODE=standalone `：单机版
- `--restart=always `：开机启动
- `-p 8848:8848  `：端口映射
- `-d`：后台运行

