const Router = require('koa-router');
const {ReportedMarker} = require('../models/ReportedMarker');

const router = new Router();
router.get('/', async (ctx, next) =>
{
    const markers = await ReportedMarker.find({}).select('longitude latitude reported');
    ctx.body = JSON.stringify(markers);
    next();
});

router.post('/', async (ctx, next) =>
{
    await ReportedMarker.create(ctx.request.body);
    ctx.response.status = 201;
    next();
});

router.post('/clear', async (ctx, next) =>
{
    const id = ctx.request.body.id;
    if(id)
    {
        const {deletedCount} = await ReportedMarker.deleteMany({reporter: id});
        ctx.ok({count: deletedCount});
    }
    else
    {
        ctx.badRequest('Missing id');
    }
    next();
});

module.exports = router;
