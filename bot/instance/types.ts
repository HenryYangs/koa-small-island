import { IBot } from '../pool/types';
import { EBotOpType } from '../types';

// 接收 message 事件消息的类型
export interface IBotMsgProps {
  // 机器人的操作类型
  type: EBotOpType;

  // 具体数据
  data: IBot;
}

export interface ICreateProps {
  pid: number;
  name: string;
}
