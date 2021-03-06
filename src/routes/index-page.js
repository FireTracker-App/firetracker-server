const Router = require('koa-router');

const router = new Router();

// Redirect the index to the GitHub repository
router.get('/', (ctx, next) =>
{
    ctx.redirect('https://github.com/FireTracker-App/firetracker-server');
    next();
});

module.exports = router;
