import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, CheckCircle2, X } from 'lucide-react';

// Convert Assamese/Bengali and Devanagari numerals to standard digits (e.g. ৫০ -> 50)
function normalizeNumerals(text) {
  if (!text) return '';
  const indicDigits = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  return text.replace(/[০-৯०-९]/g, match => indicDigits[match] || match);
}

// Automatic Language Detector (No manual selection needed!)
function detectLanguageAutomatically(text) {
  if (!text) return 'en';

  // 1. Script-based detection
  if (/[\u0980-\u09FF]/.test(text)) return 'as'; // Assamese / Bengali script
  if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Devanagari / Hindi script

  // 2. Phonetic / Transliterated vocabulary detection
  const lower = text.toLowerCase();
  const assameseKeywords = [
    'mur', 'bechibo', 'khuju', 'khuzo', 'toka', 'tokat', 'bengena', 'asene', 
    'kiman', 'poisa', 'uparjan', 'nohoru', 'bilahi', 'kobi', 'ada', 'gajor',
    'skore', 'khet', 'dhor'
  ];
  const hindiKeywords = [
    'mera', 'bechna', 'hai', 'kilo', 'rupaye', 'rupeye', 'kamai', 'dikhao', 
    'fasal', 'khet', 'gaadi', 'kitna', 'tamatar', 'pyaaz', 'pyaz', 'aloo', 'adrak'
  ];

  if (assameseKeywords.some(w => lower.includes(w))) return 'as';
  if (hindiKeywords.some(w => lower.includes(w))) return 'hi';

  return 'en';
}

// Comprehensive Crop dictionary
const CROPS = [
  {
    name: 'Onion',
    as: 'পিয়াজ',
    hi: 'प्याज',
    matches: ['পিয়াজ', 'পিয়াঁজ', 'পেঁয়াজ', 'प्याज', 'कांदा', 'pyaz', 'pyaaz', 'kanda', 'onion', 'onions']
  },
  {
    name: 'Tomato',
    as: 'বিলাহী',
    hi: 'टमाटर',
    matches: ['বিলাহী', 'টমেটো', 'টমাটো', 'टमाटर', 'tamatar', 'tomato', 'tomatoes']
  },
  {
    name: 'Potato',
    as: 'আলু',
    hi: 'आलू',
    matches: ['আলু', 'आलू', 'बटाटा', 'aloo', 'alu', 'potato', 'potatoes']
  },
  {
    name: 'Ginger',
    as: 'আদা',
    hi: 'अदरक',
    matches: ['আদা', 'अदरक', 'adrak', 'ada', 'ginger']
  },
  {
    name: 'Garlic',
    as: 'নহৰু',
    hi: 'लहसुन',
    matches: ['নহৰু', 'লহসুন', 'लहसुन', 'lahsun', 'lasun', 'nohoru', 'garlic']
  },
  {
    name: 'Carrot',
    as: 'গাজৰ',
    hi: 'गाजर',
    matches: ['গাজৰ', 'গাजर', 'गाजर', 'gajar', 'carrot', 'carrots']
  },
  {
    name: 'Cauliflower',
    as: 'ফুলকবি',
    hi: 'फूलगोभी',
    matches: ['ফুলকবি', 'ফুলकबी', 'फूलगोभी', 'gobhi', 'fulkobi', 'cauliflower']
  },
  {
    name: 'Cabbage',
    as: 'বন্ধাকবি',
    hi: 'पत्तागोभी',
    matches: ['বন্ধাকবি', 'पत्तागोभी', 'patagobhi', 'bandhakobi', 'cabbage']
  },
  {
    name: 'Spinach',
    as: 'পালেং',
    hi: 'पालक',
    matches: ['পালেং', 'পালক', 'palak', 'paleng', 'spinach']
  },
  {
    name: 'Brinjal',
    as: 'বেঙেনা',
    hi: 'बैंगन',
    matches: ['বেঙেনা', 'बैंगन', 'baingan', 'bengena', 'brinjal', 'eggplant']
  },
  {
    name: 'Okra',
    as: 'ভেণ্ডি',
    hi: 'भिंडी',
    matches: ['ভেণ্ডি', 'भिंडी', 'bhindi', 'vendi', 'okra', 'ladyfinger']
  },
  {
    name: 'Green Chilli',
    as: 'জলকীয়া',
    hi: 'हरी मिर्च',
    matches: ['জলকীয়া', 'मिर्च', 'mirch', 'jolokia', 'chilli', 'green chilli']
  }
];

export default function FarmerVoiceAssistant({
  currentView,
  setView,
  khetScore = 821,
  totalEarnings = 2841,
  pendingEarnings = 973,
  transportPools = [],
  orders = [],
  newListing,
  setNewListing,
  setShowAddForm,
  setIsAutoFilled,
  onOpenScan,
  onOpenAddHarvest,
  lang = 'as',
  setLang
}) {
  const [isListening, setIsListening] = useState(false);
  const [liveSpeech, setLiveSpeech] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [actionDone, setActionDone] = useState(false);
  const [audioWaves, setAudioWaves] = useState([30, 60, 90, 45, 75]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const recognitionRef = useRef(null);
  const waveIntervalRef = useRef(null);
  const dismissTimeoutRef = useRef(null);

  // Load natural voices cleanly
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (window.speechSynthesis) {
        setVoicesLoaded(true);
      }
    };
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      handleVoicesChanged();
    }
  }, []);

  // Natural Human-Like Text-To-Speech Engine
  const speakNaturally = (text, targetLang) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 0.90;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices() || [];
      const isHighQuality = (v) => 
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Neural') || 
        v.name.includes('Enhanced') || 
        v.name.includes('Premium') ||
        v.name.includes('India');

      let langPrefix = targetLang === 'as' ? 'bn' : targetLang === 'hi' ? 'hi' : 'en';

      let matchedVoice = voices.find(v => isHighQuality(v) && v.lang.toLowerCase().startsWith(langPrefix));
      if (!matchedVoice) matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
      if (!matchedVoice) matchedVoice = voices.find(v => isHighQuality(v) && v.lang.includes('IN'));
      if (!matchedVoice) matchedVoice = voices.find(v => isHighQuality(v));

      if (matchedVoice) utterance.voice = matchedVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Error:", e);
    }
  };

  // Ultra-Smart & Flexible Intent Parser
  const processVoiceInput = (rawSpeech) => {
    if (!rawSpeech || !rawSpeech.trim()) return;

    // 1. AUTOMATIC LANGUAGE DETECTION
    const detectedLang = detectLanguageAutomatically(rawSpeech);
    if (setLang && detectedLang !== lang) {
      setLang(detectedLang);
    }

    const normalized = normalizeNumerals(rawSpeech.toLowerCase().trim());
    setLiveSpeech(rawSpeech);

    // ----------------------------------------------------
    // 1. PRODUCE SELLING & AUTO-FILL
    // e.g.: "মই ৫০ কেজি পিয়াজ ১২ টকাত বেচিব খোজোঁ",
    // "50 kilo pyaz 12 rupaye me bechna hai", "sell 50kg onions at 12"
    // ----------------------------------------------------
    let matchedCrop = null;
    for (const crop of CROPS) {
      if (crop.matches.some(m => normalized.includes(m.toLowerCase()))) {
        matchedCrop = crop;
        break;
      }
    }

    const sellTriggers = [
      'বেচিব', 'বিক্ৰী', 'বেচিম', 'বেচা', 'খোজোঁ', 'তালিকা',
      'बेचना', 'बेचूं', 'बेचनी', 'बेचेंगे', 'लिस्ट', 'डालना', 'बिक्री',
      'sell', 'list', 'selling', 'add', 'produce'
    ];
    const hasSellWord = sellTriggers.some(w => normalized.includes(w));

    let qtyMatch = normalized.match(/(\d+(\.\d+)?)\s*(কেজি|কিলো|কিলোগ্ৰাম|কে\.জি|kg|kilo|kgs|किलो|किलोग्राम|केजी)/i);
    let detectedQty = qtyMatch ? qtyMatch[1] : null;

    let priceMatch = normalized.match(/(\d+(\.\d+)?)\s*(টকা|টকাত|টকাৰ|দৰত|रुपये|रुपए|रु|rs|rupee|rupees|₹|भाव|रेट)/i);
    let detectedPrice = priceMatch ? priceMatch[1] : null;

    if (!detectedQty || !detectedPrice) {
      const allNumbers = normalized.match(/\b\d+(\.\d+)?\b/g);
      if (allNumbers && allNumbers.length >= 2) {
        if (!detectedQty) detectedQty = allNumbers[0];
        if (!detectedPrice) detectedPrice = allNumbers[1];
      } else if (allNumbers && allNumbers.length === 1 && !detectedQty) {
        detectedQty = allNumbers[0];
      }
    }

    if (matchedCrop && (hasSellWord || detectedQty || detectedPrice)) {
      const finalQty = detectedQty || '50';
      const finalPrice = detectedPrice || '12';
      const cropLabel = matchedCrop[detectedLang] || matchedCrop.name;

      setView('listings');
      if (setIsAutoFilled) setIsAutoFilled(false);
      if (setShowAddForm) setShowAddForm(true);

      if (setNewListing) {
        setNewListing(prev => ({
          ...prev,
          name: matchedCrop.name,
          quantity: finalQty,
          price: finalPrice,
          grade: 'B'
        }));
      }

      const naturalReplies = {
        as: `আপোনাৰ ${finalQty} কেজি ${cropLabel}, ${finalPrice} টকা দৰত ফৰ্মত ভৰোৱা হৈছে।`,
        hi: `जी, आपका ${finalQty} किलो ${cropLabel}, ${finalPrice} रुपये प्रति किलो के भाव से फॉर्म में भर दिया गया है।`,
        en: `Done! Auto-filled ${finalQty} kg of ${matchedCrop.name}, at ${finalPrice} rupees per kilo.`
      };

      speakNaturally(naturalReplies[detectedLang] || naturalReplies.en, detectedLang);
      setStatusMessage(`${finalQty} kg ${matchedCrop.name} @ ₹${finalPrice}/kg Auto-Filled ✅`);
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    // ----------------------------------------------------
    // 2. KHETSCORE / CREDIT / LOANS
    // ----------------------------------------------------
    const scoreWords = [
      'score', 'khet', 'credit', 'loan', 'bank', 'eligibility', 'points', 'trust', 'karz',
      'स्कोर', 'खेत', 'क्रेडिट', 'लोन', 'कर्ज', 'बैंक', 'पात्रता',
      'স্কোৰ', 'খেত', 'ক্ৰেডিট', 'ঋণ', 'বেংক', 'যোগ্য'
    ];
    if (scoreWords.some(w => normalized.includes(w))) {
      setView('khetscore');
      const messages = {
        en: `Your verified KhetScore is ${khetScore || 821}. ${khetScore >= 650 ? 'You are eligible for bank micro-loans.' : 'Sell more produce to reach 650.'}`,
        hi: `आपका खेत स्कोर ${khetScore || 821} है। ${khetScore >= 650 ? 'आप बैंक माइक्रो-लोन के लिए पात्र हैं।' : 'लोन के लिए और फसल बेचें।'}`,
        as: `আপোনাৰ খেত স্কোৰ হৈছে ${khetScore || 821}। ${khetScore >= 650 ? 'আপুনি বেংক ঋণৰ বাবে যোগ্য।' : 'ঋণ পাবলৈ আৰু কিছু ফচল বিক্ৰী কৰক।'}`
      };
      speakNaturally(messages[detectedLang] || messages.en, detectedLang);
      setStatusMessage(`KhetScore: ${khetScore || 821} ⭐`);
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    // ----------------------------------------------------
    // 3. TRUCKS / TRANSPORT / MILK-RUN
    // ----------------------------------------------------
    const truckWords = [
      'truck', 'trucks', 'transport', 'tempo', 'vehicle', 'pickup', 'pool', 'pooling', 'milk', 'gadi', 'gaadi',
      'ट्रक', 'गाड़ी', 'ट्रांसपोर्ट', 'टेंपो', 'पूलिंग', 'पिकअप',
      'ট্ৰাক', 'গাড়ী', 'পৰিবহন', 'পিকআপ', 'টেম্পো', 'মিল্ক'
    ];
    if (truckWords.some(w => normalized.includes(w))) {
      setView('transport');
      const count = transportPools?.length || 2;
      const messages = {
        en: `Showing transport pooling. ${count} Milk-Run tempos are available on your route.`,
        hi: `ट्रांसपोर्ट पूलिंग दिखाया जा रहा है। आपके रूट पर ${count} ट्रक और टेंपो उपलब्ध हैं।`,
        as: `পৰিবহন পূলিং দেখুওৱা হৈছে। আপোনাৰ পথত ${count} খন ট্ৰাক আৰু টেম্পো উপলব্ধ আছে।`
      };
      speakNaturally(messages[detectedLang] || messages.en, detectedLang);
      setStatusMessage(`${count} Milk-Run Trucks Ready 🚚`);
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    // ----------------------------------------------------
    // 4. EARNINGS / MONEY / MONTHLY INCOME
    // ----------------------------------------------------
    const earningWords = [
      'earning', 'earnings', 'money', 'payment', 'income', 'paid', 'profit', 'balance', 'month', 'kamai', 'paisa',
      'कमाई', 'पैसे', 'पेमेंट', 'इनकम', 'महीने', 'रुपये',
      'উপাৰ্জন', 'পইচা', 'টকা', 'ধন', 'লাভ', 'মাহ', 'পেমেন্ট'
    ];
    if (earningWords.some(w => normalized.includes(w))) {
      setView('transactions');
      const earned = Math.round(totalEarnings || 2841);
      const pending = Math.round(pendingEarnings || 973);
      const messages = {
        en: `In the last month, your verified earnings are ${earned} rupees, with ${pending} rupees pending clearance.`,
        hi: `पिछले महीने आपकी कुल कमाई ${earned} रुपये है, और ${pending} रुपये पेंडिंग है।`,
        as: `যোৱা এক মাহত আপোনাৰ মুঠ উপাৰ্জন হৈছে ${earned} টকা, আৰু ${pending} টকা জমা হ'বলৈ বাকী আছে।`
      };
      speakNaturally(messages[detectedLang] || messages.en, detectedLang);
      setStatusMessage(`Earned: ₹${earned} | Pending: ₹${pending} 💰`);
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    // ----------------------------------------------------
    // 5. AI SCAN / CAMERA
    // ----------------------------------------------------
    const scanWords = [
      'scan', 'camera', 'photo', 'picture', 'image', 'grade',
      'स्कैन', 'कैमरा', 'फोटो', 'तस्वीर', 'जांच',
      'স্কেন', 'কেমেৰা', 'ফটো', 'ছবি', 'পৰীক্ষা'
    ];
    if (scanWords.some(w => normalized.includes(w))) {
      if (onOpenScan) onOpenScan();
      const messages = {
        en: 'Opening AI Magic Scan camera.',
        hi: 'एआई मैजिक स्कैन कैमरा खोला जा रहा है।',
        as: 'AI মেজিক স্কেন কেমেৰা খোলা হৈছে।'
      };
      speakNaturally(messages[detectedLang] || messages.en, detectedLang);
      setStatusMessage('AI Magic Scanner Ready 📸');
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    // ----------------------------------------------------
    // 6. MANDI RATES
    // ----------------------------------------------------
    const mandiWords = [
      'mandi', 'rate', 'rates', 'market', 'price', 'bhav',
      'मंडी', 'भाव', 'दाम', 'रेट', 'बाजार',
      'মন্ডি', 'দৰ', 'দাম', 'বজাৰ', 'ৰেট'
    ];
    if (mandiWords.some(w => normalized.includes(w))) {
      setView('mandi');
      const messages = {
        en: 'Showing live Agmarknet mandi rates.',
        hi: 'लाइव मंडी भाव दिखाए जा रहे हैं।',
        as: 'বজাৰৰ লাইভ দৰ দেখুওৱা হৈছে।'
      };
      speakNaturally(messages[detectedLang] || messages.en, detectedLang);
      setStatusMessage('Live Mandi Rates 📊');
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    // ----------------------------------------------------
    // 7. ORDERS
    // ----------------------------------------------------
    const orderWords = [
      'order', 'orders', 'customer', 'buyers', 'status',
      'ऑर्डर', 'ग्राहक', 'खरीदार',
      'অৰ্ডাৰ', 'গ্ৰাহক', 'ক্ৰেতা'
    ];
    if (orderWords.some(w => normalized.includes(w))) {
      setView('orders');
      const count = orders?.length || 0;
      const messages = {
        en: `You have ${count} received orders from HORECA buyers.`,
        hi: `आपको कुल ${count} ऑर्डर मिले हैं।`,
        as: `আপুনি মুঠ ${count} টা অৰ্ডাৰ লাভ কৰিছে।`
      };
      speakNaturally(messages[detectedLang] || messages.en, detectedLang);
      setStatusMessage(`${count} Active Orders 📦`);
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    // Fallback if not matched
    setStatusMessage(`Heard: "${rawSpeech}"`);
    setActionDone(true);
    autoCloseAfterDelay();
  };

  const autoCloseAfterDelay = () => {
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    dismissTimeoutRef.current = setTimeout(() => {
      setIsListening(false);
      setStatusMessage('');
      setActionDone(false);
    }, 4500);
  };

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      clearInterval(waveIntervalRef.current);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('Speech API not supported in browser');
      setActionDone(true);
      autoCloseAfterDelay();
      return;
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort();

      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'as' ? 'bn-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveSpeech('');
        setStatusMessage('Listening naturally...');
        setActionDone(false);
        waveIntervalRef.current = setInterval(() => {
          setAudioWaves([
            Math.floor(Math.random() * 80) + 20,
            Math.floor(Math.random() * 95) + 30,
            Math.floor(Math.random() * 75) + 25,
            Math.floor(Math.random() * 100) + 40,
            Math.floor(Math.random() * 60) + 20
          ]);
        }, 120);
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) setLiveSpeech(currentInterim);
        if (finalTranscript) {
          setLiveSpeech(finalTranscript);
          processVoiceInput(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech error:", event.error);
        setIsListening(false);
        clearInterval(waveIntervalRef.current);
      };

      recognition.onend = () => {
        setIsListening(false);
        clearInterval(waveIntervalRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Speech init error:", e);
      setIsListening(false);
      clearInterval(waveIntervalRef.current);
    }
  };

  return (
    <>
      {/* 
        ========================================================================
        1. SLEEK MOBILE-FIRST CIRCULAR FLOATING VOICE BUTTON (Bottom-Left)
        Ergonomic on smartphones: perfectly aligned with safe margins
        ========================================================================
      */}
      <div className="fixed bottom-5 left-4 md:bottom-6 md:left-6 z-40">
        <button
          onClick={toggleListening}
          className={`pointer-events-auto p-3.5 md:p-4 rounded-full shadow-[0_8px_25px_0_rgba(16,185,129,0.2)] transition-all hover:scale-105 active:scale-95 touch-manipulation relative ${
            isListening 
              ? 'bg-rose-500 text-white border-2 border-rose-300 ring-4 ring-rose-200/70 animate-pulse' 
              : 'bg-white/90 backdrop-blur-xl border border-white text-emerald-600 hover:text-emerald-700 active:bg-slate-50'
          }`}
          title="Speak to KhetFlow"
          aria-label="Voice Command Assistant"
        >
          <div className="relative flex items-center justify-center">
            {isListening ? (
              <MicOff className="w-6 h-6 md:w-7 md:h-7 text-white" />
            ) : (
              <Mic className="w-6 h-6 md:w-7 md:h-7" />
            )}
            {!isListening && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </div>
        </button>
      </div>

      {/* 
        ========================================================================
        2. MOBILE-FRIENDLY FLOATING VOICE BAR
        - On mobile: floats above the bottom buttons (bottom-20 md:bottom-8)
          so it NEVER collides with or hides the Mic and Chatbot buttons!
        - Text wraps cleanly on mobile (no awkward clipping/truncate)
        ========================================================================
      */}
      {(isListening || statusMessage) && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto px-1">
          <div className="bg-slate-900/95 text-white backdrop-blur-2xl border border-white/15 rounded-2xl md:rounded-full px-3.5 py-2.5 md:px-5 md:py-3 shadow-2xl flex items-center justify-between gap-2.5">
            
            {/* Left: Indicator & Responsive Soundwave */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${actionDone ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {actionDone ? (
                  <CheckCircle2 className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
                ) : (
                  <Mic className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 animate-pulse" />
                )}
              </div>

              {/* Live soundwave animation */}
              {isListening && (
                <div className="flex items-center gap-0.5 md:gap-1 h-3.5 shrink-0">
                  {audioWaves.map((h, i) => (
                    <span 
                      key={i} 
                      className="w-0.5 bg-emerald-400 rounded-full transition-all duration-100"
                      style={{ height: `${h}%` }}
                    ></span>
                  ))}
                </div>
              )}

              {/* Dynamic Multiline Text (Prevents truncation on narrow screens) */}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-100 leading-snug line-clamp-2 break-words">
                  {liveSpeech ? `"${liveSpeech}"` : (isListening ? 'Listening naturally in your language...' : statusMessage)}
                </p>
                {liveSpeech && statusMessage && (
                  <p className="text-[10px] md:text-xs text-emerald-400 font-bold truncate mt-0.5">
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quick Close Tap Target */}
            <button
              onClick={() => {
                if (recognitionRef.current) recognitionRef.current.stop();
                setIsListening(false);
                setStatusMessage('');
                setActionDone(false);
              }}
              className="p-1.5 md:p-2 rounded-full text-slate-400 hover:text-white active:bg-white/10 transition-colors shrink-0 touch-manipulation"
              title="Dismiss"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}
    </>
  );
}
