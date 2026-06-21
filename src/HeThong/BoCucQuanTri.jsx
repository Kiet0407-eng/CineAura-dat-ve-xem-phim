import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  BarChart3, 
  Clapperboard, 
  CalendarRange, 
  Utensils, 
  ArrowLeft, 
  Menu, 
  X, 
  ChevronDown, 
  Bell, 
  Search,
  Lock,
  Sparkles,
  Users,
  Tags,
  Building,
  LayoutGrid,
  Palette,
  Ticket,
  Gift,
  ShieldCheck // Đã thêm icon ShieldCheck vào đây
} from 'lucide-react';
import { useCineAura } from './QuanLyTrangThai';

export default function BoCucQuanTri() {
  const { currentUser, switchUserRole } = useCineAura();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notiOpen, setNotiOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Màng lọc bảo vệ ProtectedRoute ở mức độ Layout
  const laAdmin = currentUser && currentUser.role === 'ADMIN';

  const menuSections = [
    {
      title: 'QUẢN LÝ PHIM',
      items: [
        { name: 'Danh Sách Phim', href: '/admin/phim', icon: Clapperboard },
        { name: 'Thể Loại Phim', href: '/admin/the-loai', icon: Tags },
      ]
    },
    {
      title: 'HỆ THỐNG RẠP',
      items: [
        { name: 'Quản Lý Rạp', href: '/admin/rap', icon: Building },
        { name: 'Phòng Chiếu Phim', href: '/admin/phong', icon: LayoutGrid },
        { name: 'Cấu Hình Loại Ghế', href: '/admin/loai-ghe', icon: Palette },
        { name: 'Suất Chiếu & Lịch', href: '/admin/suat-chieu', icon: CalendarRange },
      ]
    },
    {
      title: 'KINH DOANH',
      items: [
        { name: 'Đơn Đặt Vé', href: '/admin/don-ve', icon: Ticket },
        { name: 'Soát Vé & Kiểm Duyệt', href: '/admin/soat-ve', icon: ShieldCheck }, // Đã thêm menu Soát vé vào đây
        { name: 'Quản Lý Đồ Ăn', href: '/admin/do-an', icon: Utensils },
        { name: 'Mã Khuyến Mãi', href: '/admin/khuyen-mai', icon: Gift },
      ]
    },
    {
      title: 'HỆ THỐNG',
      items: [
        { name: 'Bảng Điều Khiển', href: '/admin', icon: BarChart3 },
        { name: 'Quản Lý User', href: '/admin/nguoi-dung', icon: Users },
      ]
    }
  ];

  const thongBaoGiaDinh = [
    { id: 1, text: 'Thành viên VIP Phạm Minh Hoàng vừa nạp 500,000đ vào ví.', time: '5 phút trước' },
    { id: 2, text: 'Suất chiếu phim "Aura: Chiếc Gương Thời Gian" lúc 18:15 hôm nay đã hết vé.', time: '20 phút trước' },
    { id: 3, text: 'Hệ thống báo cáo doanh thu tuần 4 tháng 5 đã sẵn sàng xuất file.', time: '1 giờ trước' },
  ];

  if (!laAdmin) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full glass-effect p-8 rounded-3xl border border-brand-red/20 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle decoration bg */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent shadow-[0_0_20px_#dc2626]" />
          
          <div className="w-16 h-16 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center mx-auto mb-6 glow-red">
            <Lock className="w-8 h-8 text-brand-red" />
          </div>
          
          <h2 className="font-display font-extrabold text-2xl text-white mb-2">Từ chối truy cập</h2>
          <p className="text-xs text-brand-red font-mono uppercase tracking-widest mb-4">Màng lọc bảo mật ProtectedRoute</p>
          
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Bạn đang yêu cầu xem trang quản trị hệ thống CineAura. Yêu cầu này bị hạn chế vì tài khoản hiện tại của bạn là <strong className="text-brand-amber">[{currentUser.name}] ({currentUser.role})</strong>.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => switchUserRole('ADMIN')}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-brand-red hover:bg-red-500 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-red-950/40 border-0"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Kích hoạt quyền Admin (Cấp tốc)</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all cursor-pointer border border-white/5 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang khách hàng</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] font-sans text-gray-100 flex overflow-hidden">
      
      {/* 1. SIDEBAR BÊN TRÁI (LỚP ĐIỀU HƯỚNG QUẢN TRỊ) */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } shrink-0 bg-brand-dark-card border-r border-white/5 transition-all duration-300 flex flex-col z-20`}
      >
        
        {/* Sidebar Header Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 justify-between">
          <Link to="/admin" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shrink-0 glow-red">
              <Film className="w-5.5 h-5.5 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-left"
              >
                <span className="font-display font-extrabold text-lg text-white">
                  Cine<span className="text-brand-red">Admin</span>
                </span>
                <p className="text-[8px] text-brand-amber uppercase tracking-wider font-mono -mt-1">
                  Trạm Quản Lý
                </p>
              </motion.div>
            )}
          </Link>
          
          {/* Nút thu nhỏ sidebar trên màn desktop */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-white transition p-1 hover:bg-white/5 rounded hidden lg:block border-0 bg-transparent cursor-pointer"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow py-4 px-3 space-y-4 overflow-y-auto custom-scrollbar">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {sidebarOpen ? (
                <div className="px-4.5 pb-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono select-none">
                  {section.title}
                </div>
              ) : (
                <div className="h-px bg-white/5 my-1 mx-2" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-155 group ${
                        isActive 
                          ? 'bg-brand-red text-white shadow-lg shadow-red-950/30' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white transition'}`} />
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="truncate text-[11px]"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-brand-amber" />
            {sidebarOpen && <span>Trở lại Trang Chủ</span>}
          </Link>
        </div>

      </aside>

      {/* 2. KHU VỰC HIỂN THỊ NỘI DUNG BÊN PHẢI (HEADER + OUTLET) */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        
        {/* Header Quản Trị */}
        <header className="h-20 bg-brand-dark-card border-b border-white/5 flex items-center justify-between px-6 sm:px-8 shrink-0">
          
          {/* Trái: Menu toggler Cho Mobile */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded lg:hidden border-0 bg-transparent cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="text-left">
              <h2 className="text-xs text-gray-500 font-mono uppercase tracking-widest leading-none">Hệ Thống CineAura</h2>
              <h1 className="text-base font-bold text-white mt-1">Hệ Thống Phân Tích Suất Chiếu & Nội Dung</h1>
            </div>
          </div>

          {/* Phải: Trợ lý và Profile Admin */}
          <div className="flex items-center space-x-4">
            
            {/* Search bar mockup */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm phim, đơn hàng..."
                className="w-60 bg-black/30 border border-white/5 focus:border-brand-red rounded-full py-1.5 pl-8.5 pr-4 text-xs focus:outline-none transition-all text-white"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Notification tray */}
            <div className="relative">
              <button 
                onClick={() => setNotiOpen(!notiOpen)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-gray-400 hover:text-white transition relative cursor-pointer bg-transparent"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full animate-bounce" />
              </button>

              <AnimatePresence>
                {notiOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotiOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 rounded-2xl bg-brand-dark-card border border-white/10 p-4 shadow-2xl z-40 text-left"
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 pb-2 border-b border-white/5">Thông Báo Hệ Thống</h4>
                      <div className="space-y-3.5">
                        {thongBaoGiaDinh.map(noti => (
                          <div key={noti.id} className="text-xs group p-1 rounded transition">
                            <p className="text-gray-300 leading-relaxed">{noti.text}</p>
                            <span className="text-[10px] text-gray-500 mt-1 block">{noti.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Profile */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-white/5 transition border-0 bg-transparent cursor-pointer"
              >
                <img 
                  src={currentUser.avatar} 
                  alt="" 
                  className="w-8.5 h-8.5 rounded-full object-cover border border-white/20"
                />
                <span className="text-xs font-semibold text-gray-300 hidden sm:inline-block">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-48 rounded-xl bg-brand-dark-card border border-white/10 p-1 shadow-2xl z-40 text-left"
                    >
                      <button
                        onClick={() => {
                          switchUserRole('VIP');
                          setUserMenuOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-white/5 text-xs text-brand-amber font-medium transition rounded-lg border-0 bg-transparent cursor-pointer"
                      >
                        Trở lại KH VIP
                      </button>
                      <button
                        onClick={() => {
                          switchUserRole('GUEST');
                          setUserMenuOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-red-500/10 text-xs text-red-400 font-medium transition rounded-lg border-0 bg-transparent cursor-pointer"
                      >
                        Thoát (Log Khách)
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>

        </header>

        {/* Vùng Hiển Thị Nội Dung Admin */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-brand-dark-deep">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
}