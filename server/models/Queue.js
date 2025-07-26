const mongoose = require('mongoose');
const { Schema } = mongoose;

const queueSchema = new Schema({
  player: { 
    type: Schema.Types.ObjectId, 
    ref: 'Player', 
    required: true,
    unique: true 
  },
  gameName: { type: String, required: true },
  skillLevel: { type: Number, min: 1, max: 10, required: true },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

queueSchema.index({ gameName: 1, skillLevel: 1, joinedAt: 1 });

module.exports = mongoose.model('Queue', queueSchema);