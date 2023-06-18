import { Context } from 'koa';
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
      data = await this.botPool.createBot(username)
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

  /**
   * 启动机器人
   */
  public async start(ctx: Context) {
    const { pid } = ctx.request.body || {};

    if (!pid) {
      // TODO log
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        message: 'pid is required',
      };
      return;
    }

    try {
      await this.botPool.startBot(pid);
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

  /**
   * 停止机器人
   */
  public async stop(ctx: Context) {
    const { pid } = ctx.request.body || {};

    if (!pid) {
      // TODO log
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

  /**
   * 删除机器人
   */
  public async delete(ctx: Context) {
    const { pid } = ctx.request.body || {};

    if (!pid) {
      // TODO log
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        message: 'pid is required',
      };
      return;
    }

    const result = this.botPool.deleteBot(pid);
    
    if (result.code) {
      ctx.status = 200;
      ctx.body = result;
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '',
      };
    }
  }

  /**
   * 查询机器人的属性
   */
  public index(ctx: Context) {
    const { pid } = ctx.query || {};
    const numPid = Number(pid);

    if (!numPid) {
      // TODO log
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        message: 'pid is required',
      };
      return;
    }

    const result = this.botPool.getBotStaticAttr(numPid);

    if (result.code) {
      ctx.status = 200;
      ctx.body = result;
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        data: result,
        message: '',
      };
    }
  }

  /**
   * 查询机器人列表
   * 一期先查所有机器人
   */
  public list(ctx: Context) {
    // TODO 条件筛选、分页
    // const { page, pageSize, pid, name, status } = ctx.query || {};
    const result = this.botPool.getBotList();

    ctx.status = 200;
    ctx.body = {
      code: 0,
      data: result,
      message: '',
    };
  }

  /**
   * 查询机器人的登录二维码
   */
  public qrcode(ctx: Context) {
    const { pid } = ctx.query || {};
    const numPid = Number(pid);

    if (!numPid) {
      // TODO log
      ctx.status = 400;
      ctx.body = {
        code: 40000,
        message: 'pid is required',
      };
      return;
    }

    const result = this.botPool.getQRCode(numPid);

    ctx.status = 200;
    ctx.body = result;
  }
}
