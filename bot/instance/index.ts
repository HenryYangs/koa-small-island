import { IBot } from '../pool/types';
import { EOpType } from '../../types/operations';
import { EBotOpType, EBotStatusType } from '../types';
import { create } from './create';
import { IBotMsgProps } from './types';

/**
 * 机器人实例，通过 fork 子进程的方式运行
 */

// 监听进程的 message 事件，对于每一个机器人，需要监听对应的操作事件
process.on('message', (message: IBotMsgProps) => {
  const { type, data } = message;
  const botOpMap: Record<EBotOpType, Function> = {
    [EBotOpType.CREATE]: createBot,
    [EBotOpType.START]: startBot,
    [EBotOpType.STOP]: stopBot,
  };

  if (!botOpMap[type]) return;

  botOpMap[type](data);
});

// 创建机器人
function createBot({ pid, name }: IBot) {
  // 操作结果事件的公共参数
  const eventProps = {
    type: EBotStatusType.CREATED,
    data: { pid: process.pid },
  };

  // 调用 wechaty 创建机器人
  create({ pid, name })
    .then(() => {
      process.send?.({
        ...eventProps,
        status: EOpType.SUCCESS,
      });
    })
    .catch((error) => {
      // TODO log
      console.log('create error======', error);
      process.send?.({
        ...eventProps,
        status: EOpType.FAIL,
        message: error?.message,
      });
    });
}

/**
 * 启动机器人
 */
function startBot({ bot, pid }: IBot) {
  const eventProps = {
    type: EBotStatusType.RUNNING,
    data: { pid },
  };

  // 调用 wechaty 实例的 start 函数
  bot?.start()
    .then(() => {
      process.send?.({
        ...eventProps,
        status: EOpType.SUCCESS,
      });
    })
    .catch((error) => {
      process.send?.({
        ...eventProps,
        status: EOpType.FAIL,
        message: error?.message,
      });
    })
}

/**
 * 停止机器人
 */
function stopBot({ bot, pid }: IBot) {
  const eventProps = {
    type: EBotStatusType.STOPPED,
    data: { pid },
  };

  // 调用 wechaty 实例的 stop 函数
  bot?.stop()
    .then(() => {
      process.send?.({
        ...eventProps,
        status: EOpType.SUCCESS,
      });
    })
    .catch((error) => {
      process.send?.({
        ...eventProps,
        status: EOpType.FAIL,
        message: error?.message,
      });
    })
}
