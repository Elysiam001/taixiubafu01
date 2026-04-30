const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  dice: [{ type: Number }], // [d1, d2, d3]
  total: { type: Number },
  result: { type: String, enum: ['tai', 'xiu'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameHistory', gameHistorySchema);
