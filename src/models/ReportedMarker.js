const mongoose = require('mongoose');

// Represents a user-reported fire marker
const ReportedMarkerSchema = new mongoose.Schema({
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    reported: {type: Date, default: Date.now},
    reporter: {type: String, required: true},
    description: {type: String}
});

const ReportedMarker = new mongoose.model('ReportedMarker', ReportedMarkerSchema);

module.exports = {ReportedMarkerSchema, ReportedMarker};
