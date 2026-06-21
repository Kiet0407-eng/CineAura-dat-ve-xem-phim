import React, { useState, useEffect } from 'react';
import { BarChart3, Film, Ticket, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total_revenue: 0, total_tickets: 0, active_movies: 0 });

  useEffect(() => {
    fetch('http://localhost:8080/cineaura-backend/api/dashboard_stats.php')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Tổng Quan Hệ Thống</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-dark-card border border-white/5 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400"><DollarSign /></div>
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">Doanh Thu (Paid)</p>
            <p className="text-xl font-black text-white">{formatVND(stats.total_revenue)}</p>
          </div>
        </div>

        <div className="bg-brand-dark-card border border-white/5 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-4 bg-brand-amber/10 rounded-2xl text-brand-amber"><Ticket /></div>
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">Tổng Vé Đã Bán</p>
            <p className="text-xl font-black text-white">{stats.total_tickets} Vé</p>
          </div>
        </div>

        <div className="bg-brand-dark-card border border-white/5 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-4 bg-brand-red/10 rounded-2xl text-brand-red"><Film /></div>
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-bold">Phim Đang Chiếu</p>
            <p className="text-xl font-black text-white">{stats.active_movies} Tác phẩm</p>
          </div>
        </div>
      </div>
      
      {/* Nơi bạn có thể thêm biểu đồ (Recharts) ở bước tiếp theo nếu muốn */}
    </div>
  );
}
