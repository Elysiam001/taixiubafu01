const User = require('../models/User');
const Bet = require('../models/Bet');
const GameHistory = require('../models/GameHistory');

class GameEngine {
  constructor(io) {
    this.io = io;
    this.timer = 30;
    this.gameState = 'betting'; // 'betting', 'locked', 'result'
    this.currentDice = [1, 1, 1];
    this.currentResult = 'xiu';
    this.gameId = this.generateGameId();
    this.bets = [];
    this.startLoop();
  }

  generateGameId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async startLoop() {
    setInterval(async () => {
      this.timer--;

      if (this.timer === 5 && this.gameState === 'betting') {
        this.gameState = 'locked';
        this.io.emit('game_state', { state: 'locked' });
      }

      if (this.timer <= 0) {
        if (this.gameState === 'locked' || this.gameState === 'betting') {
          await this.processResult();
          this.timer = 35; // 30s for next round + 5s showing result
          this.gameState = 'result';
        } else {
          // Restart round
          this.gameState = 'betting';
          this.timer = 30;
          this.gameId = this.generateGameId();
          this.bets = [];
          this.io.emit('new_round', { gameId: this.gameId, timer: this.timer });
        }
      }

      this.io.emit('timer', { timer: this.timer, state: this.gameState });
    }, 1000);
  }

  async processResult() {
    // Generate Dice
    this.currentDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    const total = this.currentDice.reduce((a, b) => a + b, 0);
    this.currentResult = total >= 11 ? 'tai' : 'xiu';

    // Save History
    const history = new GameHistory({
      gameId: this.gameId,
      dice: this.currentDice,
      total: total,
      result: this.currentResult
    });
    await history.save();

    // Process Bets
    const activeBets = await Bet.find({ gameId: this.gameId, result: 'pending' });
    
    for (let bet of activeBets) {
      if (bet.choice === this.currentResult) {
        bet.result = 'win';
        bet.payout = bet.amount * 2;
        // Update user balance
        await User.findByIdAndUpdate(bet.userId, { $inc: { balance: bet.payout } });
      } else {
        bet.result = 'loss';
        bet.payout = 0;
      }
      await bet.save();
      
      // Notify user
      this.io.to(bet.userId.toString()).emit('bet_result', {
        result: bet.result,
        payout: bet.payout,
        gameId: this.gameId
      });
    }

    this.io.emit('result', {
      dice: this.currentDice,
      total: total,
      result: this.currentResult,
      gameId: this.gameId
    });
  }

  async placeBet(userId, amount, choice) {
    if (this.gameState !== 'betting') return { error: 'Cược đã khóa' };
    
    const user = await User.findById(userId);
    if (!user || user.balance < amount) return { error: 'Không đủ số dư' };

    user.balance -= amount;
    await user.save();

    const bet = new Bet({
      userId,
      gameId: this.gameId,
      amount,
      choice
    });
    await bet.save();

    return { success: true, balance: user.balance };
  }
}

module.exports = GameEngine;
