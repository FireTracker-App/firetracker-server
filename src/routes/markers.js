const Router = require('koa-router');
const {ReportedMarker} = require('../models/ReportedMarker');
const pointInPolygon = require('point-in-polygon');
const socketManager = require('../websocket');
const Filter = require('bad-words');

function pointInsideCalifornia(latitude, longitude)
{
    // Points developed from http://www.birdtheme.org/useful/v3tool.html
    // If finer coordinates are needed, they can be found here: http://econym.org.uk/gmap/states.xml
    const californiaRough = [
        [42.069470, -124.295862],
        [41.971529, -120.077112],
        [39.065890, -120.033167],
        [34.347733, -114.276331],
        [32.662257, -114.847620],
        [32.551200, -117.132776],
        [33.947677, -118.495081],
        [34.492737, -120.472620],
        [36.390102, -121.922815],
        [40.317011, -124.339807],
        [42.069470, -124.295862]
    ];
    return pointInPolygon([latitude, longitude], californiaRough);
}

const router = new Router();
const filter = new Filter();

// Send back markers in json
router.get('/', async (ctx, next) =>
{
    // If this is a websocket request, manage the socket elsewhere
    if(ctx['ws'])
    {
        const ws = await ctx.ws();
        socketManager.manageSocket(ws);
        return;
    }
    
    const markers = (await ReportedMarker.find({}).lean()).map(marker =>
    {
        // Indicate that a marker can be removed if it was created by the provided id
        marker.canRemove = (ctx.request.query['id'] === marker['reporter']);
        // Leave out reporter id
        marker['reporter'] = undefined;
        marker['__v'] = undefined;
        return marker;
    });
    ctx.ok(markers);
    next();
});

// Add path to clear *all* markers only if running in development
const env = process.env.NODE_ENV || 'development';
if(env === 'development')
{
    router.get('/dev-clear', async (ctx, next) =>
    {
        const {deletedCount} = await ReportedMarker.deleteMany({});
        ctx.response.body = `Removed ${deletedCount} marker${deletedCount === 1 ? '' : 's'}`;
        return next();
    });
}

// Create a marker upon POST request
router.post('/', async (ctx, next) =>
{
    const data = ctx.request.body;
    // Make sure the point is within California and that it has a reporter
    if(!pointInsideCalifornia(data['latitude'], data['longitude']))
    {
        ctx.badRequest('point outside California');
        return next();
    }
    if(!data['reporter'])
    {
        ctx.badRequest('missing reporter');
        return next();
    }
    if(data['description'] !== undefined && data['description'] !== '')
    {
        if(typeof data['description'] !== 'string')
        {
            ctx.badRequest('bad description type');
            return next();
        }
        else if(data['description'].length > 240)
        {
            ctx.badRequest('description too long');
            return next();
        }
        data['description'] = filter.clean(data['description']);
    }
    
    // Explicitly specify properties to disable extra data stuffing
    const marker = await ReportedMarker.create({
        latitude: data['latitude'],
        longitude: data['longitude'],
        reporter: data['reporter'],
        description: data['description']
    });
    ctx.created({
        message: 'marker created',
        marker: {
            canRemove: true,
            reported: marker.reported,
            '_id': marker['_id'],
            latitude: marker.latitude,
            longitude: marker.longitude,
            description: marker.description
        }
    });
    socketManager.sendToAll({
        action: 'created',
        data: {
            reported: marker.reported,
            '_id': marker['_id'],
            latitude: marker.latitude,
            longitude: marker.longitude,
            description: marker.description,
            canRemove: false
        }
    });
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
        ctx.badRequest('missing id');
    }
    next();
});

router.delete('/:marker', async (ctx, next) =>
{
    const id = ctx.request.query['id'];
    if(!id)
    {
        return ctx.badRequest('missing id');
    }
    const marker = await ReportedMarker.findOne({'_id': ctx.params['marker']}).exec();
    if(!marker)
    {
        return ctx.badRequest('unknown marker');
    }
    else if(marker.reporter !== id)
    {
        return ctx.badRequest('id does not match reporter');
    }
    marker.remove();
    socketManager.sendToAll({
        action: 'removed',
        data: {
            reported: marker.reported,
            '_id': marker['_id'],
            latitude: marker.latitude,
            longitude: marker.longitude,
            description: marker.description,
            canRemove: false
        }
    });
    ctx.ok('removed marker');
});

module.exports = router;
