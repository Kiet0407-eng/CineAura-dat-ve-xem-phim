import React, { useState, useEffect } from 'react';
import { Tags, Plus, Pencil, Trash2, Check, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TheLoaiPhim() {
  // KHÔNG DÙNG MẢNG CỨNG NỮA -> Khởi tạo mảng rỗng chờ dữ liệu từ DB
  const [danhSachTheLoai, setDanhSachTheLoai] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null);

  const [tenTheLoai, setTenTheLoai] = useState('');
  const [moTa, setMoTa] = useState('');

  // 1. Tải danh sách từ MySQL
  const loadData = () => {
    fetch('http://localhost:8080/cineaura-backend/api/genres.php')
      .then(res => res.json())
      .then(data => setDanhSachTheLoai(data))
      .catch(err => console.error("Lỗi lấy thể loại:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openForm = (item = null) => {
    if (item) {
      setIsEditing(item.id);
      setTenTheLoai(item.name || item.ten);
      setMoTa(item.description || item.moTa);
    } else {
      setIsEditing(null);
      setTenTheLoai('');
      setMoTa('');
    }
    setShowForm(true);
  };

  // 2. Thêm mới / Cập nhật vào MySQL
  const handleSave = (e) => {
    e.preventDefault();
    if (!tenTheLoai) return;

    const formData = new FormData();
    formData.append('name', tenTheLoai);
    formData.append('description', moTa);

    let apiUrl = 'http://localhost:8080/cineaura-backend/api/add_genre.php';
    if (isEditing) {
      apiUrl = 'http://localhost:8080/cineaura-backend/api/update_genre.php';
      formData.append('id', isEditing);
    }

    fetch(apiUrl, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          loadData(); // Tải lại DB mới nhất
          setShowForm(false);
        } else alert(data.message);
      })
      .catch(() => alert('Bạn cần tạo file PHP API add_genre.php nhé!'));
  };

  // 3. Xóa vĩnh viễn khỏi MySQL
  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa thể loại này khỏi CSDL?')) {
      fetch('http://localhost:8080/cineaura-backend/api/delete_genre.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) loadData(); // Load lại sau khi xóa
        else alert(data.message);
      })
      .catch(() => alert('Bạn cần tạo file PHP API delete_genre.php nhé!'));
    }
  };

  const filtered = danhSachTheLoai.filter(tl => 
    (tl.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-yellow-500 font-mono text-[9px] uppercase font-bold">
            <Tags className="w-3.5 h-3.5" /><span>Phân nhóm nội dung</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white uppercase">Thể Loại Phim</h2>
          <p className="text-xs text-gray-400">Danh mục phân loại để khách hàng dễ dàng tìm kiếm nội dung ưa thích.</p>
        </div>
        <button onClick={() => openForm()} className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl uppercase border-0 cursor-pointer flex items-center gap-2 shadow-lg">
          <Plus className="w-4 h-4" /><span>Thêm Thể Loại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Tìm thể loại..." className="w-full bg-black/50 border border-white/5 py-2.5 px-4 pl-10 rounded-xl text-xs text-white outline-none" />
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <table className="w-full text-xs text-left text-gray-300">
            <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
              <tr>
                <th className="p-4 w-16">ID</th>
                <th className="p-4">Tên Thể Loại</th>
                <th className="p-4">Mô Tả Chi Tiết</th>
                <th className="p-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/15">
              {filtered.map(tl => (
                <tr key={tl.id} className="hover:bg-white/5">
                  <td className="p-4 font-mono font-bold text-yellow-500">TL-{tl.id}</td>
                  <td className="p-4"><strong className="text-white text-sm">{tl.name}</strong></td>
                  <td className="p-4 text-gray-400 max-w-xs truncate">{tl.description}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => openForm(tl)} className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded cursor-pointer border-0 mr-1"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(tl.id)} className="p-1.5 bg-red-500/10 text-red-500 rounded cursor-pointer border-0"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-[10px] font-bold text-yellow-500 uppercase font-mono">{isEditing ? 'Sửa Thể Loại' : 'Thêm Thể Loại Mới'}</span>
                <button onClick={() => setShowForm(false)} className="text-gray-500 bg-white/5 p-1 rounded-full border-0 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Tên Thể Loại *</label>
                  <input type="text" required value={tenTheLoai} onChange={e=>setTenTheLoai(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3.5 rounded-xl text-white outline-none" placeholder="VD: Hành động" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Mô Tả Chi Tiết</label>
                  <textarea value={moTa} onChange={e=>setMoTa(e.target.value)} rows={4} className="w-full bg-black/40 border border-white/5 py-2.5 px-3.5 rounded-xl text-white outline-none resize-none" placeholder="Đặc điểm nhận dạng..." />
                </div>
                <button type="submit" className="w-full py-3.5 bg-red-600 text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer border-0 mt-4">Lưu Dữ Liệu</button>
              </form>
            </motion.div>
          ) : (
            <div className="bg-brand-dark-card border border-white/10 p-8 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto text-yellow-500"><Tags className="w-5.5 h-5.5" /></div>
              <h4 className="font-display font-bold text-white text-base">Bảng Điều Khiển Thể Loại</h4>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Vui lòng thêm thể loại phim để tiếp tục tổ chức danh mục nội dung chất lượng cao của hệ thống.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}