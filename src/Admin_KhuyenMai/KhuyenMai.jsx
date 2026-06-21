import React, { useState, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Check, X, 
  Sparkles, Search, Percent, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KhuyenMai() {
  const [promoList, setPromoList] = useState([]);

  // LẤY DỮ LIỆU TỪ MYSQL THAY VÌ LOCAL STORAGE
  const loadPromos = () => {
    fetch('http://localhost:8080/cineaura-backend/api/promotions.php')
      .then(res => res.json())
      .then(data => setPromoList(data))
      .catch(err => console.error("Lỗi lấy khuyến mãi:", err));
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // Form states
  const [code, setCode] = useState('');
  const [loaiGiam, setLoaiGiam] = useState('PERCENT');
  const [mucGiam, setMucGiam] = useState('');
  const [conditional, setConditional] = useState('');
  const [hanDung, setHanDung] = useState('');
  const [trangThai, setTrangThai] = useState('HOAT_DONG');

  const resetForm = () => {
    setCode('');
    setLoaiGiam('PERCENT');
    setMucGiam('');
    setConditional('');
    setHanDung('');
    setTrangThai('HOAT_DONG');
  };

  const openFormForAdd = () => {
    setIsEditing(null);
    resetForm();
    setShowForm(true);
  };

  const openFormForEdit = (item) => {
    setIsEditing(item.code);
    setCode(item.code);
    setLoaiGiam(item.loaiGiam);
    setMucGiam(item.mucGiam);
    // API trả về conditional_min, map vào form là conditional
    setConditional(item.conditional_min);
    
    if (item.hanDung && item.hanDung.includes('/')) {
      const [d, m, y] = item.hanDung.split('/');
      setHanDung(`${y}-${m}-${d}`);
    } else {
      setHanDung(item.hanDung);
    }
    setTrangThai(item.trangThai);
    setShowForm(true);
  };

  // LƯU DỮ LIỆU XUỐNG MYSQL
  const handleSave = (e) => {
    e.preventDefault();
    const codeChuanHoa = code.toUpperCase().trim();

    if (!codeChuanHoa || !mucGiam || !conditional || !hanDung) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    const promoData = {
      code: codeChuanHoa,
      loaiGiam,
      mucGiam: Number(mucGiam),
      conditional: Number(conditional),
      hanDung, 
      trangThai
    };

    fetch('http://localhost:8080/cineaura-backend/api/save_promotion.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promoData)
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        loadPromos();
        setShowForm(false);
        resetForm();
      } else {
        alert("Lỗi: " + data.message);
      }
    });
  };

  // XÓA DỮ LIỆU TỪ MYSQL
  const handleDelete = (codeToDelete) => {
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn mã khuyến mãi ${codeToDelete}?`)) {
      fetch('http://localhost:8080/cineaura-backend/api/delete_promotion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToDelete })
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) loadPromos();
      });
    }
  };

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  const formatDateVN = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString; 
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredList = promoList.filter(item => 
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10 text-left">
          <div className="flex items-center space-x-1.5 text-brand-amber font-mono text-[9px] uppercase tracking-widest font-bold">
            <Percent className="w-3.5 h-3.5 text-brand-amber" />
            <span>Chính sách gia tăng doanh thu</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Quản Lý Khuyến Mãi</h2>
          <p className="text-xs text-gray-400">Thiết kế mã quà tặng, voucher chiết khấu theo %, VNĐ áp dụng tại rạp CineAura.</p>
        </div>

        <button onClick={openFormForAdd} className="flex items-center justify-center space-x-2 py-3.5 px-6 bg-brand-red hover:bg-red-600 text-white font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all duration-150 cursor-pointer shadow-lg glow-red active:scale-[0.99] shrink-0 z-10 border-0">
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Thêm mã ưu đãi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Table Layout */}
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0c0c13] p-4 rounded-xl border border-white/5">
            <div className="relative flex-1">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm mã code..." className="w-full bg-black/50 border border-white/5 focus:border-brand-amber py-2 px-3.5 pl-9 rounded-xl text-xs text-white focus:outline-none transition" />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase shrink-0">Đang hiển thị: {filteredList.length} mã</div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="px-5 py-4 font-bold">Mã Code</th>
                  <th className="px-5 py-4 font-bold text-center">Mức Giảm</th>
                  <th className="px-5 py-4 font-bold text-right hidden sm:table-cell">Điều Kiện (Min)</th>
                  <th className="px-5 py-4 font-bold text-center">Hạn Sử Dụng</th>
                  <th className="px-5 py-4 font-bold text-center">Trạng Thái</th>
                  <th className="px-5 py-4 font-bold text-center w-28">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15 text-left">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center text-gray-500 font-mono">Không tìm thấy mã ưu đãi hợp lệ nào.</td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.code} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-brand-amber text-sm tracking-wider">{item.code}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono font-black text-xs ${item.loaiGiam === 'PERCENT' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'}`}>
                          {item.loaiGiam === 'PERCENT' ? `-${item.mucGiam}%` : `-${formatVND(item.mucGiam)}`}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-gray-400 hidden sm:table-cell">
                        {formatVND(item.conditional_min)}
                      </td>
                      <td className="px-5 py-4 text-center text-gray-300 font-medium whitespace-nowrap">{formatDateVN(item.hanDung)}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 text-[9px] uppercase font-bold rounded-full ${item.trangThai === 'HOAT_DONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400 border border-gray-500/15'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.trangThai === 'HOAT_DONG' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                          <span>{item.trangThai === 'HOAT_DONG' ? 'Đang chạy' : 'Hết hạn'}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => openFormForEdit(item)} className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition border border-yellow-500/15 cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(item.code)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition border border-red-500/15 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4 text-left shadow-xl">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-[10px] font-bold text-brand-amber uppercase tracking-widest font-mono flex items-center space-x-1.5"><Sparkles className="w-3.5 h-3.5 text-brand-amber" /><span>{isEditing ? 'Sửa Mã Ưu Đãi' : 'Thêm Mã Ưu Đãi'}</span></span>
                  <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-500 hover:text-white transition cursor-pointer p-0.5 bg-white/5 hover:bg-white/10 rounded-full border-0"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-left">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Mã Giftcode ưu đãi *</label>
                    <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. HALOSALE50" disabled={!!isEditing} className={`w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none font-mono uppercase tracking-widest ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Hình thức giảm *</label>
                      <select value={loaiGiam} onChange={(e) => setLoaiGiam(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3 rounded-xl text-white focus:outline-none font-bold">
                        <option value="PERCENT" className="bg-[#0b0b12]">Giảm theo %</option>
                        <option value="VND" className="bg-[#0b0b12]">Giảm theo VNĐ</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Mức giảm tương ứng *</label>
                      <input type="number" required min={1} value={mucGiam} onChange={(e) => setMucGiam(Number(e.target.value))} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none text-xs font-mono" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Hóa đơn tối thiểu áp dụng *</label>
                    <input type="number" required min={0} step={10000} value={conditional} onChange={(e) => setConditional(Number(e.target.value))} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition text-xs font-mono" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Hạn sử dụng *</label>
                    <input type="date" required value={hanDung} onChange={(e) => setHanDung(e.target.value)} style={{ colorScheme: 'dark' }} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none text-xs font-mono" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Thiết lập hoạt động *</label>
                    <select value={trangThai} onChange={(e) => setTrangThai(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3 rounded-xl text-white focus:outline-none font-bold">
                      <option value="HOAT_DONG" className="bg-[#0b0b12]">Hoạt động tốt</option>
                      <option value="HET_HAN" className="bg-[#0b0b12]">Ngưng / Hết hạn</option>
                    </select>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button type="submit" className="w-full py-3.5 bg-brand-red hover:bg-red-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 border-0 shadow-lg active:scale-[0.99]"><Check className="w-4 h-4 stroke-[3]" /><span>Xác minh Voucher</span></button>
                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="w-full py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl text-[10px] uppercase tracking-widest font-mono transition border-0 bg-transparent cursor-pointer">Hủy bỏ tác vụ</button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-brand-dark-card border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mx-auto text-brand-amber"><Gift className="w-5.5 h-5.5" /></div>
                <h4 className="font-display font-bold text-white text-base">Gia tăng tương tác</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Cập nhật các chương trình ưu đãi, mã giảm giá kích thích tỉ lệ mua vé xem bóng lớn lúc cao điểm.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}