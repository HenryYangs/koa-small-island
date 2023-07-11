import { WechatyBuilder } from 'wechaty';
import { WechatyInterface } from 'wechaty/impls';
import { QRCode } from '../plugins/qrcode';
import { EOpType } from '../../types/operations';
import { EBotOpType  } from '../types';
import { ICreateProps } from './types';

// 调用 wechaty 的 api 创建机器人
export const create = async ({ pid, name }: ICreateProps): Promise<WechatyInterface> => {
  const botInstance = WechatyBuilder.build({
    name,
    puppet: 'wechaty-puppet-wechat',
  });

  // TODO 机器人中间件/插件

  botInstance.use(QRCode({
    callback: ({ qrcode, status }) => {
      process.send?.({
        type: EBotOpType.SCAN,
        data: {
          pid,
          qrcode,
          scanStatus: status,
          status: EOpType.SUCCESS,
        },
      });
    },
  }));

  botInstance
    .start()
    .then(() => console.log('bot started success....'))
    .catch(error => console.error('bot started fail....', error));

  return botInstance;
};
