const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  mapCoords: {
    lat: Number,
    lng: Number
  },
  sportsAvailable: [String], // e.g. ['Football', 'Tennis']
  slotCapacity: { type: Number, default: 1 }, // how many teams can play at once
}, { timestamps: true });

module.exports = mongoose.model('Turf', turfSchema);
