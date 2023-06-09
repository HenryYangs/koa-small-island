import Router from 'koa-router';
import BotController from '../controller/bot';

const router = new Router();
const bot = new BotController();

router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = 'Hello World!';
});

router.post('/bot/create', ctx => bot.create(ctx));
router.post('/bot/stop', ctx => bot.stop(ctx));
router.post('/bot/delete', ctx => bot.delete(ctx));

export default router;
