import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  User, 
  CreditCard, 
  Sparkles, 
  LogOut, 
  Menu, 
  X, 
  Layers, 
  Coffee, 
  ChevronRight, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useCineAura } from './QuanLyTrangThai';
import Chatbox from '../components/Chatbox';

export default function BoCucKhachHang() {
  const { currentUser, switchUserRole } = useCineAura();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownUserOpen, setDropdownUserOpen] = useState(false);

  const navigation = [
    { name: 'TRANG CHỦ', href: '/' },
    { name: 'LỊCH CHIẾU', href: '/suat-chieu-do-an' },
    { name: 'PHIM', href: '/phim' },
    { name: 'MUA SẮM COMBO', href: '/mua-combo' },
    { name: 'THÀNH VIÊN', href: '/tai-khoan' },
  ];

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] font-sans text-slate-800 flex flex-col selection:bg-[#31b1be] selection:text-white">
      
      {/* 1. Header (Thanh Điều Hướng Cao Cấp Đa Tầng) */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        
        {/* TOP BAR (Thanh phụ màu tối sang trọng) */}
        <div className="bg-[#18181b] text-gray-400 text-[11px] font-bold tracking-wider py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center space-x-6">
            <Link to="/tai-khoan" className="hover:text-[#31b1be] transition-colors uppercase">
              VÉ CỦA TÔI
            </Link>
            <span>|</span>
            {currentUser?.role === 'GUEST' || !currentUser ? (
              <Link to="/auth/dang-nhap" className="hover:text-[#31b1be] transition-colors uppercase">
                ĐĂNG KÝ / ĐĂNG NHẬP
              </Link>
            ) : (
              <span className="text-[#31b1be] uppercase">
                XIN CHÀO, {currentUser.name}
              </span>
            )}
            <span>|</span>
            <div className="flex items-center space-x-1">
              <span className="text-[#31b1be] cursor-pointer">VN</span>
              <span className="text-gray-600">/</span>
              <span className="cursor-pointer hover:text-white">EN</span>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION ROW (Thanh chính màu sáng nổi bật) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#31b1be] flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105">
                  <Film className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                  <span className="font-display font-black text-2xl tracking-tight text-[#18181b] group-hover:text-[#31b1be] transition-colors duration-200">
                    Cine<span className="text-[#31b1be]">Aura</span>
                  </span>
                  <p className="text-[9px] text-[#31b1be] tracking-widest uppercase font-mono -mt-1 scale-90 origin-left">
                    Premium Cinema
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 bg-gray-100/80 p-1.5 rounded-full border border-gray-200">
              {navigation.map((item) => {
                const isActive = item.href === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-200 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-700 hover:text-[#31b1be] hover:bg-black/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBubble"
                        className="absolute inset-0 bg-[#31b1be] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        style={{ originY: '0px' }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile / Auth Area */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Nút vào admin nhanh nếu là admin */}
              {currentUser?.role === 'ADMIN' && (
                <Link 
                  to="/admin"
                  className="flex items-center space-x-1 px-3.5 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg transition-all duration-205 shadow"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Trang Admin</span>
                </Link>
              )}

              {/* User Area - Dynamic Auth Link */}
              {currentUser?.role === 'GUEST' || !currentUser ? (
                <Link
                  to="/auth/dang-nhap"
                  className="flex items-center space-x-1.5 px-4.5 py-2 bg-[#31b1be] hover:bg-[#208a95] text-white font-black text-xs uppercase tracking-wider rounded-full transition-all duration-150 shadow-md hover:scale-[1.02]"
                >
                  <User className="w-4 h-4 stroke-[2.5]" />
                  <span>Đăng Nhập</span>
                </Link>
              ) : (
                /* User Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setDropdownUserOpen(!dropdownUserOpen)}
                    className="flex items-center space-x-3 p-1.5 pr-2.5 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200 cursor-pointer bg-transparent"
                  >
                    <div className="relative">
                      <img
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200 bg-gray-200"
                        src={currentUser.avatar}
                        alt={currentUser.name}
                      />
                      {currentUser.role === 'VIP' && (
                        <span className="absolute -top-1 -right-1 bg-amber-400 text-[8px] text-black font-black px-1 rounded-full uppercase scale-75 animate-pulse">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-bold leading-none ${currentUser.role === 'VIP' ? 'text-[#31b1be] font-display font-extrabold' : 'text-slate-800'}`}>
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">
                        {currentUser.role === 'VIP' ? 'VIP Gold' : currentUser.role === 'ADMIN' ? 'Ban Quản Trị' : 'Thành Viên'}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownUserOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setDropdownUserOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2.5 w-60 rounded-xl bg-white border border-gray-200 p-2 shadow-xl z-20 text-slate-700"
                        >
                          <div className="px-3.5 py-2.5 border-b border-gray-100">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Số dư ví của bạn</p>
                            <p className="text-base font-bold text-[#31b1be] mt-0.5 font-mono">
                              {formatVND(currentUser.soDu || 0)}
                            </p>
                          </div>
                          <div className="p-1 space-y-0.5">
                            <Link
                              to="/tai-khoan"
                              onClick={() => setDropdownUserOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs hover:text-white hover:bg-[#31b1be] transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>Thông tin tài khoản</span>
                            </Link>
                            {currentUser.role === 'ADMIN' && (
                              <Link
                                  to="/admin"
                                  onClick={() => setDropdownUserOpen(false)}
                                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs hover:text-white hover:bg-brand-red transition-colors"
                              >
                                <Layers className="w-4 h-4 text-brand-red group-hover:text-white" />
                                <span>Trang Quản trị</span>
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                // Xóa thông tin lưu trong localStorage khi đăng xuất
                                localStorage.removeItem('cineaura_user');
                                if (switchUserRole) {
                                  switchUserRole('GUEST');
                                } else {
                                  window.location.reload();
                                }
                                setDropdownUserOpen(false);
                              }}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-red-500 hover:text-white hover:bg-red-500 transition-colors pointer-events-auto cursor-pointer border-0 text-left bg-transparent"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Đăng xuất</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              {currentUser?.role === 'ADMIN' && (
                <Link to="/admin" className="p-1 px-2.5 bg-brand-red rounded text-[10px] font-bold text-white uppercase">
                  Admin
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-[#31b1be] hover:bg-gray-100 transition cursor-pointer border-0 bg-transparent"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 bg-white text-slate-700 overflow-hidden"
            >
              <div className="px-4 pt-3 pb-5 space-y-2">
                {navigation.map((item) => {
                  const isActive = item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-bold ${
                        isActive 
                          ? 'bg-[#31b1be] text-white' 
                          : 'text-slate-600 hover:text-[#31b1be] hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <hr className="border-gray-200 my-3" />
                
                {/* User Mobile Info */}
                {currentUser?.role !== 'GUEST' ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-1">
                      <img className="h-10 w-10 rounded-full object-cover bg-gray-200" src={currentUser.avatar} alt="" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{currentUser.name}</h4>
                        <p className="text-xs text-[#31b1be] font-mono">{formatVND(currentUser.soDu || 0)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 p-2">
                      <Link
                        to="/tai-khoan"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex justify-center items-center py-2 bg-gray-100 rounded-lg text-xs font-bold text-slate-700"
                      >
                        Tài khoản
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('cineaura_user');
                          if(switchUserRole) switchUserRole('GUEST');
                          else window.location.reload();
                          setMobileMenuOpen(false);
                        }}
                        className="py-2 bg-red-50 text-red-600 rounded-lg text-xs border-0 font-bold cursor-pointer"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-2">
                    <Link
                      to="/auth/dang-nhap"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 bg-[#31b1be] text-white text-center rounded-lg text-sm font-bold"
                    >
                      Đăng Nhập / Đăng Ký
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Main Workspace */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer */}
      <footer className="bg-brand-dark-card border-t border-white/5 mt-auto bg-[#0b0b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Cột 1: Brand Giới thiệu */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#dc2626] flex items-center justify-center shadow-[0_0_15px_#dc2626]">
                  <Film className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  Cine<span className="text-[#dfa112]">Aura</span>
                </span>
              </Link>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                Hệ thống rạp chiếu phim hàng đầu đạt tiêu chuẩn khắt khe nhất thế giới. Trải nghiệm âm thanh vòm Dolby Atmos và chất lượng hình ảnh IMAX Laser đẳng cấp thượng lưu.
              </p>
              <p className="text-xs font-mono text-gray-600">
                © {new Date().getFullYear()} CineAura Inc. All Rights Reserved.
              </p>
            </div>

            {/* Cột 2: Hệ thống rạp */}
            <div>
              <h3 className="font-semibold text-xs text-[#dfa112] uppercase tracking-widest mb-4">Hệ Thống Rạp CineAura</h3>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span>CineAura Phan Xích Long (TP.HCM)</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span>CineAura Landmark 81 (IMAX - TP.HCM)</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span>CineAura Royal City (Hà Nội)</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span>CineAura Trần Phú (Nha Trang)</span>
                </li>
              </ul>
            </div>

            {/* Cột 3: Trải nghiệm VIP */}
            <div>
              <h3 className="font-semibold text-xs text-[#dfa112] uppercase tracking-widest mb-4">Dịch Vụ Độc Quyền</h3>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#dfa112]" />
                  <span>Hạng ghế Gold VIP cao cấp nhất</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-2">
                  <Coffee className="w-3.5 h-3.5 text-[#dfa112]" />
                  <span>Phục vụ đồ ăn tại giường nằm</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#dfa112]" />
                  <span>Thẻ thanh toán CineAura Wallet</span>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#dfa112]" />
                  <span>Lounge chờ VIP sang xịn biệt lập</span>
                </li>
              </ul>
            </div>

            {/* Cột 4: Liên hệ */}
            <div>
              <h3 className="font-semibold text-xs text-[#dfa112] uppercase tracking-widest mb-4">Chăm Sóc Khách Hàng</h3>
              <div className="space-y-3 text-xs text-gray-400">
                <p>Hotline: <strong className="text-white hover:text-[#dfa112] transition-colors">1900 8899 (VIP Line)</strong></p>
                <p>Email: <strong className="text-white">support@cineaura.vn</strong></p>
                <p>Địa chỉ: Tầng 48, Tòa nhà Bitexco Financial Tower, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Floating CineAura Virtual Assistance Chatbox */}
      <Chatbox />

    </div>
  );
}