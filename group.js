/**
测试如何跑通群消息监听 和发送
 */
import 'dotenv/config.js'

import {WechatyBuilder, ScanStatus, log} from 'wechaty';
import {baiduBot} from './baidu-bot.js';

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
    log.info('StarterBot', msg.toString())
    if (msg.text() === 'ding') {
        await msg.say('dong')
    }
    const contact = msg.talker()
    const text = msg.text()
    const room = msg.room()
    if (room) {
        const topic = await room.topic();
        console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
        if (text.includes('修改群名称')) {
            const new_name = text.split('修改群名称')[0];
            await room.topic(new_name);
        }
        if (text.includes('小度')) {
            const {result} = await baiduBot(text);
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