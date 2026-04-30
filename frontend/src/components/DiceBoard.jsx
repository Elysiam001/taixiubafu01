import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

const Dice = ({ value, rolling }) => {
  return (
    <motion.div
      className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden ${rolling ? 'dice-rolling' : ''}`}
      animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
      transition={rolling ? { repeat: Infinity, duration: 0.5 } : { type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-1 p-2 w-full h-full">
        {/* Simple dot representation based on value */}
        {[...Array(9)].map((_, i) => {
          const dots = {
            1: [4],
            2: [0, 8],
            3: [0, 4, 8],
            4: [0, 2, 6, 8],
            5: [0, 2, 4, 6, 8],
            6: [0, 2, 3, 5, 6, 8]
          };
          return (
            <div key={i} className={`flex items-center justify-center`}>
              {dots[value]?.includes(i) && (
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full shadow-sm" />
              )}
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 pointer-events-none" />
    </motion.div>
  );
};

const DiceBoard = () => {
  const { lastResult, gameState } = useGame();
  const rolling = gameState === 'locked' || (gameState === 'result' && !lastResult);

  const dice = lastResult?.dice || [1, 1, 1];

  return (
    <div className="glass-panel p-8 flex flex-col items-center gap-6 bg-black/40 border-casino-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="flex gap-4 sm:gap-8">
        {dice.map((v, i) => (
          <Dice key={i} value={v} rolling={rolling} />
        ))}
      </div>

      {lastResult && gameState === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span className="text-6xl font-black gold-text drop-shadow-glow">
            {lastResult.total}
          </span>
          <span className={`text-2xl font-bold uppercase ${lastResult.result === 'tai' ? 'text-red-500' : 'text-blue-400'}`}>
            {lastResult.result === 'tai' ? 'Tài' : 'Xỉu'}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default DiceBoard;
