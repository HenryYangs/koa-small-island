import Router from 'koa-router';

const router = new Router();

router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = 'Hello World!';
})

export default router;
