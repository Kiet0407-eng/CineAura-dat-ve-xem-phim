import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Ticket, Users, Sparkles, ShieldAlert, Check, DollarSign, Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

export default function BangDieuKhien() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu giao dịch thật từ MySQL
  useEffect(() => {
    fetch('http://localhost:8080/cineaura-backend/api/bookings.php')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy dữ liệu dashboard:", err);
        setLoading(false);
      });
  }, []);

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  // Tính toán dữ liệu thực tế từ các đơn hàng ĐÃ THANH TOÁN hoặc ĐÃ SỬ DỤNG
  const validBookings = bookings.filter(b => b.status === 'PAID' || b.status === 'USED');
  
  const tongDoanhThu = validBookings.reduce((sum, ticket) => sum + parseFloat(ticket.total_price), 0);
  
  // Tính tổng số vé bằng cách đếm số lượng ghế đã đặt (chia chuỗi bằng dấu phẩy)
  const tongSoGhe = validBookings.reduce((sum, ticket) => {
    if (!ticket.seats) return sum;
    const seatArray = ticket.seats.split(',');
    return sum + seatArray.length;
  }, 0);

  const metrics = [
    {
      id: 'doanh_thu',
      name: 'Doanh Thu Thực Tế',
      value: formatVND(tongDoanhThu),
      subText: 'Đã trừ các đơn bị hủy',
      icon: DollarSign,
      color: 'from-brand-amber to-amber-600',
      glow: 'shadow-brand-amber/10',
      badge: 'Cập nhật Live',
      isUp: true
    },
    {
      id: 'so_ve',
      name: 'Số Vé Đã Bán',
      value: `${tongSoGhe} Vé`,
      subText: 'Ghế đã được thanh toán',
      icon: Ticket,
      color: 'from-brand-red to-red-700',
      glow: 'shadow-brand-red/10',
      badge: 'Thành Công',
      isUp: true
    },
    {
      id: 'truy_cap',
      name: 'Lượng Truy Cập',
      value: '2,845 Lượt',
      subText: 'Hoạt động phòng chờ 24h',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      glow: 'shadow-blue-500/10',
      badge: '+42% Live',
      isUp: true
    }
  ];

  // Lấy 5 giao dịch mới nhất để hiển thị
  const recentTransactions = bookings.slice(0, 5);

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200 text-left">
      
      {/* 1. Header Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-32 bg-brand-amber/5 rounded-full filter blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-1.5 text-brand-red font-mono text-[9px] uppercase tracking-widest font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Hệ Thống Phân Tích CineAura v1.2</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">BẢNG ĐIỀU KHIỂN QUẢN TRỊ</h2>
          <p className="text-xs text-gray-400">Giám sát tài chính, lượng khách mua vé & vận hành phòng máy chiếu cao cấp.</p>
        </div>

        <div className="flex items-center space-x-2 bg-black/40 border border-white/5 px-4 py-2 rounded-xl relative z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold text-gray-400">
            KÊNH TRỰC TUYẾN LIVE
          </span>
        </div>
      </div>

      {/* 2. Grid Cards Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.35 }}
              className={`p-6 bg-brand-dark-card border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300 shadow-xl ${metric.glow}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono block">
                    {metric.name}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                    {metric.value}
                  </h3>
                  <p className="text-[11px] text-gray-500 flex items-center space-x-1">
                    <span>{metric.subText}</span>
                  </p>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all`}>
                  <div className="w-full h-full bg-[#0a0a0f]/90 rounded-[10px] flex items-center justify-center">
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Section Các giao dịch gần nhất */}
      <section className="bg-brand-dark-card border border-white/5 rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-lg text-white">Giao Dịch Đặt Vé Mới Nhất</h3>
            <p className="text-xs text-gray-400">Đồng bộ liên tục từ dữ liệu đặt vé của khách hàng trên toàn rạp.</p>
          </div>
          <span className="px-3.5 py-1.5 bg-white/5 border border-white/5 text-gray-400 font-mono text-[9px] uppercase font-bold rounded-full">
            Tổng cộng: {bookings.length} giao dịch
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-xs text-left text-gray-300">
            <thead className="text-[10px] text-gray-500 uppercase font-mono bg-black/40 border-b border-white/5">
              <tr>
                <th className="px-4 py-3.5 font-bold">Mã Hóa Đơn</th>
                <th className="px-4 py-3.5 font-bold">Khách Hàng</th>
                <th className="px-4 py-3.5 font-bold">Phim Lựa Chọn</th>
                <th className="px-4 py-3.5 font-bold">Vị Trí Ghế</th>
                <th className="px-4 py-3.5 font-bold text-right">Tổng Tiền</th>
                <th className="px-4 py-3.5 font-bold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/15">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500 font-mono">Đang tải dữ liệu...</td>
                </tr>
              ) : recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500 font-mono">
                    Chưa phát sinh giao dịch đặt vé trực tuyến nào.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((ve) => (
                  <tr key={ve.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-brand-amber">CINE-{String(ve.id).padStart(5, '0')}</td>
                    <td className="px-4 py-4">
                      <strong className="text-white font-medium">{ve.full_name || 'Khách vãng lai'}</strong>
                      <p className="text-[10px] text-gray-500 mt-0.5">{ve.email || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <strong className="text-white font-medium">{ve.movie_title}</strong>
                      <p className="text-[10px] text-gray-500 mt-0.5">{ve.show_time?.substring(0, 5)} - {ve.show_date}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-brand-amber font-bold">{ve.seats || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-bold text-white">
                      {formatVND(ve.total_price)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {ve.status === 'PAID' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] uppercase font-bold rounded-full">
                          <Check className="w-3 h-3 stroke-[3.5]" /><span>Hoàn Tất</span>
                        </span>
                      ) : ve.status === 'USED' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] uppercase font-bold rounded-full">
                          <Check className="w-3 h-3 stroke-[3.5]" /><span>Đã Soát Vé</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] uppercase font-bold rounded-full">
                          <Check className="w-3 h-3 stroke-[3.5]" /><span>Đã Hủy</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}