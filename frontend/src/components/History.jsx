import React from 'react';
import { useGame } from '../context/GameContext';

const History = () => {
  const { gameHistory } = useGame();

  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Lịch sử ván đấu</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {gameHistory.map((game, i) => (
          <div 
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold border-2
              ${game.result === 'tai' ? 'bg-red-900/40 border-red-500 text-red-500' : 'bg-blue-900/40 border-blue-500 text-blue-400'}`}
            title={`Dice: ${game.dice?.join(',')} - Total: ${game.total}`}
          >
            {game.result === 'tai' ? 'T' : 'X'}
          </div>
        ))}
        {gameHistory.length === 0 && (
          <span className="text-white/20 italic text-sm">Chưa có dữ liệu...</span>
        )}
      </div>
    </div>
  );
};

export default History;
