/**
 * 代码结构源自官方案例：https://github.com/wechaty/getting-started/blob/main/examples/ding-dong-bot.ts
 */
import 'dotenv/config.js';
import { Contact, log, Message, ScanStatus, WechatyBuilder } from 'wechaty';
import qrcodeTerminal from 'qrcode-terminal';
import { writeQRCode } from './write-qrcode';

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('');
    log.info(
      'StarterBot',
      'onScan: %s(%s) - %s',
      ScanStatus[status],
      status,
      qrcodeImageUrl,
    );

    qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console
    writeQRCode(qrcode);
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status);
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user);
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user);
}

async function onMessage(msg: Message) {
  log.info('StarterBot', msg.toString());

  if (msg.text() === 'ding') {
    await msg.say('dong');
  }
}

const bot = WechatyBuilder.build({
  name: 'small-island-bot',
  puppet: 'wechaty-puppet-wechat',
});

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot
  .start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch((e: any) => log.error('StarterBot', e));
