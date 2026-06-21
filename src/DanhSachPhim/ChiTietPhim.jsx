import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Calendar, 
  Play, 
  ChevronRight, 
  Ticket, 
  Info, 
  X, 
  MapPin, 
  ChevronLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChiTietPhim() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [rapList, setRapList] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('lichChieu');
  const [showTrailer, setShowTrailer] = useState(false);
  
  // State quản lý 7 ngày
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // --- THUẬT TOÁN 1: TỰ SINH 7 NGÀY ---
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

  // --- THUẬT TOÁN 2: CHẶN QUÁ KHỨ ---
  const isFutureShowtime = (ngayChieuUI, gioChieuUI) => {
    if (!ngayChieuUI || !gioChieuUI || gioChieuUI === '--:--') return false;
    const [d, m, y] = ngayChieuUI.split('/');
    const [hour, minute] = gioChieuUI.split(':');
    const showtimeDate = new Date(y, m - 1, d, hour, minute, 0);
    const now = new Date();
    return showtimeDate > now;
  };

  const formatDBDateToUI = (dbDate) => {
    if(!dbDate) return '';
    const [y, m, d] = dbDate.split('-');
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang

    Promise.all([
      fetch('http://localhost:8080/cineaura-backend/api/movies.php').then(res => res.json()),
      fetch('http://localhost:8080/cineaura-backend/api/theaters.php')
        .then(res => res.ok ? res.json() : [])
        .catch(() => []), 
      fetch('http://localhost:8080/cineaura-backend/api/rooms.php')
        .then(res => res.ok ? res.json() : [])
        .catch(() => []),
      fetch(`http://localhost:8080/cineaura-backend/api/showtimes.php?t=${new Date().getTime()}`)
        .then(res => res.json())
    ])
    .then(([moviesData, theatersData, roomsData, showtimesData]) => {
      // Tìm phim theo ID
      const foundMovie = moviesData.find(p => String(p.id) === String(id));
      if (foundMovie) {
        setMovie({
          id: String(foundMovie.id),
          tenPhim: foundMovie.title,
          moTa: foundMovie.description || 'Hồ sơ phim điện ảnh bom tấn chất lượng đỉnh cao của rạp phim CineAura Premium.',
          poster: foundMovie.poster_url || 'https://images.unsplash.com/photo-1542204172-e70528091f50?auto=format&fit=crop&q=80&w=300',
          banner: foundMovie.poster_url,
          thoiLuong: `${foundMovie.duration} phút`,
          theLoai: foundMovie.genre || 'Hành động, IMAX',
          tinhTrang: foundMovie.status === 'NOW_SHOWING' ? 'DANG_CHIEU' : 'SAP_CHIEU',
          khoiChieu: foundMovie.release_date ? formatDBDateToUI(foundMovie.release_date) : 'Đang cập nhật', 
          phanLoai: 'T16', 
          dinhDang: 'IMAX 3D',
          rating: 9.2,
          daoDien: 'CineAura Director',
          trailer: foundMovie.trailer_url // Lấy link trailer từ DB
        });
      }

      // Xử lý danh sách rạp
      let validTheaters = Array.isArray(theatersData) && theatersData.length > 0 
        ? theatersData.map(t => ({ id: String(t.id), name: t.name, address: t.address }))
        : [{ id: 'default_theater', name: 'CineAura Center (Rạp mặc định)', address: 'Hệ thống rạp chính' }];
      
      setRapList(validTheaters);

      // Lọc suất chiếu
      const filteredShowtimes = showtimesData
        .filter(s => String(s.movie_id) === String(id))
        .map(s => {
          const roomMatch = roomsData.find(r => String(r.id) === String(s.room_id));
          const finalTheaterId = roomMatch ? roomMatch.theater_id : (s.theater_id || validTheaters[0].id);

          return {
            id: String(s.id),
            phimId: String(s.movie_id),
            ngayChieu: formatDBDateToUI(s.show_date),
            gioChieu: s.show_time ? s.show_time.substring(0, 5) : '--:--',
            phongChieu: roomMatch ? roomMatch.name : (s.room_name || 'Rạp Tiêu Chuẩn'),
            rapId: String(finalTheaterId), 
            giaGhe: parseFloat(s.price) || 120000
          };
        });
      
      setShowtimes(filteredShowtimes);

      // Khởi tạo 7 ngày tự động
      const weekDates = generateWeekDays();
      setAvailableDates(weekDates);
      setSelectedDate(weekDates[0].value);

      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi tải dữ liệu chi tiết phim:", err);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#f3f4f7] text-[#31b1be] flex items-center justify-center font-bold animate-pulse">Đang tải hồ sơ phim...</div>;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#f3f4f7] text-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-xl font-bold uppercase tracking-wider text-[#da1e28]">Không tìm thấy bộ phim</h3>
        <button 
          onClick={() => navigate('/phim')}
          className="mt-4 px-6 py-2.5 bg-[#31b1be] rounded-lg text-xs font-bold text-white uppercase tracking-wider cursor-pointer border-0 shadow-md"
        >
          Quay lại danh sách phim
        </button>
      </div>
    );
  }

  const getShowtimesForRapAndDate = (rapId, date) => {
    return showtimes
      .filter(s => String(s.rapId) === String(rapId) && s.ngayChieu === date && isFutureShowtime(s.ngayChieu, s.gioChieu))
      .sort((a, b) => a.gioChieu.localeCompare(b.gioChieu));
  };

  const handleSelectShowtime = (showtime) => {
    navigate('/dat-ve/chon-ghe', {
      state: { movie: movie, showtime: showtime }
    });
  };

  const getAgeRatingBadge = (phanLoai) => {
    switch (phanLoai) {
      case 'P': return 'bg-emerald-500 text-white';
      case 'K': return 'bg-cyan-500 text-white';
      case 'T13': return 'bg-amber-500 text-white';
      case 'T16': return 'bg-orange-500 text-white';
      case 'T18': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const hasShowtimesOnSelectedDate = rapList.some(rap => getShowtimesForRapAndDate(rap.id, selectedDate).length > 0);

  return (
    <div className="bg-[#f3f4f7] text-slate-800 min-h-screen text-left font-sans select-none pb-20">
      
      {/* HERO BANNER COVER & BASIC INFO (Banner vẫn giữ nền tối để poster nổi bật) */}
      <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-10" />
          <img 
            src={movie.banner || movie.poster} 
            alt={movie.tenPhim}
            className="w-full h-full object-cover scale-105 filter blur-[3px] opacity-75"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="absolute top-6 left-6 z-30">
          <button 
            onClick={() => navigate('/phim')}
            className="flex items-center space-x-2 py-2 px-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-xs font-bold rounded-xl border border-white/20 transition duration-150 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#31b1be]" />
            <span>TRỞ VỀ DANH SÁCH</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-end">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-40 sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 shrink-0 hidden md:block bg-black/50"
            >
              <img 
                src={movie.poster} 
                alt={movie.tenPhim} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="space-y-4 md:pb-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black shadow-sm ${getAgeRatingBadge(movie.phanLoai)}`}>
                  {movie.phanLoai}
                </span>
                <span className="px-2.5 py-0.5 bg-black/55 text-[#31b1be] rounded text-[10px] font-mono font-black border border-[#31b1be]/30">
                  {movie.dinhDang}
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-none drop-shadow">
                {movie.tenPhim}
              </h1>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 font-mono text-sm font-black text-amber-400 bg-amber-400/5 px-3 py-1 rounded-full border border-amber-400/20">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{movie.rating} / 10</span>
                </div>
                
                <div className="flex items-center space-x-1.5 text-xs text-gray-300">
                  <Clock className="w-3.5 h-3.5 text-[#31b1be]" />
                  <span>{movie.thoiLuong}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-[#31b1be]" />
                  <span>{movie.theLoai}</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 max-w-2xl leading-relaxed italic line-clamp-2 md:line-clamp-none drop-shadow-md">
                "{movie.moTa}"
              </p>

              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center justify-center space-x-2 py-3 px-6 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition duration-150 cursor-pointer shadow-lg float-left mt-2 border-0"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Xem Trailer Phim</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CHỌN TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="border-b border-gray-200 flex space-x-8">
          <button
            onClick={() => setActiveTab('lichChieu')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition cursor-pointer border-b-2 bg-transparent border-0 ${
              activeTab === 'lichChieu' 
                ? 'border-[#31b1be] text-[#31b1be]' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Lịch Chiếu & Đặt Ghế
          </button>
          <button
            onClick={() => setActiveTab('thongTin')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition cursor-pointer border-b-2 bg-transparent border-0 ${
              activeTab === 'thongTin' 
                ? 'border-[#31b1be] text-[#31b1be]' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Thông Tin Chi Tiết
          </button>
        </div>

        <div className="py-8">
          <AnimatePresence mode="wait">
            
            {/* THẺ TAB 1: LỊCH CHIẾU PHIM */}
            {activeTab === 'lichChieu' && (
              <motion.div
                key="tab_schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3.5">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#31b1be] block">
                    Bước 1: Lọc Ngày Đặt Vé
                  </span>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {availableDates.map((dateObj) => {
                      const displayIsSelected = selectedDate === dateObj.value;
                      return (
                        <button
                          key={dateObj.value}
                          onClick={() => setSelectedDate(dateObj.value)}
                          className={`py-3.5 px-5.5 rounded-xl text-center leading-none transition border cursor-pointer min-w-[100px] ${
                            displayIsSelected
                              ? 'bg-[#31b1be] border-[#31b1be] text-white font-extrabold shadow-md scale-105'
                              : 'bg-white hover:bg-gray-50 border-gray-200 text-slate-600'
                          }`}
                        >
                          <div className={`text-[9px] font-mono font-bold uppercase tracking-wider mb-1 ${displayIsSelected ? 'opacity-90' : 'text-slate-400'}`}>
                            {dateObj.label}
                          </div>
                          <div className={`text-sm font-black font-mono ${displayIsSelected ? 'text-white' : 'text-slate-800'}`}>
                            {dateObj.subLabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 mb-2">
                    Các Rạp Đang Chiếu {selectedDate && `Vào Ngày ${selectedDate}`}
                  </h3>

                  {movie.tinhTrang !== 'DANG_CHIEU' ? (
                    <div className="bg-white p-10 rounded-2xl text-center border border-gray-200 shadow-sm">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h4 className="font-bold text-slate-800 text-sm">Phim Chưa Khởi Chiếu</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Tác phẩm dự kiến sắp ra mắt. Hệ thống bán vé trực tuyến sẽ tự động kích hoạt trước ngày khởi chiếu 3 ngày.
                      </p>
                    </div>
                  ) : !hasShowtimesOnSelectedDate ? (
                    <div className="bg-white p-10 rounded-2xl text-center border border-gray-200 shadow-sm">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h4 className="font-bold text-slate-800 text-sm uppercase">Không có suất chiếu</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Phim này hiện không có suất chiếu vào ngày bạn chọn hoặc các suất chiếu đã diễn ra trong quá khứ.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {rapList.map((rap) => {
                        const suits = getShowtimesForRapAndDate(rap.id, selectedDate);
                        if(suits.length === 0) return null;

                        return (
                          <div 
                            key={rap.id}
                            className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm text-left transition hover:shadow-md hover:border-[#31b1be]/40"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1.5 text-[#31b1be]">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <strong className="font-bold text-sm text-slate-900">{rap.name}</strong>
                              </div>
                              <p className="text-[10px] text-slate-500 pl-5">{rap.address}</p>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                              <div className="flex flex-wrap gap-2.5">
                                {suits.map((s) => (
                                  <button
                                    key={s.id}
                                    onClick={() => handleSelectShowtime(s)}
                                    className="py-2.5 px-4 bg-white border border-gray-300 hover:border-[#31b1be] hover:bg-[#31b1be]/5 text-slate-800 font-extrabold text-xs rounded-lg transition duration-150 cursor-pointer font-mono flex flex-col items-center space-y-0.5 shadow-sm active:scale-95 group"
                                  >
                                    <span className="text-sm group-hover:text-[#31b1be]">{s.gioChieu}</span>
                                    <span className="text-[8px] text-slate-400 font-black uppercase">
                                      {s.phongChieu}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </motion.div>
            )}

            {/* THÈ TAB 2: THÔNG TIN CHI TIẾT SẢN PHẨM */}
            {activeTab === 'thongTin' && (
              <motion.div
                key="tab_info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left"
              >
                
                <div className="md:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
                  <h4 className="text-slate-900 text-sm font-bold uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center">
                    <Info className="w-4 h-4 text-[#31b1be] mr-1.5" />
                    <span>Tóm tắt cốt truyện</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-semibold text-justify">
                    {movie.moTa}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
                  <h4 className="text-slate-900 text-sm font-bold uppercase tracking-wider pb-2 border-b border-gray-100">Chỉ Số Sản Xuất</h4>
                  
                  <div className="space-y-3 font-semibold">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Đạo diễn:</span>
                      <span className="text-slate-900 text-sm font-bold mt-1 block">{movie.daoDien}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Thể loai:</span>
                      <span className="text-[#31b1be] mt-1 block">{movie.theLoai}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Thời lượng:</span>
                      <span className="text-slate-900 mt-1 block">{movie.thoiLuong}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Phân hạng độ tuổi:</span>
                      <span className="text-slate-900 font-mono mt-1 inline-block px-2 py-0.5 bg-gray-100 rounded border border-gray-200 uppercase tracking-widest font-black">
                        {movie.phanLoai}
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      
      {/* MODAL XEM TRAILER CHẤT LƯỢNG */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 sm:p-6 z-50 pointer-events-auto"
          >
            <div className="absolute inset-0" onClick={() => setShowTrailer(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0b0b12] rounded-3xl overflow-hidden w-full max-w-4xl border border-white/10 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center bg-black/40 p-4 border-b border-white/5">
                <span className="text-xs font-black uppercase text-white font-display tracking-wider">
                  Trailer: {movie.tenPhim}
                </span>
                <button
                  onClick={() => setShowTrailer(false)}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full border-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={(movie.trailer ? movie.trailer.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/") : 'https://www.youtube.com/embed/73_1biUGHeI') + "?autoplay=1"}
                  title={`Trailer: ${movie.tenPhim}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}