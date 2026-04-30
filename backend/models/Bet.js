const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: String, required: true },
  amount: { type: Number, required: true },
  choice: { type: String, enum: ['tai', 'xiu'], required: true },
  result: { type: String, enum: ['win', 'loss', 'pending'], default: 'pending' },
  payout: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);
