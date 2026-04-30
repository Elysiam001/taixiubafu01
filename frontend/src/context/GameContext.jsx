import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const GameContext = createContext();

const API_URL = 'https://bafu14g.onrender.com';

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('betting');
  const [timer, setTimer] = useState(30);
  const [gameHistory, setGameHistory] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [currentBets, setCurrentBets] = useState({ tai: 0, xiu: 0 });
  const [myBets, setMyBets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/api/user/me`, { headers: { 'x-auth-token': token } })
        .then(res => {
          setUser(res.data);
          initSocket(res.data._id);
        })
        .catch(() => localStorage.removeItem('token'));
    }
    fetchHistory();
  }, []);

  const initSocket = (userId) => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.emit('join', userId);

    newSocket.on('timer', (data) => {
      setTimer(data.timer);
      setGameState(data.state);
    });

    newSocket.on('new_round', (data) => {
      setGameState('betting');
      setTimer(data.timer);
      setLastResult(null);
      setCurrentBets({ tai: 0, xiu: 0 });
      setMyBets([]);
    });

    newSocket.on('result', (data) => {
      setLastResult(data);
      fetchHistory();
    });

    newSocket.on('bet_success', (data) => {
      setUser(prev => ({ ...prev, balance: data.balance }));
      setMyBets(prev => [...prev, data]);
    });

    newSocket.on('total_bets_update', (data) => {
      setCurrentBets(prev => ({
        ...prev,
        [data.choice]: prev[data.choice] + data.amount
      }));
    });

    newSocket.on('bet_result', (data) => {
      // Small delay to match animation
      setTimeout(() => {
        if (data.result === 'win') {
          // You could add a sound/toast here
          fetchUser(); // Refresh balance
        }
      }, 2000);
    });

    return () => newSocket.close();
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await axios.get(`${API_URL}/api/user/me`, { headers: { 'x-auth-token': token } });
    setUser(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get(`${API_URL}/api/game/history`);
    setGameHistory(res.data);
  };

  const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    initSocket(res.data.user.id);
    return res.data;
  };

  const register = async (username, password) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, { username, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    initSocket(res.data.user.id);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (socket) socket.close();
  };

  const placeBet = (amount, choice) => {
    if (socket && user) {
      socket.emit('place_bet', { userId: user._id || user.id, amount, choice });
    }
  };

  return (
    <GameContext.Provider value={{
      user, setUser, gameState, timer, gameHistory, lastResult, 
      currentBets, myBets, login, register, logout, placeBet
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
