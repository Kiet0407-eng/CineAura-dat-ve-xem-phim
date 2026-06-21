import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserMinus, 
  Ban, 
  UserPlus, 
  Award,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuanLyNguoiDung() {
  const [danhSachKhach, setDanhSachKhach] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form states to create a new user account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('REGULAR');
  const [points, setPoints] = useState(100);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150');

  // Gọi API tải danh sách User từ Database
  const loadUsers = () => {
    fetch('http://localhost:8080/cineaura-backend/api/users.php')
      .then(res => res.json())
      .then(data => {
        // Map dữ liệu DB vào UI của bạn
        const formattedData = data.map(u => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: u.role === 'ADMIN' ? 'ADMIN' : 'REGULAR',
          points: 100, // Dummy data cho UI đẹp vì DB chưa lưu điểm
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          status: 'hoat_dong', // Dummy data cho UI
          joinedDate: u.created_at ? u.created_at.split(' ')[0] : 'N/A'
        }));
        setDanhSachKhach(formattedData);
      })
      .catch(err => console.error("Lỗi:", err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Xử lý tạo User mới và lưu vào Database
  const handleCreateUser = (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert('Vui lòng hoàn thành cả 2 thông tin Họ tên & Email bắt buộc.');
      return;
    }

    const formData = new FormData();
    formData.append('full_name', name);
    formData.append('email', email);
    formData.append('password', 'Cineaura@123'); // Cấp mật khẩu mặc định
    formData.append('role', role === 'ADMIN' ? 'ADMIN' : 'USER');

    fetch('http://localhost:8080/cineaura-backend/api/add_user.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        loadUsers();
        setShowForm(false);
        setName(''); setEmail(''); setRole('REGULAR'); setPoints(100);
      } else {
        alert(data.message);
      }
    });
  };

  // 1. Toggled Khóa tài khoản / Mở khóa (Xử lý mượt mà trên UI)
  const handleToggleBlock = (id) => {
    setDanhSachKhach(prev => prev.map(user => {
      if (user.id === id) {
        const outputStatus = user.status === 'bi_khoa' ? 'hoat_dong' : 'bi_khoa';
        return { ...user, status: outputStatus };
      }
      return user;
    }));
  };

  // 2. Grant admin rights / Cấp quyền Admin lưu thẳng vào Database
  const handleGrantAdmin = (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    
    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('full_name', user.name);
    formData.append('email', user.email);
    formData.append('role', newRole);

    fetch('http://localhost:8080/cineaura-backend/api/update_user.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        loadUsers();
        alert(`Đã ${newRole === 'ADMIN' ? 'cấp quyền Admin' : 'hạ quyền xuống Khách'} thành công!`);
      } else {
        alert(data.message);
      }
    });
  };

  const filteredUsers = danhSachKhach.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-1.5 text-brand-red font-mono text-[9px] uppercase tracking-widest font-bold">
            <Users className="w-3.5 h-3.5 text-brand-red" />
            <span>Thư viện hồ sơ người dùng</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Quản Lý Người Dùng</h2>
          <p className="text-xs text-gray-400">Tra cứu điểm thưởng tích lũy (XP-Points), điều chỉnh cấp phân quyền và quản lý trạng thái tài khoản.</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center space-x-2 py-3.5 px-6 bg-white/5 hover:bg-white/10 text-gray-300 font-extrabold text-xs rounded-xl border border-white/10 uppercase tracking-wide transition-all duration-155 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          id="btn_add_user"
        >
          <UserPlus className="w-4 h-4 text-brand-amber stroke-[2.5]" />
          <span>Đăng ký khách mới</span>
        </button>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* TRÁI: DANH SÁCH BẢNG USER */}
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0c0c13] p-4 rounded-xl border border-white/5">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm thành viên theo tên hoặc địa chỉ email đăng ký..."
                className="w-full bg-black/50 border border-white/5 focus:border-brand-amber py-2 px-3.5 pl-9 rounded-xl text-xs text-white focus:outline-none transition"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            
            <div className="text-[10px] font-mono text-gray-500 uppercase shrink-0">
              Tổng số thành viên: {filteredUsers.length} tài khoản
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="px-5 py-4 font-bold text-center w-16">Avatar</th>
                  <th className="px-5 py-4 font-bold">Họ và Tên</th>
                  <th className="px-5 py-4 font-bold">Email tài khoản</th>
                  <th className="px-5 py-4 font-bold text-center">Điểm Tích lũy (XP)</th>
                  <th className="px-5 py-4 font-bold text-center">Chức danh / Vai trò</th>
                  <th className="px-5 py-4 font-bold text-center w-40">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15 text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center text-gray-500 font-mono">
                      Không tìm thấy bất cứ kết quả hồ sơ người dùng nào trùng khớp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className={`transition-colors duration-150 ${
                        user.status === 'bi_khoa' ? 'bg-red-500/[0.02] hover:bg-red-500/[0.04]' : 'hover:bg-white/5'
                      }`}
                    >
                      
                      {/* Avatar */}
                      <td className="px-5 py-3 text-center">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className={`w-9 h-9 rounded-full object-cover mx-auto border bg-black/40 ${
                            user.status === 'bi_khoa' ? 'border-red-500/25 grayscale' : 'border-white/10'
                          }`}
                        />
                      </td>

                      {/* Họ tên */}
                      <td className="px-5 py-3">
                        <div>
                          <strong className={`font-semibold block ${user.status === 'bi_khoa' ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {user.name}
                          </strong>
                          <span className="text-[9px] text-gray-500 font-mono">Joined: {user.joinedDate}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3 font-mono text-gray-400">
                        {user.email}
                      </td>

                      {/* Điểm tích lũy XP */}
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1 font-mono font-black text-brand-amber">
                          <Award className="w-3.5 h-3.5" />
                          <span>{user.points.toLocaleString('vi-VN')} XP</span>
                        </div>
                      </td>

                      {/* Vai Trò (Khách/Regular/VIP/Admin) */}
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-black ${
                          user.role === 'ADMIN'
                            ? 'bg-brand-red/10 border border-brand-red/20 text-brand-red'
                            : user.role === 'VIP'
                            ? 'bg-brand-amber/10 border border-brand-amber/20 text-brand-amber'
                            : 'bg-white/5 text-gray-400 border border-white/5'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Hành động (Khóa tài khoản đỏ, cấp quyền Admin) */}
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5 font-bold">
                          
                          {/* Nút Khóa / Mở khóa màu Đỏ rực */}
                          <button
                            onClick={() => handleToggleBlock(user.id)}
                            className={`flex items-center space-x-1 px-2.5 py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                              user.status === 'bi_khoa'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 border-red-500/15 text-red-500 hover:bg-red-500/20'
                            }`}
                            title={user.status === 'bi_khoa' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            {user.status === 'bi_khoa' ? (
                              <>
                                <Unlock className="w-3 h-3" />
                                <span>Mở Khóa</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3" />
                                <span className="text-red-500">Khóa</span>
                              </>
                            )}
                          </button>

                          {/* Cấp Quyền Admin */}
                          <button
                            onClick={() => handleGrantAdmin(user)}
                            className={`flex items-center space-x-1 px-2.5 py-1.5 text-[9px] font-semibold uppercase rounded-lg border transition-all cursor-pointer ${
                              user.role === 'ADMIN'
                                ? 'bg-gray-400/10 border-gray-400/10 text-gray-300 hover:bg-gray-400/20'
                                : 'bg-brand-amber/10 border-brand-amber/20 text-brand-amber hover:bg-brand-amber/20'
                            }`}
                            title={user.role === 'ADMIN' ? 'Hạ cấp xuống Khách' : 'Cấp quyền Ban Quản trị'}
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>{user.role === 'ADMIN' ? 'Hạ Quyền' : 'Set Admin'}</span>
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* PHẢI: FORM CHỈNH SỬA / THÊM MỚI TÀI KHOẢN KHÁCH KIỂM THỬ */}
        <div>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4"
              >
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-[10px] font-bold text-brand-amber uppercase tracking-widest font-mono flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                    <span>Tạo Tài Khoản Khách Thử</span>
                  </span>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-white transition cursor-pointer p-0.5 bg-white/5 hover:bg-white/10 rounded-full border-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-semibold">
                  
                  {/* Tên */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Họ và Tên Khách Hàng *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dương Triệu Vũ"
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs text-left"
                    />
                  </div>

                  {/* Mail */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Địa Chỉ Email Đăng Ký *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs text-brand-amber font-mono text-left"
                    />
                  </div>

                  {/* Phân quyền ban đầu & Điểm XP */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Hạng Cấp Thẻ</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3 rounded-xl text-white focus:outline-none text-xs font-bold"
                      >
                        <option value="REGULAR" className="bg-[#0b0b12]">Khách Thường (Regular)</option>
                        <option value="VIP" className="bg-[#0b0b12]">Khách VIP (Gold Card)</option>
                        <option value="ADMIN" className="bg-[#0b0b12]">Ban Quản Trị (Admin)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Khởi Điểm (XP)</label>
                      <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all text-xs"
                      />
                    </div>
                  </div>

                  {/* Avatar URL */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Đường dẫn tệp ảnh đại diện</label>
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all text-xs font-mono"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-brand-red hover:bg-[#c93c3c] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow duration-150 active:scale-[0.99] border-0"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Xác Nhận Tạo Thành Viên</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl text-[10px] uppercase tracking-widest font-mono transition border-0 bg-transparent cursor-pointer"
                    >
                      Hủy bỏ tác tác
                    </button>
                  </div>

                </form>

              </motion.div>
            ) : (
              <div className="bg-brand-dark-card border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/25 flex items-center justify-center mx-auto text-brand-red shadow shadow-brand-red/10">
                  <Users className="w-5.5 h-5.5" />
                </div>
                <h4 className="font-display font-bold text-white text-base">Hồ Sơ Thành Viên</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Vui lòng bấm vào các nút điều khiển trực quan tương ứng ở cột Hành động để <strong className="text-red-500 font-bold">"Khóa"</strong> hoặc <strong className="text-brand-amber font-bold">"Nâng quyền Admin"</strong> cho người dùng thích hợp.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}