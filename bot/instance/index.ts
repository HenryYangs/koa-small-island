import { EOpType } from '../../types/operations';
import { EBotOpType } from '../types';
import { create } from './create';
import { IBotMsgProps } from './types';

/**
 * 机器人实例，通过 fork 子进程的方式运行
 */

// 监听进程的 message 事件
process.on('message', (message: IBotMsgProps) => {
  const { type, data: { name } } = message;
  const botOpMap: Record<EBotOpType, Function> = {
    [EBotOpType.CREATE]: createBot,
    [EBotOpType.PAUSE]: () => {},
    [EBotOpType.RESUME]: () => {},
    [EBotOpType.STOP]: () => {},
    [EBotOpType.DELETE]: () => {},
  };

  if (!botOpMap[type]) return;

  botOpMap[type](name);
});

// 创建机器人
function createBot(name: string) {
  // 操作结果事件的公共参数
  const eventProps = {
    type: EBotOpType.CREATE,
    data: { pid: process.pid },
  };

  // 调用 wechaty 创建机器人
  create(name)
    .then(() => {
      process.send?.({
        ...eventProps,
        status: EOpType.SUCCESS,
      });
    })
    .catch((error) => {
      console.log('create error======', error);
      process.send?.({
        ...eventProps,
        status: EOpType.FAIL,
      });
    });
}
