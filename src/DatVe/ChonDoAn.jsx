import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Minus, ShoppingBag, Check, ChevronLeft, Flame, Coffee 
} from 'lucide-react';

export default function ChonDoAn() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state || {};
  const { movie, showtime, seats, totalTicketPrice } = bookingData;

  if (!movie || !seats || seats.length === 0) {
    return (
      <div className="min-h-screen bg-[#050508] text-gray-300 flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">Phiên giao dịch hết hạn</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm">Không tìm thấy dữ liệu đặt vé từ bước chọn ghế. Quý khách vui lòng chọn lại phim.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 py-3 px-6 bg-[#31b1be] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#208a95] transition duration-155 cursor-pointer border-0"
        >
          Quay lại Trang Chủ
        </button>
      </div>
    );
  }

  const [doAnCart, setDoAnCart] = useState([]);

  // HÀM LẤY DỮ LIỆU ĐỒNG BỘ TỪ MYSQL MÀ ADMIN VỪA CẬP NHẬT
  useEffect(() => {
    fetch('http://localhost:8080/cineaura-backend/api/foods.php')
      .then(res => res.json())
      .then(data => {
        // Chỉ hiện những món đang ở trạng thái 'CON_HANG'
        const available = data.filter(item => item.trangThai === 'CON_HANG');
        // Khởi tạo thuộc tính soLuong = 0 cho Giỏ hàng
        setDoAnCart(available.map(item => ({ ...item, soLuong: 0 })));
      })
      .catch(err => console.error("Lỗi lấy thực đơn Khách hàng:", err));
  }, []);

  const handleUpdateSoLuong = (id, change) => {
    setDoAnCart(prev => prev.map(item => {
      if (item.id === id) {
        const temp = item.soLuong + change;
        return { ...item, soLuong: temp < 0 ? 0 : temp };
      }
      return item;
    }));
  };

  const tongTienDoAn = doAnCart.reduce((sum, item) => sum + (item.gia * item.soLuong), 0);
  const tongTienThanhToan = totalTicketPrice + tongTienDoAn;

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  const handleTiepTucThanhToan = () => {
    navigate('/dat-ve/thanh-toan', {
      state: {
        movie,
        showtime,
        seats,
        totalTicketPrice,
        selectedFoods: doAnCart 
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050508] font-sans text-gray-200 py-10 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center space-x-3.5 border-b border-white/5 pb-6">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition duration-150 cursor-pointer border-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <span className="text-[10px] bg-[#31b1be]/10 border border-[#31b1be]/35 text-[#31b1be] px-2.2 py-0.5 rounded font-mono font-bold uppercase tracking-widest leading-none">
              Bước 2: Chọn Đồ Ăn Kèm Theo
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 uppercase tracking-tight font-display">
              CineAura Food Court
            </h1>
          </div>
        </div>

        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-black font-display uppercase tracking-wider text-white">Thực đơn rạp phim</h2>
              <p className="text-xs text-gray-400">Tiết kiệm tới 25% khi tích hợp mua combo bắp nước trực tuyến kèm vé xem phim.</p>
            </div>
            
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-400/5 text-amber-400 text-[10px] font-mono font-black uppercase rounded-lg border border-amber-400/10">
              <Flame className="w-3.5 h-3.5 animate-pulse shrink-0" />
              <span>Bán Chạy Nhất</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doAnCart.length === 0 && (
               <div className="col-span-full py-10 text-center text-gray-500 font-mono">Đang cập nhật thực đơn từ máy chủ...</div>
            )}
            
            {doAnCart.map((item) => {
              const activeCount = item.soLuong;
              
              return (
                <div key={item.id} className={`bg-[#0c0c13] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-md ${activeCount > 0 ? 'border-[#31b1be] shadow-[#31b1be]/5 scale-[1.01]' : 'border-white/5 hover:border-white/10'}`}>
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
                    <img src={item.hinhAnh || 'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&q=80&w=300'} alt={item.tenDoAn} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" referrerPolicy="no-referrer" />
                    {item.banChay && (
                      <span className="absolute top-3 left-3 bg-rose-600/90 text-white font-black text-[8.5px] uppercase tracking-widest px-2.2 py-0.5 rounded border border-rose-500/15">HOT COMBO</span>
                    )}
                    {activeCount > 0 && (
                      <span className="absolute top-3 right-3 bg-[#31b1be] text-white font-mono font-black text-xs w-6.5 h-6.5 rounded-full flex items-center justify-center border border-[#31b1be]">{activeCount}</span>
                    )}
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm line-clamp-1 leading-tight">{item.tenDoAn}</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{item.moTa || 'Hương vị tuyệt hảo rạp chiếu phim.'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-black font-mono text-amber-500">{formatVND(item.gia)}</span>
                      <div className="flex items-center space-x-2 bg-black/60 p-1 rounded-xl border border-white/5">
                        <button type="button" onClick={() => handleUpdateSoLuong(item.id, -1)} className="w-7 h-7 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition border-0 bg-transparent cursor-pointer flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="font-mono font-black text-white text-xs w-6 text-center">{activeCount}</span>
                        <button type="button" onClick={() => handleUpdateSoLuong(item.id, 1)} className="w-7 h-7 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition border-0 bg-transparent cursor-pointer flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#0b0b12] border border-white/5 p-5 rounded-2xl flex items-center space-x-3 max-w-xl mt-6">
            <div className="p-3 bg-amber-400/5 text-amber-500 rounded-xl shrink-0"><Coffee className="w-5 h-5 animate-bounce" /></div>
            <div className="text-xs">
              <h4 className="font-black text-white">Chính Sách Chăm Sóc Sức Khỏe</h4>
              <p className="text-gray-500 mt-0.5 leading-relaxed">CineAura sử dụng dầu dừa cao cấp và công thức nổ hạt không chất bảo quản giúp bắp nổ thơm ngậy mà không gây ngấy béo.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090f]/95 backdrop-blur-md border-t border-white/10 py-5.5 px-4 sm:px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-left">
          <div className="space-y-1 flex-1 w-full">
            <div className="flex items-center space-x-3 flex-wrap">
              <h4 className="font-display font-black text-white text-sm uppercase tracking-tight leading-none">{movie.tenPhim}</h4>
              <span className="px-1.5 py-0.5 bg-brand-red/20 border border-brand-red/30 text-red-500 text-[8px] font-black tracking-wider uppercase rounded leading-none font-mono">{movie.dinhDang || 'IMAX 3D'}</span>
              <span className="text-[10px] text-gray-500 font-mono mt-1 sm:mt-0">{showtime.ngayChieu} • {showtime.gioChieu} • {showtime.phongChieu}</span>
            </div>

            <div className="flex items-center space-x-2 text-xs flex-wrap mt-1">
              <span className="text-gray-400">Vị trí ghế:</span>
              <strong className="text-[#31b1be] font-mono font-black uppercase">{seats.map(s => s.label).join(', ')}</strong>
              {tongTienDoAn > 0 && (
                <>
                  <span className="text-gray-600 hidden sm:inline">|</span>
                  <span className="text-gray-400">Đồ ăn kèm:</span>
                  <strong className="text-amber-500 font-mono">{doAnCart.filter(f => f.soLuong > 0).map(f => `${f.soLuong}x ${f.tenDoAn}`).join(', ')}</strong>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
            <div>
              <span className="text-[10px] text-gray-400 block font-semibold uppercase font-mono text-left sm:text-right">Tổng Tiền Hóa Đơn:</span>
              <strong className="text-xl sm:text-2xl font-mono font-black text-amber-500 tracking-tight block">{formatVND(tongTienThanhToan)}</strong>
            </div>

            <button onClick={handleTiepTucThanhToan} className="py-3.5 px-6.5 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-150 shadow-md flex items-center space-x-1.5 border-0 cursor-pointer">
              <span>Đi tiếp đến Thanh toán</span><Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}