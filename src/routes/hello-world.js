const KoaRouter = require('koa-router');
const router = KoaRouter();

router.get('/', (ctx, next) =>
{
    ctx.body = 'Hello World!';
    next();
});

module.exports = router;
