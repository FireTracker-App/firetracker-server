const Router = require('koa-router');
const {ReportedMarker} = require('../models/ReportedMarker');

const router = new Router();

// Send back markers in json
router.get('/', async (ctx, next) =>
{
    // Leave out reporter id
    const markers = await ReportedMarker.find({}).select('longitude latitude reported');
    ctx.body = JSON.stringify(markers);
    next();
});

// Create a marker upon POST request
router.post('/', async (ctx, next) =>
{
    //TODO proper validation (ensure reported time can't be set)
    await ReportedMarker.create(ctx.request.body);
    ctx.response.status = 201;
    next();
});

// Clear all markers from a provided id
router.post('/clear', async (ctx, next) =>
{
    const id = ctx.request.body.id;
    if(id)
    {
        // If the id was provided, remove all markers submitted by that id
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
