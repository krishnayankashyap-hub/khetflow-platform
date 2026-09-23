import React, { useState, useEffect } from 'react';
import { 
  Sprout, Store, Truck, ArrowRight, Leaf, CheckCircle2, 
  LineChart, Globe, Loader2, Wallet, ShieldCheck, Banknote, Star, CloudRain, Trophy, Medal,
  TrendingUp, BarChart2, Tag
} from 'lucide-react';

const teamMembers = [
  { name: "Krishnayan Kashyap Pathak", role: "Team Leader Founder & Core System Architect" },
  { name: "Suryanshu Mishra", role: "AI Strategy & Systems " },
  { name: "Gaurav Debnath", role: "Full-Stack Integration & Code Auditor " },
  { name: "Dipnalisha Borah", role: "Research, Data & Social Impact " },
  { name: "Bhargab Pratim Das", role: "Business Strategy & Field Operations " },
  { name: "Bhargab Bharadwaj Kataky", role: "Frontend Architecture & UI/UX Design " }
];


// --- Animated Counter Hook ---
const useCounter = (end, duration = 3000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    let animationFrame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) animationFrame = requestAnimationFrame(step);
    };
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
};

// --- Brand Preloader Component ---
const BrandLoader = () => {
  const brandName = "KhetFlow";
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="flex items-center gap-3 mb-4">
        <Leaf className="w-10 h-10 text-emerald-600 opacity-0 animate-fade-in-letter" style={{ animationDelay: '0s' }} />
        <div className="flex">
          {brandName.split("").map((char, i) => (
            <span 
              key={i} 
              className="text-5xl font-black tracking-tighter text-slate-900 inline-block opacity-0 animate-fade-in-letter"
              style={{ animationDelay: `${(i + 1) * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative mt-2 opacity-0 animate-fade-in-letter" style={{ animationDelay: '1.5s' }}>
        <div className="absolute inset-0 bg-emerald-600 animate-loading-bar" />
      </div>
    </div>
  );
};

export default function KhetFlowFullPortfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2800);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const stats = [
    { label: 'Food Waste Targeted', hindi: 'बर्बाद अन्न का लक्ष्य', value: useCounter(90000), prefix: '₹', suffix: '+ Cr', color: 'text-rose-600' },
    { label: 'Environment Saving Targeted', hindi: 'पर्यावरण की सुरक्षा', value: useCounter(1500), prefix: '', suffix: ' Tons', color: 'text-emerald-500' },
    { label: 'Business Savings on Raw Materials', hindi: 'व्यापारियों की बड़ी बचत', value: useCounter(40), prefix: 'Up to ', suffix: '%', color: 'text-amber-500' },
    { label: 'Farmer Extra Income', hindi: 'किसानों की अतिरिक्त आय', value: useCounter(30), prefix: '+', suffix: '%', color: 'text-blue-600' }
  ];

  const portals = [
    {
      id: 'farmer',
      title: 'Farmer Portal',
      hindi: 'किसान पोर्टल (B2B)',
      role: 'Earn Extra Income',
      desc: 'Sell your "Imperfect" Grade B & C produce that mandis reject. Turn waste into wealth and build KhetScore.',
      hindiDesc: 'फेंकी जाने वाली फसल से अतिरिक्त कमाई करें और लोन के लिए अपना क्रेडिट स्कोर बनाएं।',
      features: ['Extra Income from Waste', 'Build KhetScore for Loans'],
      url: 'https://farmer-portal-yourproject.web.app/',
      accent: 'emerald',
      icon: <Sprout className="w-6 h-6 text-emerald-600" />
    },
    {
      id: 'business',
      title: 'Business Portal',
      hindi: 'व्यापारी पोर्टल (HORECA)',
      role: 'Cheaper Materials',
      desc: 'Source fresh, high-quality "Imperfect" produce at 40-60% discounted rates. Direct from farms.',
      hindiDesc: 'सबसे सस्ता और ताज़ा कच्चा माल सीधा किसानों से खरीदें और अपना मुनाफा बढ़ाएं।',
      features: ['Save 40-60% on Bills', 'Direct B2B Supply'],
      url: 'https://business-portal-yourproject.web.app/',
      accent: 'amber',
      icon: <Store className="w-6 h-6 text-amber-600" />
    },
    {
      id: 'rider',
      title: 'Rider Portal',
      hindi: 'राइडर पोर्टल (Fleet)',
      role: 'Smart Fleet',
      desc: 'Join our logistics network. Use transport pooling to reduce fuel costs and earn daily commissions.',
      hindiDesc: 'डिलीवरी नेटवर्क से जुड़ें, ट्रक शेयर करें और रोज़ाना पक्की कमाई करें।',
      features: ['Smart Truck Pooling', 'Daily Instant Payouts'],
      url: 'https://rider-portal-yourproject.web.app/',
      accent: 'blue',
      icon: <Truck className="w-6 h-6 text-blue-600" />
    }
  ];

  // --- ACHIEVEMENT IMAGES DATA ---
  const achievements = [
    {
      id: 1,
      title: "Techstorm Innovation Challenge National Recog.",
      subtitle: "1st Prize Winners validated",
      imgPlaceholder: "https://i.postimg.cc/T1cZWT8Z/Screenshot-2026-04-04-at-10-25-47-PM.png", 
      heightClass: "h-36 md:h-44" 
    },
    {
      id: 2,
      title: "NIT Meghalaya - National 2nd Runner in Hardware,In Software Winner represented Assam and GCU",
      subtitle: "Agritech Innovation challenge and Startup Sumit",
      imgPlaceholder: "https://i.postimg.cc/c4SWLPyF/Screenshot-2026-04-15-at-2-34-35-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 3,
      title: "NLAIC-2026 - 2nd National Model Representation Winner",
      subtitle: "Assam Engineering College",
      imgPlaceholder: "https://i.postimg.cc/gJF5SxmB/Screenshot-2026-04-04-at-10-26-18-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 4,
      title: "Pitching to Jury Ahmedabad EDII",
      subtitle: "NER Rank 1",
      imgPlaceholder: "https://i.postimg.cc/DZ1zH4sm/Screenshot-2026-04-04-at-10-34-59-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 5,
      title: "GUenARK SIH 1.0 - Recieved Seed Funding",
      subtitle: "Startup Expo & Hackathon",
      imgPlaceholder: "https://i.postimg.cc/W1xfzdDK/Screenshot-2026-04-04-at-10-26-54-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 6,
      title: "National Agritech Hackathon Andhra Pradesh Validated Khetflow",
      subtitle: "Team Astranova On-Site",
      imgPlaceholder: "https://i.postimg.cc/ncP3SX1M/Screenshot-2026-04-04-at-10-27-35-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 7,
      title: "Live Prototyping",
      subtitle: "Pitching & Demonstrations",
      imgPlaceholder: "https://i.postimg.cc/TPqqx1nr/Screenshot-2026-04-04-at-10-28-44-PM.png",
      heightClass: "h-36 md:h-44"
    }
  ];

  // Duplicating arrays so the infinite loop never runs out of content on large screens
  const row1Items = [...achievements, ...achievements, ...achievements, ...achievements];
  const row2Items = [...[...achievements].reverse(), ...[...achievements].reverse(), ...[...achievements].reverse(), ...[...achievements].reverse()];

  // Helper array for scattered look
  const scatterStyles = [
    "-rotate-3 translate-y-1",
    "rotate-2 -translate-y-2",
    "-rotate-2 translate-y-3",
    "rotate-4 -translate-y-1",
    "-rotate-3 translate-y-2",
    "rotate-2 -translate-y-3"
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {isLoading && <BrandLoader />}
      
      <div className={`min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 overflow-x-hidden transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* --- NAVBAR --- */}
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-2 md:px-4 pointer-events-none">
          <nav className={`pointer-events-auto flex items-center justify-between transition-all duration-700 ${scrolled ? 'w-full md:w-[750px] bg-white/40 backdrop-blur-xl py-2 px-3 md:px-4 rounded-full border border-white/50 shadow-2xl' : 'w-full max-w-7xl bg-white py-3 px-4 md:px-6 rounded-2xl border border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-1 md:gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <Leaf className="w-5 h-5 md:w-8 md:h-8 text-emerald-600 animate-pulse" />
              <span className="text-lg md:text-2xl font-black tracking-tighter text-slate-900">KhetFlow</span>
            </div>
            <div className="flex items-center gap-2 md:gap-6">
               <button onClick={() => scrollTo('portals')} className="hidden sm:block text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">Portals</button>
              
               <button onClick={() => scrollTo('khetscore')} className="text-[10px] md:text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">Fintech</button>
               {/* ---- NEW: Price Discovery navbar button ---- */}
               <button onClick={() => scrollTo('pricediscovery')} className="hidden sm:block text-[10px] md:text-xs font-bold text-slate-500 hover:text-violet-600 transition-colors">Price Discovery</button>
               <button onClick={() => scrollTo('Achievements')} className="text-[10px] md:text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">Achievements</button>
               <button onClick={() => scrollTo('portals')} className="bg-emerald-600 text-white px-3 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black shadow-lg hover:bg-emerald-700 transition-all active:scale-95">Click for Portals</button>
            </div>
          </nav>
        </div>

        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-12 px-6 bg-slate-50 relative overflow-hidden">
          
          {/* --- BACKGROUND VIDEO --- */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
              🌍 Transforming ₹90,000+ Crore of India's Food Waste into Farmer Wealth & Business Profit
            </div>
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 leading-[1.1] relative inline-block">
              Kisaan Se <span className="text-emerald-600 relative">Kitchen Tak
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <h2 className="text-xl md:text-4xl font-bold text-slate-400 mb-2 mt-4 text-center">
              भारत की पहली <span className="text-slate-800 uppercase tracking-tighter">Imperfect Produce - Ai Driven </span> B2B Supply Chain.
            </h2>
            <p className="text-sm md:text-lg font-bold text-emerald-600 italic mb-12 text-center">
              (फेंकने वाले Grade B & C फल और सब्जियों का सबसे बड़ा मार्केटप्लेस)
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto px-2 relative z-10">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center hover:shadow-xl transition-all duration-500">
                  <div className="mb-2 md:mb-4 p-2 md:p-3 bg-slate-50 rounded-lg">
                    {i === 1 ? <CloudRain className="w-4 h-4 md:w-6 md:h-6 text-emerald-500" /> : <LineChart className={`w-4 h-4 md:w-6 md:h-6 ${stat.color}`} />}
                  </div>
                  <h3 className={`text-xl md:text-4xl font-black tracking-tighter ${stat.color}`}>
                    {stat.prefix}{stat.value}{stat.suffix}
                  </h3>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-800 uppercase mt-1">{stat.label}</p>
                  <p className="text-[7px] md:text-[9px] font-bold text-slate-400">{stat.hindi}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- PORTALS SECTION --- */}
        <main id="portals" className="py-16 md:py-24 px-6 max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">Select your portal</h2>
              <p className="text-slate-400 font-bold text-sm">अपना पोर्टल चुनें और शुरुआत करें</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {portals.map((portal) => (
              <div 
                key={portal.id}
                onClick={() => {
                  setRedirecting(portal.id);
                  setTimeout(() => { window.open(portal.url, '_blank'); setRedirecting(null); }, 1500);
                }}
                className={`group relative flex flex-col bg-white border-b-4 md:border-b-8 ${portal.accent === 'emerald' ? 'border-emerald-500' : portal.accent === 'amber' ? 'border-amber-500' : 'border-blue-500'} p-6 md:p-10 rounded-2xl md:rounded-[3rem] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden`}
              >
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm ${portal.accent === 'emerald' ? 'bg-emerald-50 text-emerald-600' : portal.accent === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    {portal.icon}
                  </div>
                  <div className="flex gap-0.5">
                     {[1,2,3].map(i => <Star key={i} size={8} className="text-amber-400 fill-amber-400" />)}
                  </div>
                </div>

                <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-1 relative z-10">{portal.title}</h3>
                <p className={`font-black text-[10px] md:text-sm mb-4 italic ${portal.accent === 'emerald' ? 'text-emerald-600' : portal.accent === 'amber' ? 'text-amber-600' : 'text-blue-600'}`}>{portal.hindi}</p>
                
                <p className="text-slate-500 font-medium text-xs md:text-sm mb-6 leading-relaxed">{portal.desc}</p>
                <p className="text-slate-800 font-bold text-[10px] md:text-xs mb-6">{portal.hindiDesc}</p>

                <button className={`mt-auto w-full py-3 md:py-5 rounded-xl md:rounded-2xl font-black flex items-center justify-between px-6 md:px-8 transition-all duration-300 shadow-md ${redirecting === portal.id ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white hover:scale-105'}`}>
                  <span className="text-xs md:text-base">{redirecting === portal.id ? 'Connecting...' : 'Go to Portal'}</span>
                  {redirecting === portal.id ? <Loader2 className="animate-spin w-4 h-4" /> : <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            ))}
          </div>
        </main>

        {/* --- KHETSCORE FINTECH SECTION --- */}
        <section id="khetscore" className="py-24 px-6 bg-slate-50 border-y border-slate-100 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black mb-8 border border-emerald-200 shadow-sm">
                  <Banknote size={16} /> KhetScore Fintech Engine
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-slate-900 uppercase">Making the Unbanked, <span className="text-emerald-600 italic">Bankable.</span></h2>
              <p className="text-slate-500 text-lg md:text-xl font-bold leading-relaxed mb-16">
                  Farmers who sell Grade B & C produce build a secure digital footprint. 
                  Our <strong>KhetScore algorithm</strong> turns transaction data into credit worthiness.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:rotate-12 transition-transform"><Wallet /></div>
                      <h4 className="text-slate-900 font-black text-xl mb-3">For Farmers (लोन की सुविधा)</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Build credit history by selling what was once wasted. Stop borrowing from moneylenders and access low-interest bank loans.</p>
                  </div>
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:rotate-12 transition-transform"><ShieldCheck /></div>
                      <h4 className="text-slate-900 font-black text-xl mb-3">For Lenders (बैंकों का भरोसा)</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">We provide verified cash-flow data from B2B transactions. This allows banks to lend safely to rural farmers for the first time.</p>
                  </div>
              </div>
          </div>
        </section>

                      {/* --- PRICE DISCOVERY SECTION --- */}
        <section id="pricediscovery" className="py-24 px-6 bg-white border-b border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-40 pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="max-w-6xl mx-auto relative z-10">

            <div className="text-center mb-16">
              <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-6">Agmarknet-Powered Price Discovery</p>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-slate-900 uppercase">
                No More Middlemen. No More Guessing. <span className="text-emerald-600 italic">Real Price Discovery.</span>
              </h2>
              <p className="text-slate-500 text-lg md:text-xl font-bold leading-relaxed max-w-3xl mx-auto">
                Farmers selling Grade B & C produce had <strong className="text-slate-900">no formal market</strong> — forced into <strong className="text-slate-900">informal, unorganized selling</strong> with <strong className="text-rose-500">zero price visibility.</strong> Middlemen underpay by up to <strong className="text-rose-600 text-2xl md:text-3xl">80%.</strong> KhetFlow fixes this with live, government-backed <strong className="text-emerald-600">Agmarknet API</strong> data — giving every farmer <strong className="text-slate-900">transparent, real-time mandi rates</strong> before they sell a single kg.
              </p>
            </div>

            <div className="relative mb-16">
              <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0" />
              <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-0 relative z-10">
                {[
                  { step: '01', label: 'Live Mandi Rate', sub: 'Agmarknet API (Govt.)', color: 'bg-emerald-600' },
                  { step: '02', label: 'AI Grade Engine', sub: 'Llama-4 Vision detects Grade B/C', color: 'bg-slate-700' },
                  { step: '03', label: 'Season & Demand', sub: 'HORECA demand signals applied', color: 'bg-slate-700' },
                  { step: '04', label: 'Fair Price Suggested', sub: 'Shown to farmer instantly', color: 'bg-emerald-600' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center w-full md:w-1/4 px-4">
                    <div className={`w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center font-black text-sm mb-4 shadow-md`}>
                      {step.step}
                    </div>
                    <p className="font-black text-slate-900 text-sm md:text-base leading-tight mb-1">{step.label}</p>
                    <p className="text-slate-400 text-[10px] md:text-xs font-semibold leading-snug">{step.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:rotate-12 transition-transform">
                  <BarChart2 />
                </div>
                <h4 className="text-slate-900 font-black text-xl mb-3">For Farmers (सही दाम की जानकारी)</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Before KhetFlow, farmers had no platform to sell their Grade B & C harvest — it was informal, unreliable, and exhausting. A farmer sold Grade B onions for ₹2/kg because no one told them the live mandi rate was ₹9/kg. Now our AI reads live Agmarknet data and shows the fair price for their entire harvest — before any buyer negotiates. <strong className="text-slate-700">No more information asymmetry. No more wasted harvests.</strong>
                </p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 group-hover:rotate-12 transition-transform">
                  <Tag />
                </div>
                <h4 className="text-slate-900 font-black text-xl mb-3">For HORECA Buyers (पारदर्शी खरीद)</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Buyers stop wasting nights hunting at wholesale mandis. KhetFlow's price engine uses live Agmarknet rates, grade, season and demand to show both parties the same transparent AI-recommended price. <strong className="text-slate-700">100% fair. 0% middlemen.</strong>
                </p>
              </div>
            </div>

          </div>
        </section>
        {/* --- END PRICE DISCOVERY SECTION --- */}

       
{/* --- FOOTER --- */}
       <footer className="bg-slate-50 py-16 px-6 relative border-t border-slate-200 overflow-hidden min-h-[400px] flex flex-col justify-center">
         {/* Background Watermark */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-slate-200/50 select-none pointer-events-none uppercase tracking-tighter">
           KhetFlow
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col xl:flex-row justify-between items-start gap-12 text-left w-full">
           
           {/* Team Members Grid Section */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 w-full xl:w-[75%]">
             {teamMembers.map((member, index) => (
               <div key={index} className="flex flex-col">
                 <p className="text-slate-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-1">
                   {member.role}
                 </p>
                 <h2 className="text-lg md:text-xl font-black text-slate-900 opacity-90 tracking-tight">
                   {member.name}
                 </h2>
               </div>
             ))}
           </div>
           
           {/* Right Info Section */}
           <div className="flex flex-col items-start xl:items-end gap-2 w-full xl:w-auto shrink-0 pt-4 xl:pt-0 border-t border-slate-200 xl:border-none">
             <p className="text-slate-900 font-black text-sm md:text-base uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">
               Under Team Astranova
             </p>
             <div className="flex gap-4 text-slate-400 text-[8px] font-black uppercase tracking-widest mt-2">
               <span>B2B Platform</span>
               <span>Fintech</span>
               <span>Agri</span>
             </div>
             
             <a 
               href="mailto:khetflow8@gmail.com" 
               className="mt-2 text-emerald-600 hover:text-emerald-700 font-bold text-[10px] md:text-xs tracking-widest transition-colors lowercase flex items-center gap-1"
             >
               khetflow8@gmail.com
             </a>

             {/* Mentor Section Moved Here */}
             <div className="flex flex-col items-start xl:items-end mt-8">
               <p className="text-slate-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-1 text-left xl:text-right">
                 Sensei and Mentor
               </p>
               <h2 className="text-lg md:text-xl font-black text-slate-900 opacity-90 tracking-tight text-left xl:text-right">
                 Dr. Adarsh Pradhan <span className="text-sm md:text-base font-semibold text-slate-500 tracking-normal ml-1">(Assistant Professor CSE)</span>
               </h2>
             </div>
           </div>
           
         </div>
       </footer>

       <style dangerouslySetInnerHTML={{__html: `
         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
         .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
         
         @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.05); } }
         .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
         
         @keyframes fadeInLetter { 0% { opacity: 0; } 100% { opacity: 1; } }
         .animate-fade-in-letter { animation: fadeInLetter 0.5s ease-out forwards; }
         
         @keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
         .animate-loading-bar { animation: loading-bar 2s infinite ease-in-out; }
         
         /* Dual Marquee Animations - Slowed down to 50s */
         @keyframes marquee-left {
           0% { transform: translateX(0%); }
           100% { transform: translateX(-50%); }
         }
         @keyframes marquee-right {
           0% { transform: translateX(-50%); }
           100% { transform: translateX(0%); }
         }
         
         .animate-marquee-left {
           animation: marquee-left 101s linear infinite;
         }
         .animate-marquee-right {
           animation: marquee-right 101s linear infinite;
         }
       `}} />
     </div>
   </>
 );
}
