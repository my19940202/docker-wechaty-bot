# 使用微信云托管-部署微信机器人
## 环境问题踩坑记录
踩了好多坑
### mac尝试部署wechaty
主要遇到
### 使用官方镜像
启动方式允许 docker外部启动 耗费资源

### 不依赖官方文档，手动搭建wechaty环境
参考当前dockerfile

## 微信云托管docker部署
需要注意需要补充一个httpserver 便于微信云托管识别到服务启动成功；
不然会一直部署失败


## 常用docker命令
```bash
# 交互式进入容器 以bash形式查看容器环境
docker run -it node:12-slim sh
# -p 本机接口:docker里面的接口
docker run -it -p 8819:80 testdemo sh 
# -e 传递环境变量
docker run -it -p 8819:88 -e PORT=88 testdemo npm start
# 非交互式打开，直接启动服务，使用dockerfile默认启动命令
docker run -p 8818:88 -e PORT=88 testdemo

把image当前目录内容 拷贝到容器环境里面
COPY . ./

ARG 变量配置
ENV 环境变量
RUN 运行系统命令

# 镜像使用的方法
优先去使用现成的镜像
pull现有镜像，run起来看下能不能正常启动，缺少什么原来就在dockerfile补充对应的服务

现有镜像都不match就搞个纯净的ubuntu centos
一步步安装服务
如何快速的尝试本机代码能不能在镜像里面跑起来
# 把当前目录映射到容器中(两部分代码会实时同步)
docker run -it -v /Users/xishengbo/Desktop/dev.tmp/git_repo/docker-wechaty:/bot  wechaty/wechaty sh

```

## 参考资料
1. 云官方官方的模板 https://github.com/WeixinCloud/wxcloudrun-koa
2. 使用nodejs19 docker部署的wechaty https://github.com/fuergaosi233/wechat-chatgpt/blob/main/Dockerfile
3. wechaty官方文档 https://wechaty.gitbook.io/wechaty/v/zh/quick-start
