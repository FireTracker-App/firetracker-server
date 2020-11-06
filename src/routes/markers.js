const Router = require('koa-router');
const {ReportedMarker} = require('../models/ReportedMarker');

const router = new Router();
router.get('/', async (ctx, next) =>
{
    const markers = await ReportedMarker.find({});
    ctx.body = JSON.stringify(markers);
    next();
});

router.post('/', async (ctx, next) =>
{
    await ReportedMarker.create(ctx.request.body);
    ctx.response.status = 201;
    next();
});

module.exports = router;
