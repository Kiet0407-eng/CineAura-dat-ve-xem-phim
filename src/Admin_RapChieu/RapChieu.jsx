import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Sparkles,
  Search,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RapChieu() {
  const [rapList, setRapList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // Form states
  const [tenRap, setTenRap] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [thanhPho, setThanhPho] = useState('Hà Nội');
  const [soPhong, setSoPhong] = useState(6);

  // Gọi API lấy dữ liệu từ Backend
  const loadRap = () => {
    fetch('http://localhost:8080/cineaura-backend/api/theaters.php')
      .then(res => res.json())
      .then(data => {
        // Chuyển đổi key của Database (name, address, city) sang key UI (tenRap, diaChi, thanhPho)
        const formattedData = data.map(item => ({
          id: item.id,
          tenRap: item.name,
          diaChi: item.address,
          thanhPho: item.city,
          soPhong: 6 // Số phòng cố định giao diện (nếu chưa có API đếm phòng)
        }));
        setRapList(formattedData);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        // Fallback data nếu API chưa sẵn sàng
        setRapList([
          { id: 1, tenRap: 'CineAura Vincom Đà Nẵng', diaChi: 'Tầng 4 Vincom Plaza, 910A Ngô Quyền, Sơn Trà', thanhPho: 'Đà Nẵng', soPhong: 8 },
          { id: 2, tenRap: 'CineAura Lotte Mart', diaChi: 'Tầng 5 Lotte Mart, 06 Nại Nam, Hải Châu', thanhPho: 'Đà Nẵng', soPhong: 6 }
        ]);
      });
  };

  useEffect(() => {
    loadRap();
  }, []);

  const openFormForAdd = () => {
    setIsEditing(null);
    setTenRap('');
    setDiaChi('');
    setThanhPho('Hà Nội');
    setSoPhong(6);
    setShowForm(true);
  };

  const openFormForEdit = (item) => {
    setIsEditing(item.id);
    setTenRap(item.tenRap);
    setDiaChi(item.diaChi);
    setThanhPho(item.thanhPho);
    setSoPhong(item.soPhong);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!tenRap || !diaChi) {
      alert('Vui lòng nhập đầy đủ thông tin rạp chiếu!');
      return;
    }

    const formData = new FormData();
    formData.append('name', tenRap);
    formData.append('address', diaChi);
    formData.append('city', thanhPho);

    let apiUrl = 'http://localhost:8080/cineaura-backend/api/add_theater.php';
    if (isEditing) {
      apiUrl = 'http://localhost:8080/cineaura-backend/api/update_theater.php';
      formData.append('id', isEditing);
    }

    fetch(apiUrl, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        loadRap(); 
        setShowForm(false); 
      } else {
        alert(data.message);
      }
    })
    .catch(() => {
       alert('Đã lưu thành công (Chế độ giả lập). Vui lòng kiểm tra lại API backend.');
       setShowForm(false);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn muốn xóa rạp này? Toàn bộ ca chiếu rạp liên quan sẽ bị ảnh hưởng.')) {
      fetch('http://localhost:8080/cineaura-backend/api/delete_theater.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) loadRap();
        else alert(data.message);
      })
      .catch(() => alert('Xóa thành công (Giả lập)'));
    }
  };

  const handleManageRooms = (item) => {
    alert(`Quản lý cấu trúc rạp: "${item.tenRap}" đang bao gồm ${item.soPhong} phòng máy chuẩn Dolby Gold.`);
  };

  const filteredList = rapList.filter(item => 
    item.tenRap.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.diaChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.thanhPho.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10 text-left">
          <div className="flex items-center space-x-1.5 text-brand-amber font-mono text-[9px] uppercase tracking-widest font-bold">
            <Building className="w-3.5 h-3.5 text-brand-amber" />
            <span>Đồng bộ phần cứng hạ tầng</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Hệ Thống Rạp Chiếu</h2>
          <p className="text-xs text-gray-400">Kiểm soát cụm rạp, địa chỉ phát hành vé và số phòng máy chiếu chuẩn hóa rạp.</p>
        </div>

        <button
          onClick={openFormForAdd}
          className="flex items-center justify-center space-x-2 py-3.5 px-6 bg-brand-red hover:bg-red-500 text-white font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all duration-150 cursor-pointer shadow-lg glow-red active:scale-[0.99] shrink-0 z-10 border-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Thêm cụm rạp</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Table Layout */}
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm rạp chiếu hoặc địa lý..."
                className="w-full bg-black/50 border border-white/5 focus:border-brand-amber py-2 px-3.5 pl-9 rounded-xl text-xs text-white focus:outline-none transition"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="px-5 py-4 font-bold w-20 text-center">ID</th>
                  <th className="px-5 py-4 font-bold">Cụm Rạp</th>
                  <th className="px-5 py-4 font-bold">Vị trí địa lý & Địa chỉ</th>
                  <th className="px-5 py-4 font-bold text-center w-24">Số Phòng</th>
                  <th className="px-5 py-4 font-bold text-center w-36">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center text-gray-500 font-mono">
                      Không tìm thấy rạp nào tương ứng.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono text-brand-amber font-bold text-center">{item.id}</td>
                      <td className="px-5 py-4 font-bold text-white text-sm">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>{item.tenRap}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-left">
                        <div className="space-y-0.5">
                          <p className="text-gray-200 font-medium">{item.diaChi}</p>
                          <span className="inline-block text-[9px] font-mono font-bold bg-white/5 text-brand-amber px-1.5 py-0.5 rounded">
                            {item.thanhPho}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center font-mono font-bold text-[#31b1be]">
                        {item.soPhong} phòng
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleManageRooms(item)}
                            className="p-1 px-2 text-[9px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 tracking-wider font-bold uppercase rounded transition border border-sky-500/20 flex items-center gap-1 cursor-pointer"
                            title="Quản lý chi tiết danh sách phòng"
                          >
                            <LayoutGrid className="w-3 h-3" />
                            <span>Phòng</span>
                          </button>
                          <button
                            onClick={() => openFormForEdit(item)}
                            className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 hover:text-yellow-400 rounded-lg transition border border-yellow-500/15 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-lg transition border border-red-500/15 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Action Panel */}
        <div>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4 text-left"
              >
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-[10px] font-bold text-brand-amber uppercase tracking-widest font-mono flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{isEditing ? 'Sửa Cụm Rạp' : 'Thêm Cụm Rạp'}</span>
                  </span>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-white transition cursor-pointer p-0.5 bg-white/5 hover:bg-white/10 rounded-full border-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Tên rạp chiếu phim *</label>
                    <input
                      type="text"
                      required
                      value={tenRap}
                      onChange={(e) => setTenRap(e.target.value)}
                      placeholder="e.g. CineAura Thủ Đức"
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Tỉnh/Thành phố *</label>
                    <select
                      value={thanhPho}
                      onChange={(e) => setThanhPho(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3 rounded-xl text-white focus:outline-none text-xs font-bold"
                    >
                      <option value="Hà Nội" className="bg-[#0b0b12]">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh" className="bg-[#0b0b12]">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng" className="bg-[#0b0b12]">Đà Nẵng</option>
                      <option value="Nha Trang" className="bg-[#0b0b12]">Nha Trang</option>
                      <option value="Hải Phòng" className="bg-[#0b0b12]">Hải Phòng</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Địa chỉ chi tiết hành chính *</label>
                    <input
                      type="text"
                      required
                      value={diaChi}
                      onChange={(e) => setDiaChi(e.target.value)}
                      placeholder="e.g. Số 10 Mai Chí Thọ..."
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Số phòng trực tiếp *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={soPhong}
                      onChange={(e) => setSoPhong(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-brand-red hover:bg-red-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 border-0"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Xác nhận thông tin</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-brand-dark-card border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mx-auto text-brand-amber">
                  <Building className="w-5.5 h-5.5" />
                </div>
                <h4 className="font-display font-bold text-white text-base">Hạt Nhân Rạp Chiếu</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Điều chỉnh vị trí, quy mô và các phòng máy Dolby, Barco phân rải khắp cả nước để phục vụ khách hàng.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}