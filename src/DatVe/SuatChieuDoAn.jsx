import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, CalendarDays, Compass, ShoppingBag, Clock, Landmark } from 'lucide-react';
import GridDivider from '../components/GridDivider';

export default function SuatChieuDoAn({ type }) {
  const navigate = useNavigate();
  const isComboMode = type === 'combo';

  const [danhSachPhim, setDanhSachPhim] = useState([]);
  const [suatChieuList, setSuatChieuList] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // ĐÃ SỬA: Chuyển danhSachDoAn thành State để nhận dữ liệu từ MySQL
  const [danhSachDoAn, setDanhSachDoAn] = useState([]);

  const formatDBDateToUI = (dbDate) => {
    if(!dbDate) return '';
    const [y, m, d] = dbDate.split('-');
    return `${d}/${m}/${y}`;
  };

  const generateWeekDays = () => {
    const dates = [];
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const dayName = i === 0 ? 'Hôm nay' : daysOfWeek[d.getDay()];
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();

      dates.push({
        label: dayName,
        subLabel: `${dd}/${mm}`,
        value: `${dd}/${mm}/${yyyy}`
      });
    }
    return dates;
  };

  const isFutureShowtime = (ngayChieuUI, gioChieuUI) => {
    if (!ngayChieuUI || !gioChieuUI || gioChieuUI === '--:--') return false;
    
    const [d, m, y] = ngayChieuUI.split('/');
    const [hour, minute] = gioChieuUI.split(':');

    const showtimeDate = new Date(y, m - 1, d, hour, minute, 0);
    const now = new Date();

    return showtimeDate > now;
  };

  useEffect(() => {
    // ĐÃ SỬA: Thêm link fetch foods.php vào Promise.all để gọi cùng lúc với Phim và Suất chiếu
    Promise.all([
      fetch('http://localhost:8080/cineaura-backend/api/movies.php').then(res => res.json()),
      fetch(`http://localhost:8080/cineaura-backend/api/showtimes.php?t=${new Date().getTime()}`).then(res => res.json()),
      fetch('http://localhost:8080/cineaura-backend/api/foods.php').then(res => res.ok ? res.json() : [])
    ])
    .then(([moviesData, showtimesData, foodsData]) => {
      
      // 1. Xử lý dữ liệu Phim
      const formattedMovies = moviesData.map(m => ({
        id: String(m.id),
        tenPhim: m.title,
        theLoai: m.genre || 'Hành động',
        thoiLuong: `${m.duration} phút`,
        poster: m.poster_url || 'https://images.unsplash.com/photo-1542204172-e70528091f50?auto=format&fit=crop&q=80&w=300',
        dinhDang: 'IMAX 3D',
        phanLoai: 'T16',
        tinhTrang: m.status
      }));
      setDanhSachPhim(formattedMovies);

      // 2. Xử lý dữ liệu Suất chiếu
      const formattedShowtimes = showtimesData.map(s => ({
        id: String(s.id),
        phimId: String(s.movie_id),
        gioChieu: s.show_time ? s.show_time.substring(0, 5) : '--:--',
        ngayChieu: formatDBDateToUI(s.show_date),
        phongChieu: s.room_name || 'Rạp Tiêu Chuẩn',
        giaGhe: parseFloat(s.price) || 120000
      }));
      setSuatChieuList(formattedShowtimes);

      // 3. Xử lý dữ liệu Đồ ăn (Lọc lấy món CÒN HÀNG)
      if (Array.isArray(foodsData)) {
        const availableFoods = foodsData.filter(item => item.trangThai === 'CON_HANG');
        setDanhSachDoAn(availableFoods);
      }

      // Khởi tạo ngày trong tuần
      const weekDates = generateWeekDays();
      setAvailableDates(weekDates);
      setSelectedDateFilter(weekDates[0].value);

      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi đồng bộ máy chủ:", err);
      setLoading(false);
    });
  }, []);

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  const getRatingStyle = (phanLoai) => {
    switch (phanLoai) {
      case 'P': return 'bg-[#4caf50] text-white'; 
      case 'K': return 'bg-[#00acc1] text-white'; 
      case 'T13': return 'bg-[#fb8c00] text-white'; 
      case 'T16': return 'bg-[#e53935] text-white'; 
      case 'T18': return 'bg-[#d32f2f] text-white'; 
      default: return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f7]">
        <div className="text-center font-bold text-[#31b1be] uppercase animate-pulse flex flex-col items-center">
          <CalendarDays className="w-10 h-10 mb-3" />
          <span>Đang đồng bộ dữ liệu từ máy chủ...</span>
        </div>
      </div>
    );
  }

  const moviesWithShowtimes = danhSachPhim.filter(phim =>
    suatChieuList.some(suat => 
      suat.phimId === phim.id && 
      suat.ngayChieu === selectedDateFilter &&
      isFutureShowtime(suat.ngayChieu, suat.gioChieu) 
    )
  );

  return (
    <div className="pb-24 space-y-16 text-slate-800 bg-[#f3f4f7] min-h-screen font-sans">
      
      <section className="w-full">
        <GridDivider title={isComboMode ? "MUA SẮM COMBO" : "LỊCH CHIẾU"} />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {isComboMode ? (
          <div className="space-y-12 animate-fade-in">
            <section className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <Utensils className="w-5 h-5 text-[#31b1be]" />
                <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 uppercase">Thực Đơn Lobby Hảo Hạng</h2>
              </div>

              {danhSachDoAn.length === 0 ? (
                 <div className="text-center py-10 text-gray-500 font-mono">Hiện chưa có món ăn nào được mở bán.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {danhSachDoAn.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:border-[#31b1be]/30 transition-all duration-300 flex flex-col justify-between shadow-sm">
                      <div className="relative aspect-video overflow-hidden bg-slate-900 shrink-0 select-none">
                        <img src={item.hinhAnh || 'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&q=80&w=300'} alt={item.tenDoAn} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                        {item.banChay ? (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#e53935] text-white font-black text-[8px] rounded uppercase tracking-wider animate-pulse">Bán Chạy</span>
                        ) : null}
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-3 bg-white">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono font-black text-[#31b1be] bg-[#31b1be]/10 px-2.2 py-0.5 rounded uppercase border border-[#31b1be]/20">{item.loai}</span>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#31b1be] transition line-clamp-1">{item.tenDoAn}</h3>
                          <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed font-semibold">{item.moTa}</p>
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-black font-mono text-slate-800">{formatVND(item.gia)}</span>
                          <button onClick={() => alert(`Combo "${item.tenDoAn}" đã phục vụ tại rạp. Việc phục vụ diễn ra trực tiếp tại chỗ nằm khi trình vé tại sảnh.`)} className="p-1.5 px-2.5 bg-gray-100 hover:bg-[#31b1be] text-slate-700 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer flex items-center space-x-1 border border-gray-200 hover:border-[#31b1be] bg-transparent">
                            <ShoppingBag className="w-3.5 h-3.5" /><span>Đặt Mua</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="p-4 bg-white rounded-2xl flex items-center gap-4 border border-gray-200 shadow-sm">
              <Compass className="w-8 h-8 text-[#31b1be] shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <h5 className="font-display font-black text-xs text-[#18181b] uppercase tracking-wider">Hệ Thống Bắp Nước Trực Tuyến Độc Quyền</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 font-semibold">Bắp rang được chuẩn bị tươi ấm nóng hổi tích hợp rạp giường nằm cao cấp. Quý khách có thể mua kèm trong tiến trình đặt vé trực tuyến hoặc mua sắm trực tiếp tại lobby thông qua số dư thẻ CineAura Wallet.</p>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in text-left">
            
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 select-none border-b border-gray-200 pb-6">
                {availableDates.map((date) => {
                  const isActive = selectedDateFilter === date.value;
                  return (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDateFilter(date.value)}
                      className={`relative px-4 py-3 sm:py-3.5 sm:px-6 rounded-xl text-center transition-all duration-200 border-2 cursor-pointer min-w-[90px] sm:min-w-[110px] flex flex-col items-center justify-center gap-1 bg-white ${
                        isActive 
                          ? 'border-[#31b1be] shadow-lg transform scale-105 z-10' 
                          : 'border-transparent hover:border-gray-300 text-slate-500 hover:text-slate-800 shadow-sm'
                      }`}
                    >
                      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isActive ? 'text-[#31b1be]' : 'text-slate-500'}`}>
                        {date.label}
                      </span>
                      <span className={`text-sm sm:text-lg font-black font-mono leading-none ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                        {date.subLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-6">
              {moviesWithShowtimes.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center text-slate-400 w-full shadow-sm">
                  <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-display font-black text-slate-700 text-xl uppercase tracking-tight">Hôm nay không có suất chiếu</h4>
                  <p className="text-sm mt-2 text-slate-500 font-semibold max-w-sm mx-auto">Vui lòng chọn các ngày tiếp theo trong tuần để xem lịch phát hành hoặc các suất chiếu mới nhất được mở bán.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <CalendarDays className="w-5 h-5 text-[#31b1be]" />
                    <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 uppercase">Suất Chiếu Đang Mở Bán</h2>
                  </div>

                  <div className="space-y-6 text-left">
                    {moviesWithShowtimes.map((phim) => {
                      const showtimesOnSelectedDate = suatChieuList
                        .filter(suat => suat.phimId === phim.id && suat.ngayChieu === selectedDateFilter && isFutureShowtime(suat.ngayChieu, suat.gioChieu))
                        .sort((a, b) => a.gioChieu.localeCompare(b.gioChieu));

                      if (showtimesOnSelectedDate.length === 0) return null;

                      return (
                        <div 
                          key={phim.id}
                          className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition duration-300"
                        >
                          <div className="relative w-full md:w-36 aspect-[3/4.2] rounded-xl overflow-hidden bg-gray-100 shrink-0 select-none shadow-sm border border-gray-200 cursor-pointer" onClick={() => navigate(`/phim/${phim.id}`)}>
                            <img src={phim.poster} alt={phim.tenPhim} className="w-full h-full object-cover hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
                            <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[9.5px] font-black tracking-wider shadow border border-white/5 ${getRatingStyle(phim.phanLoai)}`}>
                              {phim.phanLoai}
                            </span>
                          </div>

                          <div className="flex-grow flex flex-col justify-between py-1 text-left">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-display font-black text-base sm:text-lg text-slate-900 uppercase tracking-tight hover:text-[#31b1be] transition cursor-pointer inline-block" onClick={() => navigate(`/phim/${phim.id}`)}>
                                  {phim.tenPhim}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-500 font-semibold">
                                  <span className="text-slate-400">Thể loại: <strong className="text-slate-700 font-medium">{phim.theLoai}</strong></span>
                                  <span className="text-slate-200">|</span>
                                  <span className="text-slate-400">Thời lượng: <strong className="text-slate-700 font-medium">{phim.thoiLuong}</strong></span>
                                  <span className="text-slate-200">|</span>
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-[#31b1be] text-[10px] font-mono rounded font-black border border-gray-200">{phim.dinhDang}</span>
                                </div>
                              </div>

                              <div className="space-y-2.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">CHỌN GIỜ VÀO RẠP:</span>
                                <div className="flex flex-wrap gap-3">
                                  {showtimesOnSelectedDate.map((suat) => (
                                    <button
                                      key={suat.id}
                                      onClick={() => navigate('/dat-ve/chon-ghe', { state: { movie: phim, showtime: suat } })}
                                      className="border border-gray-300 bg-white hover:border-[#31b1be] hover:bg-[#31b1be]/5 px-5 py-3 rounded-xl text-[#1a1a1a] hover:text-[#31b1be] text-center transition duration-150 cursor-pointer min-w-[120px] flex flex-col items-center justify-center shadow-sm select-none"
                                    >
                                      <span className="font-mono text-sm font-black leading-tight flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {suat.gioChieu}
                                      </span>
                                      <span className="text-[9.5px] text-slate-400 uppercase font-mono tracking-widest mt-1 group-hover:text-[#31b1be]/80 font-bold flex items-center gap-0.5">
                                        <Landmark className="w-3 h-3 text-slate-400 shrink-0" />
                                        {suat.phongChieu}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-400 font-medium mt-4 pt-4 border-t border-gray-100 leading-relaxed text-left">
                              * Nhấn chọn giờ chiếu để chuyển sang sơ đồ lựa chọn ghế VIP Gold, đặt kèm thức uống và thanh toán tự động qua CineAura Wallet.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          </div>
        )}

      </div>
    </div>
  );
}