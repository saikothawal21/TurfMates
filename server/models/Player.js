const mongoose = require('mongoose');
const { Schema } = mongoose;

const playerSchema = new Schema({
  username: { type: String, required: true, unique: true },
  gamePreferences: [{
    gameName: { type: String, required: true },
    skillLevel: { type: Number, min: 1, max: 10, default: 5 }
  }],
  socketId: { type: String },
  lastActive: { type: Date, default: Date.now },
  inQueue: { type: Boolean, default: false }
}, { timestamps: true });

playerSchema.index({ 'gamePreferences.gameName': 1, 'gamePreferences.skillLevel': 1 });

module.exports = mongoose.model('Player', playerSchema);