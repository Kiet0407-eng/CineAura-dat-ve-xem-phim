import React, { createContext, useContext, useState, useEffect } from 'react';

const CineAuraContext = createContext(undefined);

// Giữ lại Mock Data Đồ Ăn 
const DOAN_MOCK = [
  { id: 'f1', tenDoAn: 'Bắp Rang Caramel Hoàng Kim', loai: 'POP_CORN', gia: 69000, hinhAnh: 'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&q=80&w=300', moTa: 'Hạt bắp nổ giòn đều ngọt lịm caramel.', banChay: true },
  { id: 'f2', tenDoAn: 'Bắp Rang Phô Mai CineAura', loai: 'POP_CORN', gia: 75000, hinhAnh: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300', moTa: 'Phủ bột phô Mai mặn ngọt thơm lừng.' },
  { id: 'f3', tenDoAn: 'Pepsi Lạnh Aura VIP', loai: 'DRINK', gia: 39000, hinhAnh: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300', moTa: 'Ly Pepsi size lớn cực đã khát.', banChay: true },
  { id: 'f4', tenDoAn: 'Combo Aura Couple đặc biệt', loai: 'COMBO', gia: 149000, hinhAnh: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=300', moTa: '1 Bắp lớn 2 vị tự chọn + 2 Nước ngọt.', banChay: true },
];

export const CineAuraProvider = ({ children }) => {
  
  // 1. SỬ DỤNG SESSION STORAGE (Chỉ nhớ trong Tab hiện tại)
  const [currentUser, setCurrentUser] = useState(() => {
    // Đọc thông tin user từ bộ nhớ tạm
    const savedUser = sessionStorage.getItem('cineaura_user');
    
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Lỗi đọc dữ liệu user:", error);
      }
    }
    
    // Mặc định trả về GUEST khi mở Tab mới
    return { role: 'GUEST', name: 'Khách', soDu: 0, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' };
  });

  const [danhSachDoAn, setDanhSachDoAn] = useState(DOAN_MOCK);
  const [veDaDat, setVeDaDat] = useState([]); 
  
  // 2. ĐỒNG BỘ LIÊN TỤC VÀO BỘ NHỚ TẠM
  useEffect(() => {
    if (currentUser && currentUser.role !== 'GUEST') {
      sessionStorage.setItem('cineaura_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('cineaura_user');
    }
  }, [currentUser]);

  // 3. HÀM CHUYỂN ROLE 
  const switchUserRole = (role) => {
    if (role === 'GUEST') {
      setCurrentUser({ role: 'GUEST', name: 'Khách', soDu: 0, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' });
    } else if (role === 'ADMIN') {
      setCurrentUser({ id: 99, name: 'Admin Tối Cao', email: 'admin@cineaura.vn', role: 'ADMIN', soDu: 9999999, avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=150' });
    } else if (role === 'VIP') {
      setCurrentUser({ id: 88, name: 'Khách Hàng VIP', email: 'vip@cineaura.vn', role: 'VIP', soDu: 5000000, hangThanhVien: 'Gold VIP Member', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' });
    } else {
      setCurrentUser({ id: 1, name: 'Thành viên Thường', email: 'user@cineaura.vn', role: 'REGULAR', soDu: 100000, hangThanhVien: 'Silver Member', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150' });
    }
  };

  const napTien = (soTien) => {
    setCurrentUser(prev => ({ ...prev, soDu: (prev.soDu || 0) + soTien }));
  };

  const muaVe = () => {}; const dangPhimMoi = () => {}; const xoaPhim = () => {}; 
  const suaPhim = () => {}; const themDoAn = () => {}; const xoaDoAn = () => {}; const suaDoAn = () => {};

  return (
    <CineAuraContext.Provider value={{ currentUser, setCurrentUser, danhSachDoAn, veDaDat, switchUserRole, napTien, muaVe, dangPhimMoi, xoaPhim, suaPhim, themDoAn, xoaDoAn, suaDoAn }}>
      {children}
    </CineAuraContext.Provider>
  );
};

export const useCineAura = () => {
  const context = useContext(CineAuraContext);
  if (!context) throw new Error('useCineAura must be used within a CineAuraProvider');
  return context;
};