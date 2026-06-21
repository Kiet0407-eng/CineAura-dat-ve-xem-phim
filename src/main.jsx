import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './HeThong/App';
import { CineAuraProvider } from './HeThong/QuanLyTrangThai';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CineAuraProvider>
      <App />
    </CineAuraProvider>
  </React.StrictMode>
);
