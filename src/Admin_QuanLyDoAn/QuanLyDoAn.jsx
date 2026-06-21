import React, { useState, useEffect } from 'react';
import { 
  Utensils, Plus, Pencil, Trash2, Check, X, 
  Sparkles, Search, Store 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuanLyDoAn() {
  const [danhSachDoAn, setDanhSachDoAn] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // Form fields
  const [tenDoAn, setTenDoAn] = useState('');
  const [loai, setLoai] = useState('COMBO');
  const [gia, setGia] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [moTa, setMoTa] = useState('');
  const [banChay, setBanChay] = useState(false);
  const [trangThai, setTrangThai] = useState('CON_HANG');

  // HÀM LẤY DỮ LIỆU TỪ DATABASE MYSQL
  const loadFoods = () => {
    fetch('http://localhost:8080/cineaura-backend/api/foods.php')
      .then(res => res.json())
      .then(data => setDanhSachDoAn(data))
      .catch(err => console.error("Lỗi tải thực đơn:", err));
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  const resetForm = () => {
    setTenDoAn('');
    setLoai('COMBO');
    setGia('');
    setHinhAnh('');
    setMoTa('');
    setBanChay(false);
    setTrangThai('CON_HANG');
  };

  const openFormForAdd = () => {
    setIsEditing(null);
    resetForm();
    setShowForm(true);
  };

  const openFormForEdit = (item) => {
    setIsEditing(item.id);
    setTenDoAn(item.tenDoAn);
    setLoai(item.loai || 'COMBO');
    setGia(item.gia);
    setHinhAnh(item.hinhAnh);
    setMoTa(item.moTa || '');
    setBanChay(!!item.banChay);
    setTrangThai(item.trangThai || 'CON_HANG');
    setShowForm(true);
  };

  // HÀM LƯU DỮ LIỆU XUỐNG MYSQL (THÊM / SỬA)
  const handleSaveDoAn = (e) => {
    e.preventDefault();
    const tenChuanHoa = tenDoAn.trim();
    const moTaChuanHoa = moTa.trim();

    if (!tenChuanHoa || !moTaChuanHoa || !gia || gia <= 0) {
      alert('Vui lòng cung cấp đầy đủ thông tin bắt buộc.');
      return;
    }

    const itemDoAn = {
      id: isEditing || `F${Date.now()}`,
      tenDoAn: tenChuanHoa,
      loai,
      gia: Number(gia),
      hinhAnh,
      moTa: moTaChuanHoa,
      banChay: banChay ? 1 : 0, // Backend nhận số 1/0
      trangThai
    };

    fetch('http://localhost:8080/cineaura-backend/api/save_food.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemDoAn)
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        loadFoods(); // Tải lại bảng ngay lập tức
        setShowForm(false);
        resetForm();
      } else {
        alert(data.message || "Lưu thất bại!");
      }
    })
    .catch(err => console.error("Lỗi lưu món:", err));
  };

  // HÀM XÓA DỮ LIỆU KHỎI MYSQL
  const handleDeleteDoAn = (id, ten) => {
    if (window.confirm(`Bạn muốn loại bỏ sản phẩm "${ten}" hoàn toàn khỏi thực đơn rạp chứ?`)) {
      fetch('http://localhost:8080/cineaura-backend/api/delete_food.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) loadFoods();
        else alert(data.message || "Xóa thất bại!");
      })
      .catch(err => console.error("Lỗi xóa món:", err));
    }
  };

  const filteredDoAn = danhSachDoAn.filter(item => 
    item.tenDoAn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.moTa && item.moTa.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10 text-left">
          <div className="flex items-center space-x-1.5 text-brand-amber font-mono text-[9px] uppercase tracking-widest font-bold">
            <Utensils className="w-3.5 h-3.5 text-brand-amber" />
            <span>Phục vụ ẩm thực CineAura Premium</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Quản Lý Đồ Ăn & Combo</h2>
          <p className="text-xs text-gray-400">Điều chỉnh menu của quầy snacks, đơn giá bắp bơ thượng hạng, đồ uống lạnh và gói Combo rạp.</p>
        </div>
        <button onClick={openFormForAdd} className="flex items-center justify-center space-x-2 py-3.5 px-6 bg-brand-amber hover:bg-[#c9900c] text-black font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all duration-155 cursor-pointer shadow-lg glow-amber active:scale-[0.99] border-0">
          <Plus className="w-4 h-4 stroke-[3]" /><span>Thêm Combo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0c0c13] p-4 rounded-xl border border-white/5">
            <div className="relative flex-1">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm món bắp rang, soda hoặc combo..." className="w-full bg-black/50 border border-white/5 focus:border-brand-amber py-2 px-3.5 pl-9 rounded-xl text-xs text-white focus:outline-none transition" />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase shrink-0">Tổng số thực đơn: {filteredDoAn.length} món</div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="px-5 py-4 font-bold text-center w-16">Hình Ảnh</th>
                  <th className="px-5 py-4 font-bold">Tên Combo / Món Ăn</th>
                  <th className="px-5 py-4 font-bold hidden sm:table-cell">Mô tả ngắn</th>
                  <th className="px-5 py-4 font-bold text-right">Giá tiền</th>
                  <th className="px-5 py-4 font-bold text-center w-28">Trạng Thái</th>
                  <th className="px-5 py-4 font-bold text-center w-24">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15">
                {filteredDoAn.length === 0 ? (
                  <tr><td colSpan="6" className="px-5 py-16 text-center text-gray-500 font-mono">Chưa có món ăn nào trong hệ thống.</td></tr>
                ) : (
                  filteredDoAn.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 text-center">
                        <img src={item.hinhAnh || 'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&q=80&w=300'} alt={item.tenDoAn} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-xl border border-white/10 mx-auto bg-black/40" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="space-y-1">
                          <strong className="text-white text-sm font-semibold block line-clamp-1">{item.tenDoAn}</strong>
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">CODE: {item.id}</span>
                            {item.banChay ? <span className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-[8px] px-1.5 py-0.5 rounded font-black font-mono">HOT SELLER</span> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-400 max-w-[200px] hidden sm:table-cell">
                        <p className="line-clamp-2 leading-relaxed">{item.moTa}</p>
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-white whitespace-nowrap">{formatVND(item.gia)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[9px] uppercase font-bold ${(item.trangThai === 'HET_HANG') ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${(item.trangThai === 'HET_HANG') ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <span>{(item.trangThai === 'HET_HANG') ? 'Hết Hàng' : 'Còn Hàng'}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button onClick={() => openFormForEdit(item)} className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition border border-yellow-500/15 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteDoAn(item.id, item.tenDoAn)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition border border-red-500/15 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl text-left">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-[10px] font-bold text-brand-amber uppercase tracking-widest font-mono flex items-center space-x-1.5"><Sparkles className="w-3.5 h-3.5 text-brand-amber" /><span>{isEditing ? 'Sửa món ăn / Combo' : 'Đưa Combo mới lên kệ'}</span></span>
                  <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-500 hover:text-white transition cursor-pointer p-0.5 bg-white/5 hover:bg-white/10 rounded-full border-0"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleSaveDoAn} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Tên Combo hoặc Snack *</label>
                    <input type="text" required value={tenDoAn} onChange={(e) => setTenDoAn(e.target.value)} placeholder="e.g. Combo Cặp Đôi Đặc Quyền" className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Chọn Phân Loại *</label>
                      <select value={loai} onChange={(e) => setLoai(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3 rounded-xl text-white focus:outline-none text-xs font-bold">
                        <option value="COMBO" className="bg-[#0b0b12]">Gói Combo</option>
                        <option value="POP_CORN" className="bg-[#0b0b12]">Bắp sấy (Popcorn)</option>
                        <option value="DRINK" className="bg-[#0b0b12]">Soda & Đồ uống</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Giá bán (VND) *</label>
                      <input type="number" required min="1000" value={gia} onChange={(e) => setGia(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all text-xs font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Hình Ảnh Trực Quan (URL)</label>
                    <input type="url" value={hinhAnh} onChange={(e) => setHinhAnh(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all text-xs text-brand-amber font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Tình Trạng Kho Hàng</label>
                    <div className="flex space-x-2">
                      <button type="button" onClick={() => setTrangThai('CON_HANG')} className={`flex-1 py-2 text-[10px] uppercase font-mono font-bold border rounded-xl transition-all border-0 cursor-pointer ${ trangThai === 'CON_HANG' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'bg-black/40 hover:bg-black/60 text-gray-400'}`}>Còn Hàng</button>
                      <button type="button" onClick={() => setTrangThai('HET_HANG')} className={`flex-1 py-2 text-[10px] uppercase font-mono font-bold border rounded-xl transition-all border-0 cursor-pointer ${ trangThai === 'HET_HANG' ? 'bg-red-500 text-white shadow-lg shadow-red-500/10' : 'bg-black/40 hover:bg-black/60 text-gray-400'}`}>Hết Hàng</button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Mô tả ngắn thành phần *</label>
                    <input type="text" required value={moTa} onChange={(e) => setMoTa(e.target.value)} placeholder="e.g. 1 Bắp lớn + 2 Pepsi lạnh size lớn" className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs" />
                  </div>
                  <div className="flex items-center space-x-2 bg-black/20 p-3 rounded-xl border border-white/5">
                    <input type="checkbox" id="banchay_cb" checked={banChay} onChange={(e) => setBanChay(e.target.checked)} className="w-4 h-4 accent-brand-amber rounded cursor-pointer" />
                    <label htmlFor="banchay_cb" className="text-gray-300 font-semibold cursor-pointer text-[11px] select-none text-left">Đánh dấu sản phẩm này là <strong className="text-brand-amber">Bán Chạy/HOT Selling</strong></label>
                  </div>
                  <div className="pt-2 space-y-2">
                    <button type="submit" className="w-full py-3.5 bg-brand-red hover:bg-[#c93c3c] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow duration-150 active:scale-[0.99] border-0"><Check className="w-4 h-4 stroke-[3]" /><span>Xác nhận Lưu Thực Đơn</span></button>
                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="w-full py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl text-[10px] uppercase tracking-widest font-mono transition border-0 bg-transparent cursor-pointer">Hủy bỏ tác vụ</button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-brand-dark-card border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mx-auto text-brand-amber"><Store className="w-5.5 h-5.5" /></div>
                <h4 className="font-display font-bold text-white text-base">Hồ Sơ Cập Nhật Menu</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Click vào icon cây bút chì ở bộ phận của món hoặc bấm nút <strong className="text-brand-amber font-bold">"Thêm Combo"</strong> ở trên đầu để hiệu chỉnh thông số bắp bơ nước ngọt nhanh chóng.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}