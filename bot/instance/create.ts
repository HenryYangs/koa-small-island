import { WechatyBuilder } from 'wechaty';

// 调用 wechaty 的 api 创建机器人
export const create = async (name: string): Promise<void> => {
  const botInstance = WechatyBuilder.build({
    name,
    puppet: 'wechaty-puppet-wechat',
  });

  // TODO 机器人中间件/插件

  return botInstance
    .start()
    .then(() => console.log('bot started success....'))
    .catch(error => console.error('bot started fail....', error));
};
