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

# 把当前目录映射到容器中(两部分代码会实时同步)
```
docker run -it -v /Users/xishengbo/Desktop/dev.tmp/git_repo/docker-wechaty:/bot  wechaty/wechaty sh
```

## 参考资料
1. 云官方官方的模板 https://github.com/WeixinCloud/wxcloudrun-koa
2. 使用nodejs19 docker部署的wechaty https://github.com/fuergaosi233/wechat-chatgpt/blob/main/Dockerfile
3. wechaty官方文档 https://wechaty.gitbook.io/wechaty/v/zh/quick-start
