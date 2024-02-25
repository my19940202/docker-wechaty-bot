
import {ScanStatus, log} from 'wechaty';
import {baiduBot} from './llmRobot.js';
import * as schedule from 'node-schedule';

const statMap = {room: 0, say: 0, msg: 0};

export function onScan (qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeImageUrl = ['https://wechaty.js.org/qrcode/', encodeURIComponent(qrcode)].join('');
        log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl);
    } else {
        log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

export function onLogin (user) {
    log.info('StarterBot', '%s login', user)
}

export function onLogout (user) {
    log.info('StarterBot', '%s logout', user)
}

export async function onMessage (msg) {
    log.info('StarterBot', msg.toString());
    if (msg.text()) {
        statMap.msg = statMap.msg + 1;
    }
    const contact = msg.talker();
    const text = msg.text();
    const room = msg.room();
    const name = contact.name();

    // 微信群聊
    if (room) {
        const topic = await room.topic();
        // 群聊@才回复消息
        if (await msg.mentionSelf()) {
            // 临高启明书友群使用带有外挂知识库的机器人
            const knowledgePattern = ['元老', '知识库测试群', '临高'];
            const zhuangxiuPattern = ['刘师傅', '作业', '装修', '局改'];
            if (knowledgePattern.some(item => topic.includes(item))) {
                const {result} = await baiduBot(text, 'LinGaoQiMing');
                statMap.say = statMap.say + 1;
                await msg.say(result);
            }
            else if (zhuangxiuPattern.some(item => topic.includes(item))) {
                const {result} = await baiduBot(text, 'LiuShifu');
                statMap.say = statMap.say + 1;
                await msg.say(result);
            }
            else {
                const {result} = await baiduBot(text, 'NotOnlyMoney');
                statMap.say = statMap.say + 1;
                await msg.say(result);
            }
        }
    }
    // 单聊使用stat查看目前统计数据
    else {
        if (msg.text() === 'stat') {
            await msg.say(`已收消息${statMap.msg}条，回复${statMap.say}次`)
        }
        else if (!name.includes('微信')) {
            const {result} = await baiduBot(text, 'NotOnlyMoney');
            statMap.say = statMap.say + 1;
            await msg.say(result);
        }
    }
}