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
      return;
    }

    // 子进程监听事件
    this.addEventListener(child);

    const name = `bot_${pid}`;

    // 向子进程发送事件创建机器人
    child.send({
      type: EBotOpType.CREATE,
      data: { name },
    });
    // 更新进程池
    this.pool.set(pid, {
      pid,
      botInstance: child,
      name,
      status: EBotStatusType.CREATED,
    });

    return {
      pid,
      name,
    };
  }

  /**
   * 监听机器人状态改变的事件，修改对应进程相关的状态和字段
   */
  private addEventListener(bot: ChildProcess) {
    const { pid } = bot;

    // 子进程监听 message 事件
    bot.on('message', (message: IBotStatusEventMsgProps) => {
      const { type } = message;
      const botOpMap: Record<EBotStatusType, Function> = {
        [EBotStatusType.CREATED]: this.onCreated,
        // TODO
        [EBotStatusType.RUNNING]: () => {},
        [EBotStatusType.PAUSED]: () => {},
        [EBotStatusType.STOPPED]: () => {},
        [EBotStatusType.DELETED]: () => {},
      }

      if (!botOpMap[type] || !pid) return;

      botOpMap[type](message, this.pool.get(pid));
    })
  }

  /**
   * 机器人创建成功的回调函数
   * 更新机器人的状态
   */
  private onCreated(message: IBotStatusEventMsgProps, bot: IBot) {
    const { status } = message.data;

    if (status === EOpType.SUCCESS) {
      bot.status = EBotStatusType.RUNNING;
    } else if (status === EOpType.FAIL) {
      bot.status = EBotStatusType.STOPPED;
    }
  }
}
