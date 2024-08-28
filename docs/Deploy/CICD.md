# CICD

## GithubAction

### VitePress 自动化部署1

```
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
