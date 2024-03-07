
import {ScanStatus, log} from 'wechaty';
import {baiduBot} from './llmRobot.js';
import {badWords} from './constant.js';
import * as schedule from 'node-schedule';

const statMap = {room: 0, say: 0, msg: 0};
// 人设map
const systemMap = {};

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

let lastAnswer = 0;

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

export async function onFriendship (friendship) {
    log.info('this.Friendship', this.Friendship);
    if (friendship.type() === this.Friendship.Type.Receive) {
        await friendship.accept();
    }
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
        // 设置人设
        if (text.includes('人设')) {
            systemMap[topic] = text.split('人设')[1];
            await sleep(1000);
            await msg.say('群人设已经更新');
        }
        else if (await msg.mentionSelf()) {
            // 临高启明书友群使用带有外挂知识库的机器人
            const novelPattern = ['元老', '临高', '启明', '丰城', '政保局', '田独'];
            const zhuangxiuPattern = ['刘师傅', '作业', '装修', '局改'];
            const sdhpPattern = ['不止金钱', '声动'];
            const bankPattern = ['中国银行'];

            if (badWords.some(item => text.includes(item))) {
                await msg.say('敏感信息，小助手暂不回答');
            }
            else if (novelPattern.some(item => topic.includes(item))) {
                // 频控设置，10秒内只能回答一次
                if (lastAnswer && (+new Date() < lastAnswer + 1000 * 10)) {
                    await msg.say('问太快了，请稍后再问');
                }
                else {
                    const {result} = await baiduBot(text, 'LinGaoQiMing');
                    statMap.say = statMap.say + 1;
                    await msg.say(result);
                    lastAnswer = +new Date();
                }
            }
            else if (zhuangxiuPattern.some(item => topic.includes(item))) {
                let {result} = await baiduBot(text, 'LiuShifu');
                if (result) {
                    if (result && result.includes('百度')) {
                        result = result.replace(/百度/g, '刘师傅');
                    }
                    statMap.say = statMap.say + 1;
                    await msg.say(result);
                }
            }
            else if (sdhpPattern.some(item => topic.includes(item))) {
                const {result} = await baiduBot(text, 'NotOnlyMoney');
                statMap.say = statMap.say + 1;
                await msg.say(result);
            }
            else if (bankPattern.some(item => topic.includes(item))) {
                const {result} = await baiduBot(text, 'ChinaBank');
                statMap.say = statMap.say + 1;
                await msg.say(result);
            }
            else {
                const {result} = await baiduBot(text, '', systemMap[topic]);
                statMap.say = statMap.say + 1;
                await msg.say(result);
            }
        }
    }
    // 单聊使用stat查看目前统计数据
    else {
        // 设置人设
        if (text.includes('设置人设')) {
            systemMap[name] = text.split('设置人设')[1];
            await sleep(1000);
            await msg.say('人设已经更新');
        }
        else if (msg.text() === 'stat') {
            await sleep(1000);
            await msg.say(`已收消息${statMap.msg}条，回复${statMap.say}次, 人设${JSON.stringify(systemMap)}`)
        }
        else if (!name.includes('微信')) {
            const {result} = await baiduBot(text, '', systemMap[name]);
            statMap.say = statMap.say + 1;
            await msg.say(result);
        }
    }
}