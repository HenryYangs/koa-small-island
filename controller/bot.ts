// import fs from 'fs';
// import path from 'path';
import { Context } from 'koa';
// import shell from 'shelljs';
import { BotPool } from '../bot/pool';
import { stop as stopBot } from '../helper/bot';

export default class BotController {
  private botPool: BotPool;

  public constructor() {
    this.botPool = new BotPool();
  }

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

    await this.botPool.createBot()

    // ctx.status = 200;
    // ctx.body = {
    //   code: 0,
    //   data: {
    //     qrcode: content.url,
    //   },
    //   message: '',
    // };
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
