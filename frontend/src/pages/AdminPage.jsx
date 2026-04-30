import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGame } from '../context/GameContext';
import { ShieldCheck, Plus, Minus } from 'lucide-react';

const AdminPage = () => {
  const { user } = useGame();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBalance = async (userId, amount) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/admin/update-balance`, 
        { userId, amount },
        { headers: { 'x-auth-token': token } }
      );
      fetchUsers();
    } catch (err) {
      alert('Lỗi khi cập nhật số dư');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <h2 className="text-4xl font-black text-red-500">TRUY CẬP BỊ TỪ CHỐI</h2>
        <p>Bạn không có quyền truy cập vào khu vực này.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheck className="w-10 h-10 text-casino-gold" />
        <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/10 text-casino-gold uppercase text-xs font-bold tracking-widest">
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold">{u.username}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-red-500' : 'bg-green-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-casino-gold">{u.balance.toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateBalance(u._id, 100000)}
                      className="bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white p-2 rounded transition-all"
                      title="+100k"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleUpdateBalance(u._id, -100000)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded transition-all"
                      title="-100k"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-10 text-center italic text-white/30">Đang tải dữ liệu...</div>}
      </div>
    </div>
  );
};

export default AdminPage;
