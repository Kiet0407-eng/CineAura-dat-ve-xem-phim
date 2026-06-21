import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Pencil, Trash2, Check, X, Search, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PhongChieu() {
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [danhSachRap, setDanhSachRap] = useState([]); // Lấy từ Quản Lý Rạp sang
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null);

  // Form State
  const [rapId, setRapId] = useState('');
  const [tenPhong, setTenPhong] = useState('');
  const [sucChua, setSucChua] = useState(80);
  const [format, setFormat] = useState('2D');

  const loadData = () => {
    Promise.all([
      fetch('http://localhost:8080/cineaura-backend/api/theaters.php').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:8080/cineaura-backend/api/rooms.php').then(res => res.ok ? res.json() : [])
    ])
    .then(([theaters, rooms]) => {
      setDanhSachRap(theaters);
      if(theaters.length > 0 && !rapId) setRapId(theaters[0].id);

      // Ghép tên rạp vào phòng để hiển thị UI
      const formattedRooms = rooms.map(room => {
        const rapMatch = theaters.find(t => String(t.id) === String(room.theater_id));
        return {
          id: room.id,
          rapId: room.theater_id,
          rap: rapMatch ? rapMatch.name : 'Rạp chưa xác định',
          ten: room.name,
          sucChua: room.capacity || 80,
          format: room.format || '2D'
        };
      });
      setDanhSachPhong(formattedRooms);
    })
    .catch(err => console.error("Lỗi:", err));
  };

  useEffect(() => { loadData(); }, []);

  const openForm = (room = null) => {
    if (room) {
      setIsEditing(room.id);
      setRapId(room.rapId);
      setTenPhong(room.ten);
      setSucChua(room.sucChua);
      setFormat(room.format);
    } else {
      setIsEditing(null);
      setTenPhong('');
      setSucChua(80);
      setFormat('2D');
      if(danhSachRap.length > 0) setRapId(danhSachRap[0].id);
    }
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!rapId || !tenPhong) { alert('Vui lòng chọn rạp và nhập tên phòng!'); return; }

    const formData = new FormData();
    formData.append('theater_id', rapId);
    formData.append('name', tenPhong);
    formData.append('capacity', sucChua);
    formData.append('format', format);

    let apiUrl = isEditing ? 'http://localhost:8080/cineaura-backend/api/update_room.php' : 'http://localhost:8080/cineaura-backend/api/add_room.php';
    if(isEditing) formData.append('id', isEditing);

    fetch(apiUrl, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if(data.success) { loadData(); setShowForm(false); } 
      else alert(data.message);
    })
    .catch(() => alert('Hệ thống đang chạy giả lập. Vui lòng kiểm tra file API add_room.php backend.'));
  };

  const handleDelete = (id) => {
    if(window.confirm('Xóa phòng này sẽ ảnh hưởng các suất chiếu liên quan. Tiếp tục?')) {
       fetch('http://localhost:8080/cineaura-backend/api/delete_room.php', {
         method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
       }).then(() => loadData()).catch(() => alert('Đã xóa (Giả lập)'));
    }
  };

  const filtered = danhSachPhong.filter(p => p.ten.toLowerCase().includes(searchQuery.toLowerCase()) || p.rap.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200 text-left">
      <div className="flex justify-between items-center bg-brand-dark-card border border-white/5 p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-[#31b1be] font-mono text-[9px] uppercase font-bold">
            <LayoutGrid className="w-3.5 h-3.5" /><span>Tổ Chức Không Gian</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white uppercase">Phòng Chiếu Hệ Thống</h2>
        </div>
        <button onClick={() => openForm()} className="py-3 px-6 bg-[#31b1be] hover:bg-[#208a95] text-white font-extrabold text-xs rounded-xl uppercase border-0 cursor-pointer flex items-center gap-2">
          <Plus className="w-4 h-4" /><span>Thêm phòng chiếu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Tìm phòng chiếu..." className="w-full bg-black/50 border border-white/5 py-2 px-3.5 pl-9 rounded-xl text-xs text-white outline-none" />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr><th className="p-4">Rạp Thuộc Về</th><th className="p-4">Tên Phòng Máy</th><th className="p-4 text-center">Sức Chứa</th><th className="p-4 text-center">Hành Động</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="p-4 font-bold text-gray-400"><Building className="w-3 h-3 inline mr-1 text-brand-amber"/>{p.rap}</td>
                    <td className="p-4"><strong className="text-white text-sm">{p.ten}</strong> <span className="ml-1 text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono text-[#31b1be]">{p.format}</span></td>
                    <td className="p-4 text-center font-mono font-bold text-emerald-400">{p.sucChua} Ghế</td>
                    <td className="p-4 text-center">
                      <button onClick={() => openForm(p)} className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded cursor-pointer border-0 mr-1"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-red-500/10 text-red-500 rounded cursor-pointer border-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-[10px] font-bold text-[#31b1be] uppercase font-mono">{isEditing ? 'Sửa Phòng' : 'Thêm Phòng Máy'}</span>
                <button onClick={() => setShowForm(false)} className="text-gray-500 bg-white/5 p-1 rounded-full border-0 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Cụm Rạp *</label>
                  <select value={rapId} onChange={e=>setRapId(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3 rounded-xl text-white outline-none">
                    {danhSachRap.length === 0 && <option value="">Vui lòng tạo Rạp Chiếu trước</option>}
                    {danhSachRap.map(r => <option key={r.id} value={r.id} className="bg-[#0b0b12]">{r.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Tên phòng *</label>
                  <input type="text" required value={tenPhong} onChange={e=>setTenPhong(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3.5 rounded-xl text-white outline-none" placeholder="VD: Phòng 03 - 3D" />
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase font-mono block">Sức chứa (Ghế)</label>
                    <input type="number" required value={sucChua} onChange={e=>setSucChua(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3.5 rounded-xl text-white outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase font-mono block">Định dạng chiếu</label>
                    <select value={format} onChange={e=>setFormat(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3 rounded-xl text-white outline-none">
                      <option value="2D" className="bg-[#0b0b12]">2D</option>
                      <option value="IMAX" className="bg-[#0b0b12]">IMAX</option>
                      <option value="VIP" className="bg-[#0b0b12]">VIP</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#31b1be] text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer border-0 mt-4">Lưu Phòng Chiếu</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}