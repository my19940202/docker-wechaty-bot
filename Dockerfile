# 使用node16带chrome的环境启动服务
FROM ahmed1n/nodewithchrome AS app

WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN export PUPPETEER_SKIP_DOWNLOAD="true"
RUN npm install
COPY . .
CMD ["npm", "run", "room"]