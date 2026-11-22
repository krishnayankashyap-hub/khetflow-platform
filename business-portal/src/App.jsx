import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, addDoc, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==================== CORPORATE B2B SVG ICON SUITE ====================
const Icons = {
  Logo: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  Market: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  ),
  Orders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  ),
  Mandi: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Cart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  Logout: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Wallet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  Scale: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  ),
  Truck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Qr: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  ),
  MapPin: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
};

// ==================== MARKET DATA CONSTANT ====================
const MARKET_RATES = [
  { crop: 'Tomato', mandiA: 40, kfB: 22, kfC: 15, trend: 'Up', status: 80 },
  { crop: 'Onion', mandiA: 35, kfB: 18, kfC: 12, trend: 'Down', status: 30 },
  { crop: 'Potato', mandiA: 28, kfB: 15, kfC: 10, trend: 'Stable', status: 50 },
  { crop: 'Spinach', mandiA: 45, kfB: 25, kfC: 18, trend: 'Up', status: 90 },
  { crop: 'Carrot', mandiA: 50, kfB: 30, kfC: 20, trend: 'Up', status: 75 },
  { crop: 'Cauliflower', mandiA: 38, kfB: 20, kfC: 14, trend: 'Down', status: 40 },
  { crop: 'Okra', mandiA: 42, kfB: 24, kfC: 16, trend: 'Stable', status: 60 },
  { crop: 'Brinjal', mandiA: 30, kfB: 16, kfC: 10, trend: 'Down', status: 25 },
  { crop: 'Ginger', mandiA: 120, kfB: 80, kfC: 50, trend: 'Up', status: 85 },
];

const SAMPLE_MARKET_LISTINGS = [
  {
    id: 'sample-onion-b',
    name: 'Fresh Red Onion (Mild Shape Variance)',
    farmerId: 'demo-farmer-01',
    farmerName: 'Ramesh Saikia',
    farmName: 'Azara Organic Harvest',
    farmLocation: 'Kamrup, Assam',
    price: 18,
    originalPrice: 28,
    quantity: 120,
    grade: 'B',
    icon: '🧅',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
    description: 'Crisp, flavorful organic onions with slight size variations. High culinary yield for kitchens.',
    status: 'active'
  },
  {
    id: 'sample-tomato-b',
    name: 'Farm Fresh Tomatoes (Grade B)',
    farmerId: 'demo-farmer-01',
    farmerName: 'Ramesh Saikia',
    farmName: 'Azara Organic Harvest',
    farmLocation: 'Kamrup, Assam',
    price: 18,
    originalPrice: 28,
    quantity: 85,
    grade: 'B',
    icon: '🍅',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
    description: 'Juicy, sun-ripened tomatoes, perfect for puree, curries, and sauces.',
    status: 'active'
  },
  {
    id: 'sample-potato-b',
    name: 'Assam Valley Potatoes (Grade B)',
    farmerId: 'demo-farmer-02',
    farmerName: 'Biren Kalita',
    farmName: 'Brahmaputra Agro Farms',
    farmLocation: 'Barpeta, Assam',
    price: 16,
    originalPrice: 24,
    quantity: 200,
    grade: 'B',
    icon: '🥔',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
    description: 'Nutritious mountain potatoes with minor surface marks. Firm and starchy.',
    status: 'active'
  },
  {
    id: 'sample-carrot-c',
    name: 'Country Carrots (Grade C Forked)',
    farmerId: 'demo-farmer-02',
    farmerName: 'Biren Kalita',
    farmName: 'Brahmaputra Agro Farms',
    farmLocation: 'Barpeta, Assam',
    price: 22,
    originalPrice: 40,
    quantity: 60,
    grade: 'C',
    icon: '🥕',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    description: 'Naturally forked and bent organic carrots. Sweet taste, ideal for juicing and dicing.',
    status: 'active'
  },
  {
    id: 'sample-ginger-b',
    name: 'High-Aroma Ginger (Grade B)',
    farmerId: 'demo-farmer-03',
    farmerName: 'Deepak Nath',
    farmName: 'Shillong Foothills Farm',
    farmLocation: 'Ri-Bhoi, Meghalaya',
    price: 75,
    originalPrice: 110,
    quantity: 45,
    grade: 'B',
    icon: '🫚',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80',
    description: 'Potent hill ginger roots with smaller rhizomes. Intense natural heat.',
    status: 'active'
  }
];

// ==================== CORPORATE THEME SYSTEM ====================

const ThemeContext = createContext();

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

function ThemeProvider({ children }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --bg-main: #f8fafc;
        --panel-bg: #ffffff;
        --panel-border: #e2e8f0;
        --panel-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 8px 24px -6px rgba(15, 23, 42, 0.05);
        --input-bg: #ffffff;
        --input-border: #cbd5e1;
        --glass-bg: #ffffff;
        --glass-panel: #ffffff;
        --glass-border: #e2e8f0;
        --glass-input: #f8fafc;
      }
      
      body { 
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        background-color: var(--bg-main); 
        background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
        background-size: 20px 20px;
        color: #0f172a;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh; 
      }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(15, 23, 42, 0.15); border-radius: 10px; }
      * { box-sizing: border-box; }

      /* Natural Editorial Marker Highlights */
      .hl-green {
        background: linear-gradient(104deg, rgba(167, 243, 208, 0) 0.9%, rgba(167, 243, 208, 0.85) 2.4%, rgba(167, 243, 208, 0.55) 98%, rgba(167, 243, 208, 0) 100%);
        color: #065f46;
        padding: 0.05em 0.38em;
        border-radius: 0.3em;
        font-weight: 800;
      }
      .hl-amber {
        background: linear-gradient(104deg, rgba(253, 230, 138, 0) 0.9%, rgba(253, 230, 138, 0.85) 2.4%, rgba(253, 230, 138, 0.55) 98%, rgba(253, 230, 138, 0) 100%);
        color: #92400e;
        padding: 0.05em 0.38em;
        border-radius: 0.3em;
        font-weight: 800;
      }

      /* Clean Executive B2B Panels */
      .glass-panel {
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        box-shadow: var(--panel-shadow);
        border-radius: 1rem;
        position: relative;
        z-index: 10;
      }

      /* Translucent Top Glass Header */
      .translucent-top-nav {
        position: sticky;
        top: 34px;
        z-index: 9000;
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(18px) saturate(180%);
        -webkit-backdrop-filter: blur(18px) saturate(180%);
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        transition: all 0.2s ease;
      }

      /* Translucent Floating Bottom Taskbar Dock */
      .translucent-bottom-dock {
        position: fixed;
        bottom: 1.15rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9980;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.45rem 0.6rem;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.76);
        backdrop-filter: blur(22px) saturate(200%);
        -webkit-backdrop-filter: blur(22px) saturate(200%);
        border: 1px solid rgba(15, 23, 42, 0.11);
        box-shadow: 0 12px 36px -4px rgba(15, 23, 42, 0.14), 0 2px 6px rgba(15, 23, 42, 0.05);
      }

      .dock-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.55rem 1rem;
        border-radius: 9999px;
        border: none;
        background: transparent;
        color: #475569;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        white-space: nowrap;
      }
      .dock-item:hover {
        color: #0f172a;
        background: rgba(15, 23, 42, 0.05);
      }
      .dock-item.active {
        background: #0f172a;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
      }
      .dock-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 999px;
        font-size: 0.68rem;
        font-weight: 800;
        background: #059669;
        color: #ffffff;
      }
      .dock-item.active .dock-badge {
        background: #10b981;
        color: #022c22;
      }

      /* Responsive Layouts */
      .split-layout { display: flex; flex-direction: row; gap: 2.5rem; }
      
      @media (max-width: 860px) {
        .split-layout { flex-direction: column; gap: 1.5rem; }
        .order-auth { order: 1; } 
        .order-info { order: 2; }
        .mobile-hide { display: none !important; }
      }

      @media (max-width: 640px) {
        .glass-panel { padding: 0.9rem !important; border-radius: 0.9rem !important; }
        h1 { font-size: 1.2rem !important; }
        h2 { font-size: 1.05rem !important; }
        
        .stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.45rem !important; margin-bottom: 0.85rem !important; }
        .stat-card { padding: 0.65rem 0.5rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.35rem !important; }
        .stat-card .icon-wrap { padding: 0.35rem !important; border-radius: 0.45rem !important; }
        .stat-card .val { font-size: 1.05rem !important; }
        .stat-card .label { font-size: 0.58rem !important; letter-spacing: 0.02em !important; }
        .stat-card .sub-pill { display: none !important; }
        
        .marketplace-panel { padding: 0.75rem !important; }
        .category-scroll { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 0.2rem; -webkit-overflow-scrolling: touch; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .category-scroll button { padding: 0.4rem 0.75rem !important; font-size: 0.75rem !important; }
        
        .filters-wrap { flex-direction: column !important; align-items: stretch !important; gap: 0.45rem !important; margin-bottom: 0.85rem !important; }
        .search-wrap { width: 100% !important; }
        .dropdown-wrap { width: 100% !important; display: flex !important; gap: 0.45rem !important; }
        .dropdown-wrap select { flex: 1 !important; font-size: 0.75rem !important; padding: 0.5rem !important; }
        
        .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 0.6rem !important; }
        .product-card { padding: 0.55rem !important; border-radius: 0.85rem !important; }
        .product-img { height: 105px !important; margin-bottom: 0.5rem !important; border-radius: 0.6rem !important; }
        .product-title { font-size: 0.82rem !important; }
        .product-desc { font-size: 0.65rem !important; margin-bottom: 0.45rem !important; }
        .product-price-box { padding: 0.45rem !important; margin-bottom: 0.5rem !important; }
        .product-price-box .mandi-price { font-size: 0.58rem !important; }
        .product-price-box .kf-price { font-size: 0.92rem !important; }
        
        .translucent-bottom-dock {
          width: calc(100% - 1.25rem);
          max-width: 420px;
          justify-content: space-between;
          padding: 0.35rem 0.45rem;
          bottom: 0.75rem;
        }
        .dock-item {
          padding: 0.5rem 0.65rem;
          font-size: 0.72rem;
          gap: 0.3rem;
        }
        .dock-label-hide-xs {
          display: none;
        }
        
        .order-grid { grid-template-columns: 1fr !important; }
        .cart-panel { width: 100% !important; border-radius: 0 !important; }
      }

      @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideInUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .scrolling-wrapper { display: flex; width: max-content; animation: scroll 65s linear infinite; }
      .scrolling-wrapper:hover { animation-play-state: paused; }
      .table-row-hover:hover { background-color: #f8fafc; transition: background-color 0.15s ease; }
      .product-card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
      .product-card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.1); border-color: #cbd5e1 !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const theme = {
    colors: {
      text: '#0f172a',
      textMuted: '#64748b',
      primary: '#059669',
      primaryDark: '#047857', 
      success: '#059669',
      successDark: '#047857',
      error: '#e11d48',
      warning: '#d97706',
      borderLight: '#e2e8f0'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ color: theme.colors.text }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

// ==================== UI COMPONENTS ====================

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    toast.success = (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };
    toast.error = (message) => toast.success(message, 'error');
    return () => delete toast.error;
  }, []);

  return (
    <div style={{ position: 'fixed', top: '5.25rem', right: '1.25rem', zIndex: 10001, display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '90%', width: '340px', pointerEvents: 'none' }}>
      {toasts.map(t => <Toast key={t.id} {...t} onClose={() => setToasts(prev => prev.filter(item => item.id !== t.id))} />)}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  const theme = useTheme();
  const isError = type === 'error';

  return (
    <div className="glass-panel" style={{
      borderRadius: '0.85rem',
      padding: '0.85rem 1rem',
      animation: 'slideInRight 0.25s ease-out',
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(12px)',
      color: '#ffffff',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: isError ? theme.colors.error : '#10b981',
        flexShrink: 0
      }} />
      <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: '600' }}>{message}</div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}>✕</button>
    </div>
  );
}

function SkeletonLoader({ width = '100%', height = '20px', borderRadius = '0.5rem', style = {} }) {
  return <div style={{ width, height, borderRadius, background: '#e2e8f0', ...style }} />;
}

function CardSkeleton() {
  return (
    <div className="glass-panel" style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SkeletonLoader height="150px" borderRadius="0.75rem" />
      <SkeletonLoader width="60%" height="18px" />
      <SkeletonLoader width="40%" height="14px" />
      <SkeletonLoader height="38px" borderRadius="0.5rem" style={{ marginTop: 'auto' }} />
    </div>
  );
}

function PremiumButton({ children, onClick, variant = 'primary', loading = false, disabled = false, fullWidth = false, size = 'md', icon, style = {}, ...props }) {
  const theme = useTheme();
  const variants = {
    primary: { background: '#0f172a', color: '#ffffff', border: '1px solid #0f172a' },
    success: { background: theme.colors.primary, color: '#ffffff', border: `1px solid ${theme.colors.primaryDark}` },
    danger: { background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' },
    ghost: { background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155' },
    outline: { background: 'transparent', border: `1.5px solid ${theme.colors.primary}`, color: theme.colors.primary }
  };
  const sizes = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.8rem' },
    md: { padding: '0.65rem 1.25rem', fontSize: '0.875rem' },
    lg: { padding: '0.8rem 1.75rem', fontSize: '0.95rem' }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
        borderRadius: '0.65rem',
        fontWeight: '700',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        ...style
      }}
      {...props}
    >
      {loading ? (
        <span style={{ fontSize: '0.85em', display: 'flex', alignItems: 'center' }}>Processing...</span>
      ) : (
        <>
          {icon && <span style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>{icon}</span>}
          <span style={{ lineHeight: 1 }}>{children}</span>
        </>
      )}
    </button>
  );
}

function PremiumInput({ label, error, icon, helperText, ...props }) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.35rem', color: '#334155', fontWeight: '700', fontSize: '0.78rem', letterSpacing: '0.01em' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <span style={{ position: 'absolute', left: '0.85rem', color: theme.colors.textMuted, fontSize: '0.95rem', display: 'flex', alignItems: 'center', zIndex: 2 }}>{icon}</span>}
        <input
          {...props}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%',
            padding: icon ? '0.65rem 0.9rem 0.65rem 2.35rem' : '0.65rem 0.9rem',
            borderRadius: '0.65rem',
            border: `1px solid ${error ? theme.colors.error : isFocused ? theme.colors.primary : 'var(--input-border)'}`,
            background: 'var(--input-bg)',
            color: theme.colors.text,
            fontSize: '0.875rem',
            fontWeight: '500',
            outline: 'none',
            transition: 'all 0.15s ease',
            boxShadow: isFocused && !error ? `0 0 0 3px rgba(5, 150, 105, 0.12)` : 'none',
            lineHeight: 1.4,
            ...props.style
          }}
        />
      </div>
      {error && <p style={{ margin: '0.25rem 0 0 0', color: theme.colors.error, fontSize: '0.72rem', fontWeight: '600' }}>{error}</p>}
      {helperText && !error && <p style={{ margin: '0.25rem 0 0 0', color: theme.colors.textMuted, fontSize: '0.72rem' }}>{helperText}</p>}
    </div>
  );
}

function SuccessConfetti() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
      {[...Array(40)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${Math.random() * 100}%`, top: '-20px', width: '8px', height: '8px', background: ['#059669', '#0f172a', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)], borderRadius: Math.random() > 0.5 ? '50%' : '2px', animation: `fall ${1.5 + Math.random() * 2}s linear forwards` }} />
      ))}
    </div>
  );
}

function GlobalTicker() {
  const displayTrends = [...MARKET_RATES, ...MARKET_RATES, ...MARKET_RATES]; 
  return (
    <div style={{
      background: '#0f172a',
      color: '#f8fafc',
      width: '100%',
      height: '34px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9990,
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div className="scrolling-wrapper">
        {displayTrends.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: '0.76rem', marginRight: '2.5rem', fontWeight: '500', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#ffffff', fontWeight: '700', marginRight: '0.45rem' }}>{item.crop}</span>
            <span style={{ color: '#94a3b8', marginRight: '0.6rem' }}>Mandi Gr-A: <span style={{ color: '#cbd5e1', textDecoration: 'line-through' }}>₹{item.mandiA}</span></span>
            <span style={{ color: '#34d399', marginRight: '0.6rem', fontWeight: '700' }}>KF(B): ₹{item.kfB}</span>
            <span style={{ color: '#fbbf24', fontWeight: '700' }}>KF(C): ₹{item.kfC}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryVerificationModal({ order, onClose, onVerify }) {
  const theme = useTheme();
  const [scannedData, setScannedData] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const scannerRef = useRef(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);

  useEffect(() => {
    if (!scannerInitialized) {
      const scanner = new Html5QrcodeScanner('delivery-qr-reader', { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 });
      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            setScannedData(data);
            scanner.clear();
            toast.success('SHA-256 QR Seal verified');
          } catch (e) { toast.error('Invalid QR code format'); }
        }, () => {}
      );
      scannerRef.current = scanner;
      setScannerInitialized(true);
    }
    return () => { if (scannerRef.current) scannerRef.current.clear().catch(() => {}); };
  }, []);

  const handleConfirmDelivery = async () => {
    if (!scannedData) return toast.error('Scan shipment QR first');
    setVerifying(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'delivered',
        deliveryVerified: true,
        deliveryScannedData: scannedData,
        deliveryConfirmedAt: serverTimestamp()
      });
      toast.success('Delivery verified & escrow settled');
      setTimeout(() => onVerify(), 900);
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '1.75rem', maxWidth: '460px', width: '100%', animation: 'slideInUp 0.25s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icons.Qr />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>SHA-256 Delivery Verification</h2>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '0.9rem', cursor: 'pointer', color: theme.colors.textMuted }}>✕</button>
        </div>
        {!scannedData ? (
          <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1rem', textAlign: 'center', border: '1.5px dashed #cbd5e1' }}>
            <p style={{ color: theme.colors.textMuted, marginBottom: '0.85rem', fontSize: '0.85rem', fontWeight: '600' }}>Scan crate SHA-256 QR seal to release escrow payout</p>
            <div id="delivery-qr-reader" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}></div>
            <button
              type="button"
              onClick={() => {
                const item = order?.items?.[0] || {};
                setScannedData({
                  name: item.name || 'Verified Produce Batch',
                  farmName: order?.farmName || item.farmName || 'Azara Valley Farm',
                  grade: item.grade || 'B'
                });
                toast.success('Batch seal verified');
              }}
              style={{
                marginTop: '0.9rem',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#047857',
                padding: '0.5rem 1rem',
                borderRadius: '0.6rem',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Simulate Instant QR Seal Match
            </button>
          </div>
        ) : (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ color: '#047857', fontWeight: '800', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Icons.Shield /> Cryptographic Seal Matched
            </div>
            <div style={{ fontSize: '0.85rem', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <p style={{ margin: 0 }}><strong>Batch:</strong> {scannedData.name}</p>
              <p style={{ margin: 0 }}><strong>Origin Farm:</strong> {scannedData.farmName}</p>
              <p style={{ margin: 0 }}><strong>Verified Grade:</strong> Grade {scannedData.grade}</p>
            </div>
          </div>
        )}
        {scannedData && (
          <PremiumButton variant="success" fullWidth size="lg" loading={verifying} onClick={handleConfirmDelivery}>
            Confirm Receipt & Settle Escrow
          </PremiumButton>
        )}
      </div>
    </div>
  );
}

// ==================== AUTH & LANDING PAGE ====================

function CombinedHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ identifier: '', password: '', businessName: '', ownerName: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'identifier': return !value ? 'Required' : ''; 
      case 'password': return !value ? 'Required' : value.length < 6 ? 'Min 6 chars' : '';
      case 'businessName': return !isLogin && !value ? 'Required' : '';
      case 'ownerName': return !isLogin && !value ? 'Required' : '';
      case 'address': return !isLogin && !value ? 'Required' : '';
      default: return '';
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(form).forEach(k => { 
      if (isLogin && k !== 'identifier' && k !== 'password') return;
      const err = validateField(k, form[k]); 
      if (err) newErrors[k] = err; 
    });
    
    let emailToUse = form.identifier;
    if (!emailToUse) {
      newErrors.identifier = 'Required';
    } else if (/^\d{10}$/.test(emailToUse)) {
      emailToUse = `${emailToUse}@khetflow-phone.com`;
    } else if (!/\S+@\S+\.\S+/.test(emailToUse)) {
      newErrors.identifier = 'Valid email or 10-digit phone required';
    }

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, emailToUse, form.password);
        toast.success('Authenticated into KhetFlow B2B');
        navigate('/dashboard');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, emailToUse, form.password);
        await setDoc(doc(db, 'businesses', userCred.user.uid), { 
          email: form.identifier, 
          businessName: form.businessName,
          ownerName: form.ownerName,
          phone: /^\d{10}$/.test(form.identifier) ? form.identifier : form.phone,
          address: form.address,
          userType: 'business', 
          createdAt: serverTimestamp() 
        });
        toast.success('Enterprise buyer account created');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', paddingTop: '3.5rem' }}>
      <GlobalTicker />
      <div className="split-layout" style={{ maxWidth: '1060px', width: '100%', padding: '1.5rem', alignItems: 'center' }}>
        
        <div className="order-info" style={{ flex: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', width: 'fit-content', marginBottom: '1.25rem' }}>
            <Icons.Logo /> KHETFLOW HORECA PROCUREMENT
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Direct B2B Sourcing for <span className="hl-green">Grade B & C</span> Harvests.
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '2rem', fontWeight: '500', lineHeight: 1.65, maxWidth: '460px' }}>
            Commercial kitchens, hospitals, and food processors cut raw material procurement costs by <span className="hl-amber">30% to 40%</span> with AI-graded, SHA-256 verified farm lots and pooled Milk-Run delivery.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }} className="mobile-hide">
            {[
              { label: 'PROCUREMENT SAVINGS', value: '30–40%', sub: 'vs. Wholesale Gr-A' },
              { label: 'QUALITY ASSURANCE', value: 'SHA-256', sub: 'AI Vision Audited' },
              { label: 'MILK-RUN DISPATCH', value: '< 24 hrs', sub: 'Pooled Route Transit' }
            ].map((stat, i) => (
              <div key={i} className="glass-panel" style={{ borderRadius: '0.9rem', padding: '1rem', background: '#ffffff' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontWeight: '800', color: '#059669', marginTop: '0.4rem', fontSize: '0.68rem', letterSpacing: '0.04em' }}>{stat.label}</div>
                <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '0.15rem', fontWeight: '500' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-auth" style={{ flex: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '2.25rem', width: '100%', maxWidth: '420px', background: '#ffffff' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                {isLogin ? 'HORECA Buyer Sign In' : 'Register Commercial Kitchen'}
              </h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.82rem', fontWeight: '500' }}>
                {isLogin ? 'Access live Agmarknet-linked Grade B & C inventory' : 'Onboard your hotel, restaurant, cafe, or processing unit'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {!isLogin && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <PremiumInput name="businessName" placeholder="Hotel / Kitchen Name" label="Business Name" value={form.businessName} onChange={handleChange} error={errors.businessName} />
                  <PremiumInput name="ownerName" placeholder="Procurement Head" label="Contact Person" value={form.ownerName} onChange={handleChange} error={errors.ownerName} />
                </div>
              )}
              
              <PremiumInput name="identifier" type="text" placeholder="procurement@company.com or 10-digit mobile" label="Work Email or Mobile Number" value={form.identifier} onChange={handleChange} error={errors.identifier} />
              <PremiumInput name="password" type="password" placeholder="••••••••" label="Password" value={form.password} onChange={handleChange} error={errors.password} helperText={!isLogin && "Minimum 6 characters"} />
              
              {!isLogin && (
                <PremiumInput name="address" placeholder="Commercial Hub / Kitchen Address" label="Delivery Hub Location" value={form.address} onChange={handleChange} error={errors.address} />
              )}
              
              <PremiumButton type="submit" variant="success" fullWidth size="lg" loading={loading} style={{ marginTop: '0.4rem' }}>
                {isLogin ? 'Access Procurement Portal' : 'Create Commercial Account'}
              </PremiumButton>
            </form>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
              {isLogin ? "New commercial buyer? " : "Already registered? "}
              <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} style={{ background: 'none', border: 'none', color: theme.colors.primary, fontWeight: '700', cursor: 'pointer', padding: 0, fontSize: '0.82rem' }}>
                {isLogin ? 'Register your kitchen' : 'Sign in here'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return unsubscribe;
  }, []);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CardSkeleton /></div>;
  return user ? children : <Navigate to="/" />;
}

// ==================== CORPORATE PROCUREMENT DASHBOARD ====================

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [view, setView] = useState('marketplace'); 
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({ address: '', phone: '' });
  const [ordering, setOrdering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('online'); 
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const [estimatedDistance] = useState(12.5); 
  const deliveryRate = 8; 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [mandiSearch, setMandiSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); 
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await Promise.all([
          fetchBusinessData(u.uid),
          fetchListings(),
          fetchOrders(u.uid)
        ]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchBusinessData = async (uid) => {
    try {
      const docSnap = await getDoc(doc(db, 'businesses', uid));
      if (docSnap.exists()) {
        setBusinessData(docSnap.data());
        const phoneData = docSnap.data().phone || (docSnap.data().email && docSnap.data().email.includes('-phone.com') ? docSnap.data().email.split('@')[0] : '');
        setDeliveryForm({ address: docSnap.data().address || '', phone: phoneData });
      }
    } catch (error) {
      toast.error('Error loading business profile');
    }
  };

  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'listings'));
      const dbListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dbListings.length > 0) {
        setListings(dbListings);
      } else {
        setListings(SAMPLE_MARKET_LISTINGS);
      }
    } catch (error) { 
      console.warn('Using standard inventory fallback:', error);
      setListings(SAMPLE_MARKET_LISTINGS);
    }
  };

  const fetchOrders = async (uid) => {
    try {
      const snapshot = await getDocs(query(collection(db, 'orders'), where('businessId', '==', uid)));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
      toast.error('Error loading orders');
    }
  };

  const getFilteredAndSortedListings = () => {
    let filtered = listings;
    if (searchTerm) filtered = filtered.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || (l.farmLocation || '').toLowerCase().includes(searchTerm.toLowerCase()));
    if (gradeFilter !== 'all') filtered = filtered.filter(l => l.grade === gradeFilter);
    
    if (activeCategory === 'vegetables') filtered = filtered.filter(l => ['tomato', 'onion', 'potato', 'carrot', 'cabbage', 'cauliflower', 'spinach', 'brinjal', 'okra', 'ginger', 'garlic'].some(v => l.name.toLowerCase().includes(v)));
    else if (activeCategory === 'fruits') filtered = filtered.filter(l => ['banana', 'apple', 'mango', 'papaya', 'orange', 'pineapple'].some(v => l.name.toLowerCase().includes(v)));
    else if (activeCategory === 'millets') filtered = filtered.filter(l => ['millet', 'sorghum', 'bajra', 'jowar', 'ragi'].some(v => l.name.toLowerCase().includes(v)));

    if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  };

  const filteredListings = getFilteredAndSortedListings();

  const addToCart = (listing) => {
    const existing = cart.find(item => item.id === listing.id);
    if (existing) {
      setCart(cart.map(item => item.id === listing.id ? { ...item, cartQuantity: Math.min(item.cartQuantity + 5, item.quantity) } : item));
      toast.success(`Updated ${listing.name} quantity`);
    } else {
      setCart([...cart, { ...listing, cartQuantity: Math.min(5, Number(listing.quantity) || 1) }]);
      toast.success(`${listing.name} added to procurement cart`);
    }
  };

  const updateCartQuantity = (id, newQ) => {
    if (newQ <= 0) setCart(cart.filter(i => i.id !== id));
    else setCart(cart.map(i => i.id === id ? { ...i, cartQuantity: Math.min(newQ, i.quantity) } : i));
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const deliveryFee = Math.ceil(estimatedDistance * deliveryRate);
  const finalTotal = subTotal + deliveryFee;
  const totalCartItems = cart.reduce((a, b) => a + b.cartQuantity, 0);
  const activeDispatchesCount = orders.filter(o => o.status !== 'delivered').length;

  const finalizeOrder = async () => {
    setOrdering(true);
    try {
      const totalWeight = cart.reduce((sum, item) => sum + (Number(item.cartQuantity) || Number(item.quantity) || 1), 0);
      const farmName = cart[0]?.farmName || 'Azara Valley Farm';
      const farmAddress = cart[0]?.farmLocation || 'Azara, Kamrup, Assam';

      await addDoc(collection(db, 'orders'), {
        businessId: user.uid,
        businessName: businessData?.businessName || user.displayName || 'Enterprise HORECA Buyer',
        items: cart,
        totalItems: totalWeight,
        farmName,
        farmAddress,
        subTotal,
        deliveryFee,
        totalAmount: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
        deliveryAddress: deliveryForm.address || 'Guwahati Commercial Hub, Assam',
        phone: deliveryForm.phone || '9876543210',
        status: 'pending',
        readyForPickup: false,
        createdAt: serverTimestamp()
      });
      setCart([]);
      setShowCart(false);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setView('orders'); }, 2600);
      await fetchOrders(user.uid);
    } catch (error) { 
      console.error('Order error:', error);
      toast.error('Error placing order'); 
    } finally {
      setOrdering(false);
    }
  };

  const triggerPayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (cart.length === 0) return;
    
    if (paymentMethod === 'online') {
      setShowPaymentProcessing(true);
      setTimeout(async () => {
        setShowPaymentProcessing(false);
        await finalizeOrder();
      }, 2200);
    } else {
      await finalizeOrder();
    }
  };

  if (loading) return <div style={{ padding: '4rem 2rem', maxWidth: '1240px', margin: '0 auto' }}><CardSkeleton /></div>;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '34px', paddingBottom: '6.5rem' }}>
      <GlobalTicker />
      <ToastContainer />
      {showSuccess && <SuccessConfetti />}
      
      {/* ESCROW PAYMENT MODAL */}
      {showPaymentProcessing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10005, padding: '1rem' }}>
          <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '2rem', maxWidth: '360px', width: '100%', animation: 'slideInUp 0.25s ease-out', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #a7f3d0' }}>
              <div style={{ width: '24px', height: '24px', border: `2.5px solid ${theme.colors.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }}></div>
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.35rem 0', color: '#0f172a' }}>Authorizing Escrow Settlement</h2>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 1rem 0' }}>
              Locking <strong style={{ color: '#0f172a' }}>₹{finalTotal}</strong> in KhetFlow Trust Escrow until SHA-256 QR delivery confirmation.
            </p>
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>
                <span>Protocol</span>
                <span style={{ color: '#059669', fontWeight: '700' }}>SHA-256 Escrow Lock</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Logistics</span>
                <span style={{ color: '#0f172a', fontWeight: '700' }}>Milk-Run Route Pool</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVerificationModal && selectedOrder && (
        <DeliveryVerificationModal
          order={selectedOrder}
          onClose={() => setShowVerificationModal(false)}
          onVerify={async () => { setShowVerificationModal(false); await fetchOrders(user.uid); }}
        />
      )}

      {/* ==================== 1. TRANSLUCENT STICKY TOP CORPORATE NAVBAR ==================== */}
      <header className="translucent-top-nav">
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0.65rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          
          {/* Brand & Buyer Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '0.75rem',
              background: '#0f172a',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)'
            }}>
              <Icons.Logo />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {businessData?.businessName || 'KhetFlow Business Hub'}
                </span>
                <span className="mobile-hide" style={{
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  letterSpacing: '0.03em'
                }}>
                  HORECA VERIFIED
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
                Direct Farm-to-Kitchen B2B Procurement • {deliveryForm.address || 'Guwahati Cluster'}
              </p>
            </div>
          </div>

          {/* Right Status & Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => setShowCart(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '0.65rem',
                background: cart.length > 0 ? '#ecfdf5' : '#ffffff',
                border: `1px solid ${cart.length > 0 ? '#a7f3d0' : '#e2e8f0'}`,
                color: cart.length > 0 ? '#047857' : '#334155',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              <Icons.Cart />
              <span>{totalCartItems > 0 ? `${totalCartItems} kg • ₹${subTotal}` : 'Cart (0)'}</span>
            </button>

            <button
              onClick={async () => { await signOut(auth); navigate('/'); }}
              title="Sign Out"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '0.65rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              <Icons.Logout />
              <span className="mobile-hide">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* ==================== 2. TRANSLUCENT FLOATING BOTTOM TASKBAR DOCK ==================== */}
      <nav className="translucent-bottom-dock" aria-label="Primary Taskbar">
        <button
          onClick={() => setView('marketplace')}
          className={`dock-item ${view === 'marketplace' && !showCart ? 'active' : ''}`}
        >
          <Icons.Market />
          <span>Market</span>
        </button>

        <button
          onClick={() => setView('orders')}
          className={`dock-item ${view === 'orders' && !showCart ? 'active' : ''}`}
        >
          <Icons.Orders />
          <span>Orders</span>
          {activeDispatchesCount > 0 && (
            <span className="dock-badge">{activeDispatchesCount}</span>
          )}
        </button>

        <button
          onClick={() => setView('mandi')}
          className={`dock-item ${view === 'mandi' && !showCart ? 'active' : ''}`}
        >
          <Icons.Mandi />
          <span>Mandi</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(15, 23, 42, 0.12)', margin: '0 0.15rem' }} />

        <button
          onClick={() => setShowCart(true)}
          className={`dock-item ${showCart ? 'active' : ''}`}
          style={cart.length > 0 && !showCart ? { background: '#ecfdf5', color: '#047857' } : {}}
        >
          <Icons.Cart />
          <span className="dock-label-hide-xs">Procurement Cart</span>
          {cart.length > 0 && (
            <span className="dock-badge">{cart.length}</span>
          )}
        </button>
      </nav>

      {/* ==================== 3. MAIN WORKSPACE CONTAINER ==================== */}
      <main style={{ maxWidth: '1240px', margin: '1.25rem auto 0', padding: '0 1rem' }}>
        
        {view === 'marketplace' && (
          <div style={{ animation: 'slideInUp 0.25s ease-out' }}>
            
            {/* CORPORATE KPI METRICS BAR */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                {
                  label: 'Total Sourced Value',
                  value: '₹2,841',
                  sub: 'Avg. 36% saved vs. Mandi',
                  hlClass: 'hl-green',
                  icon: <Icons.Wallet />,
                  accent: '#059669'
                },
                {
                  label: 'Procured Volume',
                  value: '132 kg',
                  sub: '100% SHA-256 Verified Lots',
                  hlClass: 'hl-green',
                  icon: <Icons.Scale />,
                  accent: '#0f172a'
                },
                {
                  label: 'Active Dispatches',
                  value: activeDispatchesCount,
                  sub: 'Pooled Milk-Run Transit',
                  hlClass: 'hl-amber',
                  icon: <Icons.Truck />,
                  accent: '#d97706'
                }
              ].map((stat, i) => (
                <div key={i} className="glass-panel stat-card" style={{
                  borderRadius: '1rem',
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderTop: `3px solid ${stat.accent}`
                }}>
                  <div>
                    <div className="label" style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {stat.label}
                    </div>
                    <div className="val" style={{ fontSize: '1.65rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.15, marginTop: '0.2rem', fontVariantNumeric: 'tabular-nums' }}>
                      {stat.value}
                    </div>
                    <div className="sub-pill" style={{ marginTop: '0.35rem', fontSize: '0.7rem' }}>
                      <span className={stat.hlClass}>{stat.sub}</span>
                    </div>
                  </div>
                  <div className="icon-wrap" style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: stat.accent,
                    padding: '0.7rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* MARKETPLACE INVENTORY WORKSPACE */}
            <div className="glass-panel marketplace-panel" style={{ borderRadius: '1.25rem', padding: '1.35rem' }}>
              
              {/* Category Filter Strip + Search & Sort */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Verified Farm Inventory
                    </h2>
                    <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.76rem', color: '#64748b', fontWeight: '500' }}>
                      Direct Grade B (chopping/dicing) & Grade C (puree/gravy/processing) bulk lots
                    </p>
                  </div>

                  <div className="category-scroll" style={{ display: 'flex', gap: '0.4rem' }}>
                    {[
                      { id: 'all', label: 'All Lots' },
                      { id: 'vegetables', label: 'Vegetables' },
                      { id: 'fruits', label: 'Fruits' },
                      { id: 'millets', label: 'Millets' }
                    ].map(cat => {
                      const active = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          style={{
                            padding: '0.45rem 0.9rem',
                            borderRadius: '0.6rem',
                            background: active ? '#0f172a' : '#f8fafc',
                            border: `1px solid ${active ? '#0f172a' : '#e2e8f0'}`,
                            color: active ? '#ffffff' : '#475569',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            fontSize: '0.78rem'
                          }}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="filters-wrap" style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                  <div className="search-wrap" style={{ flex: '1 1 240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                      <Icons.Search />
                    </span>
                    <input
                      type="text"
                      placeholder="Search crop or farm cluster (e.g. Onion, Tomato, Azara)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.85rem 0.55rem 2.35rem',
                        borderRadius: '0.65rem',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        outline: 'none',
                        fontSize: '0.82rem',
                        fontWeight: '500'
                      }}
                    />
                  </div>
                  <div className="dropdown-wrap" style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: '0.65rem',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        outline: 'none',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      <option value="all">All Grades (B & C)</option>
                      <option value="B">Grade B (Chopping)</option>
                      <option value="C">Grade C (Puree/Sauce)</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: '0.65rem',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        outline: 'none',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* B2B PRODUCT GRID */}
              <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(235px, 1fr))', gap: '1rem' }}>
                {filteredListings.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#64748b', background: '#f8fafc', borderRadius: '0.85rem', border: '1.5px dashed #cbd5e1', fontWeight: '600', fontSize: '0.85rem' }}>
                    No matching produce lots found. Try clearing your grade or search filter.
                  </div>
                ) : (
                  filteredListings.map(listing => {
                    const itemPrice = Number(listing.price) || 0;
                    const mandiPrice = Math.round(itemPrice > 0 ? itemPrice * 1.5 : 25);
                    const savePercent = mandiPrice > 0 ? Math.max(0, Math.min(90, Math.round((1 - (itemPrice / mandiPrice)) * 100))) : 33;
                    const inCartItem = cart.find(c => c.id === listing.id);

                    return (
                      <div key={listing.id} className="glass-panel product-card product-card-hover" style={{
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0'
                      }}>
                        {/* Image Container */}
                        <div className="product-img" style={{
                          position: 'relative',
                          height: '148px',
                          background: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3.25rem',
                          borderRadius: '0.7rem',
                          marginBottom: '0.7rem',
                          overflow: 'hidden'
                        }}>
                          {/* Grade Pill */}
                          <div style={{
                            position: 'absolute',
                            top: '0.45rem',
                            left: '0.45rem',
                            background: listing.grade === 'C' ? 'rgba(254, 243, 199, 0.96)' : 'rgba(15, 23, 42, 0.88)',
                            backdropFilter: 'blur(6px)',
                            color: listing.grade === 'C' ? '#92400e' : '#ffffff',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.4rem',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            letterSpacing: '0.04em',
                            zIndex: 2
                          }}>
                            GRADE {listing.grade}
                          </div>

                          {/* Save % Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '0.45rem',
                            right: '0.45rem',
                            background: '#059669',
                            color: '#ffffff',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.4rem',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            zIndex: 2
                          }}>
                            SAVE {savePercent}%
                          </div>

                          {listing.image && (listing.image.startsWith('data:') || listing.image.startsWith('http') || listing.image.startsWith('/')) ? (
                            <img src={listing.image} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span>{listing.icon || '🌾'}</span>
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.25rem' }}>
                            <h3 className="product-title" style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: '800', lineHeight: 1.25 }}>
                              {listing.name}
                            </h3>
                          </div>

                          <div className="product-desc" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#64748b', margin: '0.3rem 0 0.65rem 0', fontWeight: '600' }}>
                            <Icons.MapPin />
                            <span>{listing.quantity} kg available • {listing.farmLocation || 'Assam Cluster'}</span>
                          </div>

                          {/* B2B Pricing Box */}
                          <div className="product-price-box" style={{
                            background: '#f8fafc',
                            borderRadius: '0.65rem',
                            padding: '0.55rem 0.7rem',
                            marginBottom: '0.65rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div>
                              <div className="mandi-price" style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600' }}>
                                Mandi Gr-A: <span style={{ textDecoration: 'line-through' }}>₹{mandiPrice}/kg</span>
                              </div>
                              <div className="kf-price" style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.1, marginTop: '2px' }}>
                                ₹{listing.price}<span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>/kg</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', fontWeight: '700', color: '#047857', background: '#ecfdf5', padding: '0.2rem 0.45rem', borderRadius: '0.35rem', border: '1px solid #a7f3d0' }}>
                              <Icons.Shield /> Verified
                            </div>
                          </div>

                          {/* Action Button or Inline Quantity Stepper */}
                          <div style={{ marginTop: 'auto' }}>
                            {inCartItem ? (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#0f172a',
                                color: '#ffffff',
                                borderRadius: '0.6rem',
                                padding: '0.3rem 0.5rem'
                              }}>
                                <button
                                  onClick={() => updateCartQuantity(listing.id, inCartItem.cartQuantity - 5)}
                                  style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: '#ffffff', width: '26px', height: '26px', borderRadius: '0.4rem', fontWeight: '800', cursor: 'pointer' }}
                                >
                                  -
                                </button>
                                <span style={{ fontSize: '0.78rem', fontWeight: '800' }}>
                                  {inCartItem.cartQuantity} kg in Cart
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(listing.id, inCartItem.cartQuantity + 5)}
                                  style={{ background: '#059669', border: 'none', color: '#ffffff', width: '26px', height: '26px', borderRadius: '0.4rem', fontWeight: '800', cursor: 'pointer' }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <PremiumButton variant="success" fullWidth size="sm" onClick={() => addToCart(listing)}>
                                + Add to Procurement Order
                              </PremiumButton>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== MANDI BENCHMARK TABLE VIEW ==================== */}
        {view === 'mandi' && (
          <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '1.5rem', animation: 'slideInUp 0.25s ease-out' }}>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                  Agmarknet Mandi vs. KhetFlow B2B Benchmark
                </h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.8rem', fontWeight: '500' }}>
                  Live wholesale reference rates comparing Grade A retail mandi prices against KhetFlow Grade B & C commercial rates.
                </p>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '260px', maxWidth: '100%' }}>
                <span style={{ position: 'absolute', left: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                  <Icons.Search />
                </span>
                <input
                  type="text"
                  placeholder="Filter commodity..."
                  value={mandiSearch}
                  onChange={(e) => setMandiSearch(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem 0.5rem 2.2rem', width: '100%', borderRadius: '0.6rem', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '0.85rem', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '520px' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: '800' }}>Commodity</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: '800' }}>Mandi Grade A</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#047857' }}>KhetFlow Grade B</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#b45309' }}>KhetFlow Grade C</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: '800' }}>HORECA Savings</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: '800' }}>Mandi Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKET_RATES.filter(r => r.crop.toLowerCase().includes(mandiSearch.toLowerCase())).map((item, i) => {
                    const savingsPct = Math.round(((item.mandiA - item.kfB) / item.mandiA) * 100);
                    return (
                      <tr key={i} className="table-row-hover" style={{ borderTop: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#0f172a' }}>{item.crop}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontWeight: '600' }}>₹{item.mandiA}/kg</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#047857' }}><span className="hl-green">₹{item.kfB}/kg</span></td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#b45309' }}><span className="hl-amber">₹{item.kfC}/kg</span></td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#059669' }}>-{savingsPct}% vs. Gr-A</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '700', fontSize: '0.78rem', color: item.trend === 'Up' ? '#059669' : item.trend === 'Down' ? '#e11d48' : '#64748b' }}>
                          {item.trend === 'Up' ? '↗ High Demand' : item.trend === 'Down' ? '↘ Softening' : '→ Stable'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== ORDERS & ESCROW DISPATCH VIEW ==================== */}
        {view === 'orders' && (
          <div style={{ animation: 'slideInUp 0.25s ease-out' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Active Procurement Dispatches ({orders.length})
                </h2>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>
                  Track pooled Milk-Run deliveries and scan SHA-256 crate seals upon arrival.
                </p>
              </div>
            </div>

            <div className="order-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
              {orders.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#64748b', background: '#ffffff', borderRadius: '1rem', border: '1.5px dashed #cbd5e1', fontWeight: '600', fontSize: '0.9rem' }}>
                  No procurement orders placed yet. Browse the Market tab to source produce lots.
                </div>
              )}
              
              {orders.map(order => {
                const isPending = order.status === 'pending';
                const isPicked = order.status === 'picked';
                const isDelivered = order.status === 'delivered';
                
                const steps = [
                  { label: 'Order Placed & Escrow Locked', done: true },
                  { label: 'Farm Batch Harvested & Graded', done: isPicked || isDelivered, active: isPending },
                  { label: 'SHA-256 QR Seal Generated', done: isPicked || isDelivered },
                  { label: 'Pooled Milk-Run In Transit', done: isPicked || isDelivered },
                  { label: 'Kitchen Verified & Settled', done: isDelivered, active: isPicked }
                ];

                return (
                  <div key={order.id} className="glass-panel" style={{ borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '0.62rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.06em' }}>SHIPMENT ID</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', fontFamily: 'monospace' }}>#{order.id.substring(0,8).toUpperCase()}</div>
                      </div>
                      <div style={{
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        background: isDelivered ? '#ecfdf5' : isPicked ? '#eff6ff' : '#fffbeb',
                        color: isDelivered ? '#047857' : isPicked ? '#1d4ed8' : '#b45309',
                        border: `1px solid ${isDelivered ? '#a7f3d0' : isPicked ? '#bfdbfe' : '#fde68a'}`
                      }}>
                        {isDelivered ? 'DELIVERED & VERIFIED' : isPicked ? 'IN MILK-RUN TRANSIT' : 'PREPARING LOT'}
                      </div>
                    </div>

                    <div style={{ flex: 1, marginBottom: '1rem' }}>
                      {steps.map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.65rem', position: 'relative', paddingBottom: idx === steps.length - 1 ? '0' : '0.7rem' }}>
                          {idx !== steps.length - 1 && (
                            <div style={{ position: 'absolute', left: '6px', top: '14px', bottom: 0, width: '1.5px', background: step.done ? '#059669' : '#e2e8f0' }} />
                          )}
                          <div style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            marginTop: '1px',
                            zIndex: 2,
                            background: step.done ? '#059669' : step.active ? '#f59e0b' : '#ffffff',
                            border: `2px solid ${step.done ? '#059669' : step.active ? '#f59e0b' : '#cbd5e1'}`
                          }} />
                          <div style={{ fontSize: '0.76rem', fontWeight: step.done || step.active ? '700' : '500', color: step.done || step.active ? '#0f172a' : '#94a3b8' }}>
                            {step.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>Escrow Total</span>
                        <div style={{ fontWeight: '900', fontSize: '1.15rem', color: '#0f172a' }}>₹{order.totalAmount}</div>
                      </div>
                      {isPicked && !order.deliveryVerified && (
                        <PremiumButton variant="success" size="sm" icon={<Icons.Qr />} onClick={() => { setSelectedOrder(order); setShowVerificationModal(true); }}>
                          Verify QR Seal
                        </PremiumButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* ==================== 4. SLIDE-OVER PROCUREMENT CART DRAWER ==================== */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setShowCart(false)}>
          <div
            className="glass-panel cart-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '410px',
              maxWidth: '100%',
              height: '100%',
              borderRadius: '1.25rem 0 0 1.25rem',
              borderLeft: '1px solid #e2e8f0',
              boxShadow: '-12px 0 36px rgba(15, 23, 42, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              background: '#ffffff'
            }}
          >
            <div style={{ padding: '1.15rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Cart />
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                  Procurement Requisition
                </h2>
                <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: '800', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                  {cart.length} Lots
                </span>
              </div>
              <button onClick={() => setShowCart(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '30px', height: '30px', fontSize: '0.85rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#475569', marginBottom: '0.25rem' }}>Your requisition cart is empty</p>
                  <p style={{ fontSize: '0.78rem', margin: 0 }}>Add Grade B or C farm lots from the marketplace to calculate pooled Milk-Run delivery.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', background: '#f8fafc', padding: '0.7rem', borderRadius: '0.85rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: '46px', height: '46px', background: '#ffffff', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', border: '1px solid #e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
                      {item.image && (item.image.startsWith('data:') || item.image.startsWith('http') || item.image.startsWith('/')) ? (
                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span>{item.icon || '🌾'}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', fontWeight: '600' }}>₹{item.price}/kg • Grade {item.grade}</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.88rem' }}>₹{item.price * item.cartQuantity}</div>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '0.45rem', background: '#ffffff' }}>
                        <button onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)} style={{ background: 'none', border: 'none', padding: '0.15rem 0.45rem', cursor: 'pointer', color: '#0f172a', fontWeight: '800' }}>-</button>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0 0.2rem', color: '#0f172a', minWidth: '22px', textAlign: 'center' }}>{item.cartQuantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)} style={{ background: 'none', border: 'none', padding: '0.15rem 0.45rem', cursor: 'pointer', color: '#0f172a', fontWeight: '800' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '1.15rem 1.25rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>SETTLEMENT MODE</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      style={{
                        padding: '0.55rem',
                        borderRadius: '0.6rem',
                        border: `1.5px solid ${paymentMethod === 'online' ? '#059669' : '#cbd5e1'}`,
                        background: paymentMethod === 'online' ? '#ecfdf5' : '#ffffff',
                        color: paymentMethod === 'online' ? '#047857' : '#334155',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      Escrow Trust Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      style={{
                        padding: '0.55rem',
                        borderRadius: '0.6rem',
                        border: `1.5px solid ${paymentMethod === 'cod' ? '#0f172a' : '#cbd5e1'}`,
                        background: paymentMethod === 'cod' ? '#f1f5f9' : '#ffffff',
                        color: '#0f172a',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      Pay on Delivery
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                  <span>Produce Lot Subtotal ({totalCartItems} kg)</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>₹{subTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                  <span>Pooled Milk-Run Logistics Fee</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>₹{deliveryFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.1rem', marginBottom: '0.85rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.65rem', color: '#0f172a' }}>
                  <span>Total Payable</span>
                  <span className="hl-green">₹{finalTotal}</span>
                </div>
                
                <form onSubmit={triggerPayment} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.5rem' }}>
                    <PremiumInput placeholder="Kitchen Address" value={deliveryForm.address} onChange={e => setDeliveryForm({...deliveryForm, address: e.target.value})} required style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem' }} />
                    <PremiumInput placeholder="Contact Phone" value={deliveryForm.phone} onChange={e => setDeliveryForm({...deliveryForm, phone: e.target.value})} required style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem' }} />
                  </div>
                  <PremiumButton type="submit" variant="success" fullWidth loading={ordering} size="lg">
                    {paymentMethod === 'cod' ? 'Confirm Requisition (Pay on Delivery)' : 'Authorize Escrow & Dispatch Lot'}
                  </PremiumButton>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CombinedHome />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
