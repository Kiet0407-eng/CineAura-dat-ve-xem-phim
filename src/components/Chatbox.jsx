import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, Bot, User, Clock, ChevronDown
} from 'lucide-react';
import { useCineAura } from '../HeThong/QuanLyTrangThai';

export default function Chatbox() {
  const { currentUser } = useCineAura();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Chào mừng quý khách đến với sảnh hỗ trợ số CineAura Premium! Tôi là trợ lý ảo AI Concierge. Rất vinh dự được phục vụ quý khách lựa chọn phim hot và combos ẩm thực ngày hôm nay. Quý khách cần hỗ trợ gì ạ? ✨',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // 🔴 STATE LƯU TRỮ TOÀN BỘ DỮ LIỆU TỪ DATABASE
  const [dbData, setDbData] = useState({
    phimDangChieu: 'Đang tải dữ liệu...',
    phimSapChieu: 'Đang tải dữ liệu...',
    menuDoAn: 'Đang tải dữ liệu...',
    giaVe: 'Đang tải dữ liệu...'
  });

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const quickPrompts = [
    { text: 'Phim Hot đang chiếu? 🎬', id: 'phim' },
    { text: 'Giá vé giường nằm VIP? 💎', id: 'gia_ve' },
    { text: 'Combo bắp nước 🍿', id: 'combo' },
    { text: 'Liên hệ rạp hỗ trợ? 📞', id: 'lien_he' }
  ];

  // 🔴 TỰ ĐỘNG GỌI ĐỒNG THỜI 3 API TỪ BACKEND PHP ĐỂ HÚT DỮ LIỆU
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/cineaura-backend/api/movies.php').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:8080/cineaura-backend/api/foods.php').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:8080/cineaura-backend/api/seat_types.php').then(res => res.ok ? res.json() : [])
    ])
    .then(([moviesData, foodsData, seatsData]) => {
      // 1. Xử lý dữ liệu Phim
      let dangChieu = 'Hiện chưa có phim đang chiếu';
      let sapChieu = 'Hiện chưa có phim sắp chiếu';
      if (moviesData && moviesData.length > 0) {
        dangChieu = moviesData.filter(p => p.status === 'NOW_SHOWING').map(p => p.title).join(', ');
        sapChieu = moviesData.filter(p => p.status !== 'NOW_SHOWING').map(p => p.title).join(', ');
      }

      // 2. Xử lý dữ liệu Đồ Ăn (Tự động lấy tên, giá và mô tả từ CSDL)
      let menu = 'Chưa có dữ liệu đồ ăn từ CSDL';
      if (foodsData && foodsData.length > 0) {
        menu = foodsData.map(f => {
          // Dự phòng các tên trường dữ liệu phổ biến trong DB
          const ten = f.name || f.ten_do_an || f.tenDoAn || 'Món ăn';
          const gia = f.price || f.gia || 0;
          const moTa = f.description || f.mo_ta || f.moTa || 'Không có mô tả';
          return `- ${ten}: ${Number(gia).toLocaleString('vi-VN')}đ (Gồm: ${moTa})`;
        }).join('\n      ');
      }

      // 3. Xử lý dữ liệu Giá Vé (Tự động lấy loại ghế và giá từ CSDL)
      let giaVeDb = 'Chưa có dữ liệu giá vé từ CSDL';
      if (seatsData && seatsData.length > 0) {
        giaVeDb = seatsData.map(s => {
          const tenGhe = s.type_name || s.ten_loai || s.name || 'Ghế';
          const giaGhe = s.price || s.gia || 0;
          return `- ${tenGhe}: ${Number(giaGhe).toLocaleString('vi-VN')}đ`;
        }).join('\n        ');
      }

      // Cập nhật toàn bộ vào "Não" của AI
      setDbData({
        phimDangChieu: dangChieu || 'Trống',
        phimSapChieu: sapChieu || 'Trống',
        menuDoAn: menu,
        giaVe: giaVeDb
      });
    })
    .catch((error) => console.error("Lỗi đồng bộ CSDL cho AI:", error));
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const userTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text: text, time: userTime };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // BƠM TRỰC TIẾP DỮ LIỆU TỪ DATABASE VÀO PROMPT CỦA AI
      const systemPrompt = `Bạn là Concierge - AI của rạp CineAura. Tên khách: ${currentUser?.name || 'quý khách'}.
      
      NGUYÊN TẮC TỐI THƯỢNG:
      1. BẠN CHỈ ĐƯỢC PHÉP TRẢ LỜI DỰA TRÊN DỮ LIỆU ĐƯỢC CUNG CẤP TRONG DẤU NGOẶC VUÔNG BÊN DƯỚI (DỮ LIỆU NÀY LẤY TRỰC TIẾP TỪ DATABASE).
      2. TUYỆT ĐỐI KHÔNG tự bịa thêm tên phim, tự chế combo, không tự đoán giá tiền.
      3. Nếu khách hỏi thông tin KHÔNG CÓ trong dữ liệu bên dưới, hãy xin lỗi và nói rạp chưa có thông tin.

      [DỮ LIỆU CƠ SỞ DỮ LIỆU THỰC TẾ RẠP CINEAURA]
      * PHIM ĐANG CHIẾU: ${dbData.phimDangChieu}
      * PHIM SẮP CHIẾU: ${dbData.phimSapChieu}
      
      * MENU ĐỒ ĂN & COMBO HIỆN TẠI: 
      ${dbData.menuDoAn}
      
      * BẢNG GIÁ VÉ THEO LOẠI GHẾ: 
        ${dbData.giaVe}
        
      * LIÊN HỆ: Hotline: 1900 8899 | Email: support@cineaura.vn
      `;

      const cleanApiKey = GROQ_API_KEY ? GROQ_API_KEY.trim() : '';

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${cleanApiKey}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ],
          temperature: 0, // Vẫn giữ nhiệt độ 0 để AI đọc Data chuẩn như một cái máy
        })
      });

      const data = await response.json();
      const botTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      if (!response.ok) throw new Error(data.error?.message || "Lỗi máy chủ AI");

      if (data.choices && data.choices.length > 0) {
        const rawText = data.choices[0].message.content;
        const cleanText = rawText.replace(/\*\*/g, ''); 
        
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: cleanText,
          time: botTime
        }]);
      } else {
        throw new Error("Không phản hồi từ AI");
      }
    } catch (error) {
      const botTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Lỗi: ${error.message}`,
        time: botTime
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans text-gray-200">
      <AnimatePresence>
        
        {isOpen && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 h-[510px] bg-[#09090e]/95 border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden backdrop-blur-xl"
            id="chat_window_container"
          >
            <div className="p-4 bg-brand-dark-card border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-brand-amber flex items-center justify-center glow-amber">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-display font-bold text-xs text-white">Concierge CineAura AI</h3>
                    <Sparkles className="w-3 h-3 text-brand-amber animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <p className="text-[9px] text-gray-500 font-mono tracking-wider">Mạng lưới trực tuyến (Database Sync)</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 px-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition border-0 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex items-start space-x-2.5 ${!isBot ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${isBot ? 'bg-brand-amber/10 border border-brand-amber/20 text-brand-amber' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="max-w-[75%] space-y-1">
                      <div className={`p-3 rounded-xl text-xs leading-relaxed ${isBot ? 'bg-[#12121c]/90 border border-white/5 text-gray-200' : 'bg-brand-amber text-black font-semibold shadow-md rounded-tr-none'}`}>
                        {msg.text.split('\n').map((line, idx) => <p key={idx} className={line === '' ? 'h-2' : ''}>{line}</p>)}
                      </div>
                      <div className={`flex items-center space-x-1 text-[8px] text-gray-600 ${!isBot ? 'justify-end' : ''}`}>
                        <Clock className="w-2.5 h-2.5" /><span>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center text-brand-amber">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#12121c]/90 border border-white/5 px-4 py-3 rounded-xl flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2 pt-1 border-t border-white/5 bg-[#0b0b12]/50">
                <span className="text-[8px] font-mono tracking-wider font-extrabold text-brand-amber uppercase block mb-1.5">Gợi ý câu hỏi thông dụng:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p) => (
                    <button key={p.id} onClick={() => handleSendMessage(p.text)} className="px-2 py-1 bg-white/5 hover:bg-brand-amber/10 hover:text-brand-amber border border-white/5 hover:border-brand-amber/25 rounded-md text-[10px] text-gray-400 transition cursor-pointer">
                      {p.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 bg-brand-dark-card border-t border-white/5">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex items-center space-x-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isTyping} placeholder="Gửi tin nhắn hoặc hỏi rạp chiếu..." className="flex-1 bg-black/40 border border-white/5 focus:border-brand-amber rounded-xl py-2 px-3.5 text-xs text-white placeholder-gray-600 focus:outline-none transition" />
                <button type="submit" disabled={!inputText.trim() || isTyping} className="p-2 py-2.5 bg-brand-amber disabled:opacity-40 text-black hover:bg-[#c9900c] transition rounded-xl flex items-center justify-center shrink-0 border-0 cursor-pointer shadow-md shadow-brand-amber/15">
                  <Send className="w-4 h-4 text-black stroke-[2.5]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-14 h-14 bg-brand-amber hover:bg-[#c9900c] text-black font-bold rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(223,161,18,0.35)] glow-amber border-0 cursor-pointer relative" id="btn_chatbox_trigger">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close_icon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown className="w-6 h-6 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div key="chat_icon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="relative">
              <MessageSquare className="w-6.5 h-6.5 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-brand-red rounded-full ring-2 ring-[#050508] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}