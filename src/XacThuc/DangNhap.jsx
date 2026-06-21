import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Mail, Lock, Sparkles, Check, ChevronRight, AlertCircle } from 'lucide-react';
import { useCineAura } from '../HeThong/QuanLyTrangThai';

export default function DangNhap() {
  const { setCurrentUser } = useCineAura(); // Đổi từ switchUserRole sang setCurrentUser
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    fetch('http://localhost:8080/cineaura-backend/api/login.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setLoading(false);
        setSuccess(true);
        
        // Chuẩn hóa dữ liệu thật từ DB
        const userData = { 
          ...data.user, 
          name: data.user.full_name || 'Thành viên CineAura', 
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', 
          soDu: parseFloat(data.user.soDu) || 0 
        };
        
        // Cập nhật State toàn cục
        if(setCurrentUser) setCurrentUser(userData);

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(data.message);
        setLoading(false);
      }
    })
    .catch(err => {
      console.error(err);
      setError("Lỗi kết nối đến máy chủ xác thực!");
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#050508] relative flex items-center justify-center p-4 overflow-hidden font-sans select-none">
      <div className="absolute inset-0 z-0 bg-cover bg-center filter opacity-20 blur-md scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200')` }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#050508] via-[#050508]/90 to-transparent" />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }} className="relative z-10 w-full max-w-md bg-[#0a0a0f]/85 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-brand-amber to-transparent shadow-[0_0_15px_#dfa112]" />

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2.5 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center glow-red transition-all duration-300 group-hover:scale-105"><Film className="w-5.5 h-5.5 text-white" /></div>
            <div className="text-left"><span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-brand-amber transition-colors">Cine<span className="text-brand-amber">Aura</span></span><p className="text-[9px] text-gray-500 tracking-widest uppercase font-mono -mt-1 scale-90 origin-left">Premium Cinema</p></div>
          </Link>
          <h2 className="font-display font-black text-xl text-white tracking-tight uppercase">Đăng nhập tài khoản</h2>
          <p className="text-[10px] text-gray-400 font-mono tracking-wide mt-1 uppercase">Bước đệm vào thế giới điện ảnh xa hoa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (<motion.div initial={{ opacity: 0, deltaY: -10 }} animate={{ opacity: 1, deltaY: 0 }} className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex items-center space-x-2.5 text-red-400 text-xs text-left"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></motion.div>)}
          <div className="space-y-1.5 text-left"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Địa chỉ Email</label><div className="relative"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email của bạn" className="w-full bg-black/40 border border-white/5 focus:border-brand-amber rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none transition-all text-white placeholder-gray-600" /><Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" /></div></div>
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Mật khẩu bảo mật</label><Link to="/auth/quen-mat-khau" className="text-[9px] font-bold text-brand-amber hover:text-white transition uppercase tracking-wider font-mono">Quên mật khẩu?</Link></div>
            <div className="relative"><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" className="w-full bg-black/40 border border-white/5 focus:border-brand-amber rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none transition-all text-white placeholder-gray-600" /><Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" /></div>
          </div>
          <div className="pt-2"><button type="submit" disabled={loading || success} className="w-full py-3.5 bg-brand-amber hover:bg-[#c9900c] disabled:opacity-50 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 border-0 cursor-pointer shadow-lg glow-amber active:scale-[0.99]">{loading ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /><span>Đang kiểm tra hệ thống...</span></> : success ? <><Check className="w-4 h-4 stroke-[3.5]" /><span>Xác thực thành công!</span></> : <><Sparkles className="w-4 h-4" /><span>Đăng Nhập Thượng Lưu</span></>}</button></div>
        </form>

        <div className="mt-6 pt-5 border-t border-white/5 text-center flex flex-col items-center justify-center space-y-3">
          <p className="text-[11px] text-gray-500 flex items-center space-x-1"><span>Bạn mới biết đến rạp CineAura?</span><Link to="/auth/dang-ky" className="text-brand-amber font-bold hover:underline">Đăng Ký Khởi Tạo</Link></p>
          <Link to="/" className="text-[9px] font-mono tracking-widest uppercase text-gray-500 hover:text-white transition flex items-center space-x-1 border border-white/5 bg-white/5 px-3 py-1.5 rounded-full"><span>Quay lại trang chủ sảnh</span><ChevronRight className="w-3 h-3" /></Link>
        </div>

        <AnimatePresence>
          {success && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0a0a0f]/95 rounded-3xl flex flex-col items-center justify-center text-center p-6 z-20"><div className="w-14 h-14 bg-brand-amber rounded-full flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(223,161,18,0.35)]"><Check className="w-7 h-7 text-black stroke-[3.5] animate-bounce" /></div><h3 className="font-display font-black text-xl text-white">Xác Thực Thành Công!</h3><p className="text-xs text-brand-amber mt-1 tracking-widest font-mono uppercase">Chào mừng quý khách trở lại</p></motion.div>)}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}