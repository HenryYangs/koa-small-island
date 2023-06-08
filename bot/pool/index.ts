import EventEmitter from 'events';
import path from 'path';
import { ChildProcess, fork } from 'child_process';
import { EBotOpType, EBotStatusType } from '../types';
import { EOpType } from '../../types/operations';
import { IBot, IBotStatusEventMsgProps } from './types';

export class BotPool extends EventEmitter {
  private pool: Map<number, IBot>;

  public constructor() {
    super();
    this.pool = new Map();
  }

  // 创建机器人、更新机器人进程池
  public async createBot() {
    // 新开进程
    const child = fork(path.resolve(__dirname, '../instance/index.ts'));
    const { pid } = child;

    if (!child || !pid) {
      console.error(`create bot error, child process or pid is not found. child: ${child}, pid: ${pid}`);
      return { pid: 0, name: '' };
    }

    // 子进程监听事件
    this.addEventListener(child);

    const name = `bot_${pid}`;
    const base = {
      pid,
      child,
      name,
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
            message: message.message || '机器人停止失败',
          })));
        }
      })
    });
  }

  /**
   * 监听机器人状态改变的事件，修改对应进程相关的状态和字段
   */
  private addEventListener(child: ChildProcess) {
    const { pid } = child;

    // 子进程监听 message 事件
    child.on('message', (message: IBotStatusEventMsgProps) => {
      const { type } = message;
      const botOpMap: Record<EBotStatusType, Function> = {
        [EBotStatusType.CREATED]: this.onCreated,
        [EBotStatusType.STOPPED]: this.onStopped,
        // TODO
        [EBotStatusType.RUNNING]: () => {},
        [EBotStatusType.PAUSED]: () => {},
        [EBotStatusType.DELETED]: () => {},
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
  private onCreated(message: IBotStatusEventMsgProps, botInstance: IBot) {
    const { status, data: { bot } } = message;

    botInstance.bot = bot;

    if (status === EOpType.SUCCESS) {
      botInstance.status = EBotStatusType.RUNNING;
    } else if (status === EOpType.FAIL) {
      botInstance.status = EBotStatusType.STOPPED;
    }
  }

  private onStopped() {
// message: IBotStatusEventMsgProps, botInstance: IBot
  }
}
