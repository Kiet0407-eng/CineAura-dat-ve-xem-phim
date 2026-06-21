import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, Hourglass, XCircle, TrendingUp, Search, Eye, MapPin, Calendar, Clock, Popcorn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LichSuDatVe() {
  const [donList, setDonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State quản lý Modal Xem chi tiết Vé điện tử
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadDonHang = () => {
    // Lưu ý: Đáng lý ở đây phải gọi API get_user_bookings.php theo ID khách, 
    // nhưng tạm thời dùng API chung để demo hiển thị vé.
    fetch('http://localhost:8080/cineaura-backend/api/bookings.php')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          id: `CINE-${String(item.id).padStart(5, '0')}`,
          db_id: item.id,
          khachHang: item.full_name || 'Khách vãng lai',
          email: item.email || 'N/A',
          tongTien: parseFloat(item.total_price),
          gheDat: item.seats || 'N/A',
          trangThai: item.status, 
          phimTen: item.movie_title || 'Phim đã bị gỡ',
          phongChieu: item.room_name || 'Phòng chiếu chờ cập nhật',
          rapChieu: item.theater_name || 'CineAura Phan Xích Long',
          ngayChieu: item.show_date || 'Đang cập nhật',
          gioChieu: item.show_time || '--:--',
          poster: item.poster_url || 'https://via.placeholder.com/150x220?text=CineAura',
          doAn: item.foods || 'Không có đồ ăn kèm'
        }));
        setDonList(formattedData);
      })
      .catch(err => console.error("Lỗi:", err));
  };

  useEffect(() => { loadDonHang(); }, []);

  const formatVND = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);

  const totalInvoices = donList.length;
  const paidInvoices = donList.filter(d => d.trangThai === 'PAID' || d.trangThai === 'USED').length;
  const cancelledInvoices = donList.filter(d => d.trangThai === 'CANCELLED').length;

  const filteredList = donList.filter(item => 
    item.khachHang.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phimTen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0f] border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#31b1be]/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-1.5 text-[#31b1be] font-mono text-[9px] uppercase tracking-widest font-bold">
            <Ticket className="w-3.5 h-3.5 text-[#31b1be]" />
            <span>Kênh kiểm soát luồng giao dịch</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Đơn Đặt Vé Hệ Thống</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-[#0a0a0f] border border-white/5 rounded-2xl flex items-center justify-between">
          <div><span className="text-[9px] font-mono font-bold text-gray-500 uppercase">Tổng đơn phát sinh</span><p className="text-2xl font-black">{totalInvoices}</p></div>
          <TrendingUp className="w-5 h-5 text-[#31b1be]" />
        </div>
        <div className="p-5 bg-[#0a0a0f] border border-white/5 rounded-2xl flex items-center justify-between">
          <div><span className="text-[9px] font-mono font-bold text-emerald-500 uppercase">Giao dịch thành công</span><p className="text-2xl font-black text-emerald-400">{paidInvoices}</p></div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="p-5 bg-[#0a0a0f] border border-white/5 rounded-2xl flex items-center justify-between">
          <div><span className="text-[9px] font-mono font-bold text-red-500 uppercase">Đã hủy / Thất bại</span><p className="text-2xl font-black text-red-400">{cancelledInvoices}</p></div>
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
      </div>

      <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn (CINE-...), khách hàng, hoặc phim..."
            className="w-full bg-black/50 border border-white/5 py-3 px-4 pl-10 rounded-xl text-sm text-white focus:outline-none focus:border-[#31b1be]"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-xs text-left text-gray-300">
            <thead className="bg-[#111115] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
              <tr>
                <th className="px-5 py-4 font-bold text-center">Mã Đơn</th>
                <th className="px-5 py-4 font-bold">Khách Hàng</th>
                <th className="px-5 py-4 font-bold">Phim & Ghế</th>
                <th className="px-5 py-4 font-bold text-right">Tổng Tiền</th>
                <th className="px-5 py-4 font-bold text-center">Trạng Thái</th>
                <th className="px-5 py-4 font-bold text-center">Tác Vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/40">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-center text-[#31b1be]">{item.id}</td>
                  <td className="px-5 py-4"><strong>{item.khachHang}</strong><p className="text-[10px] text-gray-500">{item.email}</p></td>
                  <td className="px-5 py-4"><strong>{item.phimTen}</strong><p className="text-[10px] text-[#31b1be] font-mono mt-0.5">Ghế: {item.gheDat}</p></td>
                  <td className="px-5 py-4 text-right font-bold text-white font-mono">{formatVND(item.tongTien)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                      item.trangThai === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      item.trangThai === 'USED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {item.trangThai === 'PAID' ? 'Đã Thanh Toán' : (item.trangThai === 'USED' ? 'Đã Soát Vé' : 'Đã Hủy')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {/* NÚT XEM VÉ DÀNH CHO KHÁCH HÀNG */}
                    <button 
                      onClick={() => setSelectedTicket(item)} 
                      className="p-2 bg-[#31b1be]/10 text-[#31b1be] rounded-lg hover:bg-[#31b1be]/20 cursor-pointer border border-[#31b1be]/20 transition-all flex items-center justify-center mx-auto space-x-1.5 font-bold text-[10px] uppercase shadow-sm" 
                      title="Xem chi tiết vé điện tử"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem E-Ticket</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL E-TICKET (VÉ ĐIỆN TỬ) */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Lớp nền mờ */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTicket(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" />
            
            {/* Thân vé điện tử */}
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[70] overflow-hidden font-sans text-slate-800">
              
              {/* Nút Đóng */}
              <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 z-30 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all cursor-pointer border-0">
                <X className="w-5 h-5" />
              </button>

              {/* Phần Poster (Đầu vé) */}
              <div className="relative h-48 w-full bg-slate-900">
                <img 
  src={selectedTicket.poster} 
  alt="" 
  onError={(e) => { 
    e.target.onerror = null; 
    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop'; 
  }}
  className="w-full h-full object-cover opacity-60" 
/>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-[10px] bg-[#31b1be] text-white font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-md font-mono mb-2 inline-block">CineAura E-Ticket</span>
                  <h3 className="font-display font-black text-2xl text-slate-900 leading-tight line-clamp-2 drop-shadow-md">{selectedTicket.phimTen}</h3>
                </div>
              </div>

              {/* Phần Thông Tin Vé (Thân vé) */}
              <div className="px-6 py-5 space-y-4 relative bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> Ngày chiếu</span>
                    <p className="font-bold text-sm text-slate-800 mt-0.5">{selectedTicket.ngayChieu}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3"/> Giờ chiếu</span>
                    <p className="font-bold text-sm text-slate-800 mt-0.5">{selectedTicket.gioChieu}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3"/> Rạp & Phòng chiếu</span>
                    <p className="font-bold text-sm text-slate-800 mt-0.5">{selectedTicket.rapChieu} <span className="text-gray-400 font-normal">|</span> {selectedTicket.phongChieu}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center mt-2">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">Ghế ngồi</span>
                    <p className="text-xl font-black text-[#31b1be] font-mono">{selectedTicket.gheDat}</p>
                  </div>
                  {selectedTicket.doAn !== 'Không có đồ ăn kèm' && (
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono flex items-center justify-end gap-1"><Popcorn className="w-3 h-3"/> Combo</span>
                      <p className="text-xs font-bold text-slate-700 mt-1 line-clamp-2 max-w-[120px]">{selectedTicket.doAn}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Đường đứt nét (Đục lỗ cắt vé) */}
              <div className="relative h-6 bg-white overflow-hidden flex items-center">
                <div className="absolute left-[-12px] w-6 h-6 bg-black/60 rounded-full shadow-inner" />
                <div className="w-full border-t-[2.5px] border-dashed border-slate-200" />
                <div className="absolute right-[-12px] w-6 h-6 bg-black/60 rounded-full shadow-inner" />
              </div>

              {/* Phần Barcode (Đuôi vé) */}
              <div className="bg-white px-6 pb-8 pt-2 text-center space-y-3">
                <div className="flex justify-center opacity-80">
                  {/* Dùng CSS để vẽ giả lập mã Barcode */}
                  <div className="h-14 w-full flex items-center justify-center space-x-1 grayscale overflow-hidden px-4">
                    {[1,3,2,1,5,2,1,4,2,3,1,2,5,1,2,4,1,2].map((w, i) => (
                      <div key={i} className="h-full bg-slate-800 rounded-sm" style={{ width: `${w * 2.5}px` }} />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-xs font-bold tracking-[0.3em] text-slate-500">{selectedTicket.id}</span>
                  <p className="text-[9px] text-slate-400 uppercase mt-1">Xuất trình mã này cho nhân viên soát vé</p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}