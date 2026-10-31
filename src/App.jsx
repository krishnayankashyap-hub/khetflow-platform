import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, Store, Truck, ArrowRight, Leaf, CheckCircle2, 
  LineChart, Globe, Loader2, Wallet, ShieldCheck, Banknote, Star, CloudRain, Trophy, Medal,
  TrendingUp, BarChart2, Tag, ChevronLeft, ChevronRight
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
  const [activePortalTab, setActivePortalTab] = useState('farmer');
  const videoRef = useRef(null);
  const portalCarouselRef = useRef(null);

  const portalIds = ['farmer', 'business', 'rider'];

  const scrollToPortalCard = (id) => {
    setActivePortalTab(id);
    const container = portalCarouselRef.current;
    const el = document.getElementById(`portal-card-${id}`);
    if (container && el) {
      const left = el.offsetLeft - container.offsetLeft - (container.offsetWidth - el.offsetWidth) / 2;
      container.scrollTo({ left, behavior: 'smooth' });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const handlePrevPortal = () => {
    const currentIndex = portalIds.indexOf(activePortalTab);
    const prevIndex = (currentIndex - 1 + portalIds.length) % portalIds.length;
    scrollToPortalCard(portalIds[prevIndex]);
  };

  const handleNextPortal = () => {
    const currentIndex = portalIds.indexOf(activePortalTab);
    const nextIndex = (currentIndex + 1) % portalIds.length;
    scrollToPortalCard(portalIds[nextIndex]);
  };

  const onPortalCarouselScroll = () => {
    const el = portalCarouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.offsetWidth * 0.75;
    if (scrollLeft < cardWidth * 0.5) {
      setActivePortalTab('farmer');
    } else if (scrollLeft < cardWidth * 1.5) {
      setActivePortalTab('business');
    } else {
      setActivePortalTab('rider');
    }
  };

  useEffect(() => {
    let minTimeDone = false;
    let videoReady = false;

    const checkFinished = () => {
      if (minTimeDone && videoReady) {
        setIsLoading(false);
      }
    };

    // Minimum animation duration for brand preloader (2.2s)
    const minTimer = setTimeout(() => {
      minTimeDone = true;
      checkFinished();
    }, 2200);

    // Fallback maximum timeout (3.5s) to guarantee site always reveals seamlessly
    const maxTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    const vid = videoRef.current;
    if (vid) {
      const handleCanPlay = () => {
        videoReady = true;
        vid.play().catch(() => {});
        checkFinished();
      };

      if (vid.readyState >= 3) {
        videoReady = true;
        vid.play().catch(() => {});
        checkFinished();
      } else {
        vid.addEventListener('canplay', handleCanPlay, { once: true });
        vid.addEventListener('loadeddata', handleCanPlay, { once: true });
      }

      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);

      return () => {
        clearTimeout(minTimer);
        clearTimeout(maxTimer);
        vid.removeEventListener('canplay', handleCanPlay);
        vid.removeEventListener('loadeddata', handleCanPlay);
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => {
        clearTimeout(minTimer);
        clearTimeout(maxTimer);
        window.removeEventListener('scroll', handleScroll);
      };
    }
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
      hindi: 'किसान पोर्टल (B2B Marketplace)',
      role: 'Agri Producers',
      desc: 'Sell surplus Grade B & C produce that mandis reject. Access transparent live prices, eliminate middleman cuts, and earn extra income while building KhetScore for bank loans.',
      hindiDesc: 'Grade B & C फसल के लिए लाइव मंडी भाव जानें, अतिरिक्त आय कमाएं और बैंक लोन हेतु KhetScore बनाएं।',
      features: [
        'Extra Income from Grade B & C Produce',
        'Real-Time Agmarknet Price Discovery',
        'Build KhetScore for Low-Interest Loans'
      ],
      url: 'https://farmer-portal-yourproject.web.app/',
      accent: 'emerald',
      icon: <Sprout className="w-5 h-5 text-emerald-700" />
    },
    {
      id: 'business',
      title: 'Business Portal',
      hindi: 'व्यापारी पोर्टल (HORECA Procurement)',
      role: 'Wholesale Buyers',
      desc: 'Procure high-quality Grade B & C produce directly from farms. Cut raw material food costs by 40-60% with complete price visibility and reliable scheduled supply.',
      hindiDesc: 'होटल, रेस्टोरेंट और कैटरर्स के लिए सीधा किसानों से ताज़ा माल। 40-60% सीधी बचत और पारदर्शी दाम।',
      features: [
        '40-60% Savings on Fresh Produce Bills',
        'Transparent Wholesale Price Discovery',
        'Farm-to-Kitchen Direct B2B Supply'
      ],
      url: 'https://business-portal-yourproject.web.app/',
      accent: 'amber',
      icon: <Store className="w-5 h-5 text-amber-700" />
    },
    {
      id: 'rider',
      title: 'Logistics Portal',
      hindi: 'लॉजिस्टिक्स पोर्टल (Fleet & Fleet Owners)',
      role: 'Smart Fleet',
      desc: 'Join India\'s dedicated agricultural transit network. AI load pooling eliminates empty return trips, cuts diesel costs by up to 35%, and guarantees daily direct-to-bank settlements.',
      hindiDesc: 'एग्री लॉजिस्टिक्स नेटवर्क से जुड़ें। स्मार्ट लोड पूलिंग से खाली फेरे खत्म करें, 35% डीज़ल खर्च बचाएं और रोज़ाना पक्का बैंक भुगतान पाएं।',
      features: [
        'Dynamic Load & Route Optimization',
        'Transparent Price Discovery & Load Rates',
        'Zero Empty Returns & Guaranteed Daily Payouts'
      ],
      url: 'https://rider-portal-yourproject.web.app/',
      accent: 'blue',
      icon: <Truck className="w-5 h-5 text-blue-700" />
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
      title: "NIT Meghalaya - National 2nd Runner in Hardware, In Software Winner",
      subtitle: "Agritech Innovation challenge & Startup Summit",
      imgPlaceholder: "https://i.postimg.cc/c4SWLPyF/Screenshot-2026-04-15-at-2-34-35-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 3,
      title: "IdeaHunt - Assam's First Ideathon (#1 Rank Across Assam)",
      subtitle: "1st Prize Winner • 160+ Submissions",
      imgPlaceholder: "/achievements/ideahunt-assam-1st-rank.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 4,
      title: "FAR AWAY 2026 International Hackathon - AgriTech Winner",
      subtitle: "Global Round 2 Finalist • 15+ Countries (Zuup)",
      imgPlaceholder: "/achievements/far-away-international-hackathon.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 5,
      title: "Invited as Judge for ESCOVENTURE (AEC Udbhavanam 14.0)",
      subtitle: "2,500+ Footfall Summit • From Pitcher to Jury",
      imgPlaceholder: "/achievements/escoventure-aec-judge.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 6,
      title: "National Buildathon 2026 (FORGE India & Nihar Skill)",
      subtitle: "Govt. NSDC Certified & National Validation",
      imgPlaceholder: "/achievements/national-buildathon-nsdc.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 7,
      title: "School2Startup National Innovation Challenge",
      subtitle: "Top Innovator National Recognition",
      imgPlaceholder: "/achievements/school2startup-national.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 8,
      title: "NLAIC-2026 - 2nd National Model Representation Winner",
      subtitle: "Assam Engineering College",
      imgPlaceholder: "https://i.postimg.cc/gJF5SxmB/Screenshot-2026-04-04-at-10-26-18-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 9,
      title: "Pitching to Jury Ahmedabad EDII",
      subtitle: "NER Rank 1",
      imgPlaceholder: "https://i.postimg.cc/DZ1zH4sm/Screenshot-2026-04-04-at-10-34-59-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 10,
      title: "GUenARK SIH 1.0 - Recieved Seed Funding",
      subtitle: "Startup Expo & Hackathon",
      imgPlaceholder: "https://i.postimg.cc/W1xfzdDK/Screenshot-2026-04-04-at-10-26-54-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 11,
      title: "National Agritech Hackathon Andhra Pradesh Validated Khetflow",
      subtitle: "Team Astranova On-Site",
      imgPlaceholder: "https://i.postimg.cc/ncP3SX1M/Screenshot-2026-04-04-at-10-27-35-PM.png",
      heightClass: "h-36 md:h-44"
    },
    {
      id: 12,
      title: "Live Prototyping",
      subtitle: "Pitching & Demonstrations",
      imgPlaceholder: "https://i.postimg.cc/TPqqx1nr/Screenshot-2026-04-04-at-10-28-44-PM.png",
      heightClass: "h-36 md:h-44"
    }
  ];

  // Duplicating arrays so the infinite loop never runs out of content on large screens
  const row1Items = [...achievements, ...achievements, ...achievements];
  const row2Items = [...[...achievements].reverse(), ...[...achievements].reverse(), ...[...achievements].reverse()];

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
          
          {/* --- BACKGROUND VIDEO (PRELOADED & BUFFERED) --- */}
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-35 md:opacity-40 z-0 pointer-events-none transition-opacity duration-700"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Subtle top wash so headline text is razor-sharp, fading to 0% so stat cards are 100% transparent */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/25 to-transparent pointer-events-none z-0" />

          <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
            <div className="mb-4 md:mb-6 inline-block">
              <p className="text-xs sm:text-sm md:text-base font-extrabold tracking-normal text-slate-800">
                Transforming{' '}
                <span className="text-emerald-700 font-black relative inline-block mx-0.5">
                  ₹90,000+ Crore
                  <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-emerald-500" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0 4 Q 25 1 50 4 T 100 4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                of India's Food Waste into Farmer Wealth
              </p>
            </div>
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 leading-[1.1] relative inline-block">
              Kisaan Se <span className="text-emerald-600 relative">Kitchen Tak
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <h2 className="text-xl md:text-4xl font-extrabold text-slate-800 mb-2 mt-4 text-center">
              भारत की पहली <span className="text-slate-950 uppercase tracking-tighter">Imperfect Produce - Ai Driven </span> B2B Supply Chain.
            </h2>
            <p className="text-sm md:text-lg font-black text-emerald-700 italic mb-8 md:mb-12 text-center">
              (फेंकने वाले Grade B & C फल और सब्जियों का सबसे बड़ा मार्केटप्लेस)
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-6 max-w-5xl mx-auto px-2 relative z-10">
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                  className="bg-white/10 hover:bg-white/20 p-3.5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] border border-white/50 flex flex-col items-center transition-all duration-300"
                >
                  <div className={`mb-1.5 md:mb-4 p-2 md:p-3 rounded-xl ${
                    i === 0 ? 'bg-rose-500/20 text-rose-800 border border-rose-300/40' :
                    i === 1 ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-300/40' :
                    i === 2 ? 'bg-amber-500/20 text-amber-800 border border-amber-300/40' :
                    'bg-blue-500/20 text-blue-800 border border-blue-300/40'
                  }`}>
                    {i === 1 ? <CloudRain className="w-4 h-4 md:w-6 md:h-6" /> : <LineChart className="w-4 h-4 md:w-6 md:h-6" />}
                  </div>
                  <h3 className={`text-lg md:text-4xl font-black tracking-tight ${stat.color} drop-shadow-sm`}>
                    {stat.prefix}{stat.value}{stat.suffix}
                  </h3>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase mt-1 text-center tracking-wide">{stat.label}</p>
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-700 text-center">{stat.hindi}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- PORTALS SECTION --- */}
        <main id="portals" className="py-12 md:py-24 px-3 md:px-6 max-w-7xl mx-auto relative">
          <div className="text-center mb-6 md:mb-14">
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-1.5 md:mb-2 tracking-tighter">Select your portal</h2>
              <p className="text-slate-400 font-bold text-xs md:text-sm">अपना पोर्टल चुनें और शुरुआत करें</p>
          </div>

          {/* Interactive Portal Switcher with Slide Buttons */}
          <div className="flex items-center justify-center gap-2 mb-6 max-w-md mx-auto">
            <button
              onClick={handlePrevPortal}
              aria-label="Previous Portal"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 shadow-xs active:scale-95 border border-slate-200/80"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-xs flex-1">
              {portals.map((portal) => {
                const isActive = activePortalTab === portal.id;
                return (
                  <button
                    key={portal.id}
                    onClick={() => scrollToPortalCard(portal.id)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isActive 
                        ? 'bg-white text-slate-900 shadow-sm font-black' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {React.cloneElement(portal.icon, { className: "w-3.5 h-3.5 shrink-0" })}
                    <span className="truncate">{portal.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPortal}
              aria-label="Next Portal"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 shadow-xs active:scale-95 border border-slate-200/80"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            ref={portalCarouselRef}
            onScroll={onPortalCarouselScroll}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 px-3 -mx-3 md:mx-0 md:px-0 scroll-smooth touch-pan-x"
          >
            {portals.map((portal) => {
              const isEmerald = portal.accent === 'emerald';
              const isAmber = portal.accent === 'amber';
              
              const topBorder = isEmerald 
                ? 'border-t-4 border-t-emerald-600' 
                : isAmber 
                ? 'border-t-4 border-t-amber-600' 
                : 'border-t-4 border-t-blue-600';

              const iconBox = isEmerald
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : isAmber
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-blue-50 text-blue-700 border border-blue-100';

              const accentColor = isEmerald ? 'text-emerald-700' : isAmber ? 'text-amber-700' : 'text-blue-700';

              return (
                <div 
                  key={portal.id}
                  id={`portal-card-${portal.id}`}
                  onClick={() => {
                    setRedirecting(portal.id);
                    setTimeout(() => { window.open(portal.url, '_blank'); setRedirecting(null); }, 1500);
                  }}
                  className={`w-[85vw] max-w-[340px] md:w-auto shrink-0 snap-center group relative flex flex-col justify-between bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 rounded-2xl md:rounded-3xl p-5 md:p-8 transition-all duration-300 cursor-pointer overflow-hidden ${topBorder}`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4 md:mb-5">
                      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${iconBox}`}>
                        {React.cloneElement(portal.icon, { className: "w-5 h-5 md:w-6 md:h-6" })}
                      </div>
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200">
                        {portal.role}
                      </span>
                    </div>

                    <div className="mb-2">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">{portal.title}</h3>
                      <p className={`font-semibold text-xs md:text-sm mt-0.5 ${accentColor}`}>{portal.hindi}</p>
                    </div>

                    <div className="h-px bg-slate-100 my-3.5 md:my-4" />

                    {/* Features list */}
                    <div className="space-y-2 mb-4">
                      {portal.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-semibold text-slate-800 leading-snug">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${accentColor}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{portal.desc}</p>
                    <p className="text-slate-400 font-medium text-[11px] md:text-xs mt-1.5 leading-relaxed">{portal.hindiDesc}</p>
                  </div>

                  <button className="mt-5 md:mt-6 w-full py-3.5 px-5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-between text-white transition-all bg-slate-900 hover:bg-slate-800 shadow-sm active:scale-[0.99] group/btn">
                    <span>{redirecting === portal.id ? 'Connecting to Portal...' : 'Go to Portal'}</span>
                    {redirecting === portal.id ? (
                      <Loader2 className="animate-spin w-4 h-4 shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile Slide Indicator Dots */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            {portalIds.map((id, idx) => (
              <button
                key={id}
                onClick={() => scrollToPortalCard(id)}
                aria-label={`Slide to portal ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activePortalTab === id ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </main>

        {/* --- KHETSCORE FINTECH SECTION --- */}
        <section id="khetscore" className="py-10 md:py-24 px-3 md:px-6 bg-slate-50 border-y border-slate-100 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] md:text-xs font-black mb-4 md:mb-8 border border-emerald-200 shadow-sm">
                  <Banknote size={15} /> KhetScore Fintech Engine
              </div>
              <h2 className="text-2xl md:text-6xl font-black mb-3 md:mb-8 tracking-tighter text-slate-900 uppercase">Making the Unbanked, <span className="text-emerald-600 italic">Bankable.</span></h2>
              <p className="text-slate-500 text-xs md:text-xl font-bold leading-relaxed mb-6 md:mb-14 max-w-2xl mx-auto">
                  Farmers who sell Grade B & C produce build a secure digital footprint. 
                  Our <strong>KhetScore algorithm</strong> turns transaction data into credit worthiness.
              </p>
              
              <div className="grid grid-cols-2 gap-2.5 md:gap-8 text-left">
                  <div className="p-3.5 md:p-8 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-6 border border-emerald-100 group-hover:rotate-12 transition-transform"><Wallet className="w-4 h-4 md:w-6 md:h-6" /></div>
                        <h4 className="text-slate-900 font-black text-xs md:text-xl mb-1 md:mb-3 leading-snug">For Farmers <span className="block text-[10px] md:text-sm font-semibold text-emerald-700">(लोन की सुविधा)</span></h4>
                        <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-relaxed">Build credit history by selling what was once wasted. Stop borrowing from moneylenders and access low-interest bank loans.</p>
                      </div>
                  </div>
                  <div className="p-3.5 md:p-8 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-6 border border-blue-100 group-hover:rotate-12 transition-transform"><ShieldCheck className="w-4 h-4 md:w-6 md:h-6" /></div>
                        <h4 className="text-slate-900 font-black text-xs md:text-xl mb-1 md:mb-3 leading-snug">For Lenders <span className="block text-[10px] md:text-sm font-semibold text-blue-700">(बैंकों का भरोसा)</span></h4>
                        <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-relaxed">We provide verified cash-flow data from B2B transactions. This allows banks to lend safely to rural farmers for the first time.</p>
                      </div>
                  </div>
              </div>
          </div>
        </section>

                      {/* --- PRICE DISCOVERY SECTION --- */}
        <section id="pricediscovery" className="py-10 md:py-24 px-3 md:px-6 bg-white border-b border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-40 pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="max-w-6xl mx-auto relative z-10">

            <div className="text-center mb-6 md:mb-16">
              <p className="text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 md:mb-6">Agmarknet-Powered Price Discovery</p>
              <h2 className="text-2xl md:text-6xl font-black mb-3 md:mb-6 tracking-tighter text-slate-900 uppercase">
                No More Middlemen. No More Guessing. <span className="text-emerald-600 italic">Real Price Discovery.</span>
              </h2>
              <p className="text-slate-500 text-xs md:text-xl font-bold leading-relaxed max-w-3xl mx-auto">
                Farmers selling Grade B & C produce had <strong className="text-slate-900">no formal market</strong> — forced into <strong className="text-slate-900">informal, unorganized selling</strong> with <strong className="text-rose-500">zero price visibility.</strong> Middlemen underpay by up to <strong className="text-rose-600 text-base md:text-3xl font-black">80%.</strong> KhetFlow fixes this with live, government-backed <strong className="text-emerald-600">Agmarknet API</strong> data — giving every farmer <strong className="text-slate-900">transparent, real-time mandi rates</strong> before they sell a single kg.
              </p>
            </div>

            <div className="relative mb-6 md:mb-16">
              <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0" />
              <div className="grid grid-cols-2 md:flex md:flex-row items-center md:items-start justify-between gap-3 md:gap-0 relative z-10">
                {[
                  { step: '01', label: 'Live Mandi Rate', sub: 'Agmarknet API (Govt.)', color: 'bg-emerald-600' },
                  { step: '02', label: 'AI Grade Engine', sub: 'Llama-4 Vision detects Grade B/C', color: 'bg-slate-700' },
                  { step: '03', label: 'Season & Demand', sub: 'HORECA demand signals applied', color: 'bg-slate-700' },
                  { step: '04', label: 'Fair Price Suggested', sub: 'Shown to farmer instantly', color: 'bg-emerald-600' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-2.5 md:p-0 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none w-full md:w-1/4 border border-slate-100 md:border-none">
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full ${step.color} text-white flex items-center justify-center font-black text-xs md:text-sm mb-1.5 md:mb-4 shadow-sm`}>
                      {step.step}
                    </div>
                    <p className="font-black text-slate-900 text-xs md:text-base leading-tight mb-0.5">{step.label}</p>
                    <p className="text-slate-400 text-[9px] md:text-xs font-semibold leading-snug">{step.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 md:gap-8 text-left">
              <div className="p-3.5 md:p-8 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-6 border border-emerald-100 group-hover:rotate-12 transition-transform">
                    <BarChart2 className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs md:text-xl mb-1 md:mb-3 leading-snug">For Farmers <span className="block text-[10px] md:text-sm font-semibold text-emerald-700">(सही दाम की जानकारी)</span></h4>
                  <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-relaxed">
                    Before KhetFlow, farmers had no platform to sell their Grade B & C harvest — it was informal, unreliable, and exhausting. A farmer sold Grade B onions for ₹2/kg because no one told them the live mandi rate was ₹9/kg. Now our AI reads live Agmarknet data and shows the fair price for their entire harvest — before any buyer negotiates. <strong className="text-slate-700 font-bold block mt-1">No more information asymmetry. No more wasted harvests.</strong>
                  </p>
                </div>
              </div>
              <div className="p-3.5 md:p-8 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-amber-50 text-amber-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-6 border border-amber-100 group-hover:rotate-12 transition-transform">
                    <Tag className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs md:text-xl mb-1 md:mb-3 leading-snug">For HORECA Buyers <span className="block text-[10px] md:text-sm font-semibold text-amber-700">(पारदर्शी खरीद)</span></h4>
                  <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-relaxed">
                    Buyers stop wasting nights hunting at wholesale mandis. KhetFlow's price engine uses live Agmarknet rates, grade, season and demand to show both parties the same transparent AI-recommended price. <strong className="text-slate-700 font-bold block mt-1">100% fair. 0% middlemen.</strong>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
        {/* --- END PRICE DISCOVERY SECTION --- */}

        {/* --- DUAL SCROLLING VALIDATION SECTION --- */}
        <section id="Achievements" className="py-10 md:py-24 bg-white relative overflow-hidden group/marquee">
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 md:mb-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] md:text-xs font-black mb-3 md:mb-6 border border-amber-200 shadow-sm">
                <Trophy size={14} className="md:w-4 md:h-4" /> Track Record
              </div>
              <h2 className="text-2xl md:text-6xl font-black mb-2 md:mb-4 tracking-tighter text-slate-900 uppercase">
                Validated by <span className="text-amber-500 italic">Ecosystems.</span>
              </h2>
              <p className="text-slate-500 font-bold text-xs md:text-lg max-w-2xl mx-auto leading-relaxed">
                From securing 1st Prize at national hackathons to pitching in front of industry leaders, Team Astranova is making waves across India.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-10 py-2 md:py-4 w-full">
            
            {/* ROW 1: Moving Right to Left */}
            <div className="flex gap-3 md:gap-8 w-max animate-marquee-left hover:[animation-play-state:paused]">
              {row1Items.map((item, index) => (
                <div 
                  key={`r1-${index}`} 
                  className={`relative w-[210px] sm:w-[250px] md:w-[280px] shrink-0 bg-white p-2.5 pb-4 md:p-3.5 md:pb-6 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer hover:z-50 hover:scale-[1.05] border border-slate-100 ${scatterStyles[index % scatterStyles.length]}`}
                >
                  <div className="w-full bg-slate-100 h-28 sm:h-36 md:h-44 relative overflow-hidden rounded-lg border border-slate-100">
                    <img src={item.imgPlaceholder} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2.5 px-1 md:mt-3.5 md:px-1.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Medal className="w-3 h-3 text-amber-500 shrink-0" />
                      <p className="text-amber-500 text-[8px] md:text-[9px] font-black uppercase tracking-wider leading-tight">{item.subtitle}</p>
                    </div>
                    <h3 className="text-slate-900 text-xs md:text-sm font-black tracking-tight leading-snug">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* ROW 2: Moving Left to Right */}
            <div className="flex gap-3 md:gap-8 w-max animate-marquee-right hover:[animation-play-state:paused] ml-[-50%]">
              {row2Items.map((item, index) => (
                <div 
                  key={`r2-${index}`} 
                  className={`relative w-[210px] sm:w-[250px] md:w-[280px] shrink-0 bg-white p-2.5 pb-4 md:p-3.5 md:pb-6 rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer hover:z-50 hover:scale-[1.05] border border-slate-100 ${scatterStyles[(index + 3) % scatterStyles.length]}`}
                >
                  <div className="w-full bg-slate-100 h-28 sm:h-36 md:h-44 relative overflow-hidden rounded-lg border border-slate-100">
                    <img src={item.imgPlaceholder} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2.5 px-1 md:mt-3.5 md:px-1.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Medal className="w-3 h-3 text-amber-500 shrink-0" />
                      <p className="text-amber-500 text-[8px] md:text-[9px] font-black uppercase tracking-wider leading-tight">{item.subtitle}</p>
                    </div>
                    <h3 className="text-slate-900 text-xs md:text-sm font-black tracking-tight leading-snug">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

       
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
