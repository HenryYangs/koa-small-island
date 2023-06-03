import Router from 'koa-router';
import BotController from '../controller/bot';

const router = new Router();
const bot = new BotController();

router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = 'Hello World!';
});

router.post('/start-bot', bot.start);
router.post('/stop-bot', bot.stop);

export default router;
