const db = require('./db');
const web = require('./web');
const {ReportedMarker} = require('./models/ReportedMarker');

// Cleanup old reported markers
async function markerCleanup()
{
    // Remove markers over 24h old
    await ReportedMarker.deleteMany({
        reported: {
            $lte: Date.now() - (24 * 60 * 60 * 1000)
        }
    });
}

// Cleanup every 15 minutes
setInterval(markerCleanup, 15 * 60 * 1000);
