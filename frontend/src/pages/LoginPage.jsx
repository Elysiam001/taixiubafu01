import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useGame();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/');
    } catch (err) {
      console.error("Login/Register Error:", err);
      if (err.code === 'ERR_NETWORK') {
        setError('Không thể kết nối đến máy chủ. Hãy kiểm tra VITE_API_URL trong Vercel.');
      } else {
        setError(err.response?.data?.msg || 'Lỗi server: ' + (err.message || 'Không xác định'));
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-md p-8 bg-black/60 border-casino-gold/30"
      >
        <h2 className="text-3xl font-black gold-text text-center mb-8 uppercase tracking-widest">
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/50 uppercase">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-casino-gold"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/50 uppercase">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-casino-gold"
              required
            />
          </div>

          <button type="submit" className="gold-button py-4 rounded-xl text-lg mt-4">
            {isLogin ? 'VÀO SÒNG' : 'THAM GIA NGAY'}
          </button>
        </form>

        <p className="text-center mt-8 text-white/50">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-casino-gold font-bold ml-2 hover:underline"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
