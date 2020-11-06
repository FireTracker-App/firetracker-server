const Router = require('koa-router');

const router = new Router();
router.get('/', (ctx, next) =>
{
    ctx.redirect('https://github.com/FireTracker-App/firetracker-server');
    next();
});

module.exports = router;
