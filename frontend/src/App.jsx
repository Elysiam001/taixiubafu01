import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';

const ProtectedRoute = ({ children }) => {
  const { user } = useGame();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-casino-gradient text-white">
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;
