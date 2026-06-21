import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, Ticket, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KiemSoatVe() {
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null); // null | 'success' | 'used' | 'error'
  const inputRef = useRef(null);

  // Tự động focus vào ô nhập liệu để nhân viên dùng súng quét mã vạch bắn thẳng vào
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = (e) => {
    e.preventDefault();
    if(!ticketCode.trim()) return;

    setLoading(true);
    setScanResult(null);

    const formData = new FormData();
    formData.append('ticket_code', ticketCode.trim());

    fetch('http://localhost:8080/cineaura-backend/api/verify_ticket.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
       setLoading(false);
       if(data.success) {
           setScanResult({ type: 'success', message: data.message });
       } else {
           if(data.message.includes('ĐÃ ĐƯỢC QUÉT SỬ DỤNG')) {
              setScanResult({ type: 'used', message: data.message });
           } else {
              setScanResult({ type: 'error', message: data.message });
           }
       }
       setTicketCode('');
       inputRef.current?.focus(); // Focus lại để quét vé tiếp theo
    })
    .catch(err => {
       setLoading(false);
       setScanResult({ type: 'error', message: 'Lỗi kết nối máy chủ soát vé.' });
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-100">
      
      {/* HEADER */}
      <div className="flex items-center space-x-3 pb-4 border-b border-white/5">
        <div className="p-3 bg-brand-amber/10 rounded-xl">
          <ScanLine className="w-6 h-6 text-brand-amber" />
        </div>
        <div>
          <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">Hệ Thống Kiểm Soát Vé Rạp</h2>
          <p className="text-xs text-gray-400 font-mono mt-1">Giao diện vận hành dành riêng cho nhân viên cửa soát vé</p>
        </div>
      </div>

      {/* KHU VỰC MÁY QUÉT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Cột trái: Form Quét */}
        <div className="bg-brand-dark-card border border-white/5 p-8 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#31b1be]" />
          
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 border-4 border-dashed border-[#31b1be]/30 rounded-3xl animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-2 bg-black/50 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
              <ScanLine className="w-12 h-12 text-[#31b1be] animate-pulse" />
            </div>
            {/* Tia laser quét */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 shadow-[0_0_15px_red] animate-[ping_2s_ease-in-out_infinite]" />
          </div>

          <h3 className="font-bold text-lg text-white mb-2">Đưa mã QR vào máy quét</h3>
          <p className="text-xs text-gray-400 mb-6 max-w-xs leading-relaxed">
            Sử dụng thiết bị Barcode Scanner hoặc nhập tay mã CineCode của khách hàng (Ví dụ: CINE-00015).
          </p>

          <form onSubmit={handleScan} className="w-full space-y-4">
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="CINE-..."
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                className="w-full bg-black/40 border-2 border-white/10 focus:border-[#31b1be] rounded-2xl py-4 pl-12 pr-4 text-center text-xl font-mono font-black text-white placeholder-gray-600 focus:outline-none transition-all uppercase"
                autoComplete="off"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !ticketCode.trim()}
              className="w-full py-4 bg-[#31b1be] hover:bg-[#208a95] disabled:opacity-50 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl transition shadow-lg cursor-pointer flex justify-center items-center space-x-2 border-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Kiểm Tra Vé</span>}
            </button>
          </form>
        </div>

        {/* Cột phải: Màn hình hiển thị kết quả Real-time */}
        <div className="h-full">
          <AnimatePresence mode="wait">
            {!scanResult ? (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full bg-[#0b0b12] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Ticket className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-gray-400 font-bold uppercase tracking-wider text-sm">Chờ tín hiệu quét...</h4>
                  <p className="text-[10px] text-gray-600 mt-2">Hệ thống đang ở trạng thái sẵn sàng.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={scanResult.type}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className={`h-full border rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-5 shadow-2xl relative overflow-hidden ${
                  scanResult.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/50 shadow-emerald-900/20' :
                  scanResult.type === 'used' ? 'bg-amber-950/40 border-amber-500/50 shadow-amber-900/20' :
                  'bg-rose-950/40 border-rose-500/50 shadow-rose-900/20'
                }`}
              >
                {/* Icon Kết quả */}
                {scanResult.type === 'success' && <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-bounce" />}
                {scanResult.type === 'used' && <AlertTriangle className="w-20 h-20 text-amber-500 animate-pulse" />}
                {scanResult.type === 'error' && <XCircle className="w-20 h-20 text-rose-500" />}

                <div className="space-y-2 z-10">
                  <h3 className={`font-display font-black text-2xl uppercase tracking-wider ${
                    scanResult.type === 'success' ? 'text-emerald-400' :
                    scanResult.type === 'used' ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>
                    {scanResult.type === 'success' ? 'Cho Phép Vào Rạp' : 
                     scanResult.type === 'used' ? 'Từ Chối Truy Cập' : 'Cảnh Báo Lỗi'}
                  </h3>
                  <p className="text-sm font-semibold text-gray-200 leading-relaxed max-w-sm mx-auto bg-black/40 p-4 rounded-xl border border-white/5 font-mono">
                    {scanResult.message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}