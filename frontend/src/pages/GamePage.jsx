import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import DiceBoard from '../components/DiceBoard';
import BettingArea from '../components/BettingArea';
import History from '../components/History';
import { motion, AnimatePresence } from 'framer-motion';

const GamePage = () => {
  const { timer, gameState, lastResult } = useGame();
  const [betAmount, setBetAmount] = useState(1000);

  const quickAmounts = [1000, 5000, 10000, 50000, 100000, 500000];

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      {/* Timer & Info */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64" cy="64" r="60"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="64" cy="64" r="60"
              stroke={timer <= 5 ? "#ff4444" : "#FFD700"}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="377"
              animate={{ strokeDashoffset: 377 - (377 * timer) / 30 }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {timer}
            </span>
            <span className="text-[10px] uppercase font-bold text-white/50">
              {gameState === 'betting' ? 'Đặt Cược' : gameState === 'locked' ? 'Khóa' : 'Kết Quả'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dice Area */}
      <DiceBoard />

      {/* Betting Areas */}
      <BettingArea />

      {/* Controls */}
      <div className="glass-panel p-4 flex flex-col gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex-shrink-0 ${
                betAmount === amount ? 'gold-button scale-105' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {amount >= 1000 ? `${amount/1000}k` : amount}
            </button>
          ))}
          <button
            onClick={() => setBetAmount(amount => amount + 1000000)} // Mock All-in or huge bet
            className="px-4 py-2 rounded-lg font-bold bg-purple-600 hover:bg-purple-500 flex-shrink-0"
          >
            Tất tay
          </button>
        </div>

        <div className="relative">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-2xl font-bold text-casino-gold focus:outline-none focus:border-casino-gold"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 font-bold">
            COIN
          </div>
        </div>
      </div>

      {/* History */}
      <History />
    </div>
  );
};

export default GamePage;
