import React, { useState, useEffect } from 'react';
import { Play, Clock, Star, Flame, ChevronRight, Calendar, Ticket, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function DanhSachPhim() {
  const navigate = useNavigate();
  const [danhSachPhim, setDanhSachPhim] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  
  const [activeTab, setActiveTab] = useState('DANG_CHIEU');
  // THÊM STATE ĐỂ QUẢN LÝ POPUP TRAILER
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch('http://localhost:8080/cineaura-backend/api/movies.php')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map(phim => {
          let ngayKhoiChieu = 'Đang cập nhật';
          if (phim.release_date) {
            const [y, m, d] = phim.release_date.split('-');
            ngayKhoiChieu = `${d}/${m}/${y}`;
          }

          return {
            ...phim,
            status: phim.status === 'NOW_SHOWING' ? 'DANG_CHIEU' : 'SAP_CHIEU',
            rating: (Math.random() * (9.5 - 7.5) + 7.5).toFixed(1),
            phanLoai: 'T16',
            ngayKhoiChieuUI: ngayKhoiChieu 
          };
        });
        
        setDanhSachPhim(formattedData);
        setDangTai(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setDangTai(false);
      });
  }, []);

  const phimHienThi = danhSachPhim.filter(phim => phim.status === activeTab);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const getAgeRatingBadge = (phanLoai) => {
    switch (phanLoai) {
      case 'P': return 'bg-emerald-600 text-white';
      case 'K': return 'bg-cyan-600 text-white';
      case 'T13': return 'bg-amber-500 text-white';
      case 'T16': return 'bg-orange-500 text-white';
      case 'T18': return 'bg-rose-600 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-800 pb-24 font-sans text-left">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200 mb-8 mt-8 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight">
            Danh Sách Phim
          </h1>
          <button onClick={() => setActiveTab('DANG_CHIEU')} className="text-[#31b1be] hover:text-[#208a95] text-xs font-black flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0 font-mono uppercase tracking-wider">
            Xem Tất Cả <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex justify-center mb-10 relative z-10 px-4">
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-1.5 flex flex-wrap items-center justify-center gap-1 sm:gap-2 shadow-sm">
          <button
            onClick={() => setActiveTab('DANG_CHIEU')}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all duration-200 border-0 cursor-pointer flex items-center space-x-2 ${
              activeTab === 'DANG_CHIEU' 
                ? 'bg-[#31b1be] text-white shadow-md' 
                : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Ticket className="w-4 h-4 shrink-0" />
            <span>ĐANG CHIẾU</span>
          </button>
          <button
            onClick={() => setActiveTab('SAP_CHIEU')}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all duration-200 border-0 cursor-pointer flex items-center space-x-2 ${
              activeTab === 'SAP_CHIEU' 
                ? 'bg-[#31b1be] text-white shadow-md' 
                : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>SẮP CHIẾU</span>
          </button>
        </div>
      </div>

      {/* MAIN MOVIE GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {dangTai ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#31b1be] rounded-full animate-spin" />
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest animate-pulse">Đang đồng bộ dữ liệu phim...</p>
          </div>
        ) : phimHienThi.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm">Chưa có phim nào trong mục này</h3>
            <p className="text-xs text-slate-400 mt-2">Vui lòng quay lại sau hoặc kiểm tra các mục khác.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6"
          >
            <AnimatePresence>
              {phimHienThi.map((phim) => (
                <motion.div 
                  variants={itemVariants}
                  key={phim.id} 
                  onClick={() => navigate(`/phim/${phim.id}`)}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#31b1be]/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg flex flex-col h-full"
                >
                  
                  {/* Image Container */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 shrink-0">
                    {phim.poster_url ? (
                      <img 
                        src={phim.poster_url} 
                        alt={phim.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-mono uppercase">Trống</div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Badges TOP */}
                    <div className="absolute top-2.5 w-full px-2.5 flex justify-between items-start z-10">
                      <span className={`px-2 py-0.5 backdrop-blur-sm text-[9px] font-black tracking-widest uppercase rounded shadow-sm border border-white/20 ${getAgeRatingBadge(phim.phanLoai)}`}>
                        {phim.phanLoai}
                      </span>
                      <div className="flex items-center space-x-1 px-2 py-1 bg-black/70 backdrop-blur-md rounded border border-white/10 shadow-sm">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-white font-mono">{phim.rating}</span>
                      </div>
                    </div>

                    {/* NÚT XEM TRAILER CHÍNH THỨC */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 z-10"
                      onClick={(e) => {
                        e.stopPropagation(); // Phép thuật chặn thẻ Cha chuyển trang
                        setSelectedTrailer(phim); // Mở Modal Trailer
                      }}
                    >
                      <div className="w-12 h-12 bg-[#31b1be]/90 hover:bg-[#31b1be] backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(49,177,190,0.5)] transition-colors">
                        <Play className="w-5 h-5 text-white ml-1 fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between relative z-10 bg-white">
                    <div className="space-y-1">
                      <h2 className="text-sm font-black text-slate-900 leading-tight uppercase group-hover:text-[#31b1be] transition-colors line-clamp-2" title={phim.title}>
                        {phim.title}
                      </h2>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{phim.genre || 'Hành động, Phiêu lưu'}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-3">
                      {activeTab === 'DANG_CHIEU' ? (
                        <>
                          <span className="text-[11px] text-slate-500 flex items-center font-mono font-bold">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-[#31b1be]" /> {phim.duration} phút
                          </span>
                          <span className="text-[11px] text-[#31b1be] hover:text-[#208a95] uppercase tracking-widest font-black flex items-center gap-1">
                            Đặt Vé <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] text-slate-500 flex items-center font-mono font-bold">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#dfa112]" /> {phim.ngayKhoiChieuUI}
                          </span>
                          <span className="text-[11px] text-[#dfa112] hover:text-[#b4820a] uppercase tracking-widest font-black flex items-center gap-1">
                            Chi Tiết <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* POPUP MODAL XEM TRAILER */}
      <AnimatePresence>
        {selectedTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 sm:p-6 z-[100] pointer-events-auto"
          >
            {/* Lớp nền trong suốt để click ra ngoài thì đóng */}
            <div className="absolute inset-0" onClick={() => setSelectedTrailer(null)} />
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0b0b12] rounded-3xl overflow-hidden w-full max-w-4xl border border-white/10 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center bg-black/40 p-4 border-b border-white/5">
                <span className="text-xs font-black uppercase text-white font-display tracking-wider">
                  Trailer: {selectedTrailer.title}
                </span>
                <button
                  onClick={() => setSelectedTrailer(null)}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full border-0 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                {/* Bạn có thể thay link youtube tĩnh này thành link động từ CSDL nếu có cột trailer_url */}
                <iframe
  src={
    selectedTrailer.trailer_url 
      ? selectedTrailer.trailer_url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1"
      : 'https://www.youtube.com/embed/73_1biUGHeI?autoplay=1'
  }
  title={`Trailer: ${selectedTrailer.title}`}
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