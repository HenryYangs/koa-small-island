import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import { ChildProcess, fork } from 'child_process';
import { ScanStatus } from 'wechaty';
import { EBotOpType, EBotStatusType, EWechatyOpType } from '../types';
import { EOpType } from '../../types/operations';
import { IBot, IBotStatusEventMsgProps, IWechatyEventMsgProps } from './types';

export class BotPool extends EventEmitter {
  private pool: Map<number, IBot>;

  public constructor() {
    super();
    this.pool = new Map();
  }

  /**
   * 创建机器人、更新机器人进程池
   */
  public async createBot(username: string) {
    // 新开进程
    const child = fork(path.resolve(__dirname, '../instance/index.ts'));
    const { pid } = child;

    if (!child || !pid) {
      console.error(`create bot error, child process or pid is not found. child: ${child}, pid: ${pid}`);
      return { pid: 0, name: '' };
    }

    // 子进程监听事件
    this.addEventListener(child);

    const name = `bot_${username}_${pid}`;
    const base = {
      pid,
      child,
      name,
      qrcode: '',
      scanStatus: ScanStatus.Unknown,
    };

    // 向子进程发送事件创建机器人
    child.send({
      type: EBotOpType.CREATE,
      data: base,
    });
    // 更新进程池
    this.pool.set(pid, {
      ...base,
      status: EBotStatusType.CREATED,
    });

    return {
      pid,
      name,
    };
  }

  /**
   * 启动机器人
   */
  public async startBot(pid: number) {
    return new Promise((resolve, reject) => {
      const botInstance = this.pool.get(pid);
      
      if (!botInstance || !botInstance.child) {
        reject(new Error(JSON.stringify({
          code: 40001,
        })));
        return;
      }
      
      const { child } = botInstance;

      child.send({
        type: EBotOpType.START,
        data: botInstance,
      });
      child.once('message', (message: IBotStatusEventMsgProps) => {
        if (message.type === EBotStatusType.RUNNING && message.status === EOpType.SUCCESS) {
          botInstance.status = EBotStatusType.RUNNING;
          resolve(pid);
        } else {
          reject(new Error(JSON.stringify({
            code: 500001,
            message: message.message || 'start bot fail',
          })));
        }
      })
    });
  }

  /**
   * 停止机器人
   */
  public async stopBot(pid: number) {
    return new Promise((resolve, reject) => {
      const botInstance = this.pool.get(pid);
      
      if (!botInstance || !botInstance.child) {
        reject(new Error(JSON.stringify({
          code: 40001,
        })));
        return;
      }
      
      const { child } = botInstance;

      child.send({
        type: EBotOpType.STOP,
        data: botInstance,
      });
      child.once('message', (message: IBotStatusEventMsgProps) => {
        if (message.type === EBotStatusType.STOPPED && message.status === EOpType.SUCCESS) {
          botInstance.status = EBotStatusType.STOPPED;
          resolve(pid);
        } else {
          reject(new Error(JSON.stringify({
            code: 500001,
            message: message.message || 'stop bot fail',
          })));
        }
      })
    });
  }

  /**
   * 删除机器人
   */
  public deleteBot(pid: number) {
    const botInstance = this.pool.get(pid);

    if (!botInstance || !botInstance.child) {
      // TODO log
      return {
        code: 400001,
        message: 'bot is not found',
      };
    }

    // 机器人必须先停止，再删除
    if (botInstance.status !== EBotStatusType.STOPPED) {
      return {
        code: 400002,
        message: 'bot should be stopped',
      };
    }

    // 杀进程
    botInstance.child.kill();
    // 删除机器人的配置文件
    fs.rmSync(path.resolve(__dirname, `../../${botInstance.name}.memory-card.json`));
    // 从进程池中删掉对应的进程
    this.pool.delete(pid);

    return {
      code: 0,
      message: '',
    };
  }

  /**
   * 查询机器人的静态属性
   */
  public getBotStaticAttr(pid: number) {
    const botInstance = this.pool.get(pid);

    if (!botInstance || !botInstance.child) {
      // TODO log
      return {
        code: 400001,
        message: 'bot is not found',
      };
    }

    return {
      code: 0,
      data: {
        pid,
        name: botInstance.name,
        status: botInstance.status,
      },
    };
  }

  /**
   * 查询机器人列表
   */
  public getBotList() {
    const result = [];

    for (let bot of this.pool) {
      const [, value] = bot;
      const { pid, name, status } = value;

      result.push({
        pid, name, status,
      });
    }

    return result;
  }

  /**
   * 查询机器人的登录二维码
   */
  public getQRCode(pid: number) {
    const botInstance = this.pool.get(pid);

    if (!botInstance || !botInstance.child) {
      // TODO log
      return {
        code: 400001,
        message: 'bot is not found',
      };
    }

    return {
      code: 0,
      data: { qrcode: botInstance.qrcode },
      message: '',
    };
  }

  /**
   * 监听对 wechaty 操作的事件
   */
  private addEventListener(child: ChildProcess) {
    const { pid } = child;

    // 子进程监听 message 事件
    child.on('message', (message: IWechatyEventMsgProps) => {
      const { type } = message;
      const botOpMap: Record<EWechatyOpType, Function> = {
        [EWechatyOpType.CREATE]: this.onCreated,
        [EWechatyOpType.SCAN]: this.onScanned,
        // TODO
        [EWechatyOpType.LOGIN]: () => {},
        [EWechatyOpType.LOGOUT]: () => {},
      }

      if (!botOpMap[type] || !pid) {
        // TODO log
        return;
      }

      botOpMap[type](message, this.pool.get(pid));
    })
  }

  /**
   * 机器人创建成功的回调函数
   * 更新机器人的状态
   */
  private onCreated(message: IWechatyEventMsgProps, botInstance: IBot) {
    const { status, bot } = message.data;

    botInstance.bot = bot;

    if (status === EOpType.SUCCESS) {
      botInstance.status = EBotStatusType.RUNNING;
    } else if (status === EOpType.FAIL) {
      botInstance.status = EBotStatusType.STOPPED;
    }
  }

  /**
   * wechaty 二维码扫描事件
   */
  private onScanned(message: IWechatyEventMsgProps, botInstance: IBot) {
    const { scanStatus = ScanStatus.Unknown, qrcode = '' } = message.data;

    botInstance.qrcode = qrcode;
    botInstance.scanStatus = scanStatus;
  }
}
