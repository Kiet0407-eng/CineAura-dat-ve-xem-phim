import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCineAura } from '../HeThong/QuanLyTrangThai';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { 
  CreditCard, Wallet, QrCode, Check, Loader2, CircleDollarSign, ShieldCheck, ShoppingBag, CalendarDays, ChevronLeft, Smartphone, Ticket, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ThanhToan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useCineAura();

  const bookingData = location.state || {};
  const { movie, showtime, seats, totalTicketPrice, selectedFoods } = bookingData;

  // Lấy danh sách đồ ăn từ ChonDoAn truyền sang
  const [doAnCart, setDoAnCart] = useState(selectedFoods || []);
  const tongTienDoAn = doAnCart.reduce((sum, item) => sum + (item.gia * item.soLuong), 0);
  const thanhTien = totalTicketPrice + tongTienDoAn;

  // STATE KHUYẾN MÃI
  const [danhSachKhuyenMai, setDanhSachKhuyenMai] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [giamGia, setGiamGia] = useState(0);
  const [promoError, setPromoError] = useState('');

  // LẤY DỮ LIỆU KHUYẾN MÃI TỪ MYSQL
  useEffect(() => {
    fetch('http://localhost:8080/cineaura-backend/api/promotions.php')
      .then(res => res.json())
      .then(data => setDanhSachKhuyenMai(data))
      .catch(err => console.error("Lỗi tải khuyến mãi:", err));
  }, []);

  if (!movie || !seats || seats.length === 0) {
    return (
      <div className="min-h-screen bg-[#050508] text-gray-300 flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red mb-4"><CircleDollarSign className="w-8 h-8" /></div>
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">Giao dịch không hợp lệ</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm">Không thấy dữ liệu giỏ hàng phim của quý khách. Xin vui lòng đặt vé từ trang chủ.</p>
        <button onClick={() => navigate('/')} className="mt-6 py-3 px-6 bg-[#31b1be] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#208a95] transition duration-150 cursor-pointer border-0">Quay lại Trang Chủ</button>
      </div>
    );
  }

  const apDungKhuyenMai = (codeToApply) => {
    setPromoError('');
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (!code) { setPromoError('Vui lòng nhập mã khuyến mãi!'); return; }

    const matchPr = danhSachKhuyenMai.find(p => p.code === code);
    
    if (!matchPr) {
      setPromoError('Mã khuyến mãi không tồn tại hoặc đã hết hạn.');
      setAppliedCode(''); setGiamGia(0); return;
    }

    if (thanhTien < matchPr.conditional_min) {
      setPromoError(`Mã này yêu cầu tổng đơn tối thiểu là ${formatVND(matchPr.conditional_min)}`);
      setAppliedCode(''); setGiamGia(0); return;
    }

    const calculatedDiscount = matchPr.loaiGiam === 'PERCENT' 
      ? Math.floor((thanhTien * matchPr.mucGiam) / 100) 
      : matchPr.mucGiam;
      
    setGiamGia(calculatedDiscount);
    setAppliedCode(code);
    setPromoCode(code);
    setPromoError('');
  };

  const xoaKhuyenMai = () => {
    setAppliedCode('');
    setGiamGia(0);
    setPromoCode('');
    setPromoError('');
  };

  const [phuongThuc, setPhuongThuc] = useState('ATM'); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastTicketCode, setLastTicketCode] = useState('');

  const formatVND = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);

  // Tỷ giá & Thành tiền USD cho PayPal
  const finalThanhTien = Math.max(0, thanhTien - giamGia);
  const exchangeRate = 25000; 
  const finalUSD = (finalThanhTien / exchangeRate).toFixed(2);

  const xuLyThanhToan = () => {
    if (phuongThuc === 'CINE_BALANCE' && (!currentUser || currentUser.soDu < finalThanhTien)) {
      alert(`Số dư Ví rạp CineAura của quý khách không đủ. Vui lòng nạp thêm tiền hoặc chọn phương thức khác.`);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('showtime_id', showtime.id);
    formData.append('total_price', finalThanhTien);
    formData.append('user_id', currentUser?.id || 1); 
    formData.append('seats', seats.map(s => s.id).join(','));
    formData.append('email', currentUser?.email || 'khach@gmail.com');
    formData.append('name', currentUser?.name || 'Khách Hàng');
    formData.append('movie_name', movie.tenPhim);

    fetch('http://localhost:8080/cineaura-backend/api/add_booking.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
         const maVeMoi = `CINE-${Math.floor(100000 + Math.random() * 900000)}`;
         setLastTicketCode(maVeMoi);
         setLoading(false);
         setSuccess(true);
      } else {
         alert("Thanh toán thất bại: " + data.message);
         setLoading(false);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Lỗi kết nối đến máy chủ thanh toán!");
      setLoading(false);
    });
  };

  return (
    // Đã thay đổi client-id thành 'test' để Bypass lỗi 400 Bad Request
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div className="min-h-screen bg-[#050508] font-sans text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center space-x-3 text-left">
            <button onClick={() => navigate(-1)} disabled={success} className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition duration-150 cursor-pointer border-0 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
            <div>
              <span className="text-[10px] bg-[#31b1be]/10 border border-[#31b1be]/30 text-[#31b1be] px-2.2 py-0.5 rounded font-mono font-bold uppercase tracking-widest">Bước 3: Hoàn tất hóa đơn</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase tracking-tight font-display">Thủ Tục Thanh Toán Cổng VIP</h1>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="checkout_form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="bg-[#0c0c13] border border-white/5 p-6 rounded-3xl space-y-6">
                    <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
                      <CreditCard className="w-5 h-5 text-amber-500" />
                      <div><h3 className="font-bold text-sm text-white">Lựa Chọn Hình Thức Thanh Toán</h3><p className="text-[10px] text-gray-500 mt-0.5">Yên tâm giao dịch qua hệ thống mã hóa bảo mật chuẩn 256-bit.</p></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <button type="button" onClick={() => setPhuongThuc('ATM')} className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition border-0 cursor-pointer ${phuongThuc === 'ATM' ? 'bg-[#31b1be] text-white font-extrabold shadow-lg shadow-[#31b1be]/10' : 'bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white border border-white/5'}`}><CreditCard className="w-5 h-5 mb-2 shrink-0" /><span className="text-[10px] font-bold uppercase tracking-wider font-mono">Thẻ ATM</span></button>
                      <button type="button" onClick={() => setPhuongThuc('PAYPAL')} className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition border-0 cursor-pointer ${phuongThuc === 'PAYPAL' ? 'bg-[#003087] text-white font-extrabold shadow-lg shadow-blue-900/30' : 'bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white border border-white/5'}`}><CircleDollarSign className="w-5 h-5 mb-2 shrink-0 text-blue-400" /><span className="text-[10px] font-bold uppercase tracking-wider font-mono">PayPal</span></button>
                      <button type="button" onClick={() => setPhuongThuc('MOMO')} className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition border-0 cursor-pointer ${phuongThuc === 'MOMO' ? 'bg-[#a50064] text-white font-extrabold shadow-lg shadow-pink-500/10' : 'bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white border border-white/5'}`}><Smartphone className="w-5 h-5 mb-2 shrink-0 text-pink-400" /><span className="text-[10px] font-bold uppercase tracking-wider font-mono">Ví MoMo</span></button>
                      <button type="button" onClick={() => setPhuongThuc('ZALOPAY')} className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition border-0 cursor-pointer ${phuongThuc === 'ZALOPAY' ? 'bg-[#0068ff] text-white font-extrabold shadow-lg shadow-blue-500/10' : 'bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white border border-white/5'}`}><QrCode className="w-5 h-5 mb-2 shrink-0 text-blue-400" /><span className="text-[10px] font-bold uppercase tracking-wider font-mono">ZaloPay</span></button>
                      <button type="button" onClick={() => setPhuongThuc('CINE_BALANCE')} className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition border-0 cursor-pointer ${phuongThuc === 'CINE_BALANCE' ? 'bg-amber-500 text-white font-extrabold shadow-lg shadow-amber-500/10 animate-pulse' : 'bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white border border-white/5'}`}><Wallet className="w-5 h-5 mb-2 shrink-0 text-amber-500" /><span className="text-[10px] font-bold uppercase tracking-wider font-mono">Ví Cine</span></button>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-5 border border-white/5 min-h-[140px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {phuongThuc === 'ATM' && (
                          <motion.div key="form_atm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4 text-xs font-semibold">
                            <p className="text-[10.5px] text-gray-400 leading-relaxed mb-1">Nhập thông tin thẻ quốc tế Visa / Mastercard hoặc thẻ nội địa Napas để hoàn tất thanh toán.</p>
                            <div className="space-y-1.5"><label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Số Thẻ Ngân Hàng *</label><input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-black/60 border border-white/10 focus:border-[#31b1be] py-2.5 px-3.5 rounded-xl text-white focus:outline-none font-mono" /></div>
                            <div className="grid grid-cols-3 gap-3.5"><div className="col-span-2 space-y-1.5"><label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Chủ Thẻ (Không dấu) *</label><input type="text" placeholder="NGUYEN VAN A" className="w-full bg-black/60 border border-white/10 focus:border-[#31b1be] py-2.5 px-3.5 rounded-xl text-white focus:outline-none uppercase font-mono" /></div><div className="space-y-1.5"><label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Hạn Dùng *</label><input type="text" placeholder="MM/YY" className="w-full bg-black/60 border border-white/10 focus:border-[#31b1be] py-2.5 px-3.5 rounded-xl text-white focus:outline-none text-center font-mono" /></div></div>
                          </motion.div>
                        )}

                        {phuongThuc === 'PAYPAL' && (
                          <motion.div key="form_paypal" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4 text-xs">
                            <h4 className="font-bold text-white text-sm flex items-center"><CircleDollarSign className="w-4 h-4 mr-1 text-blue-400"/> Cổng Thanh Toán Quốc Tế PayPal</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm">Hệ thống sẽ tự động quy đổi số tiền từ VNĐ sang USD để tương thích với hệ thống của PayPal.</p>
                            <div className="p-3 bg-[#003087]/10 rounded-xl border border-blue-500/20 inline-block">
                              <p className="text-gray-400 text-[10px] uppercase font-mono mb-1">Số tiền quy đổi (Tỷ giá: 1$ = 25.000đ)</p>
                              <strong className="text-blue-400 font-mono font-black text-lg block">{finalUSD} USD</strong>
                            </div>
                          </motion.div>
                        )}

                        {(phuongThuc === 'MOMO' || phuongThuc === 'ZALOPAY') && (
                          <motion.div key="form_qr" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-36 h-36 bg-white p-3.5 rounded-2xl relative shadow-lg shrink-0"><div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-1 relative overflow-hidden"><QrCode className="w-20 h-20 text-white stroke-[2]" /><span className="text-[8px] text-amber-500 font-mono font-black mt-2 tracking-widest">SCAN TO PAY</span></div></div>
                            <div className="space-y-2.5 text-xs"><h4 className="font-bold text-white text-sm">Quét mã QR để thanh toán nhanh</h4><p className="text-[10.5px] text-gray-400 leading-relaxed max-w-sm">Mở ứng dụng ví điện tử trên điện thoại di động của bạn, chọn tính năng quét ảnh QR Code để quét mã hiển thị bên trái.</p></div>
                          </motion.div>
                        )}

                        {phuongThuc === 'CINE_BALANCE' && (
                          <motion.div key="form_cine_balance" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3">
                            <h4 className="font-bold text-white text-sm">Thanh toán thông qua Tài Khoản CineAura</h4>
                            <div className="p-4 bg-black/60 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                              <div><p className="text-gray-500 text-[10px] uppercase font-mono">Số dư ví hiện tại:</p><strong className="text-amber-500 font-mono font-black text-base block mt-1">{formatVND(currentUser?.soDu || 0)}</strong></div>
                              <div className="text-right"><p className="text-gray-500 text-[10px] uppercase font-mono">Cần thanh toán:</p><strong className="text-white font-mono block mt-1 font-bold">{formatVND(finalThanhTien)}</strong></div>
                            </div>
                            {(!currentUser || currentUser?.soDu < finalThanhTien) ? (
                              <p className="text-[10.5px] text-rose-500 font-semibold leading-relaxed">* Số dư hiện tại không đủ. Quý khách có thể nạp thêm tiền tại Trang cá nhân hoặc đổi sang phương thức khác.</p>
                            ) : (
                              <div className="flex items-center space-x-2 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 p-2 rounded border border-emerald-500/10"><ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /><span>Đủ điều kiện thanh toán.</span></div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#0c0c13] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-7 relative overflow-hidden text-left">
                  <h3 className="font-display font-black text-white text-base uppercase tracking-tight pb-3.5 border-b border-white/5">Tóm Tắt Hóa Đơn</h3>
                  
                  <div className="flex items-start space-x-4">
                    <img src={movie.poster} alt="" className="w-16 h-22 object-cover rounded-xl border border-white/10 shadow-lg shrink-0" referrerPolicy="no-referrer" />
                    <div className="text-xs space-y-1.5"><h4 className="font-bold text-white text-sm tracking-tight leading-none uppercase">{movie.tenPhim}</h4><p className="text-[10px] text-gray-500 font-mono flex items-center"><CalendarDays className="w-3.5 h-3.5 text-amber-500 mr-1" /><span>{showtime.ngayChieu} • {showtime.gioChieu}</span></p></div>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-start text-xs"><span className="text-gray-400">Vé Xem Phim ({seats.length}):</span><div className="flex flex-wrap gap-1 justify-end max-w-[200px]">{seats.map(s => (<span key={s.id} className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[9.5px] font-black text-white font-mono">{s.label}</span>))}</div></div>
                    <div className="flex justify-between text-xs"><span className="text-gray-500">Giá vé tạm tính:</span><strong className="text-white font-mono">{formatVND(totalTicketPrice)}</strong></div>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold">Thực Đơn Đã Chọn:</span>
                      <button onClick={() => navigate(-1)} className="text-[9px] uppercase tracking-widest font-black text-[#31b1be] hover:text-white transition flex items-center space-x-1 border border-[#31b1be]/30 px-2 py-1 rounded bg-[#31b1be]/10 cursor-pointer">
                        <Plus className="w-3 h-3" /><span>Sửa/Thêm Combo</span>
                      </button>
                    </div>
                    
                    {doAnCart.filter(f => f.soLuong > 0).length === 0 ? (
                      <p className="text-[10px] text-gray-600 font-mono italic">Chưa chọn món ăn kèm nào.</p>
                    ) : (
                      <ul className="space-y-2">
                        {doAnCart.filter(f => f.soLuong > 0).map(item => (
                          <li key={item.id} className="flex justify-between text-xs text-gray-300">
                            <span>{item.soLuong}x {item.tenDoAn}</span>
                            <span className="font-mono">{formatVND(item.gia * item.soLuong)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {tongTienDoAn > 0 && (
                      <div className="flex justify-between text-xs mt-2"><span className="text-gray-500">Giá combo tạm tính:</span><strong className="text-white font-mono">{formatVND(tongTienDoAn)}</strong></div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono block text-left">Mã Khuyến Mãi (Tự động từ CSDL)</span>
                      
                      {danhSachKhuyenMai.length > 0 && !appliedCode && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {danhSachKhuyenMai.map(promo => (
                            <button 
                              key={promo.code} 
                              onClick={() => apDungKhuyenMai(promo.code)}
                              className="text-[9px] font-mono font-bold px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded cursor-pointer hover:bg-amber-500 hover:text-black transition"
                            >
                              {promo.code} (-{promo.loaiGiam === 'PERCENT' ? `${promo.mucGiam}%` : formatVND(promo.mucGiam)})
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input type="text" placeholder="Hoặc nhập mã..." value={promoCode} onChange={e => setPromoCode(e.target.value)} disabled={appliedCode} className="flex-grow bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:ring-0 focus:outline-none focus:border-[#31b1be] font-mono font-bold disabled:opacity-50" />
                        {!appliedCode ? (
                          <button type="button" onClick={() => apDungKhuyenMai()} className="px-4 py-2 bg-[#31b1be] text-white hover:bg-[#208a95] rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-0">Áp dụng</button>
                        ) : (
                          <button type="button" onClick={xoaKhuyenMai} className="px-4 py-2 bg-rose-500/20 text-rose-500 hover:bg-rose-500/40 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-0">Hủy</button>
                        )}
                      </div>
                      {promoError && <p className="text-[10px] text-rose-500 font-semibold">{promoError}</p>}
                      {appliedCode && <p className="text-[10px] text-emerald-500 font-semibold flex items-center"><Check className="w-3 h-3 mr-1" /> Áp dụng thành công mã {appliedCode}!</p>}
                    </div>

                    {giamGia > 0 && (
                      <div className="flex justify-between items-center text-emerald-400 text-xs">
                        <span>Được giảm giá:</span>
                        <strong className="font-mono">- {formatVND(giamGia)}</strong>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline pt-2"><div className="text-left"><span className="text-xs text-gray-400">Tổng cộng thành tiền:</span></div><strong className="text-xl sm:text-2xl font-black font-mono text-amber-500 tracking-tight">{formatVND(finalThanhTien)}</strong></div>

                    {/* VÙNG NÚT THANH TOÁN (PAYPAL HOẶC MẶC ĐỊNH) */}
                    <div className="mt-4 relative z-10">
                      {phuongThuc === 'PAYPAL' ? (
                        <PayPalButtons
                          style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [{ amount: { value: finalUSD } }],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                              // Gọi hàm xử lý lưu DB của bạn sau khi PayPal trừ tiền thành công
                              xuLyThanhToan(); 
                            });
                          }}
                          onError={(err) => {
                            console.error("PayPal Checkout onError", err);
                            alert("Đã xảy ra lỗi trong quá trình thanh toán qua PayPal!");
                          }}
                        />
                      ) : (
                        <button type="button" onClick={xuLyThanhToan} disabled={loading} className="w-full py-4 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition duration-150 shadow-lg glow-amber cursor-pointer flex items-center justify-center space-x-2 border-0 disabled:opacity-50 disabled:cursor-not-allowed">
                          {loading ? <><Loader2 className="w-4 h-4 animate-spin stroke-[3]" /><span>Đang xử lý giao dịch...</span></> : <><Check className="w-4 h-4 stroke-[3]" /><span>Xác nhận thanh toán</span></>}
                        </button>
                      )}
                    </div>

                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div key="payment_success_card" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="max-w-2xl mx-auto bg-[#0c0c13] border border-emerald-500/30 rounded-[2rem] overflow-hidden shadow-2xl relative">
                
                {/* Phần Header Ticket */}
                <div className="bg-emerald-500/10 p-6 sm:p-8 flex flex-col items-center border-b border-emerald-500/30 relative">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4 ring-4 ring-emerald-500/10">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-emerald-400 uppercase tracking-widest font-display text-center">Giao Dịch Thành Công!</h2>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-2 text-center max-w-sm leading-relaxed">
                    Vé điện tử đã được gửi đến email <span className="text-white font-bold">{currentUser?.email || 'khach@gmail.com'}</span>. Vui lòng kiểm tra hộp thư.
                  </p>
                </div>

                {/* Phần Body Ticket (Thông tin chi tiết) */}
                <div className="p-6 sm:p-8 relative bg-gradient-to-b from-[#0c0c13] to-[#050508]">
                  {/* Hiệu ứng 2 lỗ cắt ở cạnh viền giống vé thật */}
                  <div className="absolute top-0 left-0 w-6 h-6 bg-[#050508] rounded-full -translate-x-1/2 -translate-y-1/2 border-r border-b border-emerald-500/30"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 bg-[#050508] rounded-full translate-x-1/2 -translate-y-1/2 border-l border-b border-emerald-500/30"></div>

                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <img src={movie.poster} alt={movie.tenPhim} className="w-32 h-48 sm:w-36 sm:h-52 object-cover rounded-xl shadow-lg border border-white/10 shrink-0" referrerPolicy="no-referrer" />
                    
                    <div className="flex-1 w-full space-y-5 text-left">
                      <div>
                        <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono font-bold uppercase mb-2 inline-block">CINEAURA E-TICKET</span>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{movie.tenPhim}</h3>
                        <div className="text-xs text-gray-400 font-mono mt-1.5 flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4 text-[#31b1be]" />
                          <span>{showtime.ngayChieu} • {showtime.gioChieu}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-4 border-t border-white/10 border-dashed">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Ghế ngồi</span>
                          <p className="text-sm font-black text-[#31b1be] mt-0.5">{seats.map(s => s.label).join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Phòng chiếu</span>
                          <p className="text-sm font-bold text-white mt-0.5">CINEMA 01</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Mã Đặt Vé</span>
                          <p className="text-sm font-black text-amber-500 tracking-wider mt-0.5">{lastTicketCode}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Tổng thanh toán</span>
                          <p className="text-sm font-bold text-emerald-400 mt-0.5">{formatVND(finalThanhTien)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mã vạch Barcode mô phỏng */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
                    <div className="h-10 w-full max-w-[250px] flex gap-[2px] justify-center opacity-80">
                      {/* Tạo ngẫu nhiên các thanh barcode dọc */}
                      {[...Array(40)].map((_, i) => (
                        <div key={i} className="h-full bg-gray-300 rounded-[1px]" style={{ width: `${Math.floor(Math.random() * 4) + 1}px` }}></div>
                      ))}
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 tracking-[0.4em] mt-2">{lastTicketCode}</p>
                  </div>
                </div>

                {/* Phần Footer (Nút hành động) */}
                <div className="bg-[#0c0c13] p-6 flex flex-col sm:flex-row gap-3 border-t border-white/5">
                   <button onClick={() => navigate('/taikhoan')} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition border border-white/10 cursor-pointer">
                     <div className="flex items-center justify-center gap-2"><Ticket className="w-4 h-4" /><span>Xem vé của tôi</span></div>
                   </button>
                   <button onClick={() => navigate('/')} className="flex-1 py-3.5 bg-[#31b1be] hover:bg-[#208a95] text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition shadow-lg shadow-[#31b1be]/20 cursor-pointer border-0">
                     Về Trang Chủ Khám Phá
                   </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}