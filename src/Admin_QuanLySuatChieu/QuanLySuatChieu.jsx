import React, { useState, useEffect } from 'react';
import { CalendarRange, Plus, Pencil, Trash2, Check, X, Sparkles, Search, Film, Clock, MapPin, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuanLySuatChieu() {
  const [danhSachPhim, setDanhSachPhim] = useState([]);
  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [danhSachSuatChieu, setDanhSachSuatChieu] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // Form states
  const [selectedPhimId, setSelectedPhimId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [ngayChieu, setNgayChieu] = useState('');
  const [gioChieu, setGioChieu] = useState('');
  const [loaiGhe, setLoaiGhe] = useState('IMAX'); 
  const [giaGhe, setGiaGhe] = useState(160000);

  const formatVND = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);

  const loadAllData = () => {
    Promise.all([
      fetch('http://localhost:8080/cineaura-backend/api/movies.php').then(res => res.json()),
      fetch('http://localhost:8080/cineaura-backend/api/rooms.php').then(res => res.ok ? res.json() : []).catch(() => []),
      fetch('http://localhost:8080/cineaura-backend/api/showtimes.php').then(res => res.json())
    ])
    .then(([moviesData, roomsData, showtimesData]) => {
      setDanhSachPhim(moviesData);
      
      const validRooms = roomsData.length > 0 ? roomsData : [
        { id: '1', theater_name: 'CineAura Center', name: 'Phòng VIP IMAX' }
      ];
      setDanhSachPhong(validRooms);

      const formattedShowtimes = showtimesData.map(item => {
        const movieMatch = moviesData.find(m => String(m.id) === String(item.movie_id));
        const roomMatch = validRooms.find(r => String(r.id) === String(item.room_id));
        
        return {
          id: item.id,
          phimId: item.movie_id,
          tenPhim: movieMatch ? movieMatch.title : 'Phim ẩn danh',
          roomId: item.room_id,
          rapChieu: roomMatch ? roomMatch.theater_name : 'CineAura Center',
          phongChieu: roomMatch ? roomMatch.name : (item.room_name || 'Phòng chiếu rạp'),
          ngayChieu: item.show_date,
          gioChieu: item.show_time ? item.show_time.substring(0, 5) : '00:00',
          loaiGhe: item.price > 200000 ? 'VIP' : (item.price > 100000 ? 'IMAX' : 'NORMAL'),
          giaGhe: item.price || 120000
        };
      });
      setDanhSachSuatChieu(formattedShowtimes);
    })
    .catch(err => console.error("Lỗi đồng bộ dữ liệu:", err));
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const openFormForAdd = () => {
    setIsEditing(null);
    if(danhSachPhim.length > 0) setSelectedPhimId(danhSachPhim[0].id);
    if(danhSachPhong.length > 0) setSelectedRoomId(danhSachPhong[0].id);
    
    const today = new Date().toISOString().split('T')[0];
    setNgayChieu(today);
    setGioChieu('19:00');
    setLoaiGhe('IMAX');
    setGiaGhe(160000);
    setShowForm(true);
  };

  // ĐÃ SỬA LỖI: Vá lỗ hổng Ghost State cho dữ liệu cũ
  const openFormForEdit = (sc) => {
    setIsEditing(sc.id);
    
    // Nếu dữ liệu cũ không có room_id, ép lấy ID của phòng đầu tiên trong danh sách
    const safePhimId = sc.phimId || (danhSachPhim.length > 0 ? danhSachPhim[0].id : '');
    const safeRoomId = sc.roomId || (danhSachPhong.length > 0 ? danhSachPhong[0].id : '');

    setSelectedPhimId(safePhimId);
    setSelectedRoomId(safeRoomId);
    setNgayChieu(sc.ngayChieu || '');
    setGioChieu(sc.gioChieu || '');
    setLoaiGhe(sc.loaiGhe || 'IMAX');
    setGiaGhe(sc.giaGhe || 160000);
    setShowForm(true);
  };

  const handleSaveSuatChieu = (e) => {
    e.preventDefault();
    
    // ĐÃ SỬA: Hiển thị đích danh trường nào đang bị rỗng để dễ bắt bệnh
    if (!selectedPhimId || !selectedRoomId || !ngayChieu || !gioChieu) {
      alert(`Bị thiếu dữ liệu bộ nhớ! Chi tiết:\n- Phim ID: ${selectedPhimId}\n- Phòng ID: ${selectedRoomId}\n- Ngày: ${ngayChieu}\n- Giờ: ${gioChieu}`);
      return;
    }

    const formData = new FormData();
    formData.append('movie_id', selectedPhimId);
    formData.append('room_id', selectedRoomId);
    formData.append('show_date', ngayChieu);
    formData.append('show_time', gioChieu);
    formData.append('price', giaGhe);

    let apiUrl = 'http://localhost:8080/cineaura-backend/api/add_showtime.php';
    if (isEditing) {
      apiUrl = 'http://localhost:8080/cineaura-backend/api/update_showtime.php';
      formData.append('id', isEditing);
    }

    fetch(apiUrl, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        loadAllData();
        setShowForm(false);
      } else {
        alert(data.message);
      }
    });
  };

  const handleXoaSuatChieu = (id) => {
    if (window.confirm('Bạn có đồng ý xóa suất chiếu này?')) {
      fetch('http://localhost:8080/cineaura-backend/api/delete_showtime.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      }).then(() => loadAllData());
    }
  };

  const filteredSuatChieu = danhSachSuatChieu.filter(sc => 
    (sc.tenPhim && sc.tenPhim.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200 text-left">
      <div className="flex justify-between items-center bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-1.5 text-brand-amber font-mono text-[9px] uppercase font-bold">
            <CalendarRange className="w-3.5 h-3.5" /><span>Kế hoạch trình chiếu</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white uppercase">Quản Lý Suất Chiếu</h2>
        </div>
        <button onClick={openFormForAdd} className="flex items-center space-x-2 py-3.5 px-6 bg-brand-amber text-black font-extrabold text-xs rounded-xl uppercase shadow-lg border-0 cursor-pointer z-10">
          <Plus className="w-4 h-4 stroke-[3]" /><span>Thêm suất chiếu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm tên phim..." className="w-full bg-black/50 border border-white/5 py-2 px-3.5 pl-9 rounded-xl text-xs text-white focus:outline-none" />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="px-5 py-4 font-bold">Mã</th>
                  <th className="px-5 py-4 font-bold">Tên Phim</th>
                  <th className="px-5 py-4 font-bold">Rạp & Phòng</th>
                  <th className="px-5 py-4 font-bold text-center">Thời Gian</th>
                  <th className="px-5 py-4 font-bold text-center w-24">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15">
                {filteredSuatChieu.map((sc) => (
                  <tr key={sc.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 font-mono font-bold">{sc.id}</td>
                    <td className="px-5 py-4"><strong className="text-white text-sm">{sc.tenPhim}</strong></td>
                    <td className="px-5 py-4"><div className="text-brand-amber font-bold">{sc.rapChieu}</div><div className="text-gray-400 text-[10px] font-mono">{sc.phongChieu}</div></td>
                    <td className="px-5 py-4 text-center">
                      <div className="inline-block bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg">
                        <div className="font-bold text-white"><Clock className="w-3 h-3 inline mr-1 text-brand-amber" />{sc.gioChieu}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">{sc.ngayChieu}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button onClick={() => openFormForEdit(sc)} className="p-1.5 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded cursor-pointer border-0 transition">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleXoaSuatChieu(sc.id)} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded cursor-pointer border-0 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                <span className="text-[10px] font-bold text-brand-amber uppercase tracking-widest font-mono"><Sparkles className="w-3 h-3 inline mr-1" />{isEditing ? 'Sửa Lịch Chiếu' : 'Thêm Lịch Chiếu'}</span>
                <button onClick={() => setShowForm(false)} className="text-gray-500 bg-white/5 p-1 rounded-full border-0 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveSuatChieu} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Phim *</label>
                  <select value={selectedPhimId} onChange={(e) => setSelectedPhimId(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3 rounded-xl text-white outline-none">
                    {danhSachPhim.map(p => <option key={p.id} value={p.id} className="bg-[#0c0c13]">{p.title}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Phòng Chiếu *</label>
                  <select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3 rounded-xl text-white outline-none">
                    {danhSachPhong.map(r => <option key={r.id} value={r.id} className="bg-[#0c0c13]">{r.theater_name} - {r.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase font-mono block">Ngày *</label>
                    <input style={{ colorScheme: 'dark' }} type="date" required value={ngayChieu} onChange={(e) => setNgayChieu(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3.5 rounded-xl text-white outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase font-mono block">Giờ *</label>
                    <input style={{ colorScheme: 'dark' }} type="time" required value={gioChieu} onChange={(e) => setGioChieu(e.target.value)} className="w-full bg-black/40 border border-white/5 py-2.5 px-3.5 rounded-xl text-white outline-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-brand-red text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer border-0 mt-4">Xác Nhận Lưu</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}