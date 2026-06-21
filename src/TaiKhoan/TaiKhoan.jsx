import React, { useState } from 'react';
import { CreditCard, Award, History, Sparkles, Plus, Wallet, Mail, Check, Edit3, X, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LichSuDatVe from './LichSuDatVe';
import { useCineAura } from '../HeThong/QuanLyTrangThai'; // Import Context

export default function TaiKhoan() {
  // Đồng bộ toàn bộ dữ liệu từ Context (Không dùng localStorage nữa)
  const { currentUser, setCurrentUser } = useCineAura();

  const [showNapModal, setShowNapModal] = useState(false);
  const [napAmount, setNapAmount] = useState(100000);
  const [napSuccess, setNapSuccess] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: '', email: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null); 

  const formatVND = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);

  const executeNapTien = () => {
    if (napAmount <= 0) return;
    
    // Cập nhật thông qua Context
    const updatedUser = { ...currentUser, soDu: (currentUser.soDu || 0) + napAmount };
    setCurrentUser(updatedUser);
    
    setNapSuccess(true);
    setTimeout(() => { setNapSuccess(false); setShowNapModal(false); }, 1800);
  };

  const openEditModal = () => {
    setEditForm({ name: currentUser.name, email: currentUser.email, avatar: currentUser.avatar });
    setAvatarFile(null); 
    setShowEditModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setEditForm({ ...editForm, avatar: URL.createObjectURL(file) });
    }
  };

  const executeUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('id', currentUser.id || '1');
    formData.append('full_name', editForm.name);
    formData.append('email', editForm.email);
    formData.append('role', currentUser.role);

    if (avatarFile) {
       formData.append('avatar_file', avatarFile);
    } else {
       formData.append('avatar_url', editForm.avatar);
    }

    try {
      const response = await fetch('http://localhost:8080/cineaura-backend/api/update_user.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        // Cập nhật Context để toàn bộ app thay đổi theo ngay lập tức
        const updatedUser = { 
          ...currentUser, 
          name: editForm.name, 
          email: editForm.email, 
          avatar: data.new_avatar || editForm.avatar 
        };
        setCurrentUser(updatedUser);

        setEditSuccess(true);
        setTimeout(() => {
          setEditSuccess(false);
          setShowEditModal(false);
          setIsUploading(false);
          // Không cần window.location.reload() nữa!
        }, 1500);
      } else {
        alert("Lỗi máy chủ: " + data.message);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối tới máy chủ XAMPP!");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-850 text-left">
      
      {/* 1. PROFILE OVERVIEW HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cột Trái: Thông tin thẻ thành viên */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#31b1be]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Group Avatar + Edit Button để tạo hiệu ứng hover đẹp */}
          <div className="relative group shrink-0">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-24 h-24 rounded-full object-cover border-2 border-[#31b1be]/40 ring-4 ring-[#31b1be]/5 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="text-center sm:text-left space-y-2 flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-3">
              <h2 className="font-display font-black text-2xl text-slate-900">{currentUser.name}</h2>
              <div className="flex items-center space-x-2">
                {currentUser.role === 'VIP' && (
                  <span className="inline-flex items-center space-x-1 px-3 py-0.5 bg-[#31b1be]/10 border border-[#31b1be]/20 text-[#31b1be] font-display font-bold text-[10px] rounded-full tracking-wider uppercase animate-pulse">
                    <Sparkles className="w-3 h-3 text-[#31b1be] fill-[#31b1be]" />
                    <span>Gold VIP Member</span>
                  </span>
                )}
                {/* NÚT CHỈNH SỬA THÔNG TIN */}
                <button onClick={openEditModal} className="p-1.5 bg-gray-100 hover:bg-[#31b1be] hover:text-white text-slate-500 rounded-lg transition-all cursor-pointer border border-gray-200 border-0" title="Chỉnh sửa hồ sơ">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#31b1be]" />
              <span className="font-semibold">{currentUser.email}</span>
            </p>

            <div className="pt-3 flex flex-wrap justify-center sm:justify-start gap-4">
              <div className="bg-gray-50 px-4 py-2 rounded-xl text-center min-w-28 border border-gray-200">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Điểm tích lũy</span>
                <p className="text-sm font-bold text-[#31b1be] mt-0.5 font-mono">
                  {currentUser.role === 'VIP' ? '2,850 Pts' : '350 Pts'}
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-xl text-center min-w-28 border border-gray-200">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Hạn Sử Dụng</span>
                <p className="text-sm font-bold text-slate-700 mt-0.5 font-mono">Vô thời hạn</p>
              </div>
            </div>
          </div>

          <div className="bg-[#31b1be]/5 border border-[#31b1be]/10 p-4 rounded-2xl flex flex-col justify-center items-center text-center shrink-0 w-full sm:w-auto">
            <Award className="w-7 h-7 text-[#31b1be] fill-[#31b1be]/20 mb-1" />
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Hạng Thành Viên</span>
            <strong className="text-xs text-[#31b1be] uppercase mt-1 tracking-wide font-black">
              {currentUser.role === 'VIP' ? 'Gold Privilege' : currentUser.role === 'ADMIN' ? 'Ban Quản Trị' : 'Khách Hàng'}
            </strong>
          </div>
        </div>

        {/* Cột Phải: Thông tin ví xu */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Wallet className="w-20 h-20 text-[#31b1be]" />
          </div>

          <div className="space-y-1.5 z-10 font-sans">
            <div className="flex items-center space-x-2 text-[#31b1be] text-xs font-bold">
              <CreditCard className="w-4 h-4 text-[#31b1be]" />
              <span>CineAura Wallet (Ký Số)</span>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono font-bold">Số xu kỹ thuật khả dụng</p>
            <p className="text-3xl font-black text-[#31b1be] font-display tracking-tight pt-1 font-mono">
              {formatVND(currentUser.soDu)}
            </p>
          </div>

          <div className="pt-6 z-10">
            <button
              onClick={() => setShowNapModal(true)}
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold rounded-xl text-xs tracking-wider uppercase transition pointer-events-auto cursor-pointer border-0 shadow-sm"
            >
              <Plus className="w-4 h-4 text-white stroke-[3.5]" />
              <span>Nạp thêm xu vào ví</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. HISTORY TICKETS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-[#31b1be]" />
          <h3 className="font-display font-extrabold text-xl text-slate-900 uppercase">Lịch Sử Mua Vé Trực Tuyến</h3>
        </div>

        <LichSuDatVe />
      </div>

      {/* 3. MODAL NẠP TIỀN */}
      <AnimatePresence>
        {showNapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNapModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white border border-gray-300 p-6 rounded-3xl shadow-2xl z-20 space-y-5">
              <div className="text-center relative text-slate-800">
                <div className="w-12 h-12 bg-[#31b1be]/10 border border-[#31b1be]/20 flex items-center justify-center rounded-2xl mx-auto mb-3"><CreditCard className="w-6 h-6 text-[#31b1be]" /></div>
                <h3 className="font-display font-extrabold text-lg text-slate-950 uppercase">Nạp Xu Vào Thẻ CineAura</h3>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Lựa chọn nhanh</label>
                <div className="grid grid-cols-3 gap-2">
                  {[100000, 200000, 500000].map((amt) => (
                    <button key={amt} onClick={() => setNapAmount(amt)} className={`py-2 rounded-xl border text-[11px] font-black font-mono transition-all border-0 cursor-pointer ${napAmount === amt ? 'bg-[#31b1be] text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-700'}`}>
                      {amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Hoặc nhập số tiền mong muốn</label>
                <div className="relative">
                  <input type="number" value={napAmount} onChange={(e) => setNapAmount(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-4 text-xs font-bold font-mono text-center focus:outline-none focus:border-[#31b1be] text-slate-850" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 uppercase font-mono font-bold">VND</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button onClick={executeNapTien} disabled={napSuccess} className="w-full py-3 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-0 cursor-pointer shadow-sm">
                  {napSuccess ? <><Check className="w-4 h-4 text-white stroke-[3.5]" /><span>Thành Công!</span></> : <><Wallet className="w-4 h-4 text-white" /><span>Nạp Tiền</span></>}
                </button>
                <button onClick={() => setShowNapModal(false)} className="w-full py-2.5 text-slate-500 hover:text-slate-800 rounded-xl text-xs transition border-0 bg-transparent cursor-pointer font-bold">Bỏ qua</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL CHỈNH SỬA THÔNG TIN CÁ NHÂN */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white border border-gray-300 p-6 rounded-3xl shadow-2xl z-20 space-y-5">
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-slate-900">
                  <Edit3 className="w-5 h-5 text-[#31b1be]" />
                  <h3 className="font-display font-extrabold text-base uppercase">Cập nhật hồ sơ</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full border-0 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={executeUpdateProfile} className="space-y-4">
                {/* Demo Ảnh hiện tại nhỏ */}
                <div className="flex justify-center mb-2 relative group w-20 h-20 mx-auto">
                  <img src={editForm.avatar || 'https://via.placeholder.com/150'} alt="Avatar Preview" className="w-full h-full rounded-full object-cover border-2 border-gray-200" />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Họ Tên / Tên hiển thị *</label>
                  <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-[#31b1be] text-slate-800" />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Địa chỉ Email *</label>
                  <input type="email" required value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-[#31b1be] text-slate-800" />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Ảnh đại diện (URL hoặc Tải lên)</label>
                  <div className="flex gap-2">
                    <input type="text" value={editForm.avatar} onChange={(e) => {
                      setEditForm({...editForm, avatar: e.target.value});
                      setAvatarFile(null); // Nếu dán link thì hủy file đã chọn
                    }} placeholder="Dán link ảnh..." className="flex-grow bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-[#31b1be] text-slate-800" />
                    
                    <label className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-xl px-4 cursor-pointer hover:bg-[#31b1be] hover:text-white transition-all text-slate-600 border-0" title="Tải ảnh từ thiết bị">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isUploading || editSuccess} className="w-full py-3.5 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-0 cursor-pointer shadow-sm disabled:opacity-70">
                    {editSuccess ? (
                      <><Check className="w-4 h-4 text-white stroke-[3.5]" /><span>Đã Lưu Xong!</span></>
                    ) : isUploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin text-white" /><span>Đang Tải Ảnh...</span></>
                    ) : (
                      <span>Lưu Thay Đổi</span>
                    )}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}