import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Mail, Lock, User, Sparkles, Check, ChevronRight, AlertCircle } from 'lucide-react';

export default function DangKy() {
  const navigate = useNavigate();
  
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!hoTen || !email || !password || !confirmPassword) {
      setError('Vui lòng hoàn thành mọi ô nhập trong biểu mẫu.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu bảo mật tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);

    // Gói dữ liệu gửi xuống API PHP
    const formData = new FormData();
    formData.append('full_name', hoTen);
    formData.append('email', email);
    formData.append('password', password);

    fetch('http://localhost:8080/cineaura-backend/api/register.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setLoading(false);
        setSuccess(true);
        
        // Đăng ký thành công, chuyển hướng về trang Đăng nhập
        setTimeout(() => {
          navigate('/auth/dang-nhap');
        }, 1800);
      } else {
        setError(data.message); // Hiển thị lỗi từ DB (ví dụ: Trùng email)
        setLoading(false);
      }
    })
    .catch(err => {
      console.error(err);
      setError("Lỗi kết nối đến máy chủ CineAura!");
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#050508] relative flex items-center justify-center p-4 overflow-hidden font-sans select-none">
      
      {/* Cinematic Blurred Background Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center filter opacity-20 blur-md scale-105"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#050508] via-[#050508]/90 to-transparent" />

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-[#0a0a0f]/85 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl"
      >
        
        {/* Subtle Red/Amber Border Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-brand-red to-transparent shadow-[0_0_15px_#dc2626]" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2.5 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center glow-red transition-all duration-300 group-hover:scale-105">
              <Film className="w-5.5 h-5.5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-brand-amber transition-colors">
                Cine<span className="text-brand-amber">Aura</span>
              </span>
              <p className="text-[9px] text-gray-500 tracking-widest uppercase font-mono -mt-1 scale-90 origin-left">
                Premium Cinema
              </p>
            </div>
          </Link>
          <h2 className="font-display font-black text-xl text-white tracking-tight uppercase">Đăng ký thành viên</h2>
          <p className="text-[10px] text-gray-400 font-mono tracking-wide mt-1 uppercase">Khai sinh hộ chiếu thưởng thức không giới hạn</p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, deltaY: -10 }} 
              animate={{ opacity: 1, deltaY: 0 }}
              className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex items-center space-x-2.5 text-red-400 text-xs text-left"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Full Name input */}
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Họ và tên của bạn</label>
            <div className="relative">
              <input
                type="text"
                required
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                placeholder="Nhập tên đầy đủ (Ví dụ: Nguyễn Văn A)"
                className="w-full bg-black/40 border border-white/5 focus:border-brand-amber rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none transition-all text-white placeholder-gray-600"
              />
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Địa chỉ Email liên kết</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@cineaura.vn"
                className="w-full bg-black/40 border border-white/5 focus:border-brand-amber rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none transition-all text-white placeholder-gray-600"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full bg-black/40 border border-white/5 focus:border-brand-amber rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none transition-all text-white placeholder-gray-600"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5 font-sans text-left">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Xác thực lại</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác thực"
                  className="w-full bg-black/40 border border-white/5 focus:border-brand-amber rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none transition-all text-white placeholder-gray-600"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 bg-brand-amber hover:bg-[#c9900c] disabled:opacity-50 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 border-0 cursor-pointer shadow-lg glow-amber active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Đang khởi tạo tài khoản kỹ thuật số...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4 stroke-[3.5]" />
                  <span>Khởi tạo hoàng kim tốt đẹp!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ký Khế Ước Đăng Ký</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Footer Navigation within Auth Card */}
        <div className="mt-6 pt-5 border-t border-white/5 text-center flex flex-col items-center justify-center space-y-3">
          <p className="text-[11px] text-gray-500 flex items-center space-x-1">
            <span>Bạn đã có thẻ thành viên trực tuyến?</span>
            <Link to="/auth/dang-nhap" className="text-brand-amber font-bold hover:underline">
              Đăng Nhập Ngay
            </Link>
          </p>
          <Link
            to="/"
            className="text-[9px] font-mono tracking-widest uppercase text-gray-500 hover:text-white transition flex items-center space-x-1 border border-white/5 bg-white/5 px-3 py-1.5 rounded-full"
          >
            <span>Quay lại trang chủ sảnh</span>
            <ChevronRight className="w-3" />
          </Link>
        </div>

        {/* Successful auth transition layer */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0a0f]/95 rounded-3xl flex flex-col items-center justify-center text-center p-6 z-20"
            >
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                <Check className="w-7 h-7 text-black stroke-[3.5] animate-bounce" />
              </div>
              <h3 className="font-display font-black text-xl text-white">Đăng Ký Thành Công!</h3>
              <p className="text-xs text-brand-amber mt-1 tracking-widest font-mono uppercase">Hồ sơ đã được mã hóa an toàn</p>
              <p className="text-[10px] text-gray-400 mt-2 max-w-xs">Chúc mừng bạn {hoTen} đã chính thức là một phần của đại gia đình CineAura. Hệ thống đang chuyển hướng đến màn hình đăng nhập...</p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}