import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function QuenMatKhau() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-xl border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#dfa112]">Khôi phục mật khẩu</h2>
          <p className="mt-2 text-gray-400">Nhập email của bạn để nhận mã xác nhận</p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dfa112]"
                placeholder="Nhập địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#dfa112] hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfa112]"
            >
              Gửi mã xác nhận
            </button>
          </form>
        ) : (
          <div className="mt-8 text-center space-y-4">
            <div className="p-4 bg-green-900/50 border border-green-500 rounded-md text-green-400">
              Đường dẫn khôi phục mật khẩu đã được gửi đến email <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn!
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/dang-nhap" className="flex items-center justify-center text-sm text-[#dfa112] hover:text-yellow-400">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}