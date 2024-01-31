/**
    支持响应群消息，群消息监听
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
const statMap = {
    room: 0,
    say: 0,
    msg: 0
};

async function onMessage (msg) {
    log.info('StarterBot', msg.toString());
    if (msg.text()) {
        statMap.msg = statMap.msg + 1;
    }
    const contact = msg.talker();
    const text = msg.text();
    const room = msg.room();
    const name = contact.name();

    if (room) {
        const topic = await room.topic();
        console.log(`Room: ${topic} Contact: ${name} Text: ${text}`)
        if (text.includes('修改群名称')) {
            const new_name = text.split('修改群名称')[1];
            await room.topic(new_name);
        }
        // 群聊@才回复消息
        if (await msg.mentionSelf()) {
            const str = text.split('老司机')[1];
            const {result} = await baiduBot(str);
            statMap.say = statMap.say + 1;
            await msg.say(result);
        }
    } else {
        // 单聊使用ding查看目前统计数据
        if (msg.text() === 'ding') {
            await msg.say(`已收到消息${statMap.msg}条，回复${statMap.say}次,`)
        }
        // 不和微信官方账户互动
        else if (!name.includes('微信')) {
            const {result} = await baiduBot(text);
            statMap.say = statMap.say + 1;
            await msg.say(result);
        }
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
