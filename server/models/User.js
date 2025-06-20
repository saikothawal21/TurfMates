const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sports: [String], // e.g. ['Football', 'Cricket']
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  location: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
