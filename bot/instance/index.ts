import { WechatyInterface } from 'wechaty/impls';
import { IBot } from '../pool/types';
import { EOpType } from '../../types/operations';
import { EBotOpType, EBotStatusType } from '../types';
import { create } from './create';
import { IBotMsgProps } from './types';

/**
 * 机器人实例，通过 fork 子进程的方式运行
 */

/**
 * 使用全局变量维护 wechaty 实例
 */
const botMap: Record<number, WechatyInterface> = {};

// 监听进程的 message 事件，对于每一个机器人，需要监听对应的操作事件
process.on('message', (message: IBotMsgProps) => {
  const { type, data } = message;
  const botOpMap: Record<EBotOpType, Function> = {
    [EBotOpType.CREATE]: createBot,
    [EBotOpType.START]: startBot,
    [EBotOpType.STOP]: stopBot,
    // TODO
    [EBotOpType.SCAN]: () => {},
    [EBotOpType.LOGIN]: () => {},
    [EBotOpType.LOGOUT]: () => {},
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
    .then((bot) => {
      botMap[pid] = bot;
      process.send?.({
        ...eventProps,
        data: {
          ...eventProps.data,
          status: EOpType.SUCCESS,
        },
      });
    })
    .catch((error) => {
      // TODO log
      console.log('create error======', error);
      process.send?.({
        ...eventProps,
        data: {
          ...eventProps.data,
          status: EOpType.FAIL,
        },
        message: error?.message,
      });
    });
}

/**
 * 启动机器人
 */
function startBot({ pid }: IBot) {
  const eventProps = {
    type: EBotStatusType.RUNNING,
    data: { pid },
  };

  // 调用 wechaty 实例的 start 函数
  botMap[pid]?.start()
    .then(() => {
      process.send?.({
        ...eventProps,
        data: {
          ...eventProps.data,
          status: EOpType.SUCCESS,
        },
      });
    })
    .catch((error) => {
      process.send?.({
        ...eventProps,
        data: {
          ...eventProps.data,
          status: EOpType.FAIL,
        },
        message: error?.message,
      });
    })
}

/**
 * 停止机器人
 */
function stopBot({ pid }: IBot) {
  const eventProps = {
    type: EBotStatusType.STOPPED,
    data: { pid },
  };

  // 调用 wechaty 实例的 stop 函数
  botMap[pid]?.stop()
    .then(() => {
      process.send?.({
        ...eventProps,
        data: {
          ...eventProps.data,
          status: EOpType.SUCCESS,
        },
      });
    })
    .catch((error) => {
      process.send?.({
        ...eventProps,
        data: {
          ...eventProps.data,
          status: EOpType.FAIL,
        },
        message: error?.message,
      });
    })
}
