const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSessionSchema = new Schema({
  gameName: { type: String, required: true },
  teams: [[{ type: Schema.Types.ObjectId, ref: 'Player' }]],
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('TeamSession', teamSessionSchema);