import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Lớp Layout cục bộ từ HeThong
import BoCucKhachHang from './BoCucKhachHang';
import BoCucQuanTri from './BoCucQuanTri';

// Các Màn hình Khách hàng (Client Views) từ các Module tiếng Việt mới
import TrangChu from '../TrangChu/TrangChu';
import DanhSachPhim from '../DanhSachPhim/DanhSachPhim';
import ChiTietPhim from '../DanhSachPhim/ChiTietPhim';
import TaiKhoan from '../TaiKhoan/TaiKhoan';
import SuatChieuDoAn from '../DatVe/SuatChieuDoAn';
import ChonGhe from '../DatVe/ChonGhe';
import ChonDoAn from '../DatVe/ChonDoAn';
import ThanhToan from '../DatVe/ThanhToan';

// Các Màn hình Xác thực (Auth Views) chuyển sang thư mục XacThuc
import DangNhap from '../XacThuc/DangNhap';
import DangKy from '../XacThuc/DangKy';
import QuenMatKhau from '../XacThuc/QuenMatKhau';

// Các Màn hình Quản trị (Admin Views) từ Module tiếng Việt tương ứng
import BangDieuKhien from '../Admin_BangDieuKhien/BangDieuKhien';
import QuanLyPhim from '../Admin_QuanLyPhim/QuanLyPhim';
import QuanLyDoAn from '../Admin_QuanLyDoAn/QuanLyDoAn';
import QuanLySuatChieu from '../Admin_QuanLySuatChieu/QuanLySuatChieu';
import QuanLyNguoiDung from '../Admin_QuanLyNguoiDung/QuanLyNguoiDung';
import TheLoaiPhim from '../Admin_TheLoaiPhim/TheLoaiPhim';
import RapChieu from '../Admin_RapChieu/RapChieu';
import PhongChieu from '../Admin_PhongChieu/PhongChieu';
import LoaiGhe from '../Admin_LoaiGhe/LoaiGhe';
import DonDatVe from '../Admin_DonDatVe/DonDatVe';
import KhuyenMai from '../Admin_KhuyenMai/KhuyenMai';
import KiemSoatVe from '../Admin_KiemSoatVe/KiemSoatVe';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* LUỒNG PHÂN TUYẾN DÀNH CHO BAN QUẢN TRỊ (ADMIN LAYOUTS) */}
        <Route path="/admin/*" element={<BoCucQuanTri />}>
          <Route index element={<BangDieuKhien />} />
          <Route path="phim" element={<QuanLyPhim />} />
          <Route path="the-loai" element={<TheLoaiPhim />} />
          <Route path="rap" element={<RapChieu />} />
          <Route path="phong" element={<PhongChieu />} />
          <Route path="loai-ghe" element={<LoaiGhe />} />
          <Route path="suat-chieu" element={<QuanLySuatChieu />} />
          <Route path="don-ve" element={<DonDatVe />} />
          <Route path="do-an" element={<QuanLyDoAn />} />
          <Route path="khuyen-mai" element={<KhuyenMai />} />
          <Route path="nguoi-dung" element={<QuanLyNguoiDung />} />
          
          {/* Hướng tới Dashboard khi admin gõ sai/đường dẫn lạ */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* LUỒNG PHÂN TUYẾN DÀNH CHO KHÁCH HÀNG (CLIENT LAYOUTS) */}
        <Route path="/*" element={<BoCucKhachHang />}>
          <Route index element={<TrangChu />} />
          <Route path="phim" element={<DanhSachPhim />} />
          <Route path="phim/:id" element={<ChiTietPhim />} />
          <Route path="suat-chieu-do-an" element={<SuatChieuDoAn />} />
          <Route path="mua-combo" element={<SuatChieuDoAn type="combo" />} />
          <Route path="tai-khoan" element={<TaiKhoan />} />
          <Route path="dat-ve/chon-ghe" element={<ChonGhe />} />
          <Route path="dat-ve/chon-do-an" element={<ChonDoAn />} />
          <Route path="dat-ve/thanh-toan" element={<ThanhToan />} />
          <Route path="soat-ve" element={<KiemSoatVe />} />
          
          {/* Auth sub-routes lồng ghép bên dưới Client Layout */}
          <Route path="auth/dang-nhap" element={<DangNhap />} />
          <Route path="auth/dang-ky" element={<DangKy />} />
          <Route path="auth/quen-mat-khau" element={<QuenMatKhau />} />

          {/* Về trang chủ nếu khách hàng gõ sai đường dẫn */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
