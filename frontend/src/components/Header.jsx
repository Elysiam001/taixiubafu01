import React from 'react';
import { useGame } from '../context/GameContext';
import { User, Wallet, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useGame();

  if (!user) return (
    <header className="p-4 flex justify-between items-center border-b border-white/10">
      <h1 className="text-2xl font-black italic gold-text drop-shadow-glow">CASINO ROYAL</h1>
    </header>
  );

  return (
    <header className="p-4 flex justify-between items-center glass-panel rounded-none border-t-0 border-x-0">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black italic gold-text drop-shadow-glow">CASINO ROYAL</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 glass-panel px-3 py-1">
          <Wallet className="text-casino-gold w-4 h-4" />
          <span className="font-bold text-casino-gold">
            {user.balance.toLocaleString()}
          </span>
          <span className="text-xs text-white/50">COIN</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center border border-white/20">
            <User className="text-black w-5 h-5" />
          </div>
          <span className="font-semibold hidden sm:inline">{user.username}</span>
        </div>

        <button 
          onClick={logout}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </header>
  );
};

export default Header;
