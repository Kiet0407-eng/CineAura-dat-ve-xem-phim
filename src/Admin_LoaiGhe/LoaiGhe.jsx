import React, { useState, useEffect } from 'react';
import { Palette, Pencil, Check, X, ShieldAlert, Armchair } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoaiGhe() {
  const [danhSachLoaiGhe, setDanhSachLoaiGhe] = useState([]);

  // Kéo dữ liệu từ MySQL
  const loadData = () => {
    fetch('http://localhost:8080/cineaura-backend/api/seat_types.php')
      .then(res => res.json())
      .then(data => setDanhSachLoaiGhe(data))
      .catch(err => console.error("Lỗi tải loại ghế:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // Form states
  const [tenLoai, setTenLoai] = useState('');
  const [phuThu, setPhuThu] = useState(0);
  const [moTa, setMoTa] = useState('');

  const formatVND = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);

  const openFormForEdit = (item) => {
    setIsEditing(item.id);
    setTenLoai(item.tenLoai);
    setPhuThu(item.phuThu);
    setMoTa(item.moTa);
    setShowForm(true);
  };

  // Lưu dữ liệu vào MySQL
  const handleSave = (e) => {
    e.preventDefault();
    
    const data = {
      id: isEditing,
      phuThu: Number(phuThu),
      moTa
    };

    fetch('http://localhost:8080/cineaura-backend/api/save_seat_type.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resData => {
      if (resData.success) {
         loadData(); // Tải lại bảng ngay lập tức
         setShowForm(false);
      } else {
         alert(resData.message);
      }
    });
  };

  const getColorStyle = (color) => {
    switch (color) {
      case 'red': return 'bg-red-500/10 text-red-500 border-red-500/20 border-2';
      case 'pink': return 'bg-pink-500/10 text-pink-500 border-pink-500/20 border-2';
      case 'amber': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 border-2';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20 border';
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#31b1be]/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-1.5 text-[#31b1be] font-mono text-[9px] uppercase tracking-widest font-bold">
            <Palette className="w-3.5 h-3.5" /><span>Tùy Biến Trải Nghiệm Khán Giả</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Cấu Hình Loại Ghế</h2>
          <p className="text-xs text-gray-400">Thiết lập danh mục ghế (Thường, VIP, Đôi) và cấu hình mức giá phụ thu tương ứng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2 text-xs text-brand-amber bg-brand-amber/10 p-3 rounded-xl border border-brand-amber/20 font-medium">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>Hệ thống hiện tại đang sử dụng sơ đồ ghế chuẩn CINEAURA-72. Bạn có thể thay đổi mức phụ thu giá vé tại đây.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="px-5 py-4 font-bold w-12">Màu</th>
                  <th className="px-5 py-4 font-bold">Phân Loại Ghế</th>
                  <th className="px-5 py-4 font-bold text-right">Mức Phụ Thu</th>
                  <th className="px-5 py-4 font-bold text-center w-24">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15">
                {danhSachLoaiGhe.length === 0 ? (
                  <tr><td colSpan="4" className="text-center p-8 text-gray-500">Đang tải dữ liệu từ Database...</td></tr>
                ) : danhSachLoaiGhe.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-center">
                      <div className={`w-4 h-4 rounded ${getColorStyle(item.mauSac)}`} />
                    </td>
                    <td className="px-5 py-4">
                      <strong className="text-white text-sm font-semibold">{item.tenLoai}</strong>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{item.moTa}</p>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400">
                      {item.phuThu === 0 ? 'Giá gốc' : `+ ${formatVND(item.phuThu)}`}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => openFormForEdit(item)} className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition border border-yellow-500/15 cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-[10px] font-bold text-[#31b1be] uppercase tracking-widest font-mono flex items-center space-x-1.5"><Palette className="w-3.5 h-3.5" /><span>Hiệu chỉnh giá vé</span></span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition cursor-pointer p-0.5 bg-white/5 hover:bg-white/10 rounded-full border-0"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase font-mono block">Tên Phân Loại Ghế</label>
                    <input type="text" disabled value={tenLoai} className="w-full bg-black/60 border border-white/5 py-2.5 px-3.5 rounded-xl text-gray-500 outline-none cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase font-mono block">Mức Phụ Thu (VNĐ) *</label>
                    <input type="number" required min="0" step="1000" value={phuThu} onChange={(e) => setPhuThu(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-[#31b1be] py-2.5 px-3.5 rounded-xl text-white outline-none font-mono text-lg font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase font-mono block">Ghi chú hiển thị</label>
                    <textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/5 focus:border-[#31b1be] py-2 px-3.5 rounded-xl text-white outline-none transition-all" />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full py-3.5 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer flex items-center justify-center space-x-1.5 border-0"><Check className="w-4 h-4 stroke-[3]" /><span>Cập nhật bảng giá</span></button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-brand-dark-card border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#31b1be]/10 border border-[#31b1be]/20 flex items-center justify-center mx-auto text-[#31b1be]"><Armchair className="w-5 h-5" /></div>
                <h4 className="font-display font-bold text-white text-base">Hồ Sơ Ghế Ngồi</h4>
                <p className="text-xs text-gray-400 leading-relaxed">Chọn biểu tượng sửa để định giá phụ thu cho từng phân hạng ghế. Giá này sẽ được lưu xuống Database và cộng thẳng vào hóa đơn mua vé.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}