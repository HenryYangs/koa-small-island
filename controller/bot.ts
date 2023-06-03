import fs from 'fs';
import path from 'path';
import { Context } from 'koa';
import shell from 'shelljs';
import { stop as stopBot } from '../helper/bot';

export default class BotController {
  /**
   * 启动机器人
   */
  public async start(ctx: Context) {
    const { username } = ctx.request.body || {};

    if (!username) {
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        message: 'username is required',
      };
      return;
    }

    // 执行命令启动机器人
    // 暂时只支持启动一个机器人
    // TODO 支持多个机器人
    shell.exec('pm2 install typescript && pm2 start bot/index.ts');

    let content;
    const startTime = Date.now();
    const qrcodeFilePath = path.resolve(__dirname, '../qrcode.txt');

    // 读本地文件
    // 有就说明启动成功了
    while (true) {
      if (fs.existsSync(qrcodeFilePath)) {
        content = JSON.parse(fs.readFileSync(qrcodeFilePath, 'utf-8'));
        break;
      }

      // 20s，超时返回
      if (Date.now() - startTime > 20000) {
        ctx.status = 500;
        ctx.body = {
          code: 50001,
          message: 'timeout 20000ms',
        };
        return;
      }
    }

    // 创建的登录链接超时了
    if (content.createTime - Date.now() > 30 * 1000) {
      ctx.status = 200;
      ctx.body = {
        code: 50002,
        message: 'qrcode url is expired, please try again',
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      code: 0,
      data: {
        qrcode: content.url,
      },
      message: '',
    };
  }

  // 停止机器人
  // TODO 支持多用户，停止指定机器人
  public async stop(ctx: Context) {
    await stopBot();

    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: '',
    };
  }
}
