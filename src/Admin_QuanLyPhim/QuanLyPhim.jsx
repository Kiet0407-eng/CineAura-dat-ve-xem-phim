import React, { useState, useEffect, useRef } from 'react';
import { 
  Clapperboard, Plus, Pencil, Trash2, Check, X, Sparkles, Search, Star, Film, PlayCircle, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuanLyPhim() {
  const [danhSachPhim, setDanhSachPhim] = useState([]);
  
  // 🔴 KHÔI PHỤC STATE QUẢN LÝ THỂ LOẠI
  const [genresList, setGenresList] = useState([]); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  
  const fileInputRef = useRef(null);

  const [tenPhim, setTenPhim] = useState('');
  const [theLoai, setTheLoai] = useState('');
  const [thoiLuong, setThoiLuong] = useState('');
  const [daoDien, setDaoDien] = useState('');
  const [khoiChieu, setKhoiChieu] = useState('');
  const [rating, setRating] = useState(9.0);
  const [tinhTrang, setTinhTrang] = useState('DANG_CHIEU');
  const [moTa, setMoTa] = useState('');
  const [dinhDang, setDinhDang] = useState('IMAX');
  
  const [fileAnh, setFileAnh] = useState(null);
  const [posterUrl, setPosterUrl] = useState('');
  const [linkTrailer, setLinkTrailer] = useState('');

  const loadData = () => {
    // 🔴 KHÔI PHỤC GỌI API KÉP (VỪA LẤY PHIM, VỪA LẤY THỂ LOẠI)
    Promise.all([
      fetch('http://localhost:8080/cineaura-backend/api/movies.php').then(res => res.json()),
      fetch('http://localhost:8080/cineaura-backend/api/genres.php').then(res => res.ok ? res.json() : []).catch(() => [])
    ])
    .then(([moviesData, genresData]) => {
      setGenresList(genresData);

      const formattedData = moviesData.map(item => ({
        id: item.id,
        tenPhim: item.title,
        theLoai: item.genre || 'Chưa phân loại',
        thoiLuong: item.duration,
        daoDien: item.director || '', 
        khoiChieu: item.release_date || '',
        rating: item.rating || 9.0,
        tinhTrang: item.status === 'NOW_SHOWING' ? 'DANG_CHIEU' : 'SAP_CHIEU',
        moTa: item.description || '',
        dinhDang: item.format || '2D',
        poster: item.poster_url || '', 
        linkTrailer: item.trailer_url || '' 
      }));
      setDanhSachPhim(formattedData);
    })
    .catch(err => console.error("Lỗi đồng bộ:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openFormForAdd = () => {
    setIsEditing(null);
    setTenPhim('');
    // 🔴 TỰ ĐỘNG CHỌN THỂ LOẠI ĐẦU TIÊN NẾU CÓ
    setTheLoai(genresList.length > 0 ? genresList[0].name : '');
    setThoiLuong('');
    setDaoDien('');
    setKhoiChieu('');
    setRating(9.0);
    setTinhTrang('DANG_CHIEU');
    setMoTa('');
    setDinhDang('IMAX');
    setLinkTrailer(''); 
    
    setFileAnh(null);
    setPosterUrl('');
    if(fileInputRef.current) fileInputRef.current.value = "";
    
    setShowForm(true);
  };

  const openFormForEdit = (p) => {
    setIsEditing(p.id);
    setTenPhim(p.tenPhim);
    setTheLoai(p.theLoai);
    setThoiLuong(p.thoiLuong);
    setDaoDien(p.daoDien);
    setKhoiChieu(p.khoiChieu);
    setRating(p.rating);
    setTinhTrang(p.tinhTrang);
    setMoTa(p.moTa);
    setDinhDang(p.dinhDang);
    setLinkTrailer(p.linkTrailer); 
    
    setFileAnh(null);
    setPosterUrl(p.poster); 
    if(fileInputRef.current) fileInputRef.current.value = "";
    
    setShowForm(true);
  };

  const handleSavePhim = (e) => {
    e.preventDefault();

    const tenPhimChuan = tenPhim.trim();
    const moTaChuan = moTa.trim();
    const trailerChuan = linkTrailer.trim();

    if (!tenPhimChuan || !thoiLuong) {
      alert('Vui lòng điền đầy đủ Tên phim và Thời lượng bắt buộc.');
      return;
    }

    const durationNumber = thoiLuong.toString().replace(/\D/g, '') || 120;
    const dbStatus = tinhTrang === 'DANG_CHIEU' ? 'NOW_SHOWING' : 'COMING_SOON';

    const formData = new FormData();
    formData.append('title', tenPhimChuan);
    formData.append('duration', durationNumber);
    formData.append('description', moTaChuan);
    formData.append('status', dbStatus);
    formData.append('genre', theLoai); 
    if (khoiChieu) formData.append('release_date', khoiChieu);
    formData.append('trailer_url', trailerChuan); 
    
    if (fileAnh) {
      formData.append('poster', fileAnh);
    } else if (posterUrl) {
      formData.append('poster_url', posterUrl);
    }

    formData.append('director', daoDien);
    formData.append('rating', rating);
    formData.append('format', dinhDang);

    let apiUrl = 'http://localhost:8080/cineaura-backend/api/add_movie.php';
    if (isEditing) {
      apiUrl = 'http://localhost:8080/cineaura-backend/api/update_movie.php';
      formData.append('id', isEditing);
    }

    fetch(apiUrl, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        loadData();
        setShowForm(false);
      } else {
        alert(data.message);
      }
    });
  };

  const handleDeletePhim = (id, tenPhim) => {
    if (window.confirm(`Bạn chắc chắn muốn loại bỏ tác phẩm "${tenPhim}" vĩnh viễn khỏi danh mục CineAura Premium chứ?`)) {
      fetch('http://localhost:8080/cineaura-backend/api/delete_movie.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) loadData();
        else alert(data.message);
      });
    }
  };

  const filteredPhim = danhSachPhim.filter(p => 
    p.tenPhim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.theLoai.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-200">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10 text-left">
          <div className="flex items-center space-x-1.5 text-brand-amber font-mono text-[9px] uppercase tracking-widest font-bold">
            <Clapperboard className="w-3.5 h-3.5 text-brand-amber" />
            <span>Danh mục điện ảnh hoàng gia</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Quản lý Phim</h2>
          <p className="text-xs text-gray-400">Đăng duyệt, chỉnh sửa định dạng chiếu IMAX/3D và thiết lập hiện thị trạng thái tại rạp.</p>
        </div>

        <button
          onClick={openFormForAdd}
          className="flex items-center justify-center space-x-2 py-3.5 px-6 bg-brand-amber hover:bg-[#c9900c] text-black font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all duration-150 cursor-pointer shadow-lg glow-amber active:scale-[0.99] shrink-0 z-10 border-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Thêm phim mới</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">TỔNG ĐIỆN ẢNH CORES</span>
          <span className="text-xl font-bold font-mono text-white">{danhSachPhim.length} Tác phẩm</span>
        </div>
        <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">ĐANG TRÌNH CHIẾU</span>
          <span className="text-xl font-bold font-mono text-white">
            {danhSachPhim.filter(p => p.tinhTrang === 'DANG_CHIEU').length} Phim
          </span>
        </div>
        <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">CHỜ KHỞI CHIẾU</span>
          <span className="text-xl font-bold font-mono text-white">
            {danhSachPhim.filter(p => p.tinhTrang === 'SAP_CHIEU').length} Phim
          </span>
        </div>
        <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">CHẤT LƯỢNG VIP</span>
          <span className="text-xl font-bold font-mono text-brand-amber">★ 9.2 AVG</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div className="lg:col-span-2 bg-brand-dark-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0c0c13] p-4 rounded-xl border border-white/5">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm phim theo tên hoặc thể loại..."
                className="w-full bg-black/50 border border-white/5 focus:border-brand-amber py-2 px-3.5 pl-9 rounded-xl text-xs text-white focus:outline-none transition"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Đang hiển thị: {filteredPhim.length} / {danhSachPhim.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-[#0b0b12] text-[10px] text-gray-500 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="px-4 py-4 font-bold text-center w-16">Poster</th>
                  <th className="px-4 py-4 font-bold">Tên Phim</th>
                  <th className="px-4 py-4 font-bold">Thể Loại & Định dạng</th>
                  <th className="px-4 py-4 font-bold text-center">Trạng Thái</th>
                  <th className="px-4 py-4 font-bold text-center w-24">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/15">
                {filteredPhim.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-16 text-center text-gray-500 font-mono">
                      Không tìm thấy bộ phim nào trùng khớp.
                    </td>
                  </tr>
                ) : (
                  filteredPhim.map((phim) => (
                    <tr key={phim.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-center">
                        {phim.poster ? (
                          <img src={phim.poster} alt={phim.tenPhim} referrerPolicy="no-referrer" className="w-12 aspect-[3/4.2] object-cover rounded-lg border border-white/10 mx-auto bg-black/40" />
                        ) : (
                          <div className="w-12 aspect-[3/4.2] rounded-lg border border-white/10 mx-auto bg-black/40 flex items-center justify-center text-[8px] text-gray-600">No Image</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <strong className="text-white text-sm font-semibold line-clamp-1">{phim.tenPhim}</strong>
                          <div className="flex items-center space-x-3.5">
                            <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">ID: {phim.id}</span>
                            <div className="flex items-center text-brand-amber text-[10px] font-bold font-mono">
                              <Star className="w-3 h-3 text-brand-amber fill-brand-amber mr-0.5" /><span>{phim.rating}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="text-gray-200 line-clamp-1">{phim.theLoai}</p>
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 bg-white/5 text-gray-400 font-mono text-[9px] font-black rounded uppercase">{phim.thoiLuong} phút</span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-mono font-black rounded uppercase ${phim.dinhDang === 'IMAX' ? 'bg-amber-500/10 text-brand-amber border border-brand-amber/20' : phim.dinhDang === '3D' ? 'bg-red-500/10 text-brand-red border border-brand-red/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                              {phim.dinhDang || '2D'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 text-[9px] uppercase font-bold rounded-full border ${phim.tinhTrang === 'DANG_CHIEU' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-brand-amber/10 border-brand-amber/20 text-brand-amber'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${phim.tinhTrang === 'DANG_CHIEU' ? 'bg-emerald-500' : 'bg-brand-amber'}`} />
                          <span>{phim.tinhTrang === 'DANG_CHIEU' ? 'Đang chiếu' : 'Sắp chiếu'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button onClick={() => openFormForEdit(phim)} className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 rounded-lg transition border border-yellow-500/15 cursor-pointer" title="Hiệu chỉnh phim">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeletePhim(phim.id, phim.tenPhim)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-lg transition border border-red-500/15 cursor-pointer" title="Xóa vĩnh viễn">
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

        <div>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-brand-dark-card border border-white/10 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-[10px] font-bold text-brand-amber uppercase tracking-widest font-mono flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{isEditing ? 'Sửa thông tin Phim' : 'Đăng tuyển Phim mới'}</span>
                  </span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition cursor-pointer p-0.5 bg-white/5 hover:bg-white/10 rounded-full border-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSavePhim} className="space-y-4 text-xs font-semibold text-left">
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Tên tác phẩm phim *</label>
                    <input type="text" required value={tenPhim} onChange={(e) => setTenPhim(e.target.value)} placeholder="e.g. Aura Trực Tuyến" className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Chọn Quy Chuẩn *</label>
                      <select value={dinhDang} onChange={(e) => setDinhDang(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3 rounded-xl text-white focus:outline-none text-xs font-bold">
                        <option value="2D" className="bg-[#0c0c13] text-white">Phạm trù 2D</option>
                        <option value="3D" className="bg-[#0c0c13] text-white">Chân thực 3D</option>
                        <option value="IMAX" className="bg-[#0c0c13] text-white">Cực đỉnh IMAX</option>
                      </select>
                    </div>
                    
                    {/* 🔴 KHÔI PHỤC LẠI SELECT DROPDOWN THỂ LOẠI */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Thể loại phim *</label>
                      <select 
                        value={theLoai} 
                        onChange={(e) => setTheLoai(e.target.value)} 
                        className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3 rounded-xl text-white focus:outline-none text-xs font-bold"
                      >
                        {genresList.length === 0 && <option value="">-- Trống --</option>}
                        {genresList.map(g => (
                          <option key={g.id} value={g.name} className="bg-[#0c0c13] text-white">{g.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Thời lượng chiếu *</label>
                      <input type="text" required value={thoiLuong} onChange={(e) => setThoiLuong(e.target.value)} placeholder="e.g. 142 phút" className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Đạo diễn phim</label>
                      <input type="text" value={daoDien} onChange={(e) => setDaoDien(e.target.value)} placeholder="Tên đạo diễn" className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Khởi chiếu</label>
                      <input style={{ colorScheme: 'dark' }} type="date" value={khoiChieu} onChange={(e) => setKhoiChieu(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Đánh giá sỹ số ★</label>
                      <input type="number" step="0.1" min="1" max="10" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all text-xs" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-brand-red uppercase tracking-widest font-mono block font-bold">Link Trailer (YouTube Embed)</label>
                    <div className="relative flex items-center">
                      <PlayCircle className="w-4 h-4 text-brand-red absolute left-3" />
                      <input 
                        type="text" 
                        value={linkTrailer} 
                        onChange={(e) => setLinkTrailer(e.target.value)} 
                        placeholder="https://www.youtube.com/embed/..." 
                        className="w-full bg-black/40 border border-brand-red/20 focus:border-brand-red py-2.5 px-3.5 pl-9 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-[11px]" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Ảnh Poster (URL hoặc Tải lên)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={posterUrl} 
                        onChange={(e) => {
                          setPosterUrl(e.target.value);
                          setFileAnh(null); 
                          if(fileInputRef.current) fileInputRef.current.value = "";
                        }} 
                        placeholder="Dán link ảnh..." 
                        className="flex-grow bg-black/40 border border-white/5 focus:border-brand-amber py-2.5 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-[11px]" 
                      />
                      <label className="flex items-center justify-center bg-white/5 border border-white/10 rounded-xl px-3 cursor-pointer hover:bg-white/10 transition-all text-gray-300 border-0 shrink-0" title="Tải ảnh từ thiết bị">
                        <span className="text-[10px] font-bold font-mono uppercase text-brand-amber">CHOOSE FILE</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if(file) {
                                setFileAnh(file);
                                setPosterUrl(URL.createObjectURL(file));
                            }
                          }} 
                        />
                      </label>
                    </div>
                    {/* Hiển thị xem trước ảnh */}
                    {posterUrl && (
                      <div className="mt-2 h-24 w-16 rounded-md overflow-hidden border border-white/10">
                        <img src={posterUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Trạng thái phát hành</label>
                    <div className="flex space-x-2">
                      <button type="button" onClick={() => setTinhTrang('DANG_CHIEU')} className={`flex-1 py-2 text-[10px] uppercase font-mono font-bold border rounded-xl transition-all border-0 cursor-pointer ${tinhTrang === 'DANG_CHIEU' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/15' : 'bg-black/40 hover:bg-black/60 text-gray-400'}`}>Đang Chiếu</button>
                      <button type="button" onClick={() => setTinhTrang('SAP_CHIEU')} className={`flex-1 py-2 text-[10px] uppercase font-mono font-bold border rounded-xl transition-all border-0 cursor-pointer ${tinhTrang === 'SAP_CHIEU' ? 'bg-brand-amber text-black shadow-lg shadow-brand-amber/15' : 'bg-black/40 hover:bg-black/60 text-gray-400'}`}>Sắp Chiếu</button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Mô tả tóm tắt nội dung</label>
                    <textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} rows={3} placeholder="Tóm tắt ngắn gọn phim chiếu bóng..." className="w-full bg-black/40 border border-white/5 focus:border-brand-amber py-2 px-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 text-xs text-left" />
                  </div>

                  <div className="pt-2 space-y-2">
                    <button type="submit" className="w-full py-3.5 bg-brand-red hover:bg-[#c93c3c] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow duration-150 active:scale-[0.99] border-0">
                      <Check className="w-4 h-4 stroke-[3]" /><span>Lưu hồ sơ phim</span>
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setIsEditing(null); }} className="w-full py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl text-[10px] uppercase tracking-widest font-mono transition border-0 bg-transparent cursor-pointer">Hủy bỏ thao tác</button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-brand-dark-card border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center mx-auto text-brand-amber"><Film className="w-5.5 h-5.5" /></div>
                <h4 className="font-display font-bold text-white text-base">Hồ Sơ Cập Nhật Phim</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Nhấp chọn biểu tượng <strong className="text-yellow-400 font-bold">"Sửa"</strong> ở danh mục phim, hoặc click nút <strong className="text-brand-amber font-bold">"Thêm phim mới"</strong> tại thanh tiêu đề để kích hoạt bảng hiệu chỉnh.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}