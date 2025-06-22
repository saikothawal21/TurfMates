const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxPlayers: { type: Number, default: 8 },
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  matchTime: { type: Date, required: true },
  status: { type: String, enum: ['open', 'full', 'cancelled'], default: 'open' }

}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
