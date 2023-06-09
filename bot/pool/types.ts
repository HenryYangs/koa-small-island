import { ChildProcess } from 'child_process';
import { WechatyInterface } from 'wechaty/impls';
import { ScanStatus } from 'wechaty';
import { EOpType } from '../../types/operations';
import { EBotOpType, EBotStatusType } from '../types';

// 进程池中，机器人所需要的类型字段
export interface IBot {
  // 进程 id
  pid: number;

  // 机器人子进程
  child: ChildProcess;

  // 机器人名称
  name: string;

  // 机器人的状态
  status: EBotStatusType;

  // 登录二维码链接
  qrcode: string;

  // 登录二维码扫描状态
  scanStatus: ScanStatus;

  // wechaty 实例
  bot?: WechatyInterface;
}

// 机器人状态改变事件的消息结构
export interface IBotStatusEventMsgProps {
  // 状态改变的类型
  type: EBotStatusType;

  // 具体数据
  data: {
    // 进程 id
    pid: string,

    // 操作状态
    status: EOpType;
  };

  // 状态改变的最终结果
  status: EOpType;

  message: string;
}

// wechaty 触发的事件的消息结构
export interface IWechatyEventMsgProps {
  // 状态改变的类型
  type: EBotOpType;

  // 具体数据
  data: {
    // 进程名
    name: string;

    // 状态改变的最终结果
    status: EOpType;

    // 二维码链接
    qrcode?: string;

    // 登录二维码扫描状态
    scanStatus?: ScanStatus;

    // wechaty 实例
    bot?: WechatyInterface;

    [index: string]: unknown;
  };

  message: string;
}
