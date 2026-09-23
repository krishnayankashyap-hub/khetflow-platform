// src/pages/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Database, Car, ShieldCheck, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/vena-logo-removebg-preview.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      console.log("Authentication Successful!");
      
      // Wait 1.5 seconds so the user sees the green success message, then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500); 
      
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please verify your hospital access.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* ========================================== */}
      {/* DESKTOP LEFT COLUMN (Unchanged)            */}
      {/* ========================================== */}
      <div className="hidden lg:flex w-1/2 bg-white flex-col justify-between p-16 relative overflow-hidden">
        <div className="relative z-10">
          <img 
            src={logo} 
            alt="VENA" 
            className="h-[5rem] object-contain select-none pointer-events-none mb-4" 
          />
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-5 bg-[#C12026]"></div>
            <p className="text-slate-500 font-bold tracking-[0.15em] uppercase text-xs">
              Zero-Inventory Logistics Solution
            </p>
          </div>
        </div>

        <div className="space-y-10 max-w-lg relative z-10">
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-xl text-[#C12026] border border-[#C12026]/20 bg-[#C12026]/5">
              <Zap size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-lg uppercase tracking-wide">Real-Time Matching</h3>
              <p className="text-slate-600 text-sm mt-1.5 leading-relaxed font-medium">Predictive donor matching triggered before the 24-hour safe buffer is lost.</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-xl text-[#C12026] border border-[#C12026]/20 bg-[#C12026]/5">
              <Database size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-lg uppercase tracking-wide">Zero Inventory</h3>
              <p className="text-slate-600 text-sm mt-1.5 leading-relaxed font-medium">Eliminates reliance on passive blood camps and physical storage limits.</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-xl text-[#C12026] border border-[#C12026]/20 bg-[#C12026]/5">
              <Car size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-lg uppercase tracking-wide">Frictionless Transport</h3>
              <p className="text-slate-600 text-sm mt-1.5 leading-relaxed font-medium">Free, on-demand cabs booked via Uber/Ola for verified donors.</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-xl text-[#C12026] border border-[#C12026]/20 bg-[#C12026]/5">
              <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-lg uppercase tracking-wide">Verification Loop</h3>
              <p className="text-slate-600 text-sm mt-1.5 leading-relaxed font-medium">QR-based donation verification secures the system against free-ride misuse.</p>
            </div>
          </div>
        </div>

        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest relative z-10">
          © 2026 Team Astranova
        </div>
      </div>


      {/* ========================================== */}
      {/* RIGHT COLUMN & MOBILE VIEW                 */}
      {/* ========================================== */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8 bg-[#C12026] min-h-[100dvh]">
        
        {/* MOBILE BRANDING (Moved closer to top) */}
        <div className="flex lg:hidden flex-col items-center w-full max-w-[400px] mb-4 mt-2">
          <img 
            src={logo} 
            alt="VENA" 
            className="h-[3rem] object-contain select-none pointer-events-none mb-2 brightness-0 invert" 
          />
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-white"></div>
            <p className="text-white font-bold tracking-[0.1em] uppercase text-[9px]">
              Zero-Inventory Logistics Solution
            </p>
          </div>
        </div>

        {/* LOGIN CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/20 shrink-0 z-10"
        >
          <div className="mb-5 sm:mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 sm:mb-2">Admin Portal</h2>
            <p className="text-slate-500 text-xs sm:text-[15px] font-medium leading-relaxed">Enter your credentials to access the hospital command center.</p>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-[#C12026] text-red-700 text-[11px] sm:text-sm font-bold rounded-r-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border-l-4 border-green-600 text-green-700 text-[11px] sm:text-sm font-bold rounded-r-lg">
              Authentication successful! Connecting to command center...
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-6">
            <div>
              <label className="block text-[10px] sm:text-sm font-black text-slate-700 uppercase tracking-widest mb-1.5 sm:mb-2">Hospital Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C12026] focus:border-[#C12026] transition-all outline-none text-slate-900 text-sm sm:text-base font-medium"
                placeholder="admin@hospital.org"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-sm font-black text-slate-700 uppercase tracking-widest mb-1.5 sm:mb-2">Secure Access Key</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C12026] focus:border-[#C12026] transition-all outline-none text-slate-900 text-sm sm:text-base font-medium"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#C12026] hover:bg-[#a51a1f] text-white text-base sm:text-lg font-bold py-3.5 sm:py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-2 sm:mt-4 shadow-lg shadow-red-900/20"
            >
              {loading ? 'Authenticating...' : success ? 'Connected' : 'Access Dashboard'}
              {!loading && !success && <ArrowRight size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />}
            </button>
          </form>

          <div className="mt-5 sm:mt-8 text-center border-t border-slate-100 pt-4 sm:pt-6">
            <p className="text-[10px] sm:text-[13px] text-slate-500 font-medium">
              Need to register a new medical facility? <br className="hidden sm:block"/>
              <a href="#" className="text-[#C12026] font-bold hover:text-red-800 transition-colors sm:mt-1.5 inline-block ml-1 sm:ml-0">Contact Vena Support</a>
            </p>
          </div>
        </motion.div>

        {/* MOBILE 2x2 GRID (Moved below the login box, no background colors) */}
        <div className="lg:hidden grid grid-cols-2 gap-x-3 gap-y-4 w-full max-w-[400px] mt-6 px-1">
          
          <div className="flex items-start gap-1.5">
            <Zap size={14} className="text-white mt-0.5 shrink-0" strokeWidth={2.5} />
            <div>
              <h3 className="text-white font-black text-[10px] uppercase tracking-wide leading-tight mb-0.5">Real-Time Matching</h3>
              <p className="text-white/80 text-[9px] leading-snug">Predictive donor matching triggered before the 24-hour safe buffer is lost.</p>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <Database size={14} className="text-white mt-0.5 shrink-0" strokeWidth={2.5} />
            <div>
              <h3 className="text-white font-black text-[10px] uppercase tracking-wide leading-tight mb-0.5">Zero Inventory</h3>
              <p className="text-white/80 text-[9px] leading-snug">Eliminates reliance on passive blood camps and physical storage limits.</p>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <Car size={14} className="text-white mt-0.5 shrink-0" strokeWidth={2.5} />
            <div>
              <h3 className="text-white font-black text-[10px] uppercase tracking-wide leading-tight mb-0.5">Frictionless Transport</h3>
              <p className="text-white/80 text-[9px] leading-snug">Free, on-demand cabs booked via Uber/Ola for verified donors.</p>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <ShieldCheck size={14} className="text-white mt-0.5 shrink-0" strokeWidth={2.5} />
            <div>
              <h3 className="text-white font-black text-[10px] uppercase tracking-wide leading-tight mb-0.5">Verification Loop</h3>
              <p className="text-white/80 text-[9px] leading-snug">QR-based donation verification secures the system against free-ride misuse.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}