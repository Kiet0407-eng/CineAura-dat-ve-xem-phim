import React, { useState, useEffect } from 'react';
import { 
  Play, Sparkles, Star, Calendar, Ticket, ChevronRight, Flame, ChevronLeft, 
  Facebook, Instagram, Youtube, Smartphone, Award /* <-- Đã bổ sung import Award tại đây */
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GridDivider from '../components/GridDivider';

export default function TrangChu() {
  const navigate = useNavigate();
  const [danhSachPhim, setDanhSachPhim] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  
  const [activeTab, setActiveTab] = useState('DANG_CHIEU'); 
  const [heroIndex, setHeroIndex] = useState(0);

  // Dữ liệu giả lập cho phần Tin tức & Ưu đãi
  const tinTucUuDai = [
    {
      id: 1,
      title: 'CHÍNH THỨC NÂNG CẤP DIỆN MẠO WEBSITE CINEAURA PREMIUM',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'HƯỚNG DẪN LỐI VÀO KHU VỰC GIỮ XE CINEAURA CINEMA',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'DANH SÁCH NHỮNG BỘ PHIM HOT THÁNG ĐÁNG XEM NHẤT',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 4,
      title: 'NHỮNG CHI TIẾT ẤN TƯỢNG CỦA THÁM TỬ LỪNG DANH CONAN MOVIE',
      image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?auto=format&fit=crop&q=80&w=600'
    }
  ];

  useEffect(() => {
    fetch('http://localhost:8080/cineaura-backend/api/movies.php')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          id: String(item.id),
          tenPhim: item.title,
          moTa: item.description || 'Hồ sơ phim điện ảnh bom tấn chất lượng đỉnh cao của rạp phim CineAura Premium.',
          poster: item.poster_url,
          banner: item.poster_url, 
          thoiLuong: `${item.duration} phút`,
          theLoai: item.genre || 'Hành động, IMAX',
          tinhTrang: item.status === 'NOW_SHOWING' ? 'DANG_CHIEU' : 'SAP_CHIEU',
          phanLoai: 'T16', 
          dinhDang: 'IMAX 3D',
          rating: 9.2, 
          daoDien: 'James Cameron',
          trailer: item.trailer_url
        }));
        setDanhSachPhim(formattedData);
      })
      .catch(err => console.error("Lỗi tải phim:", err));
  }, []);

  const dangChieu = danhSachPhim.filter((p) => p.tinhTrang === 'DANG_CHIEU');
  const sapChieu = danhSachPhim.filter((p) => p.tinhTrang === 'SAP_CHIEU');
  const itemsToDisplay = activeTab === 'DANG_CHIEU' ? dangChieu : sapChieu;

  useEffect(() => {
    if (dangChieu.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % dangChieu.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [dangChieu.length]);

  const activeHero = dangChieu[heroIndex] || dangChieu[0];

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

  return (
    <div className="text-slate-800 bg-[#f3f4f7] min-h-screen font-sans text-left flex flex-col">
      
      {/* KHU VỰC NỘI DUNG CHÍNH */}
      <div className="flex-grow space-y-12 pb-16">
        
        {activeHero && (
          <section className="relative h-[65vh] sm:h-[75vh] w-full overflow-hidden select-none bg-[#111]">
            {dangChieu.map((phim, idx) => (
              <div
                key={`bg-${phim.id}`}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out transform scale-105 ${
                  heroIndex === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                }`}
                style={{ backgroundImage: `url("${phim.banner}")` }}
              />
            ))}

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#f8f9fc] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-full sm:w-1/2 z-10 bg-gradient-to-r from-black/80 sm:from-black/60 via-black/20 to-transparent pointer-events-none" />

            <div key={`info-${activeHero.id}`} className="absolute inset-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 text-white text-left animate-fade-in">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#31b1be]/20 border border-[#31b1be]/30 text-[#31b1be] rounded-full text-[10px] font-bold uppercase tracking-widest font-mono">
                  <Sparkles className="w-3 h-3 text-[#31b1be] animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Bắp Nước Phân Hạng VIP • Đặt Vé Hôm Nay</span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-6xl text-white tracking-tight leading-none drop-shadow-xl">
                  {activeHero.tenPhim}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs text-gray-200">
                  <span className={`px-2.5 py-0.5 rounded font-black font-mono text-[10.5px] ${getRatingStyle(activeHero.phanLoai)}`}>{activeHero.phanLoai}</span>
                  <span className="px-2.5 py-0.5 bg-white/10 rounded font-bold font-mono text-[10px]">{activeHero.dinhDang}</span>
                  <span className="flex items-center space-x-1"><Star className="w-3.5 h-3.5 fill-[#dfa112] text-[#dfa112]" /><strong className="text-white font-mono">{activeHero.rating}</strong></span>
                  <span className="text-gray-500">•</span>
                  <span className="font-semibold">{activeHero.theLoai}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl line-clamp-3 drop-shadow">
                  "{activeHero.moTa}"
                </p>
                
                <div className="flex items-center space-x-3 pt-4 sm:pt-6">
                  <Link to={`/phim/${activeHero.id}`} className="px-5 py-3 bg-[#31b1be] hover:bg-[#208a95] text-white font-black rounded-lg text-xs tracking-wider uppercase transition-all duration-150 flex items-center space-x-2 shadow-lg cursor-pointer border-0">
                    <Ticket className="w-4 h-4 text-white" />
                    <span>Mua Vé Ngay</span>
                  </Link>
                  <button 
                    onClick={() => setSelectedTrailer(activeHero.trailer || "https://www.youtube.com/embed/73_1biUGHeI")} 
                    className="px-4.5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-bold text-white tracking-wider uppercase transition-all flex items-center space-x-2 cursor-pointer bg-transparent"
                  >
                    <Play className="w-4 h-4 text-[#31b1be] fill-[#31b1be]" />
                    <span>Xem Trailer</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute right-0 left-0 bottom-4 sm:bottom-6 z-30 flex justify-center items-center space-x-2">
              {dangChieu.map((_, idx) => (
                <button key={idx} onClick={() => setHeroIndex(idx)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border-0 cursor-pointer ${heroIndex === idx ? 'bg-[#31b1be] px-3.5' : 'bg-gray-400'}`} />
              ))}
            </div>

            <button onClick={() => setHeroIndex((prev) => (prev - 1 + dangChieu.length) % dangChieu.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-[#31b1be] text-white flex items-center justify-center transition border-0 cursor-pointer hidden sm:flex">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setHeroIndex((prev) => (prev + 1) % dangChieu.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-[#31b1be] text-white flex items-center justify-center transition border-0 cursor-pointer hidden sm:flex">
              <ChevronRight className="w-5 h-5" />
            </button>
          </section>
        )}

        {/* SECTION CHỌN PHIM ĐANG CHIẾU / SẮP CHIẾU */}
        <section className="w-full">
          <GridDivider>
            <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center p-1 sm:p-1.5 space-x-1 sm:space-x-3 text-black">
              <button
                onClick={() => setActiveTab('DANG_CHIEU')}
                className={`px-4 sm:px-6 py-2 rounded-md text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all duration-150 border-0 cursor-pointer ${activeTab === 'DANG_CHIEU' ? 'bg-black text-white' : 'bg-transparent text-slate-500 hover:text-black'}`}
              >
                PHIM ĐANG CHIẾU
              </button>
              <span className="text-gray-300 font-bold">✶</span>
              <button
                onClick={() => setActiveTab('SAP_CHIEU')}
                className={`px-4 sm:px-6 py-2 rounded-md text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all duration-150 border-0 cursor-pointer ${activeTab === 'SAP_CHIEU' ? 'bg-black text-white' : 'bg-transparent text-slate-500 hover:text-black'}`}
              >
                PHIM SẮP CHIẾU
              </button>
            </div>
          </GridDivider>
        </section>

        {/* DANH SÁCH PHIM */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
            <div>
              <div className="flex items-center space-x-1.5 text-[#31b1be]"><Flame className="w-4 h-4 animate-pulse fill-[#31b1be]" /><span className="text-[10px] uppercase tracking-widest font-extrabold font-mono">HÔM NAY {new Date().getDate()}/0{new Date().getMonth() + 1}</span></div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-1">{activeTab === 'DANG_CHIEU' ? 'DANH SÁCH PHIM ĐANG CHIẾU CHÍNH THỨC' : 'PHIM BOM TẤN CHỜ KHỞI CHIẾU SỚM'}</h2>
            </div>
            <Link to="/suat-chieu-do-an" className="text-xs font-black tracking-wider text-[#31b1be] hover:text-[#1d747d] transition flex items-center space-x-1 border border-[#31b1be]/30 px-3 py-1.5 rounded-full bg-white shadow-sm">
              <span>XEM LỊCH CHIẾU</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {itemsToDisplay.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200"><h3 className="text-gray-500 font-bold uppercase tracking-widest">Hiện chưa có phim nào trong mục này.</h3></div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {itemsToDisplay.map((phim) => (
              <div 
                key={phim.id}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#31b1be]/40 flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4.2] overflow-hidden bg-gray-100 shrink-0 select-none">
                  <img src={phim.poster} alt={phim.tenPhim} className="w-full h-full object-cover group-hover:scale-103 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                  <span className={`absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-md border border-white/10 ${getRatingStyle(phim.phanLoai)}`}>{phim.phanLoai}</span>
                  <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.2 py-0.5 bg-black/60 backdrop-blur rounded-full text-[9px] font-mono font-bold text-white border border-white/5 shadow-md"><Star className="w-3 h-3 fill-[#dfa112] text-[#dfa112]" /><span>{phim.rating}</span></div>
                  
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-[10px] text-[#31b1be] uppercase tracking-widest font-black mb-1">ĐẠO DIỄN: {phim.daoDien}</p>
                      <p className="text-[11px] text-gray-300 leading-tight line-clamp-3 mb-4">{phim.moTa}</p>
                      <button onClick={() => navigate(`/phim/${phim.id}`)} className="w-full py-2.5 bg-[#31b1be] hover:bg-[#208a95] text-white text-center text-[10px] font-black rounded-lg uppercase tracking-wider transition duration-100 cursor-pointer border-0 shadow-md">XEM CHI TIẾT & LỊCH CHIẾU</button>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-1 bg-white cursor-pointer" onClick={() => navigate(`/phim/${phim.id}`)}>
                  <div>
                    <h3 className="font-display font-black text-xs sm:text-sm text-[#18181b] group-hover:text-[#31b1be] transition uppercase tracking-tighter leading-tight line-clamp-1">{phim.tenPhim}</h3>
                    <p className="text-[10px] text-slate-500 truncate leading-relaxed mt-1 font-medium">{phim.theLoai}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400 font-medium"><span>{phim.thoiLuong}</span><span className="font-mono text-[10px] text-slate-500 bg-gray-100 px-1.5 py-0.5 rounded font-black">{phim.dinhDang}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION TIN TỨC & ƯU ĐÃI */}
        <section className="w-full mt-10">
          <GridDivider>
            <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] px-6 py-2.5">
              <h2 className="text-sm sm:text-base font-black tracking-widest uppercase text-black">TIN TỨC & ƯU ĐÃI</h2>
            </div>
          </GridDivider>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {tinTucUuDai.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-[#31b1be] transition">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="mt-auto">
        <div 
          className="w-full h-8 bg-[#222]" 
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: `40px 100%, 10px 50%`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom'
          }}
        />
        
        <footer className="bg-[#222] text-gray-300 pt-12 pb-8 text-xs font-medium border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Cột 1 */}
            <div className="space-y-4 text-left">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Về CineAura</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-[#31b1be] transition">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-[#31b1be] transition">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-[#31b1be] transition">FAQs</a></li>
                <li><a href="#" className="hover:text-[#31b1be] transition">Liên hệ quảng cáo</a></li>
              </ul>
            </div>
            
            {/* Cột 2 */}
            <div className="space-y-4 text-left">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Điều khoản sử dụng</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-[#31b1be] transition">Điều khoản chung</a></li>
                <li><a href="#" className="hover:text-[#31b1be] transition">Chính Sách Thanh Toán</a></li>
                <li><a href="#" className="hover:text-[#31b1be] transition">Chính Sách Thành Viên</a></li>
                <li><a href="#" className="hover:text-[#31b1be] transition">Điều Khoản và Điều Kiện</a></li>
              </ul>
            </div>

            {/* Cột 3 */}
            <div className="space-y-4 text-left">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Chăm sóc khách hàng</h4>
              <ul className="space-y-2.5">
                <li>Hotline: <strong className="text-white">0236 3630 689</strong></li>
                <li>Giờ làm việc: <strong className="text-white">Từ 8h00 mỗi ngày</strong></li>
                <li>Email hỗ trợ: <strong className="text-white">contact@cineaura.vn</strong></li>
              </ul>
            </div>

            {/* Cột 4 */}
            <div className="space-y-4 text-left">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Kết nối với chúng tôi</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Youtube className="w-5 h-5" /></a>
              </div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 mt-4">Tải ứng dụng đặt vé</h4>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-1 border border-gray-600 rounded p-1.5 hover:bg-white/10 transition cursor-pointer">
                  <Smartphone className="w-4 h-4" />
                  <div className="text-left leading-tight">
                    <div className="text-[8px] text-gray-400">GET IT ON</div>
                    <div className="text-[10px] text-white font-bold">Google Play</div>
                  </div>
                </button>
                <button className="flex items-center space-x-1 border border-gray-600 rounded p-1.5 hover:bg-white/10 transition cursor-pointer">
                  <Award className="w-4 h-4" />
                  <div className="text-left leading-tight">
                    <div className="text-[8px] text-gray-400">Download on the</div>
                    <div className="text-[10px] text-white font-bold">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 border-t border-white/10 text-[10px] text-gray-500 space-y-1">
            <p>Tên Doanh Nghiệp: <strong className="text-gray-400">Công Ty TNHH CineAura Premium.</strong></p>
            <p>Giấy CNĐKKD: 0400668112 - Ngày cấp: 05/11/2008. Đăng ký thay đổi lần thứ 20 ngày 12/11/2026</p>
          </div>
        </footer>
      </div>

      {/* MODAL POPUP TRAILER */}
      {selectedTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="bg-white border-2 border-black rounded-xl max-w-4xl w-full overflow-hidden p-1 relative shadow-2xl">
            <button onClick={() => setSelectedTrailer(null)} className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white cursor-pointer z-10 border border-white/20 flex items-center justify-center w-8 h-8 font-black transition">✕</button>
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
              <iframe 
                src={(selectedTrailer ? selectedTrailer.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/") : 'https://www.youtube.com/embed/73_1biUGHeI') + "?autoplay=1"} 
                title="Trailer" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen 
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}