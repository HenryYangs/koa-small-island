import { ChildProcess } from 'child_process';
import { EOpType } from '../../types/operations';
import { EBotStatusType } from '../types';

// 进程池中，机器人所需要的类型字段
export interface IBot {
  // 进程 id
  pid: number;

  // 机器人子进程
  botInstance: ChildProcess;

  // 机器人名称
  name: string;

  // 机器人的状态
  status: EBotStatusType;
}

// 机器人状态改变事件的消息结构
export interface IBotStatusEventMsgProps {
  // 状态改变的类型
  type: EBotStatusType;

  // 具体数据
  data: {
    // 进程名
    name: string,

    // 状态改变的最终结果
    status: EOpType;
  };
}
