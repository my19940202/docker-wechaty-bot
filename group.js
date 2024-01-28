/**
    支持响应群消息，群消息监听，当群消息中包含“小度”时，自动调用百度AI接口
*/
import 'dotenv/config.js'
import http from 'http'
import {WechatyBuilder, ScanStatus, log} from 'wechaty';
import {baiduBot} from './baidu-bot.js';

const port = process.env.PORT || 80;
function onScan (qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeImageUrl = ['https://wechaty.js.org/qrcode/', encodeURIComponent(qrcode)].join('');
        log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl);
    } else {
        log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

function onLogin (user) {
    log.info('StarterBot', '%s login', user)
}

function onLogout (user) {
    log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg) {
    log.info('StarterBot', msg.toString());
    if (msg.text() === 'ding') {
        await msg.say('dong')
    }
    const contact = msg.talker();
    const text = msg.text();
    const room = msg.room();
    if (room) {
        const topic = await room.topic();
        console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
        if (text.includes('修改群名称')) {
            const new_name = text.split('修改群名称')[0];
            await room.topic(new_name);
        }
        if (text.includes('小度')) {
            const real_content = text.split('小度')[1];
            const {result} = await baiduBot(real_content);
            await msg.say(result);
        }
    } else {
        console.log(`Contact: ${contact.name()} Text: ${text}`);
    }
}

const bot = WechatyBuilder.build({
    name: 'group-test-bot'
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))


// 创建服务器
const server = http.createServer((req, res) => {  
    // 设置响应头
    res.setHeader('Content-Type', 'text/plain');  
    // 发送响应内容
    res.end('Hello, World!' + new Date());
});

// 监听端口
server.listen(port, () => {
    console.log('Server is running');
});
