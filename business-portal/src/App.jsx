import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, addDoc, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

// ==================== THEME SYSTEM ====================

const ThemeContext = createContext();

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

function ThemeProvider({ children }) {
  useEffect(() => {
    // Premium, crisp, professional SaaS styling WITH soft ambient background gradients
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --bg-main: #f8fafc; /* Crisp slate-white */
        --panel-bg: #ffffff;
        --panel-border: rgba(15, 23, 42, 0.06);
        --panel-shadow: 0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 6px -1px rgba(15, 23, 42, 0.04);
        --input-bg: #ffffff;
        --input-border: #cbd5e1;
      }
      
      body { 
        margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; 
        background-color: var(--bg-main); 
        background-image: radial-gradient(#cbd5e1 1px, transparent 1px); /* Premium Dot Grid Pattern */
        background-size: 24px 24px;
        -webkit-font-smoothing: antialiased; min-height: 100vh; 
      }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(15, 23, 42, 0.15); border-radius: 10px; }
      * { box-sizing: border-box; }

      /* Sharp premium solid panels */
      .glass-panel {
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        box-shadow: var(--panel-shadow);
        border-radius: 1.25rem;
        position: relative;
        z-index: 10; /* Ensures panels sit cleanly above the background gradients */
      }

      /* PREMIUM AMBIENT BACKGROUND GRADIENTS */
      .bg-blob { position: fixed; filter: blur(120px); z-index: 0; opacity: 0.35; animation: floatBlob 15s ease-in-out infinite alternate; pointer-events: none; }
      .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; max-width: 600px; max-height: 600px; background: #10b981; border-radius: 50%; }
      .blob-2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; max-width: 700px; max-height: 700px; background: #3b82f6; border-radius: 50%; animation-delay: -7s; }

      /* Responsive Layouts */
      .split-layout { display: flex; flex-direction: row; gap: 2rem; }
      
      /* APP-LIKE MOBILE OPTIMIZATIONS */
      @media (max-width: 860px) {
        .split-layout { flex-direction: column; gap: 1.5rem; }
        .order-auth { order: 1; } 
        .order-info { order: 2; }
        .mobile-hide { display: none !important; }
      }

      @media (max-width: 600px) {
        .glass-panel { padding: 1rem !important; border-radius: 1.25rem !important; }
        h1 { font-size: 1.35rem !important; }
        h2 { font-size: 1.15rem !important; }
        
        .header-actions { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 0.25rem; }
        .header-actions button { padding: 0.3rem 0.6rem !important; font-size: 0.75rem !important; white-space: nowrap; }
        
        .stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important; margin-bottom: 1rem !important; }
        .stat-card { padding: 0.5rem !important; flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 0.2rem !important; }
        .stat-card .icon-wrap { padding: 0.4rem !important; font-size: 1rem !important; border-radius: 0.5rem !important; }
        .stat-card .val { font-size: 0.95rem !important; margin-top: 0 !important; }
        .stat-card .label { font-size: 0.55rem !important; letter-spacing: 0 !important; line-height: 1.1 !important; }
        
        .marketplace-panel { padding: 0.75rem !important; }
        .marketplace-panel h3 { margin-bottom: 0.4rem !important; font-size: 0.7rem !important; }
        .category-scroll { margin-bottom: 0.4rem !important; flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 0.25rem; -webkit-overflow-scrolling: touch; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .category-scroll button { padding: 0.4rem 0.75rem !important; font-size: 0.75rem !important; }
        .divider-line { margin-bottom: 0.5rem !important; }
        
        .filters-wrap { flex-direction: column !important; align-items: stretch !important; gap: 0.4rem !important; margin-bottom: 0.75rem !important; }
        .search-wrap { flex: none !important; width: 100% !important; }
        .search-wrap input { padding: 0.5rem 0.75rem 0.5rem 2rem !important; font-size: 0.8rem !important; }
        .dropdown-wrap { flex-direction: row !important; width: 100% !important; gap: 0.4rem !important; }
        .dropdown-wrap select { padding: 0.5rem !important; font-size: 0.75rem !important; flex: 1 !important; }
        
        .product-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)) !important; gap: 0.5rem !important; }
        .product-card { padding: 0.5rem !important; border-radius: 1rem !important; }
        .product-img { height: 90px !important; font-size: 2.5rem !important; margin-bottom: 0.5rem !important; border-radius: 0.5rem !important; }
        .product-img div { font-size: 0.6rem !important; padding: 0.15rem 0.4rem !important; top: 0.25rem !important; left: 0.25rem !important; }
        .product-title { font-size: 0.85rem !important; margin-bottom: 0.1rem !important; }
        .product-desc { font-size: 0.65rem !important; margin-bottom: 0.5rem !important; }
        .product-price-box { padding: 0.4rem !important; margin-bottom: 0.5rem !important; border-radius: 0.5rem !important; }
        .product-price-box .mandi-price { font-size: 0.55rem !important; }
        .product-price-box .kf-price { font-size: 0.9rem !important; }
        .product-price-box .kf-price span { font-size: 0.65rem !important; }
        .product-save { font-size: 0.55rem !important; padding: 0.2rem 0.3rem !important; border-radius: 0.25rem !important; }
        .product-card button { padding: 0.35rem !important; font-size: 0.75rem !important; border-radius: 0.5rem !important; }
        
        .order-grid { grid-template-columns: 1fr !important; }
        .cart-panel { width: 100% !important; border-radius: 0 !important; }
      }

      @keyframes floatBlob { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(40px, 40px) scale(1.05); } }
      @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .scrolling-wrapper { display: flex; width: max-content; animation: scroll 75s linear infinite; }
      .scrolling-wrapper:hover { animation-play-state: paused; }
      .table-row-hover:hover { background-color: rgba(15, 23, 42, 0.02); transform: scale(1.002); transition: all 0.2s ease; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const theme = {
    colors: {
      text: '#0f172a', textMuted: '#64748b',
      primary: '#10b981', primaryDark: '#059669', 
      success: '#10b981', successDark: '#059669',
      error: '#ef4444', warning: '#f59e0b',
      borderLight: '#e2e8f0'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ color: theme.colors.text, transition: 'color 0.4s ease' }}>
       
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        
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
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    };
    toast.error = (message) => toast.success(message, 'error');
    return () => delete toast.error;
  }, []);

  return (
    <div style={{ position: 'fixed', top: '4.5rem', right: '1.5rem', zIndex: 10001, display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '90%', width: '380px', pointerEvents: 'none' }}>
      {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />)}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  const theme = useTheme();
  const colors = { success: { icon: '' }, error: { icon: '' }, info: { icon: '' }, warning: { icon: '' } };
  const color = colors[type] || colors.info;

  return (
    <div className="glass-panel" style={{ borderRadius: '1rem', padding: '1rem 1.25rem', animation: 'slideInRight 0.3s ease-out', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>{color.icon}</div>
      <div style={{ flex: 1, color: theme.colors.text, fontSize: '0.925rem', fontWeight: '600' }}>{message}</div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>✕</button>
    </div>
  );
}

function SkeletonLoader({ width = '100%', height = '20px', borderRadius = '0.5rem', style = {} }) {
  return <div style={{ width, height, borderRadius, background: 'rgba(0,0,0,0.05)', animation: 'pulse 1.5s infinite ease-in-out', ...style }} />;
}

function CardSkeleton() {
  return (
    <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SkeletonLoader height="160px" borderRadius="0.75rem" />
      <SkeletonLoader width="60%" height="20px" />
      <SkeletonLoader width="40%" height="16px" />
      <SkeletonLoader height="40px" borderRadius="0.5rem" style={{ marginTop: 'auto' }} />
    </div>
  );
}

function PremiumButton({ children, onClick, variant = 'primary', loading = false, disabled = false, fullWidth = false, size = 'md', icon, style = {}, ...props }) {
  const theme = useTheme();
  const variants = {
    primary: { background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.successDark})`, color: 'white', border: 'none' },
    success: { background: `linear-gradient(135deg, ${theme.colors.success}, #047857)`, color: 'white', border: 'none' },
    danger: { background: `linear-gradient(135deg, ${theme.colors.error}, #be123c)`, color: 'white', border: 'none' },
    ghost: { background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', color: theme.colors.text },
    outline: { background: 'transparent', border: `2px solid ${theme.colors.primary}`, color: theme.colors.primary }
  };
  const sizes = { sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' }, md: { padding: '0.75rem 1.5rem', fontSize: '0.95rem' }, lg: { padding: '0.85rem 2rem', fontSize: '1rem' } };

  return (
    <button
      onClick={onClick} disabled={disabled || loading}
      style={{
        ...variants[variant], ...sizes[size], width: fullWidth ? '100%' : 'auto',
        borderRadius: '1rem', fontWeight: '700', cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        boxShadow: variant !== 'ghost' && variant !== 'outline' ? `0 4px 15px ${theme.colors.primary}40` : 'none',
        ...style
      }}
      onMouseEnter={(e) => { 
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          if (variant !== 'ghost' && variant !== 'outline') e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}60`;
        } 
      }}
      onMouseLeave={(e) => { 
        if (!disabled && !loading) { 
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          if (variant !== 'ghost' && variant !== 'outline') e.currentTarget.style.boxShadow = `0 4px 15px ${theme.colors.primary}40`;
        } 
      }}
      {...props}
    >
      {loading ? <span style={{ fontSize: '0.9em', display: 'flex', alignItems: 'center' }}> Wait...</span> : <>{icon && <span style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>{icon}</span>}<span style={{ lineHeight: 1 }}>{children}</span></>}
    </button>
  );
}

function PremiumInput({ label, error, icon, helperText, ...props }) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.4rem', color: theme.colors.text, fontWeight: '600', fontSize: '0.85rem' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <span style={{ position: 'absolute', left: '1rem', color: theme.colors.textMuted, fontSize: '1.1rem', display: 'flex', alignItems: 'center', zIndex: 2 }}>{icon}</span>}
        <input
          {...props} onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }} onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%', padding: icon ? '0.75rem 1rem 0.75rem 2.75rem' : '0.75rem 1rem',
            borderRadius: '0.75rem', 
            border: `1px solid ${error ? theme.colors.error : isFocused ? theme.colors.primary : 'var(--input-border)'}`,
            background: 'var(--input-bg)', color: theme.colors.text, fontSize: '0.95rem', outline: 'none',
            transition: 'all 0.2s ease', 
            boxShadow: isFocused && !error ? `0 0 0 3px ${theme.colors.primary}20` : '0 1px 2px rgba(0,0,0,0.02)', 
            lineHeight: 1.5,
            ...props.style
          }}
        />
      </div>
      {error && <p style={{ margin: '0.3rem 0 0 0', color: theme.colors.error, fontSize: '0.75rem', fontWeight: '600' }}>{error}</p>}
      {helperText && !error && <p style={{ margin: '0.3rem 0 0 0', color: theme.colors.textMuted, fontSize: '0.75rem' }}>{helperText}</p>}
    </div>
  );
}

function SuccessConfetti() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
      {[...Array(50)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${Math.random() * 100}%`, top: '-20px', width: '10px', height: '10px', background: ['#10b981', '#3b82f6', '#f472b6', '#fbbf24'][Math.floor(Math.random() * 4)], borderRadius: Math.random() > 0.5 ? '50%' : '3px', animation: `fall ${1.5 + Math.random() * 2}s linear forwards` }} />
      ))}
    </div>
  );
}

function GlobalTicker() {
  const displayTrends = [...MARKET_RATES, ...MARKET_RATES, ...MARKET_RATES]; 
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', color: 'white', width: '100%', height: '38px', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9990, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="scrolling-wrapper">
        {displayTrends.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', marginRight: '3rem', fontWeight: '500', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'white', fontWeight: '700', marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>{item.crop}</span>
            <span style={{ color: '#94a3b8', marginRight: '0.75rem', display: 'flex', alignItems: 'center' }}>Mandi: <span style={{ color: 'white', marginLeft: '4px' }}>₹{item.mandiA}</span></span>
            <span style={{ color: '#10b981', marginRight: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center' }}>KF(B): ₹{item.kfB}</span>
            <span style={{ color: '#fbbf24', fontWeight: '700', display: 'flex', alignItems: 'center' }}>KF(C): ₹{item.kfC}</span>
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
      const scanner = new Html5QrcodeScanner('delivery-qr-reader', { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 });
      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            setScannedData(data);
            scanner.clear();
            toast.success('QR Code scanned successfully!');
          } catch (e) { toast.error('Invalid QR code format!'); }
        }, () => {}
      );
      scannerRef.current = scanner;
      setScannerInitialized(true);
    }
    return () => { if (scannerRef.current) scannerRef.current.clear().catch(() => {}); };
  }, []);

  const handleConfirmDelivery = async () => {
    if (!scannedData) return toast.error('Scan QR first!');
    setVerifying(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: 'delivered', deliveryVerified: true, deliveryScannedData: scannedData, deliveryConfirmedAt: serverTimestamp() });
      toast.success('✨ Delivery perfectly verified!');
      setTimeout(() => onVerify(), 1000);
    } catch (error) { toast.error('Error: ' + error.message); } finally { setVerifying(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '2rem', padding: '2rem', maxWidth: '500px', width: '100%', animation: 'slideInUp 0.3s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, lineHeight: 1 }}>Verify Delivery </h2>
          <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1rem', cursor: 'pointer', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {!scannedData ? (
          <div style={{ background: 'var(--glass-input)', borderRadius: '1.5rem', padding: '1rem', textAlign: 'center', border: `2px dashed ${theme.colors.primary}60` }}>
            <p style={{ color: theme.colors.text, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '600' }}>Point camera at cute package QR Code</p>
            <div id="delivery-qr-reader" style={{ borderRadius: '1rem', overflow: 'hidden' }}></div>
          </div>
        ) : (
          <div style={{ background: `${theme.colors.success}15`, border: `2px solid ${theme.colors.success}40`, borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.5rem', backdropFilter: 'blur(5px)' }}>
            <div style={{ color: theme.colors.success, fontWeight: '800', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>✨</span> Product Verified!
            </div>
            <div style={{ fontSize: '0.95rem', color: theme.colors.text, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p style={{ margin: 0 }}><strong>Product:</strong> {scannedData.name}</p>
              <p style={{ margin: 0 }}><strong>Farm:</strong> {scannedData.farmName}</p>
              <p style={{ margin: 0 }}><strong>Grade:</strong> {scannedData.grade}</p>
            </div>
          </div>
        )}
        {scannedData && <PremiumButton variant="success" fullWidth size="lg" loading={verifying} onClick={handleConfirmDelivery}>Confirm Received ✨</PremiumButton>}
      </div>
    </div>
  );
}

// ==================== PAGES  ====================

function CombinedHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Auth State
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
      if(err) newErrors[k] = err; 
    });
    
    // Identifier check (Email or Phone)
    let emailToUse = form.identifier;
    if (!emailToUse) {
      newErrors.identifier = 'Required';
    } else if (/^\d{10}$/.test(emailToUse)) {
      emailToUse = `${emailToUse}@khetflow-phone.com`; // phone routing
    } else if (!/\S+@\S+\.\S+/.test(emailToUse)) {
      newErrors.identifier = 'Valid email or 10-digit phone required';
    }

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, emailToUse, form.password);
        toast.success('Welcome back to KhetFlow!');
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
        toast.success('Account successfully created!');
        navigate('/dashboard');
      }
    } catch (err) { toast.error(err.message.replace('Firebase: ', '')); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', paddingTop: '3rem' }}>
      <div className="split-layout" style={{ maxWidth: '1100px', width: '100%', padding: '2rem', animation: 'fadeIn 0.6s ease-out' }}>
        
        
        <div className="order-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0.5rem' }}>
          <div style={{ background: theme.colors.primary, color: 'white', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.5rem', boxShadow: `0 8px 16px ${theme.colors.primary}40` }}>🥦</div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: theme.colors.text, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            KhetFlow <span style={{ color: theme.colors.primary }}>Business</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: theme.colors.textMuted, marginBottom: '2.5rem', fontWeight: '500', lineHeight: 1.6, maxWidth: '420px' }}>
            Source perfectly imperfect Grade B & C crops directly from farmers and Vendors. Cheapest! and Zero food waste. Unbeatable margins.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }} className="mobile-hide">
            {[{ label: 'Smart Savings', value: '40-60%', icon: '📉' }, { label: 'Farm Direct', value: '24hrs', icon: '🚚' }, { label: 'Quality Check', value: '100%', icon: '✨' }].map((stat, i) => (
              <div key={i} className="glass-panel" style={{ borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', transition: 'transform 0.2s', background: '#fff' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: theme.colors.primary, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontWeight: '700', color: theme.colors.textMuted, marginTop: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

       
        <div className="order-auth" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '440px', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', color: theme.colors.text, margin: '0 0 0.5rem 0' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ textAlign: 'center', color: theme.colors.textMuted, marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '500' }}>
              {isLogin ? 'Enter your details to access the marketplace' : 'Join the network of smart buyers'}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isLogin && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 45%' }}><PremiumInput name="businessName" placeholder="Cafe Name" label="Business Name" icon="" value={form.businessName} onChange={handleChange} error={errors.businessName} /></div>
                  <div style={{ flex: '1 1 45%' }}><PremiumInput name="ownerName" placeholder="Your Name" label="Owner Name" icon="" value={form.ownerName} onChange={handleChange} error={errors.ownerName} /></div>
                </div>
              )}
              
              <PremiumInput name="identifier" type="text" placeholder="name@company.com or 10-digit phone" label="Email or Phone Number" icon="" value={form.identifier} onChange={handleChange} error={errors.identifier} />
              <PremiumInput name="password" type="password" placeholder="••••••••" label="Password" icon="🔒" value={form.password} onChange={handleChange} error={errors.password} helperText={!isLogin && "At least 6 characters"} />
              
              {!isLogin && (
                <PremiumInput name="address" placeholder="Where do we deliver?" label="Business Address" icon="📍" value={form.address} onChange={handleChange} error={errors.address} />
              )}
              
              <PremiumButton type="submit" variant="primary" fullWidth size="lg" loading={loading} style={{ marginTop: '0.5rem', fontSize: '1.05rem' }}>
                {isLogin ? 'Login Securely' : 'Create Account'}
              </PremiumButton>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: theme.colors.textMuted }}>
              {isLogin ? "New to KhetFlow? " : "Already our friend? "}
              <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} style={{ background: 'none', border: 'none', color: theme.colors.primary, fontWeight: '700', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                {isLogin ? 'Create an account' : 'Log in here'}
              </button>
            </div>
          </div>
        </div>

      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { setUser(user); setLoading(false); });
    return unsubscribe;
  }, []);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CardSkeleton /></div>;
  return user ? children : <Navigate to="/" />;
}

// ==================== DASHBOARD  ====================

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
  const [activeCategory, setActiveCategory] = useState('all'); 
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await Promise.all([
          fetchBusinessData(user.uid),
          fetchListings(),
          fetchOrders(user.uid)
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
        // Handle the phone routing fallback logic
        const phoneData = docSnap.data().phone || (docSnap.data().email && docSnap.data().email.includes('-phone.com') ? docSnap.data().email.split('@')[0] : '');
        setDeliveryForm({ address: docSnap.data().address || '', phone: phoneData });
      }
    } catch (error) { toast.error('Error loading data'); }
  };

  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'listings'));
      setListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { toast.error('Error loading cute products'); }
  };

  const fetchOrders = async (uid) => {
    try {
      const snapshot = await getDocs(query(collection(db, 'orders'), where('businessId', '==', uid)));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) { toast.error('Error loading orders'); }
  };

  const getFilteredAndSortedListings = () => {
    let filtered = listings;
    if (searchTerm) filtered = filtered.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (gradeFilter !== 'all') filtered = filtered.filter(l => l.grade === gradeFilter);
    
    if (activeCategory === 'vegetables') filtered = filtered.filter(l => ['tomato', 'onion', 'potato', 'carrot', 'cabbage'].some(v => l.name.toLowerCase().includes(v)));
    else if (activeCategory === 'fruits') filtered = filtered.filter(l => ['banana', 'apple', 'mango', 'papaya'].some(v => l.name.toLowerCase().includes(v)));
    else if (activeCategory === 'millets') filtered = filtered.filter(l => ['millet', 'sorghum', 'bajra', 'jowar'].some(v => l.name.toLowerCase().includes(v)));

    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  };

  const filteredListings = getFilteredAndSortedListings();

  const addToCart = (listing) => {
    const existing = cart.find(item => item.id === listing.id);
    if (existing) {
      setCart(cart.map(item => item.id === listing.id ? { ...item, cartQuantity: Math.min(item.cartQuantity + 1, item.quantity) } : item));
      toast.success(`✨ Cart delightfully updated`);
    } else {
      setCart([...cart, { ...listing, cartQuantity: 1 }]);
      toast.success(`✨ Dropped into your cart!`);
    }
  };

  const updateCartQuantity = (id, newQ) => {
    if (newQ <= 0) setCart(cart.filter(i => i.id !== id));
    else setCart(cart.map(i => i.id === id ? { ...i, cartQuantity: Math.min(newQ, i.quantity) } : i));
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const deliveryFee = Math.ceil(estimatedDistance * deliveryRate);
  const finalTotal = subTotal + deliveryFee;

  const finalizeOrder = async () => {
    setOrdering(true);
    try {
      await addDoc(collection(db, 'orders'), {
        businessId: user.uid, businessName: businessData?.businessName || 'Unknown',
        items: cart, subTotal, deliveryFee, totalAmount: finalTotal,
        paymentMethod, paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
        deliveryAddress: deliveryForm.address, phone: deliveryForm.phone,
        status: 'pending', createdAt: serverTimestamp()
      });
      setCart([]); setShowCart(false); setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setView('orders'); }, 3000);
      await fetchOrders(user.uid);
    } catch (error) { toast.error('Error placing order'); } 
    finally { setOrdering(false); }
  };

  const triggerPayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (cart.length === 0) return;
    
    if (paymentMethod === 'online') {
      setShowPaymentProcessing(true);
      setTimeout(async () => {
        setShowPaymentProcessing(false);
        await finalizeOrder();
      }, 3000);
    } else {
      await finalizeOrder();
    }
  };

  if (loading) return <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}><CardSkeleton /></div>;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '42px', paddingBottom: '2rem' }}>
      <GlobalTicker />
      <ToastContainer />
      {showSuccess && <SuccessConfetti />}
      
      {showPaymentProcessing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10005, padding: '1rem' }}>
          <div className="glass-panel" style={{ borderRadius: '2rem', padding: '2rem', maxWidth: '350px', width: '100%', animation: 'slideInUp 0.3s ease-out', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: `${theme.colors.primary}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: `2px solid ${theme.colors.primary}40` }}>
               <div style={{ width: '30px', height: '30px', border: `3px solid ${theme.colors.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: theme.colors.text }}>Secure Magic </h2>
            <p style={{ color: theme.colors.textMuted, fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
              Safely sending <strong style={{color: theme.colors.text}}>₹{finalTotal}</strong> to Escrow.
            </p>
            <div style={{ background: 'var(--glass-input)', padding: '0.75rem', borderRadius: '1rem', border: `1px solid var(--glass-border)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: theme.colors.textMuted, marginBottom: '0.25rem' }}>
                <span>Connection</span>
                <span style={{ color: theme.colors.success, fontWeight: 'bold' }}>Secured 🔒</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: theme.colors.textMuted }}>
                <span>Escrow</span>
                <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>KhetFlow Trust</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVerificationModal && selectedOrder && <DeliveryVerificationModal order={selectedOrder} onClose={() => setShowVerificationModal(false)} onVerify={async () => { setShowVerificationModal(false); await fetchOrders(user.uid); }} />}

      <div style={{ maxWidth: '1200px', margin: '0.5rem auto 0', padding: '0 1rem' }}>
        
        {/* TOP NAVIGATION HEADER  */}
        <div className="glass-panel" style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          borderRadius: '1.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', 
          flexWrap: 'wrap', gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>🥦</div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: theme.colors.text, lineHeight: 1.2 }}>Business Hub</h1>
              <p style={{ margin: 0, fontSize: '0.75rem', color: theme.colors.primary, fontWeight: '700', lineHeight: 1.2 }}>Smart Sourcing</p>
            </div>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'nowrap' }}>
            <PremiumButton variant={view === 'marketplace' ? 'primary' : 'ghost'} onClick={() => setView('marketplace')} size="sm" icon="">Market</PremiumButton>
            <PremiumButton variant={view === 'orders' ? 'primary' : 'ghost'} onClick={() => setView('orders')} size="sm" icon="">Orders</PremiumButton>
            <PremiumButton variant={view === 'mandi' ? 'primary' : 'ghost'} onClick={() => setView('mandi')} size="sm" icon="">Mandi</PremiumButton>
            <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)', margin: '0 0.25rem' }}></div>
            <PremiumButton variant="danger" onClick={async () => { await signOut(auth); navigate('/'); }} size="sm" icon="">Logout</PremiumButton>
          </div>
        </div>

        {view === 'marketplace' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* STATS */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[{ label: 'Total Spend', value: '₹2,841', icon: '', color: theme.colors.success }, { label: 'Food Ordered(Kg)', value: '132 kg', icon: '', color: theme.colors.primary }, { label: 'Active Orders', value: orders.filter(o=>o.status!=='delivered').length, icon: '', color: theme.colors.warning }].map((stat, i) => (
                <div key={i} className="glass-panel stat-card" style={{ borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.3s' }}>
                  <div className="icon-wrap" style={{ fontSize: '1.5rem', background: 'var(--glass-input)', padding: '0.75rem', borderRadius: '1rem', display: 'flex', alignItems: 'center' }}>{stat.icon}</div>
                  <div><div className="label" style={{ fontSize: '0.8rem', color: theme.colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div><div className="val" style={{ fontSize: '1.5rem', fontWeight: '800', color: stat.color || theme.colors.text, lineHeight: 1, marginTop: '4px' }}>{stat.value}</div></div>
                </div>
              ))}
            </div>

            {/* MAIN MARKET CONTENT - Zero huge gaps */}
            <div className="glass-panel marketplace-panel" style={{ borderRadius: '1.5rem', padding: '1.25rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.colors.textMuted, marginBottom: '0.75rem', fontWeight: '800' }}>Explore Finds</h3>
                <div className="category-scroll" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[ { id: 'all', icon: '', label: 'All' }, { id: 'vegetables', icon: '', label: 'Veggies' }, { id: 'fruits', icon: '', label: 'Fruits' }, { id: 'millets', icon: '', label: 'Millets' }].map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '1.5rem', background: activeCategory === cat.id ? `${theme.colors.success}20` : 'var(--glass-input)', border: `2px solid ${activeCategory === cat.id ? theme.colors.success : 'transparent'}`, color: activeCategory === cat.id ? theme.colors.success : theme.colors.text, fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>{cat.icon}</span> 
                      <span style={{ lineHeight: 1 }}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="divider-line" style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '1rem' }} />

              {/* Search & Filters */}
              <div className="filters-wrap" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div className="search-wrap" style={{ flex: '1 1 200px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '0.75rem', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>🔍</span>
                  <input type="text" placeholder="Search produce..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--glass-input)', color: theme.colors.text, outline: 'none', fontSize: '0.9rem' }} />
                </div>
                <div className="dropdown-wrap" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: window.innerWidth < 600 ? '100%' : 'auto' }}>
                  <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} style={{ flex: 1, padding: '0.6rem 0.5rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--glass-input)', color: theme.colors.text, outline: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <option value="all">All Grades </option><option value="B">Grade B</option><option value="C">Grade C</option>
                  </select>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1, padding: '0.6rem 0.5rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--glass-input)', color: theme.colors.text, outline: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <option value="price-low">Lowest </option><option value="price-high">Highest </option>
                  </select>
                </div>
              </div>

              {/* Product Grid Mobile */}
              <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {filteredListings.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: theme.colors.textMuted, background: 'var(--glass-input)', borderRadius: '1rem', border: `2px dashed ${theme.colors.primary}40`, fontWeight: '600', fontSize: '0.9rem' }}>No cute items found here. 🥺</div>
                ) : filteredListings.map(listing => {
                  const mandiPrice = Math.round(listing.price * 1.5);
                  const savePercent = Math.round((1 - (listing.price / mandiPrice)) * 100);
                  return (
                    <div key={listing.id} className="glass-panel product-card" style={{ borderRadius: '1.25rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid var(--glass-border)' }}>
                      <div className="product-img" style={{ position: 'relative', height: '130px', background: 'var(--glass-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', borderRadius: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', color: theme.colors.warning, padding: '0.2rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '800', border: '1px solid var(--glass-border)', zIndex: 2 }}>GRADE {listing.grade}</div>
                        {listing.image && listing.image.startsWith('data:') ? <img src={listing.image} alt="" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius: '0.75rem'}} /> : <span style={{display:'flex', alignItems:'center'}}>{listing.icon || ''}</span>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 className="product-title" style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem', color: theme.colors.text, fontWeight: '800' }}>{listing.name}</h3>
                        <div className="product-desc" style={{ fontSize: '0.75rem', color: theme.colors.textMuted, marginBottom: '0.75rem', fontWeight: '500' }}>{listing.quantity}kg • {listing.farmLocation || 'Local'}</div>
                        <div className="product-price-box" style={{ background: `${theme.colors.success}15`, borderRadius: '0.75rem', padding: '0.6rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${theme.colors.success}30` }}>
                          <div><div className="mandi-price" style={{ fontSize: '0.65rem', color: theme.colors.textMuted, textDecoration: 'line-through', fontWeight: '600' }}>Mandi: ₹{mandiPrice}</div><div className="kf-price" style={{ fontSize: '1.1rem', fontWeight: '800', color: theme.colors.text, lineHeight: 1, marginTop: '2px' }}>₹{listing.price}<span style={{fontSize:'0.75rem', fontWeight:'600', color: theme.colors.textMuted}}>/kg</span></div></div>
                          <div className="product-save" style={{ background: `linear-gradient(135deg, ${theme.colors.success}, ${theme.colors.successDark})`, color: 'white', padding: '0.3rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center', lineHeight: 1 }}>SAVE {savePercent}%</div>
                        </div>
                        <div style={{ marginTop: 'auto' }}><PremiumButton fullWidth size="sm" icon="" onClick={() => addToCart(listing)}>Add</PremiumButton></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'mandi' && (
          <div className="glass-panel" style={{ borderRadius: '1.5rem', padding: '1.25rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: theme.colors.text, margin: '0 0 0.25rem 0' }}>Market Rates </h2>
                <p style={{ color: theme.colors.textMuted, margin: 0, fontSize: '0.85rem', fontWeight: '500' }}>Compare Grade A vs Grade B savings.</p>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ position: 'absolute', left: '0.75rem', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}></span>
                <input type="text" placeholder="Search crop..." style={{ padding: '0.6rem 0.75rem 0.6rem 2.25rem', width: '100%', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--glass-input)', color: theme.colors.text, outline: 'none', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '1rem', border: '1px solid var(--glass-border)', background: 'var(--glass-input)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                <thead style={{ background: 'var(--glass-bg)' }}>
                  <tr style={{ color: theme.colors.textMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '800' }}>Crop</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '800' }}>Gr A</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: theme.colors.success }}>KF(B)</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: theme.colors.warning }}>KF(C)</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '800' }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKET_RATES.map((item, i) => (
                    <tr key={i} className="table-row-hover" style={{ borderTop: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: theme.colors.text }}>{item.crop}</td>
                      <td style={{ padding: '0.75rem 1rem', color: theme.colors.textMuted, fontWeight: '600' }}>₹{item.mandiA}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '800', color: theme.colors.success }}>₹{item.kfB}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '800', color: theme.colors.warning }}>₹{item.kfC}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '700', fontSize: '0.8rem', color: item.trend === 'Up' ? theme.colors.success : item.trend === 'Down' ? theme.colors.error : theme.colors.textMuted }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'var(--glass-bg)', padding: '0.2rem 0.5rem', borderRadius: '0.5rem', width: 'fit-content' }}>
                          {item.trend === 'Up' ? '↗ Up' : item.trend === 'Down' ? '↘ Down' : '→ Stable'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'orders' && (
          <div className="order-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
            {orders.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: theme.colors.textMuted, background: 'var(--glass-panel)', borderRadius: '1.5rem', border: `2px dashed var(--glass-border)`, fontWeight: '600', fontSize: '0.95rem' }}>No orders found yet. </div>}
            
            {orders.map(order => {
              const isPending = order.status === 'pending';
              const isPicked = order.status === 'picked';
              const isDelivered = order.status === 'delivered';
              
              const steps = [
                { label: 'Order Started', desc: 'Received', done: true },
                { label: 'Harvested', desc: 'Fresh', done: isPicked || isDelivered, active: isPending },
                { label: 'Passed', desc: 'Verified', done: isPicked || isDelivered },
                { label: 'Out for Delivery', desc: '', done: isPicked || isDelivered },
                { label: 'Delivered', desc: 'Arrived', done: isDelivered, active: isPicked }
              ];

              return (
                <div key={order.id} className="glass-panel" style={{ borderRadius: '1.5rem', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: '800', color: theme.colors.textMuted, letterSpacing: '0.05em' }}>ORDER ID</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: theme.colors.text, lineHeight: 1 }}>#{order.id.substring(0,8).toUpperCase()}</div>
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', background: isDelivered ? `${theme.colors.success}25` : isPicked ? `${theme.colors.primary}25` : `${theme.colors.warning}25`, color: isDelivered ? theme.colors.success : isPicked ? theme.colors.primary : theme.colors.warning, border: `1px solid ${isDelivered ? theme.colors.success : isPicked ? theme.colors.primary : theme.colors.warning}40` }}>
                      {isDelivered ? '✅ DELIVERED' : isPicked ? 'TRANSIT' : ' PROCESS'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', flex: 1, marginBottom: '1rem' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {steps.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.5rem', position: 'relative', paddingBottom: idx === steps.length - 1 ? '0' : '0.8rem' }}>
                            {idx !== steps.length - 1 && <div style={{ position: 'absolute', left: '6px', top: '14px', bottom: 0, width: '2px', background: step.done ? theme.colors.success : 'var(--glass-border)' }} />}
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', marginTop: '2px', zIndex: 2, background: step.done ? theme.colors.success : step.active ? theme.colors.warning : 'var(--glass-input)', border: `2px solid ${step.done ? theme.colors.success : step.active ? theme.colors.warning : 'var(--glass-border)'}` }} />
                            <div style={{ marginTop: '-2px' }}>
                              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: step.done || step.active ? theme.colors.text : theme.colors.textMuted, lineHeight: 1 }}>{step.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <span style={{ fontSize: '0.65rem', color: theme.colors.textMuted, display: 'block', marginBottom: '2px', fontWeight: '800' }}>Total Magic</span>
                       <div style={{ fontWeight: '800', fontSize: '1.1rem', color: theme.colors.success, lineHeight: 1 }}>₹{order.totalAmount}</div>
                    </div>
                    {isPicked && !order.deliveryVerified && <PremiumButton size="sm" icon="📸" onClick={() => { setSelectedOrder(order); setShowVerificationModal(true); }}>Verify</PremiumButton>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* CART UI */}
      {showCart && (
        <div className="glass-panel cart-panel" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100%', borderLeft: '1px solid var(--glass-border)', boxShadow: '-10px 0 40px rgba(0,0,0,0.2)', zIndex: 10000, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)', borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}>
          
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.4)' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.colors.text }}>
              Cute Cart  
              <span style={{fontSize:'0.75rem', color:theme.colors.primary, fontWeight:'700', background: `${theme.colors.primary}20`, padding: '0.2rem 0.5rem', borderRadius: '0.75rem'}}>{cart.length} Items</span>
            </h2>
            <button onClick={() => setShowCart(false)} style={{ background: 'var(--glass-input)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '32px', height: '32px', fontSize: '1rem', cursor: 'pointer', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', background: 'var(--glass-input)', padding: '0.75rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid var(--glass-border)' }}>
                   {item.image && item.image.startsWith('data:') ? <img src={item.image} alt="" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'0.75rem'}} /> : <span>{item.icon || '🌾'}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', color: theme.colors.text }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: theme.colors.textMuted, marginTop: '2px', fontWeight: '600' }}>₹{item.price}/kg • Gr {item.grade}</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                  <div style={{ fontWeight: '800', color: theme.colors.text, fontSize: '0.95rem' }}>₹{item.price * item.cartQuantity}</div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', background: 'var(--glass-bg)' }}>
                    <button onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)} style={{ background: 'none', border: 'none', padding: '0.2rem 0.5rem', cursor: 'pointer', color: theme.colors.text, fontWeight: '800' }}>-</button>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0 0.1rem', color: theme.colors.text, minWidth: '18px', textAlign: 'center' }}>{item.cartQuantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)} style={{ background: 'none', border: 'none', padding: '0.2rem 0.5rem', cursor: 'pointer', color: theme.colors.text, fontWeight: '800' }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.4)' }}>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.65rem', color: theme.colors.textMuted, fontWeight: '800', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>HOW TO PAY? </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button type="button" onClick={() => setPaymentMethod('online')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '0.75rem', border: `2px solid ${paymentMethod === 'online' ? theme.colors.primary : 'var(--glass-border)'}`, background: paymentMethod === 'online' ? `${theme.colors.primary}15` : 'var(--glass-input)', color: theme.colors.text, fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                   Pay Now
                </button>
                <button type="button" onClick={() => setPaymentMethod('cod')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '0.75rem', border: `2px solid ${paymentMethod === 'cod' ? theme.colors.success : 'var(--glass-border)'}`, background: paymentMethod === 'cod' ? `${theme.colors.success}15` : 'var(--glass-input)', color: theme.colors.text, fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                   COD
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', color: theme.colors.textMuted, fontWeight: '600' }}><span>Item Total</span><span style={{color: theme.colors.text}}>₹{subTotal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', color: theme.colors.textMuted, fontWeight: '600' }}><span>Delivery Rider</span><span style={{color: theme.colors.text}}>₹{deliveryFee}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.2rem', marginBottom: '1rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '0.75rem', color: theme.colors.text }}><span>To Pay</span><span style={{color: theme.colors.primary}}>₹{finalTotal}</span></div>
            
            <form onSubmit={triggerPayment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PremiumInput placeholder="Where to?" value={deliveryForm.address} onChange={e=>setDeliveryForm({...deliveryForm, address: e.target.value})} icon="" required style={{ padding: '0.6rem 0.75rem 0.6rem 2.25rem', fontSize: '0.85rem' }} />
                <PremiumInput placeholder="Phone" value={deliveryForm.phone} onChange={e=>setDeliveryForm({...deliveryForm, phone: e.target.value})} icon="" required style={{ padding: '0.6rem 0.75rem 0.6rem 2.25rem', fontSize: '0.85rem' }} />
              </div>
              <PremiumButton type="submit" variant={paymentMethod === 'cod' ? 'success' : 'primary'} fullWidth loading={ordering} icon={paymentMethod === 'cod' ? "" : ""} style={{ padding: '0.85rem', fontSize: '1rem' }}>
                {paymentMethod === 'cod' ? 'Place COD Order' : 'Pay & Order Magic'}
              </PremiumButton>
            </form>
          </div>
        </div>
      )}

      {cart.length > 0 && !showCart && (
        <button className="glass-panel" onClick={() => setShowCart(true)} style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.successDark})`, color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '2rem', padding: '0.8rem 1.25rem', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: `0 8px 20px ${theme.colors.primary}50`, display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 9999 }}>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}></span> Cart ({cart.reduce((a,b)=>a+b.cartQuantity,0)})
        </button>
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
