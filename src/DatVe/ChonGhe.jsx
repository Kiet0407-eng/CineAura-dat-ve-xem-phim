import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, Video, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

export default function ChonGhe() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingState = location.state || {};
  const selectedMovie = bookingState.movie;
  const selectedShowtime = bookingState.showtime;

  if (!selectedMovie || !selectedShowtime) {
     return (
        <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-red-500 mb-4">Dữ liệu suất chiếu không tồn tại</h3>
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#dfa112] text-black font-bold rounded-xl cursor-pointer border-0">Về trang chủ</button>
        </div>
     );
  }

  const hangGhe = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const soGheMoiHang = 12;

  // QUY ĐỊNH LOGIC PHÂN LOẠI GHẾ
  const laGheVIP = (hang, so) => {
    return ['C', 'D', 'E'].includes(hang) && so >= 3 && so <= 10;
  };
  const laGheDoi = (hang) => {
    return hang === 'G'; // Toàn bộ hàng G cuối cùng sẽ là Ghế Đôi (Sweetbox)
  };

  const [gheDangChon, setGheDangChon] = useState(new Set());
  const [gheDaDat, setGheDaDat] = useState(new Set());
  
  // Lưu bảng giá phụ thu từ CSDL
  const [bangGiaPhuThu, setBangGiaPhuThu] = useState({ VIP: 40000, SWEETBOX: 90000 });

  useEffect(() => {
    // 1. Lấy danh sách ghế đã đặt
    fetch(`http://localhost:8080/cineaura-backend/api/get_booked_seats.php?showtime_id=${selectedShowtime.id}`)
      .then(res => res.json())
      .then(data => setGheDaDat(new Set(data)))
      .catch(err => console.error("Lỗi tải ghế:", err));

    // 2. Lấy bảng giá cấu hình phụ thu loại ghế từ MySQL
    fetch('http://localhost:8080/cineaura-backend/api/seat_types.php')
      .then(res => res.json())
      .then(data => {
        const giaMoi = { VIP: 40000, SWEETBOX: 90000 };
        data.forEach(type => {
          if (type.id === 'VIP') giaMoi.VIP = type.phuThu;
          if (type.id === 'SWEETBOX') giaMoi.SWEETBOX = type.phuThu;
        });
        setBangGiaPhuThu(giaMoi);
      })
      .catch(err => console.error("Lỗi tải bảng giá loại ghế:", err));
  }, [selectedShowtime.id]);

  const handleToggleGhe = (seatId) => {
    if (gheDaDat.has(seatId)) return;

    setGheDangChon(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(seatId)) {
        newSelection.delete(seatId);
      } else {
        if (newSelection.size >= 8) {
          alert('Đặc quyền CineAura: Quý khách chỉ có thể đặt tối đa 8 ghế trong một giao dịch.');
          return prev;
        }
        newSelection.add(seatId);
      }
      return newSelection;
    });
  };

  // TÍNH TOÁN GIÁ TIỀN GHẾ DỰA TRÊN BẢNG GIÁ TỪ MYSQL
  const tinhGiaGhe = (seatId) => {
    const [hang, soStr] = seatId.split('-');
    const so = parseInt(soStr, 10);
    const giaGoc = parseFloat(selectedShowtime.giaGhe) || 120000;
    
    if (laGheDoi(hang)) return giaGoc + bangGiaPhuThu.SWEETBOX;
    if (laGheVIP(hang, so)) return giaGoc + bangGiaPhuThu.VIP; 
    return giaGoc;
  };

  const tongTienTamTinh = Array.from(gheDangChon).reduce((sum, seatId) => {
    return sum + tinhGiaGhe(seatId);
  }, 0);

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  const handleTiepTucChonDoAn = () => {
    if (gheDangChon.size === 0) {
      alert('Vui lòng chọn ít nhất một ghế ngồi để tiếp tục hành trình.');
      return;
    }

    const selectedSeatList = Array.from(gheDangChon).map(seatId => {
      const [hang, so] = seatId.split('-');
      let type = 'Thường';
      if (laGheVIP(hang, so)) type = 'VIP';
      if (laGheDoi(hang)) type = 'Sweetbox';

      return {
        id: seatId,
        label: `${hang}${so} (${type})`, // Gắn thêm Loại vào nhãn để hiển thị ở Bill
        gia: tinhGiaGhe(seatId)
      };
    });

    navigate('/dat-ve/chon-do-an', {
      state: {
        movie: selectedMovie,
        showtime: selectedShowtime,
        seats: selectedSeatList,
        totalTicketPrice: tongTienTamTinh
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050508] font-sans text-gray-100 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition duration-150 cursor-pointer border-0"><ChevronLeft className="w-5 h-5" /></button>
            <div>
              <span className="text-[10px] bg-brand-amber/10 border border-brand-amber/20 text-[#dfa112] px-2.5 py-1 rounded font-mono font-bold uppercase tracking-widest">Bước 1: Chọn Chỗ Ngồi VIP</span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 uppercase tracking-tight font-display">Sơ đồ rạp hàng hiệu</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 bg-[#111115] border border-white/5 p-3 rounded-2xl max-w-md">
            <img src={selectedMovie.poster} alt="" className="w-10 h-14 object-cover rounded-lg border border-white/10 shrink-0" referrerPolicy="no-referrer" />
            <div className="text-xs">
              <strong className="text-white line-clamp-1 text-sm font-semibold">{selectedMovie.tenPhim}</strong>
              <div className="flex space-x-3 text-gray-400 mt-1 font-mono text-[10px]">
                <span>{selectedShowtime.gioChieu}</span><span>•</span><span>{selectedShowtime.phongChieu}</span><span>•</span><span className="text-[#dfa112] font-bold">{selectedMovie.dinhDang}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center py-8 px-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#dfa112]/5 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[640px] text-center mb-16 relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-[0.3em] uppercase text-gray-600 font-extrabold flex items-center gap-1.5 z-10"><Video className="w-4 h-4 text-[#dfa112] animate-pulse" />MÀN HÌNH CHIẾU CINEAURA</div>
          <div className="h-4.5 bg-gradient-to-b from-[#dfa112] via-[#dfa112]/50 to-transparent opacity-95 rounded-[50%] blur-sm pointer-events-none shadow-[0_-5px_30px_rgba(223,161,18,0.4)]" />
          <div className="h-[2px] bg-[#dfa112]/85 w-full mx-auto shadow-md rounded-[50%]" />
          <div className="w-[85%] mx-auto h-24 bg-gradient-to-b from-[#dfa112]/[0.12] to-transparent rounded-[50%] filter blur-xl pointer-events-none -mt-1" />
        </div>

        <div className="w-full max-w-3xl select-none text-center">
          <div className="grid gap-3.5">
            {hangGhe.map((hang) => (
              <div key={hang} className="flex items-center justify-center space-x-3">
                <span className="w-6 text-[11px] font-black text-gray-600 font-mono text-center">{hang}</span>
                <div className="flex space-x-2 sm:space-x-2.5">
                  {Array.from({ length: soGheMoiHang }).map((_, index) => {
                    const soGhe = index + 1;
                    const seatId = `${hang}-${soGhe}`;
                    const isOccupied = gheDaDat.has(seatId);
                    const isSelect = gheDangChon.has(seatId);
                    const isVip = laGheVIP(hang, soGhe);
                    const isDoi = laGheDoi(hang);

                    let seatStyle = "border border-white/10 hover:border-white/30 text-gray-400 hover:text-white bg-black/40";
                    let buttonWidth = "w-6.5 sm:w-7.5"; // Độ rộng mặc định

                    if (isOccupied) {
                      seatStyle = "bg-white/5 border border-transparent text-gray-700 cursor-not-allowed";
                    } else if (isSelect) {
                      seatStyle = "bg-[#dfa112] text-black border-[#dfa112] font-extrabold shadow-lg shadow-[#dfa112]/20 scale-[1.05]";
                    } else if (isDoi) {
                      // Style riêng cho Ghế đôi (Màu Hồng) và RỘNG HƠN
                      seatStyle = "border-2 border-pink-500/60 text-pink-400 bg-pink-500/10 hover:bg-pink-500/30 hover:border-pink-500 hover:text-white";
                      buttonWidth = "w-[60px] sm:w-[70px]"; // Ghế đôi dài gấp đôi
                    } else if (isVip) {
                      // Style cho Ghế VIP (Màu Đỏ)
                      seatStyle = "border-2 border-red-600/60 text-red-500 bg-red-500/5 hover:bg-red-500/20 hover:border-red-500 hover:text-white";
                    }

                    // Vì ghế đôi tốn 2 chỗ, ta sẽ bỏ qua các số chẵn ở hàng G để tạo thành 1 block lớn
                    if (isDoi && soGhe % 2 === 0) return null; 
                    const displayLabel = isDoi ? `${hang}${soGhe}-${hang}${soGhe+1}` : soGhe;

                    return (
                      <motion.button 
                        key={seatId} 
                        whileHover={!isOccupied ? { scale: 1.15 } : {}} 
                        whileTap={!isOccupied ? { scale: 0.93 } : {}} 
                        onClick={() => {
                          if (isDoi) {
                             handleToggleGhe(`${hang}-${soGhe}`); // Ghế đôi vẫn lưu 1 ID đại diện
                          } else {
                             handleToggleGhe(seatId);
                          }
                        }} 
                        disabled={isOccupied} 
                        className={`${buttonWidth} h-6.5 sm:h-7.5 rounded text-[8px] sm:text-[9.5px] font-mono font-bold flex items-center justify-center transition-colors cursor-pointer relative border-0 ${seatStyle}`} 
                        title={isDoi ? `Ghế Đôi ${displayLabel}` : `${hang}${soGhe}`}
                      >
                        {isOccupied ? '•' : displayLabel}
                      </motion.button>
                    );
                  })}
                </div>
                <span className="w-6 text-[11px] font-black text-gray-600 font-mono text-center">{hang}</span>
              </div>
            ))}
          </div>

          {/* CHÚ THÍCH (LEGEND) CẬP NHẬT */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8 mt-12 bg-[#111115] border border-white/5 py-4 px-6 rounded-2xl max-w-2xl mx-auto text-[11px] font-semibold text-gray-400">
            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded border border-white/15 bg-black/40" /><span>Ghế thường</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded border-2 border-red-600/60 bg-red-500/5" /><span>Ghế VIP</span></div>
            <div className="flex items-center space-x-2"><div className="w-8 h-4 rounded border-2 border-pink-500/60 bg-pink-500/10" /><span>Ghế Đôi (Sweetbox)</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-[#dfa112] shadow shadow-[#dfa112]/30" /><span className="text-white">Đang chọn</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-white/5 border border-transparent text-gray-700 flex items-center justify-center font-mono font-bold text-[8px]">•</div><span>Đã bán</span></div>
          </div>
        </div>
      </div>

      <div className="h-[120px] shrink-0" />

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#07070d]/95 backdrop-blur-md border-t border-white/10 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5.5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#dfa112]/10 border border-[#dfa112]/20 rounded-xl flex items-center justify-center text-[#dfa112]"><Ticket className="w-6 h-6 shrink-0" /></div>
            <div>
              <h4 className="font-display font-black text-white text-base tracking-tight leading-none uppercase">{selectedMovie.tenPhim}</h4>
              <p className="text-[11px] text-gray-400 mt-1 font-mono leading-relaxed">Suất: <strong className="text-white">{selectedShowtime.gioChieu}</strong> | Ngày: <strong className="text-white">{selectedShowtime.ngayChieu}</strong></p>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-6">
            <div className="text-left md:text-right">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Tạm tính:</span>
              <p className="text-lg font-black font-mono text-[#dfa112] tracking-tight mt-0.5">{formatVND(tongTienTamTinh)}</p>
            </div>
            <button onClick={handleTiepTucChonDoAn} disabled={gheDangChon.size === 0} className={`py-3.5 px-7 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 border-0 cursor-pointer ${gheDangChon.size > 0 ? 'bg-[#dfa112] hover:bg-[#c9900c] text-black' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}>
              <span>Tiếp Tục Chọn Đồ Ăn</span><Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 