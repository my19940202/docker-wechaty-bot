import {Wechaty} from 'wechaty';

Wechaty.instance() // Global Instance
    .on('scan', (qrcode, status) => console.log(`Scan xsb QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
    .on('login',            user => console.log(`User lala ${user} logged in`))
    .on('message',       message => console.log(`Message:  alal ${message}`))
.start()
