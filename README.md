# 微信云托管-Koa模板测试用
fork 自微信云托管模板 https://github.com/WeixinCloud/wxcloudrun-koa

docker run -it node:12-slim bash
docker run -it node:12-slim sh
<!-- -p 本机接口:docker里面的接口 -->
docker run -it -p 8819:80 testdemo sh 
<!-- -e 传递环境变量 -->
docker run -it -p 8819:88 -e PORT=88 testdemo npm start
<!-- 非交互式打开，直接启动服务，使用dockerfile默认启动命令 -->
docker run -p 8818:88 -e PORT=88 testdemo

把image当前努力的内容 拷贝到docker实际环境里面
COPY . ./

dockerfile一些变量的使用
ARG 变量配置
ENV 环境变量
RUN 运行系统命令

镜像images是否适合你去跑项目
run起来看下能不能正常启动，如果都都match就不用新安装服务

如果不行自己搞个纯净的ubuntu centos
一步步安装服务
如何快速的尝试本机代码能不能在镜像里面跑起来
docker run -it -v /Users/xishengbo/Desktop/dev.tmp/git_repo/docker-wechaty:/bot  wechaty/wechaty


wechaty/wechaty 进入到了这个容器实例中
docker run -it wechaty/wechaty sh

专门打包了一个

