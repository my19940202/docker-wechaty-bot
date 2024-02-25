/**
 * 微信群聊机器人，用于消息回复
*/
import 'dotenv/config.js';
import http from 'http';
import {WechatyBuilder, log} from 'wechaty';
import {onScan, onLogin, onLogout, onMessage} from './util/index.js';

// 微信机器人 事件监听
const bot = WechatyBuilder.build({name: 'group-test-bot'});
bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))

// 创建服务器，为了防止微信云托管 监测不到http服务自动关闭
const port = process.env.PORT || 80;
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!');
});
server.listen(port, () => {console.log('Server is running')});
