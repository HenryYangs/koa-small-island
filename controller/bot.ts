// import fs from 'fs';
// import path from 'path';
import { Context } from 'koa';
// import shell from 'shelljs';
import { BotPool } from '../bot/pool';

export default class BotController {
  private botPool: BotPool;

  public constructor() {
    this.botPool = new BotPool();
  }

  /**
   * 创建机器人
   */
  public async create(ctx: Context) {
    const { username } = ctx.request.body || {};

    if (!username) {
      // TODO log
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        message: 'username is required',
      };
      return;
    }

    let data;
    try {
      data = await this.botPool.createBot()
    } catch {
      // TODO log
      ctx.status = 500;
      return;
    }
  
    ctx.status = 200;
    ctx.body = {
      code: 0,
      data,
      message: '',
    };
  }

  // 停止机器人
  public async stop(ctx: Context) {
    const { pid } = ctx.request.body || {};

    if (!pid) {
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        message: 'pid is required',
      };
      return;
    }

    try {
      await this.botPool.stopBot(pid);
    } catch (error) {
      // TODO log
      console.log('error=====', error)
      ctx.status = 500;
      return;
    }

    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: '',
    };
  }
}
