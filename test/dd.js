/**
发送叮咚的测试demo，限于个人账户无法进入微信群操作
 */
import 'dotenv/config.js'

import {
 WechatyBuilder,
 ScanStatus,
 log,
}                     from 'wechaty'
import qrcodeTerminal from 'qrcode-terminal'

function onScan (qrcode, status) {
 if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
   qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

   const qrcodeImageUrl = [
     'https://wechaty.js.org/qrcode/',
     encodeURIComponent(qrcode),
   ].join('')

   log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

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
}

const bot = WechatyBuilder.build({
 name: 'ding-dong-bot',
 /**
  * How to set Wechaty Puppet Provider:
  *
  *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-padlocal' }`, see below)
  *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-padlocal`)
  *
  * You can use the following providers:
  *  - wechaty-puppet-wechat (no token required)
  *  - wechaty-puppet-padlocal (token required)
  *  - wechaty-puppet-service (token required, see: <https://wechaty.js.org/docs/puppet-services>)
  *  - etc. see: <https://github.com/wechaty/wechaty-puppet/wiki/Directory>
  */
 // puppet: 'wechaty-puppet-padlocal',
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
 .then(() => log.info('StarterBot', 'Starter Bot Started.'))
 .catch(e => log.error('StarterBot', e))