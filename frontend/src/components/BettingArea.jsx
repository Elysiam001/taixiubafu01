import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

const BettingArea = () => {
  const { placeBet, currentBets, myBets, gameState } = useGame();

  const myTai = myBets.filter(b => b.choice === 'tai').reduce((a, b) => a + b.amount, 0);
  const myXiu = myBets.filter(b => b.choice === 'xiu').reduce((a, b) => a + b.amount, 0);

  const handleBet = (choice) => {
    const amount = parseInt(document.querySelector('input[type="number"]').value);
    if (amount > 0) {
      placeBet(amount, choice);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* TÀI */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={gameState !== 'betting'}
        onClick={() => handleBet('tai')}
        className={`relative h-48 rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center gap-2
          ${gameState === 'betting' ? 'border-red-500/30 hover:border-red-500 shadow-[0_0_20px_rgba(196,30,58,0.2)]' : 'opacity-50 border-white/10'}
          bg-gradient-to-br from-red-900/40 to-black`}
      >
        <span className="text-5xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">TÀI</span>
        <div className="flex flex-col items-center">
          <span className="text-white/60 text-xs uppercase font-bold tracking-widest">Tổng cược</span>
          <span className="text-xl font-bold text-white">{(currentBets.tai).toLocaleString()}</span>
        </div>
        {myTai > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-[10px] font-bold animate-bounce">
            BẠN: {myTai.toLocaleString()}
          </div>
        )}
      </motion.button>

      {/* XỈU */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={gameState !== 'betting'}
        onClick={() => handleBet('xiu')}
        className={`relative h-48 rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center gap-2
          ${gameState === 'betting' ? 'border-blue-500/30 hover:border-blue-500 shadow-[0_0_20px_rgba(0,71,171,0.2)]' : 'opacity-50 border-white/10'}
          bg-gradient-to-br from-blue-900/40 to-black`}
      >
        <span className="text-5xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]">XỈU</span>
        <div className="flex flex-col items-center">
          <span className="text-white/60 text-xs uppercase font-bold tracking-widest">Tổng cược</span>
          <span className="text-xl font-bold text-white">{(currentBets.xiu).toLocaleString()}</span>
        </div>
        {myXiu > 0 && (
          <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-[10px] font-bold animate-bounce">
            BẠN: {myXiu.toLocaleString()}
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default BettingArea;
