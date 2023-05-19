import Koa from 'koa';

export default async(_ctx: Partial<Koa.ParameterizedContext>, next: () => void) => {
  await next();
};
