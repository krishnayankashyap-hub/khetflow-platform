import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc,setDoc, getDoc, collection, getDocs, addDoc, deleteDoc, updateDoc, query, where, serverTimestamp, onSnapshot, orderBy, increment } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import QRCode from 'react-qr-code';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Leaf, Package, ShoppingBag, Clock, LogOut, Plus, Trash2, X, Download, 
  QrCode, ChevronRight, UploadCloud, TrendingUp, MapPin, Phone, User, 
  Zap, Check, IndianRupee, CloudRain, Sun, Wind, Droplets, Calendar, Globe,
  Camera, Aperture, Wand2, ScanLine, Settings, AlertCircle, CreditCard, Landmark,
  ShieldCheck, TrendingDown, Percent, Info, Sprout, Briefcase, MessageCircle, Send, HelpCircle, Bot, MessageSquare,
  Truck, Users, ArrowRight, Timer, Search, BarChart3, Map, Navigation, CheckCircle2, Mail, PackageCheck, ArrowLeft
} from 'lucide-react';

// ==================== 0. LANGUAGE SYSTEM ====================

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'اردو' },
  { code: 'hr', name: 'हरियाणवी' }
];

const TRANSLATIONS = {
  en: {
    heroSubtitle: 'Turn "Imperfect" Produce into Perfect Profit',
    heroDesc: 'Sell Grade B & C produce that would otherwise go to waste. Zero waste, better income, happy planet.',
    startSelling: 'Start Selling Now',
    betterPrices: 'Better Prices',
    zeroWaste: 'Zero Waste',
    happyBuyers: 'Happy Buyers',
    welcomeBack: 'Welcome back KhetFlow Farmer 🌱',
    joinKhetFlow: 'Join KhetFlow Farmer ',
    loginDesc: 'Login with your Email or Mobile Number',
    regDesc: 'Register your details to start earning',
    yourName: 'Your Name',
    farmName: 'Farm Name',
    email: 'Email Address', 
    identifier: 'Email or Mobile Number',
    password: 'Password / PIN',
    phone: 'Mobile Number',
    location: 'Farm Location',
    login: 'Login',
    createAccount: 'Create Account',
    dontHaveAcc: "Don't have an account?",
    alreadyHaveAcc: "Already have an account?",
    createFarmerAcc: 'Create Farmer Account',
    loginHere: 'Login Here',
    listings: 'My Produce',
    orders: 'Orders',
    payments: 'Earnings',
    active: 'Active',
    earned: 'Earned',
    pending: 'Pending',
    yourHarvest: 'Your Harvest ',
    addProduct: 'Add Product',
    addNewListing: 'Add New Produce ',
    prodName: 'Product Name',
    qty: 'Quantity (kg)',
    price: 'Price / kg (₹)',
    grade: 'Grade',
    desc: 'Description',
    publish: 'Publish Listing ',
    noListings: 'No produce listed yet',
    createFirst: 'Add your first harvest',
    receivedOrders: 'Received Orders ',
    paymentHistory: 'Payment History ',
    farmerDash: 'Farmer Dashboard',
    aiScan: 'AI Magic Scan ',
    scanProduce: 'Scan Produce',
    khetScore: 'Khet Score ',
    creditHistory: 'Credit History',
    loanEligible: 'Loan Eligibility',
    scoreGood: 'Good',
    scoreLow: 'Needs Improv.',
    scoreExcellent: 'Excellent',
    buildScore: 'Sell more to improve score',
    transport: 'Transport Pooling ',
    shareTruck: 'Share a Truck',
    availablePools: 'Available Trucks',
    joinPool: 'Join Pool',
    capacityLeft: 'Capacity Left',
    mandiRates: 'Market Rates ',
    mandi: 'Mandi',
    searchCrop: 'Search crop...',
    priceTrend: 'Price Trend'
  },
  hi: {
    heroSubtitle: 'अपूर्ण उपज को सही मुनाफे में बदलें',
    heroDesc: 'ग्रेड बी और सी उपज बेचें जो अन्यथा बर्बाद हो जाती। शून्य अपशिष्ट, बेहतर आय, खुशहाल ग्रह।',
    startSelling: 'अब बेचना शुरू करें',
    betterPrices: 'बेहतर कीमतें',
    zeroWaste: 'शून्य अपशिष्ट',
    happyBuyers: 'खुश खरीदार',
    welcomeBack: 'वापसी पर स्वागत है खेतफ्लो किसान 🌱',
    joinKhetFlow: 'खेतफ्लो किसान से जुड़ें ',
    loginDesc: 'अपने ईमेल या मोबाइल नंबर से लॉगिन करें',
    regDesc: 'कमाई शुरू करने के लिए अपना विवरण पंजीकृत करें',
    yourName: 'आपका नाम',
    farmName: 'खेत का नाम',
    email: 'ईमेल पता',
    identifier: 'ईमेल या मोबाइल नंबर',
    password: 'पासवर्ड / पिन',
    phone: 'मोबाइल नंबर',
    location: 'खेत का स्थान',
    login: 'लॉगिन',
    createAccount: 'खाता बनाएं',
    dontHaveAcc: "खाता नहीं है?",
    alreadyHaveAcc: "पहले से खाता है?",
    createFarmerAcc: 'किसान खाता बनाएं',
    loginHere: 'यहाँ लॉगिन करें',
    listings: 'मेरी उपज',
    orders: 'ऑर्डर',
    payments: 'कमाई',
    active: 'सक्रिय',
    earned: 'कमाई',
    pending: 'लंबित',
    yourHarvest: 'आपकी फसल ',
    addProduct: 'उत्पाद जोड़ें',
    addNewListing: 'नई उपज जोड़ें ',
    prodName: 'उत्पाद का नाम',
    qty: 'मात्रा (किग्रा)',
    price: 'कीमत / किग्रा (₹)',
    grade: 'ग्रेड',
    desc: 'विवरण',
    publish: 'लिस्टिंग प्रकाशित करें ',
    noListings: 'अभी कोई उपज नहीं',
    createFirst: 'पहली फसल जोड़ें',
    receivedOrders: 'प्राप्त ऑर्डर ',
    paymentHistory: 'भुगतान इतिहास ',
    farmerDash: 'किसान डैशबोर्ड',
    aiScan: 'AI मैजिक स्कैन ',
    scanProduce: 'फसल स्कैन करें',
    khetScore: 'खेत स्कोर ',
    creditHistory: 'क्रेडिट इतिहास',
    loanEligible: 'ऋण पात्रता',
    scoreGood: 'अच्छा',
    scoreLow: 'सुधार की आवश्यकता',
    scoreExcellent: 'बहुत बढ़िया',
    buildScore: 'स्कोर बढ़ाने के लिए अधिक बेचें',
    transport: 'परिवहन ',
    shareTruck: 'ट्रक साझा करें',
    availablePools: 'उपलब्ध ट्रक',
    joinPool: 'शामिल हों',
    capacityLeft: 'बची हुई क्षमता',
    mandiRates: 'बाज़ार भाव ',
    mandi: 'मंडी',
    searchCrop: 'फसल खोजें...',
    priceTrend: 'कीमत रुझान'
  },
  as: { heroSubtitle: 'অসম্পূৰ্ণ উৎপাদনক সঠিক লাভলৈ পৰিৱৰ্তন কৰক', heroDesc: 'গ্ৰেড বি আৰু চি সামগ্ৰী বিক্ৰী কৰক যি নহলে নষ্ট হৈ যাব। শূন্য আৱৰ্জনা, উন্নত আয়।', startSelling: 'এতিয়াই বিক্ৰী আৰম্ভ কৰক', betterPrices: 'উন্নত দাম', zeroWaste: 'শূন্য আৱৰ্জনা', happyBuyers: 'সুখী ক্ৰেতা', welcomeBack: 'স্বাগতম KhetFlow কৃষক 🌱', joinKhetFlow: 'KhetFlow ত যোগদান কৰক ', loginDesc: 'আপোনাৰ ইমেইল বা ম’বাইল নম্বৰেৰে লগ ইন কৰক', regDesc: 'উপাৰ্জন আৰম্ভ কৰিবলৈ পঞ্জীয়ন কৰক', yourName: 'আপোনাৰ নাম', farmName: 'খেতিৰ নাম', email: 'ইমেইল ঠিকনা', identifier: 'ইমেইল বা ম’বাইল নম্বৰ', password: 'পাছৱৰ্ড', phone: 'ম’বাইল নম্বৰ', location: 'খেতিৰ স্থান', login: 'লগ ইন', createAccount: 'একাউণ্ট সৃষ্টি কৰক', dontHaveAcc: "একাউণ্ট নাই নেকি?", alreadyHaveAcc: "ইতিমধ্যে একাউণ্ট আছে?", createFarmerAcc: 'কৃষকৰ একাউণ্ট খোলক', loginHere: 'ইয়াত লগ ইন কৰক', listings: 'মোৰ শস্য', orders: 'অৰ্ডাৰ', payments: 'উপাৰ্জন', active: 'সক্ৰিয়', earned: 'উপাৰ্জন', pending: 'বাকী', yourHarvest: 'আপোনাৰ ফচল ', addProduct: 'সামগ্ৰী যোগ কৰক', addNewListing: 'নতুন শস্য যোগ কৰক ', prodName: 'সামগ্ৰীৰ নাম', qty: 'পৰিমাণ (কেজি)', price: 'দাম / কেজি (₹)', grade: 'গ্ৰেড', desc: 'বিৱৰণ', publish: 'প্ৰকাশ কৰক ', noListings: 'কোনো তালিকা নাই', createFirst: 'প্ৰথম তালিকা সৃষ্টি কৰক', receivedOrders: 'প্ৰাপ্ত অৰ্ডাৰ ', paymentHistory: 'পেমেন্টৰ ইতিহাস ', farmerDash: 'কৃষক ডেশ্ববৰ্ড', aiScan: 'AI স্কেন ', scanProduce: 'সামগ্ৰী স্কেন কৰক', khetScore: 'খেত স্কোৰ ', creditHistory: 'ক্ৰেডিট ইতিহাস', loanEligible: 'ঋণৰ যোগ্যতা', scoreGood: 'ভাল', scoreLow: 'উন্নতিৰ প্ৰয়োজন', scoreExcellent: 'অতি উত্তম', buildScore: 'স্কোৰ বঢ়াবলৈ অধিক বিক্ৰী কৰক', transport: 'পৰিবহণ ', shareTruck: 'ট্ৰাক ভাগ কৰক', availablePools: 'উপलब्ध ট্ৰাক', joinPool: 'যোগদান কৰক', capacityLeft: 'বাকী থকা ক্ষমতা', mandiRates: 'বজাৰৰ দৰ ', mandi: 'মাণ্ডি', searchCrop: 'শস্য বিচাৰক...', priceTrend: 'দৰৰ প্ৰৱণতা' },
  pa: { heroSubtitle: 'ਅਧੂਰੀ ਉਪਜ ਨੂੰ ਪੂਰੇ ਮੁਨਾਫੇ ਵਿੱਚ ਬਦਲੋ', heroDesc: 'ਗ੍ਰੇਡ ਬੀ ਅਤੇ ਸੀ ਉਪਜ ਵੇਚੋ ਜੋ ਨਹੀਂ ਤਾਂ ਵਿਅਰਥ ਜਾਵੇਗੀ। ਜ਼ੀਰੋ ਵੇਸਟ, ਬਿਹਤਰ ਆਮਦਨ।', startSelling: 'ਹੁਣੇ ਵੇਚਣਾ ਸ਼ੁਰੂ ਕਰੋ', betterPrices: 'ਵਧੀਆ ਕੀਮਤਾਂ', zeroWaste: 'ਜ਼ੀਰੋ ਵੇਸਟ', happyBuyers: 'ਖੁਸ਼ ਖਰੀਦਦਾਰ', welcomeBack: 'ਜੀ ਆਇਆਂ ਨੂੰ ਖੇਤਫਲੋ ਕਿਸਾਨ 🌱', joinKhetFlow: 'ਖੇਤਫਲੋ ਨਾਲ ਜੁੜੋ ', loginDesc: 'ਆਪਣੇ ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ ਨਾਲ ਲੌਗਇਨ ਕਰੋ', regDesc: 'ਕਮਾਈ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਰਜਿਸਟਰ ਕਰੋ', yourName: 'ਤੁਹਾਡਾ ਨਾਮ', farmName: 'ਖੇਤ ਦਾ ਨਾਮ', email: 'ਈਮੇਲ ਪਤਾ', identifier: 'ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ', password: 'ਪਾਸਵਰਡ', phone: 'ਮੋਬਾਈਲ ਨੰਬਰ', location: 'ਖੇਤ ਦਾ ਟਿਕਾਣਾ', login: 'ਲੌਗਇਨ', createAccount: 'ਖਾਤਾ ਬਣਾਓ', dontHaveAcc: "ਕੀ ਖਾਤਾ ਨਹੀਂ ਹੈ?", alreadyHaveAcc: "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?", createFarmerAcc: 'ਕਿਸਾਨ ਖਾਤਾ ਬਣਾਓ', loginHere: 'ਇੱਥੇ ਲੌਗਇਨ ਕਰੋ', listings: 'ਮੇਰੀ ਉਪਜ', orders: 'ਆਰਡਰ', payments: 'ਕਮਾਈ', active: 'ਸਰਗਰਮ', earned: 'ਕਮਾਈ', pending: 'ਬਕਾਇਆ', yourHarvest: 'ਤੁਹਾਡੀ ਫਸਲ ', addProduct: 'ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ', addNewListing: 'ਨਵੀਂ ਉਪਜ ਸ਼ਾਮਲ ਕਰੋ ', prodName: 'ਉਤਪਾਦ ਦਾ ਨਾਮ', qty: 'ਮਾਤਰਾ (ਕਿਲੋ)', price: 'ਕੀਮਤ / ਕਿਲੋ (₹)', grade: 'ਗ੍ਰੇਡ', desc: 'ਵੇਰਵਾ', publish: 'ਸੂਚੀ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ ', noListings: 'ਅਜੇ ਕੋਈ ਸੂਚੀ ਨਹੀਂ', createFirst: 'ਪਹਿਲੀ ਸੂਚੀ ਬਣਾਓ', receivedOrders: 'ਪ੍ਰਾਪਤ ਆਰਡਰ ', paymentHistory: 'ਭੁਗਤਾਨ ਇਤਿਹਾਸ ', farmerDash: 'ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ', aiScan: 'AI ਸਕੈਨ ', scanProduce: 'ਉਪਜ ਸਕੈਨ ਕਰੋ', khetScore: 'ਖੇਤ ਸਕੋਰ ', creditHistory: 'ਕ੍ਰੈਡਿਟ ਇਤਿਹਾਸ', loanEligible: 'ਕਰਜ਼ਾ ਯੋਗਤਾ', scoreGood: 'ਵਧੀਆ', scoreLow: 'ਸੁਧਾਰ ਦੀ ਲੋੜ', scoreExcellent: 'ਬਹੁਤ ਵਧੀਆ', buildScore: 'ਸਕੋਰ ਵਧਾਉਣ ਲਈ ਹੋਰ ਵੇਚੋ', transport: 'ਆਵਾਜਾਈ ', shareTruck: 'ਟਰੱਕ ਸਾਂਝਾ ਕਰੋ', availablePools: 'ਉਪਲਬਧ ਟਰੱਕ', joinPool: 'ਸ਼ਾਮਲ ਹੋਵੋ', capacityLeft: 'ਬਾਕੀ ਸਮਰੱਥਾ', mandiRates: 'ਮੰਡੀ ਦੇ ਭਾਅ ', mandi: 'ਮंडी', searchCrop: 'ਫਸਲ ਖੋਜੋ...', priceTrend: 'ਕੀਮਤ ਦਾ ਰੁਝਾਨ' },
  ur: { heroSubtitle: 'نامکمل پیداوار کو مکمل منافع میں بدلیں', heroDesc: 'گریڈ بی اور سی کی پیداوار بیچیں جو ورنہ ضائع ہو جاتی۔ صفر فضلہ، بہتر آمدنی۔', startSelling: 'اب بیچنا شروع کریں', betterPrices: 'بہتر قیمتیں', zeroWaste: 'صفر فضلہ', happyBuyers: 'خوش خریدار', welcomeBack: 'خوش آمدید کھیت فلو کسان 🌱', joinKhetFlow: 'کھیت فلو میں شامل ہوں ', loginDesc: 'اپنے ای میل یا موبائل نمبر کے ساتھ لاگ ان کریں', regDesc: 'کمانا شروع کرنے کے لیے رجسٹر کریں', yourName: 'آپ کا نام', farmName: 'کھیت کا نام', email: 'ای میل پتہ', identifier: 'ای میل یا موبائل نمبر', password: 'پاس ورڈ', phone: 'موبائل نمبر', location: 'کھیت کا مقام', login: 'لاگ ان', createAccount: 'اکاؤنٹ بنائیں', dontHaveAcc: "اکاؤنٹ نہیں ہے؟", alreadyHaveAcc: "پہلے سے اکاؤنٹ ہے؟", createFarmerAcc: 'کسان اکاؤنٹ بنائیں', loginHere: 'یہاں لاگ ان کریں', listings: 'میری پیداوار', orders: 'آرڈرز', payments: 'آمدنی', active: 'فعال', earned: 'کمایا', pending: 'زیر التوا', yourHarvest: 'آپ کی فصل ', addProduct: 'پروڈکٹ شامل کریں', addNewListing: 'نئی پیداوار شامل کریں ', prodName: 'پروڈکٹ کا نام', qty: 'مقدار (کلوگرام)', price: 'قیمت / کلوگرام (₹)', grade: 'گریڈ', desc: 'تفصیل', publish: 'فہرست شائع کریں ', noListings: 'ابھی کوئی فہرست نہیں', createFirst: 'پہلی فہرست بنائیں', receivedOrders: 'موصولہ آرڈرز ', paymentHistory: 'ادائیگی کی تاریخ ', farmerDash: 'کسان ڈیش بورڈ', aiScan: 'AI اسکین ', scanProduce: 'پیداوار اسکین کریں', khetScore: 'کھیت اسکور ', creditHistory: 'کریڈٹ ہسٹری', loanEligible: 'قرض کی اہلیت', scoreGood: 'اچھا', scoreLow: 'بہتری کی ضرورت', scoreExcellent: 'بہترین', buildScore: 'اسکور بڑھانے کے لیے مزید بیچیں', transport: 'نقل و حمل ', shareTruck: 'ٹرک شیئر کریں', availablePools: 'دستیاب ٹرک', joinPool: 'شامل ہوں', capacityLeft: 'باقی گنجائش', mandiRates: 'منڈی کے نرخ ', mandi: 'منڈی', searchCrop: 'فصل تلاش کریں...', priceTrend: 'قیمت کا رجحان' },
  hr: { heroSubtitle: 'हल्की फसल का भी बढ़िया मुनाफा कमाओ', heroDesc: 'B और C ग्रेड की फसल बेचो जो वैसे ही खराब हो जावे थी। ना बर्बादी, ज्यादा कमाई, खुशहाली।', startSelling: 'इब बेचना शुरू करो', betterPrices: 'बढ़िया भाव', zeroWaste: 'ना होवे बर्बादी', happyBuyers: 'राजी गाहक', welcomeBack: 'राम राम जी खेतफ्लो किसान 🌱', joinKhetFlow: 'खेतफ्लो तै जुड़ो ', loginDesc: 'अपने ईमेल या मोबाइल नंबर तै लॉगिन करो', regDesc: 'कमाई शुरू करण खातिर रजिस्टर करो', yourName: 'थारा नाम', farmName: 'खेत का नाम', email: 'ईमेल', identifier: 'ईमेल या मोबाइल नंबर', password: 'पासवर्ड / पिन', phone: 'मोबाइल नंबर', location: 'खेत कित्त सै', login: 'लॉगिन', createAccount: 'खाता बणाओ', dontHaveAcc: "खाता कोनी के?", alreadyHaveAcc: "पहलां ई खाता सै?", createFarmerAcc: 'जमींदार खाता बणाओ', loginHere: 'उरे लॉगिन करो', listings: 'मेरी फसल', orders: 'ऑर्डर', payments: 'कमाई', active: 'चालू', earned: 'कमाई', pending: 'रुक रया', yourHarvest: 'थारी फसल ', addProduct: 'फसल जोड़ो', addNewListing: 'नई फसल चढ़ाओ ', prodName: 'फसल का नाम', qty: 'वजन (किलो)', price: 'भाव / किलो (₹)', grade: 'ग्रेड', desc: 'ब्यौरा', publish: 'लिस्टिंग लगाओ ', noListings: 'इब तक कोई फसल कोनी', createFirst: 'पहली फसल चढ़ाओ', receivedOrders: 'आये होये ऑर्डर ', paymentHistory: 'लेन-देन का हिसाब ', farmerDash: 'जमींदार डैशबोर्ड', aiScan: 'AI स्कैन ', scanProduce: 'फसल देखो', khetScore: 'खेत स्कोर ', creditHistory: 'उधारी खाता', loanEligible: 'लोन मिल सकै', scoreGood: 'बढ़िया', scoreLow: 'हल्का सै', scoreExcellent: 'कती ए जहर', buildScore: 'स्कोर बढ़ावण खातिर और बेचो', transport: 'ढुलाई ', shareTruck: 'ट्रक साझा करो', availablePools: 'चालू ट्रक', joinPool: 'मिल के चलो', capacityLeft: 'जगह बची सै', mandiRates: 'मंडी का भाव ', mandi: 'मंडी', searchCrop: 'फसल ढूंढो...', priceTrend: 'भाव का हाल' }
};

const BOT_TRANSLATIONS = {
  en: {
    title: "KhetFlow Guide",
    welcome: "Hello! I'm here to help you get the most out of KhetFlow. What do you need help with today?",
    placeholder: "Type your question...",
    options: [
      { id: 'sell', text: "How to sell produce?" },
      { id: 'score', text: "What is KhetScore?" },
      { id: 'loan', text: "How to get a Loan?" },
      { id: 'payment', text: "Check Payment Status" },
      { id: 'support', text: "Contact Support" },
      { id: 'scan', text: "How to use AI Scan?" }
    ],
    answers: {
      sell: "To sell: Go to the 'Listings' tab, click the + 'Add Product' button. You can upload a photo manually or use our AI Camera to auto-detect the grade.",
      score: "KhetScore is your digital credit history. It starts at 0. Every time you deliver an order successfully, you get +25 points. Earning revenue also boosts it!",
      loan: "Once your KhetScore reaches 650+, the 'Loan Eligibility' button in the Khet Score tab will unlock. You can then apply for low-interest micro-loans directly.",
      payment: "Payments are processed 24 hours after the buyer confirms delivery. Check the 'Payments' tab to see your transaction history.",
      support: "For urgent issues, call our farmer helpline at 1800-KHET-FLOW (1800-543-8356) between 8 AM and 8 PM.",
      scan: "Click the 'AI Scan' button on the dashboard. Point your camera at the produce. Our AI will identify the vegetable and estimate its grade automatically.",
      default: "I'm not sure about that yet. Please try one of the guided options below or contact support."
    }
  }
};

const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function LanguageSelector({ className = "" }) {
  const { lang, setLang } = useContext(LanguageContext);
  return (
    <div className={`relative z-50 ${className}`}>
      <div className="flex items-center gap-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-lg p-1 shadow-sm">
        <Globe className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 drop-shadow-sm" />
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          className="bg-transparent border-none text-[9px] md:text-sm font-bold text-slate-800 outline-none cursor-pointer focus:ring-0 py-0 pl-0.5 pr-2"
        >
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
    </div>
  );
}

// --- Custom Loader Component ---
function KhetFlowLoader() {
  const text1 = "KHETFLOW";
  const text2 = ".COM";
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/90 backdrop-blur-sm font-sans fixed inset-0 z-[100]">
      <div className="flex items-baseline">
        {text1.split('').map((char, i) => (
          <span 
            key={`t1-${i}`} 
            className="text-4xl md:text-6xl font-black text-emerald-500 drop-shadow-lg opacity-0 animate-reveal"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards', animationDuration: '0.2s' }}
          >
            {char}
          </span>
        ))}
        {text2.split('').map((char, i) => (
          <span 
            key={`t2-${i}`} 
            className="text-sm md:text-2xl font-black text-emerald-400 drop-shadow-md opacity-0 animate-reveal ml-[1px]"
            style={{ animationDelay: `${(text1.length + i) * 0.05}s`, animationFillMode: 'forwards', animationDuration: '0.2s' }}
          >
            {char}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes reveal {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-reveal {
          animation-name: reveal;
        }
      `}</style>
    </div>
  );
}

// --- Constants ---
const CROP_CATEGORIES = {
  Vegetables: ['Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Cauliflower', 'Spinach', 'Brinjal', 'Okra', 'Peas', 'Bottle Gourd', 'Bitter Gourd', 'Capsicum', 'Chilli', 'Ginger', 'Garlic'],
  Fruits: ['Apple', 'Banana', 'Mango', 'Orange', 'Grapes', 'Papaya', 'Pomegranate', 'Guava', 'Watermelon', 'Muskmelon', 'Custard Apple', 'Pineapple', 'Strawberry'],
  Millets: ['Pearl Millet (Bajra)', 'Sorghum (Jowar)', 'Finger Millet (Ragi)', 'Foxtail Millet', 'Kodo Millet', 'Little Millet', 'Barnyard Millet', 'Proso Millet']
};

// --- Animated Background Component  ---
function AnimatedBackground() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Premium Dot-Grid Background */
      body {
        background-color: #f8fafc !important;
        background-image: radial-gradient(#cbd5e1 1px, transparent 1px) !important;
        background-size: 24px 24px !important;
      }
      
      /* Soft Ambient Blobs (Stripe-like) */
      .bg-blob { position: fixed; filter: blur(120px); z-index: 0; opacity: 0.35; animation: floatBlob 15s ease-in-out infinite alternate; pointer-events: none; }
      .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; max-width: 600px; max-height: 600px; background: #10b981; border-radius: 50%; }
      .blob-2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; max-width: 700px; max-height: 700px; background: #3b82f6; border-radius: 50%; animation-delay: -7s; }
      @keyframes floatBlob { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(40px, 40px) scale(1.05); } }

      /* Global Override: Convert Blurry Glass to Crisp Solid White Cards */
      .bg-white\\/40, .bg-white\\/50, .bg-white\\/60, .bg-white\\/80, .backdrop-blur-xl, .backdrop-blur-2xl, .backdrop-blur-3xl {
         background-color: #ffffff !important;
         backdrop-filter: none !important;
         -webkit-backdrop-filter: none !important;
         box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 12px 32px -8px rgba(15, 23, 42, 0.08) !important;
         border-color: rgba(15, 23, 42, 0.06) !important;
      }

      /* Global Override: Crisp Inputs */
      input, textarea, select {
        background-color: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
        transition: all 0.2s ease !important;
      }
      input:focus, textarea:focus, select:focus {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
      }

      /* Mobile Compact Fixes (Eliminates gaps & shrinks stats perfectly) */
      @media (max-width: 768px) {
         /* Shrink the top 4 stat cards into a tight 4-column grid */
         .grid.grid-cols-3.md\\:grid-cols-6 { 
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important; 
            gap: 0.5rem !important; 
            margin-bottom: 1rem !important;
         }
         .grid.grid-cols-3.md\\:grid-cols-6 > div.col-span-1 { 
            padding: 0.5rem !important; 
            min-height: auto !important; 
            align-items: center !important; 
            text-align: center !important; 
            justify-content: center !important;
         }
         .grid.grid-cols-3.md\\:grid-cols-6 > div.col-span-1 > div:first-child { 
            justify-content: center !important; 
            margin-bottom: 0.25rem !important; 
         }
         .grid.grid-cols-3.md\\:grid-cols-6 > div.col-span-1 .w-6.h-6 { width: 1.25rem !important; height: 1.25rem !important; }
         .grid.grid-cols-3.md\\:grid-cols-6 > div.col-span-1 .text-lg { font-size: 1rem !important; margin-bottom: 0 !important; }
         .grid.grid-cols-3.md\\:grid-cols-6 > div.col-span-1 .text-\\[8px\\] { font-size: 0.6rem !important; letter-spacing: 0 !important; }
         
         /* Reduce all large margins/paddings */
         .gap-8 { gap: 1rem !important; }
         .mb-8 { margin-bottom: 1rem !important; }
         .py-8 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
         .p-8 { padding: 1.25rem !important; }
         .px-6 { padding-left: 1rem !important; padding-right: 1rem !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
    </div>
  );
}

// --- Weather Widget Component ---
function WeatherWidget({ location, isMobileBox }) {
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'Sunny',
    humidity: 65,
    wind: 12,
    forecast: [
      { day: 'Mon', temp: 28, icon: <Sun className="w-3 h-3 md:w-6 md:h-6 text-amber-400 drop-shadow-md" /> },
      { day: 'Tue', temp: 27, icon: <CloudRain className="w-3 h-3 md:w-6 md:h-6 text-blue-400 drop-shadow-md" /> },
      { day: 'Wed', temp: 29, icon: <Sun className="w-3 h-3 md:w-6 md:h-6 text-amber-400 drop-shadow-md" /> },
    ]
  });

  if (isMobileBox) {
     return (
        <div className="md:hidden col-span-1 bg-white/60 backdrop-blur-xl p-2.5 rounded-[1rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:-translate-y-1 transition-transform flex flex-col justify-between relative overflow-hidden min-h-[90px]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-300/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between mb-1 relative z-10">
            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-amber-500 shadow-sm">
              <Sun className="w-3.5 h-3.5 animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="text-[7px] font-bold text-slate-500 flex flex-col items-end">
              <span className="flex items-center gap-0.5"><Droplets className="w-2 h-2 text-blue-400"/> {weather.humidity}%</span>
              <span className="flex items-center gap-0.5 mt-0.5"><Wind className="w-2 h-2 text-emerald-400"/> {weather.wind}k</span>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="text-xl font-black text-slate-800 mb-0 leading-none">{weather.temp}°</div>
            <div className="text-slate-500 font-bold text-[8px] leading-tight truncate">{weather.condition}</div>
          </div>
        </div>
     );
  }

  return (
    <div className="hidden md:flex bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-8 text-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] relative overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex-row justify-between items-center gap-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>

      <div className="relative z-10 flex items-center gap-6 w-auto">
        <div className="w-20 h-20 bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-100 shrink-0">
          <Sun className="w-10 h-10 text-amber-400 animate-[spin_10s_linear_infinite]" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight text-slate-800">{weather.temp}°</span>
            <span className="text-xl font-bold text-slate-500">{weather.condition}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold text-base">{location || 'Farm Location'}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-auto gap-8 divide-x divide-slate-300/50">
        <div className="flex flex-col items-center px-4">
          <Droplets className="w-6 h-6 text-blue-400 drop-shadow-sm mb-2" />
          <span className="text-xl font-extrabold text-slate-700">{weather.humidity}%</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Humidity</span>
        </div>
        <div className="flex flex-col items-center px-4">
          <Wind className="w-6 h-6 text-emerald-400 drop-shadow-sm mb-2" />
          <span className="text-xl font-extrabold text-slate-700">{weather.wind} km/h</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Wind</span>
        </div>
      </div>

      <div className="relative z-10 flex gap-4 bg-white/50 border border-white/60 p-3 rounded-3xl backdrop-blur-md shadow-sm">
        {weather.forecast.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1 w-16">
            <span className="text-xs font-bold text-slate-400">{day.day}</span>
            <div className="my-1">{day.icon}</div>
            <span className="font-extrabold text-slate-700 text-sm">{day.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Mandi Ticker Component ---
function MandiTicker() {
  const { t } = useContext(LanguageContext);
  // Realistic Agmarknet Rates Data
  const rates = [
    { crop: "Tomato", gradeA: 24, gradeB: 18, gradeC: 12, trend: 'up' },
    { crop: "Onion", gradeA: 35, gradeB: 25, gradeC: 15, trend: 'down' },
    { crop: "Potato", gradeA: 22, gradeB: 16, gradeC: 10, trend: 'stable' },
    { crop: "Spinach", gradeA: 45, gradeB: 30, gradeC: 20, trend: 'up' },
    { crop: "Carrot", gradeA: 50, gradeB: 35, gradeC: 25, trend: 'up' },
    { crop: "Cauliflower", gradeA: 38, gradeB: 25, gradeC: 18, trend: 'down' },
    { crop: "Okra", gradeA: 42, gradeB: 30, gradeC: 20, trend: 'stable' },
  ];

  return (
    <div className="bg-white/40 backdrop-blur-md border-b border-white/60 text-slate-700 py-1 md:py-2 overflow-hidden relative shadow-sm z-30">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-white/90 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-white/90 z-10 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 md:gap-4 animate-[marquee_30s_linear_infinite] whitespace-nowrap px-2 md:px-4">
            <span className="text-[10px] md:text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> LIVE MARKET:
            </span>
            {rates.map((rate, i) => (
                <div key={i} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm px-2 md:px-4 border-r border-slate-300/50">
                    <span className="font-extrabold text-slate-800">{rate.crop}</span>
                    <span className="text-slate-500 font-medium">Gr A: ₹{rate.gradeA}</span>
                    <span className="text-emerald-600 font-extrabold">Gr B: ₹{rate.gradeB}</span>
                    <span className="text-amber-500 font-extrabold">Gr C: ₹{rate.gradeC}</span>
                </div>
            ))}
            {rates.map((rate, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm px-2 md:px-4 border-r border-slate-300/50">
                    <span className="font-extrabold text-slate-800">{rate.crop}</span>
                    <span className="text-slate-500 font-medium">Gr A: ₹{rate.gradeA}</span>
                    <span className="text-emerald-600 font-extrabold">Gr B: ₹{rate.gradeB}</span>
                    <span className="text-amber-500 font-extrabold">Gr C: ₹{rate.gradeC}</span>
                </div>
            ))}
        </div>
        <style>{`
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        `}</style>
    </div>
  );
}

// --- QR Code Modal ---
function QRCodeModal({ listing, onClose }) {
  const qrData = JSON.stringify({
    id: listing.id,
    name: listing.name,
    quantity: listing.quantity,
    price: listing.price,
    grade: listing.grade,
    farmerId: listing.farmerId,
    farmerName: listing.farmerName || 'Unknown Farmer',
    farmName: listing.farmName || 'Unknown Farm',
    farmLocation: listing.farmLocation || 'Unknown Location',
    timestamp: new Date().toISOString()
  });

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${listing.id}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `${listing.name.replace(/\s+/g, '_')}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] w-full max-w-sm md:max-w-md overflow-hidden transform scale-100 transition-all max-h-[90vh] flex flex-col">
        <div className="p-5 md:p-6 text-center border-b border-white/50 bg-white/40">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
            Product Code
          </h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">Scan to verify authenticity</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center overflow-y-auto">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <QRCode
              id={`qr-${listing.id}`}
              value={qrData}
              size={200}
              level="H"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>

          <div className="w-full bg-emerald-50/50 backdrop-blur-sm rounded-2xl p-4 mb-6 text-left border border-emerald-100/50">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-slate-500 font-bold">Product:</span>
              <span className="font-extrabold text-slate-800 text-right">{listing.name}</span>
              
              <span className="text-slate-500 font-bold">Grade:</span>
              <span className="font-extrabold text-emerald-600 text-right">{listing.grade}</span>
              
              <span className="text-slate-500 font-bold">Quantity:</span>
              <span className="font-extrabold text-slate-800 text-right">{listing.quantity} kg</span>
              
              <span className="text-slate-500 font-bold">Farm:</span>
              <span className="font-extrabold text-slate-800 text-right truncate">{listing.farmName || 'Unknown'}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-200/50 flex justify-between text-xs text-slate-400 font-bold">
              <span>ID</span>
              <span className="font-mono">{listing.id.substring(0, 12)}...</span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={downloadQR}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95 text-sm md:text-base"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 bg-white/60 hover:bg-white backdrop-blur-md text-slate-700 border border-white/80 shadow-sm py-3 px-4 rounded-2xl font-bold transition-all active:scale-95 text-sm md:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- NEW PRICE DISCOVERY MODAL COMPONENT ---
function PriceDiscoveryModal({ listing, onClose, onConfirm, setListing, mandiRates }) {
    // Dynamically match the crop to real Agmarknet data
    const matchedCrop = mandiRates.find(r => r.crop.toLowerCase() === (listing.name || '').toLowerCase()) || { gradeA: 25, gradeB: 18, gradeC: 12 };
    
    // Live Market rate for this grade
    const marketRate = listing.grade === 'B' ? matchedCrop.gradeB : matchedCrop.gradeC;
    const gradeA_Rate = matchedCrop.gradeA;
    
    // User's chosen price (editable)
    const userPrice = parseFloat(listing.price) || marketRate;
    
    // Middleman typically gives ~30% of Grade A price
    const middlemanPrice = Math.max(1, Math.floor(gradeA_Rate * 0.30));
    const multiplier = (userPrice / middlemanPrice).toFixed(1);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-all">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 shrink-0 bg-white relative z-10">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Price Discovery</h2>
                        <p className="text-slate-500 text-xs md:text-sm font-medium mt-0.5">Know the right price. Sell with confidence.</p>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6 bg-slate-50/50 flex-1">
                    
                    {/* Live Mandi Card */}
                    <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-[1.5rem] p-4 md:p-5 relative overflow-hidden shadow-sm">
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center border-2 border-[#10b981] shadow-sm shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-black text-slate-800 text-sm md:text-base">Live Mandi Price — {listing.name || 'Produce'}, Grade {listing.grade}</h3>
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>Live
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-3 mt-1 md:mt-2">
                                    <span className="text-3xl md:text-4xl font-black text-slate-900">₹{marketRate} <span className="text-lg md:text-xl font-bold text-slate-500">/ kg</span></span>
                                    <span className="text-emerald-600 font-black text-sm md:text-base flex items-center">▲ +12%</span>
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-2">Agmarknet Rate • Updated 2 min ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Comparison Card */}
                    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 md:p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4 md:mb-5">
                            <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-1">Price Comparison <Info className="w-4 h-4 text-slate-400"/></h3>
                            <span className="text-xs font-bold text-slate-600 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">Per kg ▾</span>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Middleman Row */}
                            <div className="flex items-center gap-3">
                                <span className="w-24 text-xs font-bold text-slate-600">Middleman</span>
                                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-400 rounded-full w-1/5"></div>
                                </div>
                                <span className="w-6 text-right font-black text-slate-800">₹{middlemanPrice}</span>
                            </div>
                            {/* Mandi Row */}
                            <div className="flex items-center gap-3">
                                <span className="w-24 text-xs font-bold text-slate-600">Local Mandi (Gr A)</span>
                                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full w-3/5"></div>
                                </div>
                                <span className="w-6 text-right font-black text-slate-800">₹{gradeA_Rate}</span>
                            </div>
                            {/* KhetFlow Row */}
                            <div className="flex items-center gap-3">
                                <span className="w-24 text-xs font-bold text-slate-800">Your Ask Price</span>
                                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                                </div>
                                <span className="w-6 text-right font-black text-slate-800">₹{userPrice}</span>
                            </div>
                        </div>

                        <div className="mt-5 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                            <p className="text-xs text-slate-600 font-medium">You can get up to <span className="text-emerald-700 font-bold">{multiplier}x higher price</span> than selling to a middleman.</p>
                        </div>
                    </div>

                    {/* Your Produce Card */}
                    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 md:p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Your Produce</h3>
                        </div>

                        <div className="flex gap-4">
                            {/* Image Preview Area */}
                            <div className="w-28 h-28 rounded-xl overflow-hidden relative shrink-0 bg-slate-100 border border-slate-200">
                                {listing.imagePreview ? (
                                    <img src={listing.imagePreview} alt="Produce" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Camera className="w-8 h-8 text-slate-300"/></div>
                                )}
                                <div className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-black text-slate-800 shadow-sm border border-white">
                                    Grade {listing.grade} • {listing.quantity || '0'} kg
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="flex-1 flex flex-col justify-center">
                                <label className="text-xs font-bold text-emerald-700 flex items-center gap-1 mb-1.5"><Wand2 className="w-3 h-3"/> AI Suggested Price</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={listing.price} 
                                        onChange={(e) => setListing({...listing, price: e.target.value})}
                                        className="w-full bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-2xl font-black text-emerald-900 shadow-inner"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-lg">/kg</span>
                                </div>
                                <p className="text-[9px] md:text-[10px] text-slate-500 font-medium mt-2 leading-tight">Based on live mandi data (Agmarknet) and market demand. Editable.</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Footer Action */}
                <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
                    <button 
                        onClick={onConfirm} 
                        className="w-full bg-[#1e7b51] hover:bg-[#155e3e] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                        <UploadCloud className="w-5 h-5" />
                        List at Fair Price
                    </button>
                    <p className="text-center text-[9px] md:text-[10px] text-slate-500 font-medium mt-3">Get better buyers. Reduce waste. Support a fairer food system.</p>
                </div>

            </div>
        </div>
    );
}

// --- AI BATCH Camera Modal Component (Dots & Selectable Listings) ---
function AICameraModal({ onClose, onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); 
  const [stream, setStream] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please allow camera access to use the AI Scanner.");
    }
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null); }
  };

  const captureBatchAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    const MAX_WIDTH = 1024; 
    const scale = MAX_WIDTH / video.videoWidth;
    canvas.width = MAX_WIDTH;
    canvas.height = video.videoHeight * scale;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`, // Replace in prod
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "qwen/qwen3.8-27b", 
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: "You are an agricultural AI batch scanner. Analyze this crate of mixed produce. Return ONLY a valid JSON object with no markdown. 1. Identify all types of produce visible. 2. For each type, estimate the total Grade B and Grade C counts. 3. Map EVERY SINGLE visible item across the image by estimating their X and Y coordinates (as a percentage from 0 to 100, where x:0, y:0 is top-left). CRITICAL INSTRUCTION: You must generate a coordinate entry in the 'items' array for EVERY item you count. If you estimate 40 items total, there MUST be 40 coordinate objects in the 'items' array distributed accurately over the produce. Do not provide a sample; map every item. Use this EXACT format: {\"batches\": [{\"crop_name\": \"Onion\", \"grade_b_count\": 35, \"grade_c_count\": 10}], \"items\": [{\"x\": 45, \"y\": 60, \"grade\": \"C\", \"crop_name\": \"Onion\"}, {\"x\": 20, \"y\": 30, \"grade\": \"B\", \"crop_name\": \"Onion\"}]}" 
                },
                { 
                  type: "image_url", 
                  image_url: { url: base64Image } 
                }
              ]
            }
          ],
          temperature: 0.1,
          max_tokens: 1000 
        })
      });

      const data = await response.json();

      if (data.error) {
          throw new Error(data.error.message);
      }

      let rawContent = data.choices[0].message.content;
      rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const resultObj = JSON.parse(rawContent);

      const mappedBatches = (resultObj.batches || []).map(b => ({ ...b, isSelected: true }));

      setReviewData({
          image: base64Image,
          batches: mappedBatches,
          items: resultObj.items || []
      });
      
      stopCamera();

    } catch (error) {
      console.error("Batch Scan Error:", error);
      alert("Failed to analyze batch. Ensure the image is clear and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleBatchSelection = (index) => {
      const newBatches = [...reviewData.batches];
      newBatches[index].isSelected = !newBatches[index].isSelected;
      setReviewData({...reviewData, batches: newBatches});
  };

  const handleConfirmAndList = () => {
      if (!reviewData) return;

      const selectedBatches = reviewData.batches.filter(b => b.isSelected);

      if (selectedBatches.length === 0) {
          alert("Please select at least one produce batch to list.");
          return;
      }

      const finalItemsToLog = [];

      selectedBatches.forEach(batch => {
          const bCount = parseInt(batch.grade_b_count) || 0;
          const cCount = parseInt(batch.grade_c_count) || 0;
          
          if(bCount > 0) finalItemsToLog.push({ name: batch.crop_name, grade: "B", count: bCount, weight: bCount * 0.15, image: reviewData.image });
          if(cCount > 0) finalItemsToLog.push({ name: batch.crop_name, grade: "C", count: cCount, weight: cCount * 0.15, image: reviewData.image });
      });

      onComplete(finalItemsToLog);
  };

  // ==========================================
  // VIEW 1: AR REVIEW SCREEN
  // ==========================================
  if (reviewData) {
      return (
          <div className="fixed inset-0 z-[150] bg-slate-900 flex flex-col animate-in fade-in">
              <div className="p-4 flex justify-between items-center bg-slate-900 text-white shadow-md relative z-10">
                  <div className="flex items-center gap-2">
                      <Aperture className="w-5 h-5 text-emerald-400" />
                      <span className="font-extrabold tracking-wide">AI Batch Audit</span>
                  </div>
                  <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <X className="w-5 h-5" />
                  </button>
              </div>

              {/* Image Container with DOT AR Overlays */}
              <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
                  <div className="relative w-full max-w-lg">
                      <img src={reviewData.image} alt="Batch" className="w-full h-auto object-contain" />
                      
                      {/* Draw Clean Color Dots */}
                      {reviewData.items.map((item, idx) => (
                          <div 
                              key={idx}
                              className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full border border-white/50 shadow-[0_0_8px_rgba(0,0,0,0.6)] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group cursor-pointer animate-in zoom-in ${item.grade === 'C' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ left: `${item.x}%`, top: `${item.y}%` }}
                          >
                              {/* Tooltip on hover */}
                              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-white text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${item.grade === 'C' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                                  {item.crop_name} Grade {item.grade}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Bottom Action Panel */}
              <div className="bg-white rounded-t-[2.5rem] p-6 pb-8 shadow-2xl relative z-20 -mt-6 max-h-[55vh] overflow-y-auto">
                  <h3 className="text-xl font-black text-slate-800 mb-4 border-b border-slate-100 pb-3">Select Produce to List</h3>
                  
                  {/* Selectable List of Mixed Produce */}
                  <div className="space-y-3 mb-6">
                      {reviewData.batches.map((batch, idx) => (
                          <div 
                              key={idx} 
                              onClick={() => toggleBatchSelection(idx)}
                              className={`flex justify-between items-center p-3 md:p-4 rounded-2xl border cursor-pointer transition-all ${batch.isSelected ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}
                          >
                              <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${batch.isSelected ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-slate-300'}`}>
                                      {batch.isSelected && <Check className="w-3.5 h-3.5" />}
                                  </div>
                                  <span className="font-extrabold text-slate-700 text-sm md:text-base">{batch.crop_name}</span>
                              </div>
                              <div className="flex gap-4">
                                  <div className="flex items-center gap-1.5">
                                      <span className={`text-sm font-black ${batch.isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>{batch.grade_b_count}</span>
                                      <span className="text-[10px] font-bold text-slate-400">Gr B</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                                      <span className={`text-sm font-black ${batch.isSelected ? 'text-rose-500' : 'text-slate-400'}`}>{batch.grade_c_count}</span>
                                      <span className="text-[10px] font-bold text-slate-400">Gr C</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="flex gap-3">
                      <button 
                          onClick={() => { setReviewData(null); startCamera(); }}
                          className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-colors active:scale-95 text-sm md:text-base"
                      >
                          Retake
                      </button>
                      <button 
                          onClick={handleConfirmAndList}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
                      >
                          <CheckCircle2 className="w-5 h-5" /> List Selected
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // ==========================================
  // VIEW 2: CAMERA CAPTURE SCREEN
  // ==========================================
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full h-[85vh] bg-black flex flex-col justify-center items-center overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             <Aperture className="w-5 h-5 text-emerald-400" />
             <span className="text-white font-extrabold tracking-wide text-sm">Batch Scanner</span>
          </div>
          <button onClick={onClose} className="bg-black/40 p-2 rounded-full text-white border border-white/10">
              <X className="w-5 h-5" />
          </button>
        </div>

        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-8">
           <div className="relative w-full max-w-md aspect-[4/3] border-2 border-dashed border-white/40 rounded-2xl flex items-center justify-center bg-white/5">
              {isAnalyzing ? (
                  <div className="flex flex-col items-center">
                      <ScanLine className="w-10 h-10 text-emerald-400 mb-3 animate-pulse" />
                      <span className="text-emerald-400 font-black text-sm uppercase tracking-widest text-center px-4 drop-shadow-md">Inspecting Quality...</span>
                  </div>
              ) : (
                  <span className="text-white/60 font-black text-sm uppercase tracking-widest text-center px-4 drop-shadow-md">
                     Align crate inside frame
                  </span>
              )}
           </div>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-40">
           <button 
             onClick={captureBatchAndAnalyze}
             disabled={isAnalyzing}
             className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${isAnalyzing ? 'border-slate-500 bg-slate-600/50' : 'border-white bg-white/20 hover:bg-white/40 active:scale-95'}`}
           >
              <div className={`w-14 h-14 rounded-full ${isAnalyzing ? 'bg-slate-400' : 'bg-white'}`}></div>
           </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-[2.5rem] p-6 flex flex-col justify-center items-center z-30 -mt-6">
          <h3 className="text-slate-800 font-black text-xl mb-1">AI Mixed Batch Audit</h3>
          <p className="text-slate-500 font-medium text-sm text-center max-w-sm"> The AI will audit, count, and assign grades automatically.</p>
      </div>
    </div>
  );
}

// --- LIVE TRACKING MAP MODAL (OPENSTREETMAP VIA LEAFLET) ---
function LiveTrackingModal({ order, onClose }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let target = 15; 
    if (order.status === 'picked') target = 65; 
    if (order.status === 'delivered') target = 100; 
    setProgress(target);

    const initMap = () => {
      if (mapRef.current || !mapContainerRef.current) return;
      
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([28.6139, 77.2090], 12);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const hash = order.id.charCodeAt(0) || 0;
      const farmPos = [28.5355 + (hash * 0.001), 77.3910 - (hash * 0.001)]; 
      const hubPos = [28.7041 - (hash * 0.001), 77.1025 + (hash * 0.001)]; 
      
      window.L.polyline([farmPos, hubPos], { color: '#10b981', weight: 5, dashArray: '10, 10' }).addTo(map);

      const dotIcon = (color) => window.L.divIcon({
        html: `<div style="background: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: '', iconSize: [16, 16], iconAnchor: [8, 8]
      });
      window.L.marker(farmPos, { icon: dotIcon('#10b981') }).addTo(map).bindPopup('Farm Origin');
      window.L.marker(hubPos, { icon: dotIcon('#3b82f6') }).addTo(map).bindPopup('Buyer Destination');

      const truckIcon = window.L.divIcon({
        html: `<div style="background: white; border: 3px solid #10b981; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 1000;">🚚</div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const currentLat = farmPos[0] + (hubPos[0] - farmPos[0]) * (target / 100);
      const currentLng = farmPos[1] + (hubPos[1] - farmPos[1]) * (target / 100);

      markerRef.current = window.L.marker([currentLat, currentLng], { icon: truckIcon }).addTo(map);
      
      map.fitBounds(window.L.latLngBounds(farmPos, hubPos).pad(0.3));
      mapRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    };

    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [order]);

  const progressPercent = progress;
  const isFarmerDriving = order.farmerSelfDelivery;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex flex-col border border-white/60">
        
        <div className="p-5 md:p-6 bg-white/40 border-b border-white/60 flex justify-between items-center shadow-sm relative z-20">
          <div>
            <h2 className="font-extrabold flex items-center gap-2 text-lg md:text-2xl text-slate-800">
               <Map className="w-6 h-6 md:w-8 md:h-8 text-emerald-500"/> Live Order Tracking 📍
            </h2>
            <p className="text-slate-500 font-bold text-xs md:text-sm mt-1">Order ID: #{order.id.slice(0,8)}</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/60 border border-white/80 shadow-sm rounded-full hover:bg-white text-slate-600 transition-all">
             <X className="w-5 h-5 md:w-6 md:h-6"/>
          </button>
        </div>

        <div className="relative h-64 md:h-96 w-full bg-slate-100 z-0 border-y border-slate-200">
           <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0"></div>
           
           <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md text-emerald-600 font-extrabold text-xs px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-2">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span> Live GPS Active
           </div>
        </div>

        <div className="p-6 md:p-8 bg-white/60 backdrop-blur-md relative z-20">
           <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-1 space-y-4">
                 <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-200/50 pb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-500"/> Delivery Details
                 </h3>
                 <div className="grid grid-cols-2 gap-5 text-sm">
                    <div className="bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm">
                       <span className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Buyer</span>
                       <span className="font-extrabold text-slate-800 text-base">{order.businessName || 'Business Client'}</span>
                    </div>
                    <div className="bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm">
                       <span className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Delivery Address</span>
                       <span className="font-extrabold text-slate-800 text-base truncate block">{order.deliveryAddress || 'Verified Hub Location'}</span>
                    </div>
                    <div className="bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm">
                       <span className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Total Amount</span>
                       <span className="font-extrabold text-emerald-600 text-lg">
                          ₹{order.items?.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0) * 0.9}
                       </span>
                    </div>
                    <div className="bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm">
                       <span className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">ETA</span>
                       <span className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                          <Timer className="w-4 h-4 text-orange-400"/> 
                          {progress === 100 ? 'Delivered' : 'Arriving Soon'}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200/50 pt-6 md:pt-0 md:pl-8">
                 <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-200/50 pb-3 mb-5">Current Status</h3>
                 <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-slate-200/50">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 relative z-10 shadow-md border-4 border-white"><Check className="w-5 h-5"/></div>
                          <span className="font-extrabold text-slate-700 text-base">Order Packed</span>
                       </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-md border-4 border-white transition-colors duration-500 ${progress >= 65 ? 'bg-emerald-100 text-emerald-500' : 'bg-slate-100 text-slate-300'}`}>
                             {progress >= 65 ? <Check className="w-5 h-5"/> : <Truck className="w-4 h-4"/>}
                          </div>
                          <span className={`font-extrabold text-base transition-colors duration-500 ${progress >= 65 ? 'text-slate-700' : 'text-slate-400'}`}>Out for Delivery</span>
                       </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-md border-4 border-white transition-colors duration-500 ${progress >= 100 ? 'bg-emerald-100 text-emerald-500' : 'bg-slate-100 text-slate-300'}`}>
                             {progress >= 100 ? <Check className="w-5 h-5"/> : <MapPin className="w-4 h-4"/>}
                          </div>
                          <span className={`font-extrabold text-base transition-colors duration-500 ${progress >= 100 ? 'text-slate-700' : 'text-slate-400'}`}>Delivered Successfully</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- Chatbot Component ---
function Chatbot() {
  const { lang } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const content = BOT_TRANSLATIONS[lang] || BOT_TRANSLATIONS['en'];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ type: 'bot', text: content.welcome }]);
    }
  }, [lang, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleOptionClick = (option) => {
    const userMsg = { type: 'user', text: option.text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'bot', text: content.answers[option.id] }]);
    }, 1200);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const userMsg = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    const lowerInput = inputText.toLowerCase();
    let responseId = 'default';
    
    if (lowerInput.includes('sell') || lowerInput.includes('bechna') || lowerInput.includes('bikri')) responseId = 'sell';
    else if (lowerInput.includes('score') || lowerInput.includes('credit')) responseId = 'score';
    else if (lowerInput.includes('loan') || lowerInput.includes('money') || lowerInput.includes('paisa')) responseId = 'loan';
    else if (lowerInput.includes('pay') || lowerInput.includes('status')) responseId = 'payment';
    else if (lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('call')) responseId = 'support';
    else if (lowerInput.includes('scan') || lowerInput.includes('camera') || lowerInput.includes('ai')) responseId = 'scan';

    setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'bot', text: content.answers[responseId] }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className={`pointer-events-auto bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/60 w-[90vw] md:w-96 h-[500px] mb-4 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          
          <div className="bg-white/50 backdrop-blur-md border-b border-white/60 p-4 flex justify-between items-center text-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/60 backdrop-blur-md p-1.5 rounded-full flex items-center justify-center border border-white/80 shadow-sm">
                <Bot className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-wide">{content.title}</h3>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1.5 font-bold bg-emerald-100/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full w-fit border border-emerald-200">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/80 p-2 rounded-full transition-colors relative z-10 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scrollbar-thin scrollbar-thumb-slate-200">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center mr-2 mt-auto shrink-0 border border-white shadow-sm">
                        <Bot className="w-4 h-4 text-emerald-500" />
                    </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm leading-relaxed font-semibold ${
                  msg.type === 'user' 
                    ? 'bg-emerald-500 text-white rounded-br-none shadow-emerald-200' 
                    : 'bg-white/80 backdrop-blur-sm text-slate-700 border border-white/60 rounded-bl-none shadow-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center mr-2 mt-auto shrink-0 border border-white shadow-sm">
                        <Bot className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 bg-white/40 backdrop-blur-sm border-t border-white/60 overflow-x-auto whitespace-nowrap scrollbar-hide">
             <div className="flex gap-2 pb-1">
                {content.options.map(opt => (
                    <button 
                        key={opt.id}
                        onClick={() => handleOptionClick(opt)}
                        className="px-3 py-1.5 bg-white/80 backdrop-blur-md text-emerald-700 text-xs font-extrabold rounded-full border border-white shadow-sm hover:bg-emerald-50 transition-all active:scale-95"
                    >
                        {opt.text}
                    </button>
                ))}
             </div>
          </div>

          <div className="p-3 bg-white/60 backdrop-blur-md border-t border-white/80 flex gap-2 items-center">
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={content.placeholder}
                className="flex-1 bg-white/80 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-400 font-bold text-slate-800 shadow-inner"
            />
            <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
                <Send className="w-5 h-5" />
            </button>
          </div>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/80 text-emerald-600 p-4 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all hover:scale-110 active:scale-95 group relative z-50 ${isOpen ? 'rotate-90 bg-slate-800 text-white border-slate-700' : ''}`}
      >
        {isOpen ? (
          <X className="w-7 h-7 transition-transform duration-300 -rotate-90" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-400 rounded-full border-2 border-white animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
}

// --- Custom UI Components ---
function PremiumButton({ children, onClick, variant = 'primary', loading = false, disabled = false, fullWidth = false, size = 'md', icon, style = {}, ...props }) {
  const variants = {
    primary: { background: '#10b981', color: 'white', border: 'none' },
    success: { background: '#10b981', color: 'white', border: 'none' },
    danger: { background: '#ef4444', color: 'white', border: 'none' },
    ghost: { background: 'transparent', border: '1px solid #cbd5e1', color: '#334155' },
    outline: { background: 'transparent', border: '2px solid #10b981', color: '#10b981' }
  };
  const sizes = { sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' }, md: { padding: '0.75rem 1.5rem', fontSize: '0.95rem' }, lg: { padding: '0.85rem 2rem', fontSize: '1rem' } };

  return (
    <button
      onClick={onClick} disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 rounded-[1rem] font-bold transition-all ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]'}`}
      style={{ ...variants[variant], ...sizes[size], width: fullWidth ? '100%' : 'auto', ...style }}
      {...props}
    >
      {loading ? '⏳ Processing...' : <>{icon && <span>{icon}</span>}<span>{children}</span></>}
    </button>
  );
}

function PremiumInput({ label, error, icon, helperText, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full space-y-1">
      {label && <label className="block text-sm font-bold text-slate-700">{label}</label>}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-4 text-slate-400 z-10">{icon}</div>}
        <input
          {...props}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          className={`w-full bg-white border ${
            error ? 'border-rose-400 focus:ring-rose-400/20' 
            : isFocused ? 'border-emerald-500 focus:ring-emerald-500/20' 
            : 'border-slate-200'
          } rounded-xl px-4 py-3 ${icon ? 'pl-11' : ''} outline-none focus:ring-4 font-medium text-slate-800 placeholder:text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all text-sm md:text-base`}
        />
      </div>
      {error && <p className="text-xs font-bold text-rose-500 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs font-bold text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
}

// --- Landing Page Component ---
function FarmerLanding() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { t } = useContext(LanguageContext);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <AnimatedBackground />
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
        <LanguageSelector />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col items-center text-center">
        <div className="w-24 h-24 md:w-40 md:h-40 mb-6 md:mb-8 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transform hover:rotate-6 transition-transform duration-500">
           <Leaf className="w-12 h-12 md:w-20 md:h-20 text-emerald-500 drop-shadow-md" strokeWidth={2} />
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-slate-800 leading-tight">
          KhetFlow <span className="text-emerald-500 bg-clip-text">Farmer</span> 👩🏽‍🌾
        </h1>

        <p className="text-lg md:text-2xl text-slate-600 font-bold mb-4">
          {t('heroSubtitle')}
        </p>

        <p className="text-base md:text-lg text-slate-500 font-medium mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
          {t('heroDesc')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mb-8 md:mb-12 px-2">
          {[
            { label: t('betterPrices'), value: '+35%', icon: <IndianRupee className="w-8 h-8 md:w-10 md:h-10" />, color: 'text-emerald-600', bg: 'bg-white/60', border: 'border-white/80', desc: 'Than throwing away' },
            { label: t('zeroWaste'), value: '100%', icon: <Leaf className="w-8 h-8 md:w-10 md:h-10" />, color: 'text-green-600', bg: 'bg-white/60', border: 'border-white/80', desc: 'Sell all imperfect produce' },
            { label: t('happyBuyers'), value: '1.2k+', icon: <ShoppingBag className="w-8 h-8 md:w-10 md:h-10" />, color: 'text-teal-600', bg: 'bg-white/60', border: 'border-white/80', desc: 'Businesses save money' }
          ].map((stat, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`p-6 md:p-8 rounded-[2.5rem] backdrop-blur-xl border transition-all duration-300 cursor-default ${stat.bg} ${stat.border} ${hoveredCard === i ? 'shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] -translate-y-1' : 'shadow-sm'}`}
            >
              <div className={`mb-4 ${stat.color} drop-shadow-sm`}>{stat.icon}</div>
              <div className={`text-3xl md:text-4xl font-extrabold mb-2 ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-800 font-extrabold text-lg mb-1">{stat.label}</div>
              <div className="text-slate-500 font-bold text-sm">{stat.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/login')}
          className="group relative bg-white/80 backdrop-blur-xl border-2 border-white text-emerald-600 text-lg md:text-xl font-extrabold py-4 md:py-5 px-8 md:px-10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">{t('startSelling')}</span>
          <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}


// --- Auth Page  ---
function AuthPage({ isLogin }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  
  const [form, setForm] = useState({
    identifier: '', 
    password: '',
    farmerName: '',
    farmName: '',
    location: '',
    hasTransport: false 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let loginEmail = form.identifier;
      
      if (!loginEmail.includes('@')) {
        const digits = loginEmail.replace(/[^0-9]/g, '');
        if (digits.length < 10) throw new Error("Please enter a valid mobile number or email.");
        loginEmail = `${digits}@farmer.khetflow.com`;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, loginEmail, form.password);
        navigate('/dashboard');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, loginEmail, form.password);
        await setDoc(doc(db, 'farmers', userCred.user.uid), {
          farmerName: form.farmerName,
          farmName: form.farmName,
          email: loginEmail,
          phone: form.identifier.includes('@') ? '' : form.identifier, 
          location: form.location,
          userType: 'farmer',
          hasTransport: form.hasTransport, 
          totalEarnings: 0,
          pendingEarnings: 0,
          createdAt: serverTimestamp()
        });
        navigate('/dashboard');
      }
    } catch (err) {
      let errorMsg = err.message.replace('Firebase: ', '').replace('auth/', '');
      if (errorMsg.includes('invalid-credential')) errorMsg = "Incorrect Mobile/Email or Password/PIN.";
      if (errorMsg.includes('email-already-in-use')) errorMsg = "This Account is already registered.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-x-hidden overflow-y-auto font-sans">
      <AnimatedBackground />
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center relative z-10 py-10">
        
        
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 animate-in slide-in-from-bottom-8 duration-500 delay-100">
          <div className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 bg-emerald-500 rounded-[1rem] md:rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Leaf className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-3 md:mb-4 leading-tight tracking-tight">
            KhetFlow <span className="text-emerald-500">Farmer</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mb-8 md:mb-10 max-w-md leading-relaxed">
            Sell Grade B & C produce that would otherwise go to waste. Zero waste, better income, happy planet.
          </p>

          {/* 3 Square Stats Layout */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-md hidden md:grid">
            {[
              { label: 'BETTER PRICES', value: '+35%', icon: <IndianRupee className="w-5 h-5 md:w-6 md:h-6" />, color: 'text-emerald-600' },
              { label: 'ZERO WASTE', value: '100%', icon: <Leaf className="w-5 h-5 md:w-6 md:h-6" />, color: 'text-emerald-600' },
              { label: 'HAPPY BUYERS', value: '1.2k+', icon: <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />, color: 'text-emerald-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-[1.25rem] p-4 md:p-5 text-center transition-transform hover:-translate-y-1 shadow-[0_4px_12px_rgba(15,23,42,0.03)] border border-slate-100 flex flex-col items-center justify-center">
                <div className="mb-2 text-slate-400">{stat.icon}</div>
                <div className={`text-lg md:text-xl font-black leading-none mb-1 md:mb-1.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-slate-400 font-bold text-[8px] md:text-[9px] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="w-full max-w-md lg:w-1/2 flex justify-center order-1 lg:order-2">
          <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] border border-slate-100 p-6 md:p-10 w-full animate-in slide-in-from-bottom-4 duration-500">
            
            <div className="mb-6 md:mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-1.5 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 font-medium text-xs md:text-sm">
                {isLogin ? 'Enter your details to access the marketplace' : 'Register your details to start earning'}
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PremiumInput label="Your Name" name="farmerName" placeholder="John Doe" value={form.farmerName} onChange={(e) => setForm({...form, farmerName: e.target.value})} required />
                  <PremiumInput label="Farm Name" name="farmName" placeholder="Green Farms" value={form.farmName} onChange={(e) => setForm({...form, farmName: e.target.value})} required />
                </div>
              )}

              <PremiumInput label="Email or Phone Number" name="identifier" type="text" placeholder="name@company.com or 10-digit phone" icon={<Mail className="w-4 h-4 md:w-5 md:h-5" />} value={form.identifier} onChange={(e) => setForm({...form, identifier: e.target.value})} required />
              <PremiumInput label="Password" name="password" type="password" placeholder="••••••••" icon={<ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required helperText={!isLogin && "At least 6 characters"} />
              
              {!isLogin && (
                <div className="space-y-4">
                  <PremiumInput label="Farm Location" name="location" type="text" placeholder="City, State" icon={<MapPin className="w-4 h-4 md:w-5 md:h-5" />} value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required />
                  
                  <label className="flex items-center gap-3 text-sm text-slate-700 font-bold cursor-pointer">
                    <input type="checkbox" checked={form.hasTransport} onChange={(e) => setForm({...form, hasTransport: e.target.checked})} className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 rounded border-slate-300 focus:ring-emerald-400 accent-emerald-500" />
                    I have my own transport 
                  </label>
                </div>
              )}

              <PremiumButton type="submit" loading={loading} fullWidth size="lg" style={{ marginTop: '0.5rem' }}>
                 {isLogin ? 'Login Securely' : 'Create Account'}
              </PremiumButton>
            </form>

            <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-slate-500 font-medium">
              {isLogin ? "New to KhetFlow? " : "Already have an account? "}
             <button onClick={() => { navigate(isLogin ? '/register' : '/login'); setError(''); }} className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
  {isLogin ? 'Create an account' : 'Log in here'}
</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
// --- Protected Route ---
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <KhetFlowLoader />;
  }

  return user ? children : <Navigate to="/login" />;
}

// --- Dashboard Component ---
function Dashboard() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [user, setUser] = useState(null);
  const [farmerData, setFarmerData] = useState(null);
  const [view, setView] = useState('listings');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPriceDiscovery, setShowPriceDiscovery] = useState(false); // NEW STATE FOR PRICE DISCOVERY
  
  const [uploading, setUploading] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // NEW AUTO-SCAN STATE:
  const [scannedItems, setScannedItems] = useState([]);
  const [showBatchSummary, setShowBatchSummary] = useState(false);

  // Replaced handleDoneScanning with handleCameraComplete
  const handleCameraComplete = (batchesToList) => {
    setShowCameraModal(false);
    if (batchesToList && batchesToList.length > 0) {
        setScannedItems(batchesToList);
        setShowBatchSummary(true);
    }
  };

  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Vegetables');
  const [khetScore, setKhetScore] = useState(0); 
  
  // LIVE Transport State
  const [transportPools, setTransportPools] = useState([]);
  const [joinId, setJoinId] = useState(null);
  const [joinWeight, setJoinWeight] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  // Self Delivery State
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Live Tracking State 
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [showTrackingList, setShowTrackingList] = useState(false);

  // Realistic Market Mandi State
  const mandiRates = [
    { crop: "Tomato", gradeA: 24, gradeB: 18, gradeC: 12, trend: 'up' },
    { crop: "Onion", gradeA: 35, gradeB: 25, gradeC: 15, trend: 'down' },
    { crop: "Potato", gradeA: 22, gradeB: 16, gradeC: 10, trend: 'stable' },
    { crop: "Spinach", gradeA: 45, gradeB: 30, gradeC: 20, trend: 'up' },
    { crop: "Carrot", gradeA: 50, gradeB: 35, gradeC: 25, trend: 'up' },
    { crop: "Cauliflower", gradeA: 38, gradeB: 25, gradeC: 18, trend: 'down' },
    { crop: "Okra", gradeA: 42, gradeB: 30, gradeC: 20, trend: 'stable' },
    { crop: "Brinjal", gradeA: 30, gradeB: 20, gradeC: 12, trend: 'down' },
    { crop: "Ginger", gradeA: 120, gradeB: 85, gradeC: 60, trend: 'up' },
    { crop: "Garlic", gradeA: 150, gradeB: 110, gradeC: 75, trend: 'up' },
  ];
  const [searchTerm, setSearchTerm] = useState('');

  const [newListing, setNewListing] = useState({
    name: '',
    quantity: '',
    price: '',
    grade: 'B',
    description: '',
    imageFile: null,
    imagePreview: null,
    isFlashSale: false,
    flashSaleDiscount: 0,
    flashSaleEndTime: ''
  });

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        Promise.all([
          fetchFarmerData(user.uid),
          fetchListings(user.uid),
          fetchOrders(user.uid),
          calculateEarnings(user.uid)
        ]);
      }
      setLoading(false); 
    });
    return unsubscribe;
  }, []);

  // REAL-TIME FIREBASE LISTENER FOR TRUCKS
  useEffect(() => {
    const q = query(collection(db, 'transport_pools'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransportPools(data);
    });
    return () => unsubscribe();
  }, []);

  const fetchFarmerData = async (uid) => {
    try {
      const docRef = doc(db, 'farmers', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFarmerData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching farmer data:', error);
    }
  };

  const fetchListings = async (uid) => {
    try {
      const q = query(collection(db, 'listings'), where('farmerId', '==', uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const fetchOrders = async (uid) => {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const farmerOrders = allOrders.filter(order => 
        order.items && order.items.some(item => item.farmerId === uid)
      );
      
      setOrders(farmerOrders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      
      const deliveredOrders = farmerOrders.filter(order => order.status === 'delivered');
      const txns = deliveredOrders.map(order => {
        const farmerItems = order.items.filter(item => item.farmerId === uid);
        const orderTotal = farmerItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
        const earnings = (orderTotal * 0.9).toFixed(2);
        
        return {
          id: `TXN-${order.id.substring(0, 6).toUpperCase()}`,
          orderId: order.id,
          date: order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString(),
          amount: earnings,
          status: 'Completed',
          items: farmerItems.length
        };
      });
      setTransactions(txns);

    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateEarnings = async (uid) => {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      let delivered = 0;
      let pending = 0;
      let deliveredCount = 0;
      let uniqueCrops = new Set();

      allOrders.forEach(order => {
        if (order.items) {
          const farmerItems = order.items.filter(item => item.farmerId === uid);
          const orderTotal = farmerItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
          const farmerEarning = orderTotal * 0.9;

          farmerItems.forEach(item => uniqueCrops.add(item.name));

          if (order.status === 'delivered') {
            delivered += farmerEarning;
            deliveredCount++;
          } else if (order.status === 'picked' || order.status === 'pending') {
            pending += farmerEarning;
          }
        }
      });

      setTotalEarnings(delivered);
      setPendingEarnings(pending);

      let score = 0; 
      
      if (deliveredCount > 0) {
        let reliability = deliveredCount * 25;
        score += Math.min(reliability, 250);

        let volumeBonus = Math.floor(delivered / 1000) * 5; 
        score += Math.min(volumeBonus, 200);

        score += (uniqueCrops.size * 10);

        if (deliveredCount >= 5) score += 50;
        if (deliveredCount >= 10) score += 50;
      }
      
      if (score > 900) score = 900;
      setKhetScore(Math.floor(score));

      await setDoc(doc(db, 'farmers', uid), {
    totalEarnings: delivered,
    pendingEarnings: pending
}, { merge: true });
    } catch (error) {
      console.error('Error calculating earnings:', error);
    }
  };

  const markReadyForPickup = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        readyForPickup: true,
        readyAt: serverTimestamp(),
        farmerSelfDelivery: farmerData?.hasTransport || false 
      });
      alert('Order Updated Successfully! ');
      await fetchOrders(user.uid);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleStartDelivery = (order) => {
    setSelectedOrder(order);
    setShowVerificationModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert('Image too large! Please choose an image smaller than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewListing({
          ...newListing,
          imageFile: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // NEW METHOD: Intercepts form submission to open Price Discovery
  const handleAddListing = (e) => {
    e.preventDefault();
    
    let currentPrice = newListing.price;
    if (!currentPrice) {
        // Try to find the crop in mandiRates dynamically
        const matchedCrop = mandiRates.find(r => r.crop.toLowerCase() === newListing.name.toLowerCase());
        if (matchedCrop) {
            currentPrice = newListing.grade === 'B' ? matchedCrop.gradeB : matchedCrop.gradeC;
        } else {
            currentPrice = newListing.grade === 'B' ? 18 : 12; // Fallback
        }
    }
    
    setNewListing({...newListing, price: currentPrice});
    setShowPriceDiscovery(true);
  };

  // THE ACTUAL UPLOAD LOGIC
  const executeAddListing = async () => {
    setUploading(true);

    try {
      const finalPrice = newListing.isFlashSale 
        ? parseFloat(newListing.price) * (1 - parseFloat(newListing.flashSaleDiscount) / 100)
        : parseFloat(newListing.price);

      const listing = {
        farmerId: user.uid,
        farmerName: farmerData?.farmerName || 'Unknown',
        farmName: farmerData?.farmName || 'Unknown Farm',
        farmLocation: farmerData?.location || 'Unknown',
        name: newListing.name,
        quantity: parseFloat(newListing.quantity),
        price: finalPrice,
        originalPrice: parseFloat(newListing.price),
        grade: newListing.grade,
        image: newListing.imagePreview || '',
        icon: newListing.imagePreview || '',
        description: newListing.description,
        savings: newListing.grade === 'B' ? '40-50%' : '50-60%',
        status: 'active',
        isFlashSale: newListing.isFlashSale,
        flashSaleDiscount: newListing.isFlashSale ? parseFloat(newListing.flashSaleDiscount) : 0,
        flashSaleEndTime: newListing.isFlashSale ? newListing.flashSaleEndTime : null,
        createdAt: serverTimestamp(),
        hasTrackingCode: true
      };

      await addDoc(collection(db, 'listings'), listing);
      alert(' Product listed successfully! ');
      
      setNewListing({ 
        name: '', 
        quantity: '', 
        price: '', 
        grade: 'B', 
        description: '', 
        imageFile: null, 
        imagePreview: null, 
        isFlashSale: false, 
        flashSaleDiscount: 0, 
        flashSaleEndTime: '' 
      });
      
      setShowPriceDiscovery(false);
      setShowAddForm(false);
      await fetchListings(user.uid);

      // Check if there are more items to list from the batch
      if (scannedItems.length > 0) {
          setShowBatchSummary(true);
      }

    } catch (error) {
      alert('Error listing product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (confirm('Delete this listing?')) {
      try {
        await deleteDoc(doc(db, 'listings', listingId));
        alert(' Listing deleted successfully! ');
        await fetchListings(user.uid);
      } catch (error) {
        alert('Error deleting listing: ' + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // LIVE Transport Joining Logic
  const handleJoinPool = async (pool) => {
    if (!joinWeight || !pickupLocation) {
        alert("Please provide both weight and pickup location on the highway.");
        return;
    }
    const weight = parseInt(joinWeight);
    if (pool.filledCapacity + weight > pool.totalCapacity) {
      alert("Exceeds capacity! Only " + (pool.totalCapacity - pool.filledCapacity) + "kg space left.");
      return;
    }
    try {
      const isFull = (pool.filledCapacity + weight) >= pool.totalCapacity;
      
      // Update Main Truck Capacity
      await updateDoc(doc(db, 'transport_pools', pool.id), {
        filledCapacity: increment(weight),
        farmerCount: increment(1),
        status: isFull ? 'full' : 'open'
      });
      
      // Farmer to Truck's manifest
      await addDoc(collection(db, `transport_pools/${pool.id}/joiners`), {
          riderId: user.uid,
          riderName: farmerData?.farmerName || 'Farmer',
          weightAdded: weight,
          pickupLocation: pickupLocation,
          type: 'farmer',
          timestamp: serverTimestamp()
      });
      
      setJoinId(null);
      setJoinWeight('');
      setPickupLocation('');
      alert("Successfully reserved space on this truck! ");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <KhetFlowLoader />;
  }

  // --- KHETSCORE CERTIFICATE UI LOGIC ---
  const getScoreColor = (score) => {
    if (score >= 750) return 'text-emerald-500';
    if (score >= 600) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score) => {
    if (score >= 750) return 'bg-emerald-50 border-emerald-200';
    if (score >= 600) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'scoreExcellent';
    if (score >= 600) return 'scoreGood';
    return 'scoreLow';
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 font-sans">
      <AnimatedBackground />

      {/* --- Modals --- */}
      {showQRModal && selectedListing && (
        <QRCodeModal
          listing={selectedListing}
          onClose={() => {
            setShowQRModal(false);
            setSelectedListing(null);
          }}
        />
      )}

      {/* --- PRICE DISCOVERY MODAL --- */}
      {showPriceDiscovery && (
          <PriceDiscoveryModal 
              listing={newListing} 
              setListing={setNewListing} 
              onClose={() => setShowPriceDiscovery(false)} 
              onConfirm={executeAddListing} 
              mandiRates={mandiRates}
          />
      )}

      {showVerificationModal && selectedOrder && farmerData && (
        <FarmerVerificationModal
          order={selectedOrder}
          farmerData={farmerData}
          user={user}
          onClose={() => { setShowVerificationModal(false); setSelectedOrder(null); }}
          onVerify={async () => {
            alert('Quality verified! Order is now Out for Delivery. ');
            setShowVerificationModal(false);
            setSelectedOrder(null);
            await fetchOrders(user.uid);
          }}
        />
      )}

      {/* --- TRACKING SELECTION HUB --- */}
      {showTrackingList && (
        <TrackingListModal
          orders={orders}
          onClose={() => setShowTrackingList(false)}
          onSelectOrder={(order) => {
              setShowTrackingList(false);
              setTrackingOrder(order);
          }}
        />
      )}

      {/* Live Tracking Modal */}
      {trackingOrder && (
        <LiveTrackingModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      
      <div className="sticky top-0 z-40 bg-white/40 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_30px_rgb(0,0,0,0.03)] print:hidden">
        <MandiTicker />
        <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-2 md:py-0 md:h-20 gap-2 md:gap-0">
            
            {/* Header / Logo Row */}
            <div className="w-full md:w-auto flex justify-between items-center px-1 md:px-0">
                <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <Leaf className="w-4 h-4 md:w-7 md:h-7" />
                  </div>
                  <div className="block">
                    <h1 className="text-[13px] md:text-lg font-extrabold text-slate-800 leading-tight">
                      {farmerData?.farmName || 'My Farm'}
                    </h1>
                    <p className="text-[9px] md:text-xs text-slate-500 font-bold leading-none">{t('farmerDash')}</p>
                  </div>
                </div>

                <div className="flex md:hidden items-center gap-1 shrink-0">
                    <LanguageSelector />
                    <button
                    onClick={handleLogout}
                    className="p-1.5 bg-white/60 border border-white/80 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-500 shadow-sm transition-all"
                    >
                    <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-1 flex justify-center w-full md:mx-4 overflow-hidden">
                <div className="flex bg-white/40 border border-white/80 p-0.5 md:p-2 rounded-xl md:rounded-3xl w-full md:max-w-max shadow-inner gap-0.5 md:gap-2">
                  <button
                    onClick={() => setView('listings')}
                    className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-1 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl text-[9px] md:text-sm font-extrabold transition-all whitespace-nowrap ${
                      view === 'listings' 
                        ? 'bg-white text-emerald-600 shadow-sm scale-105 md:scale-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t('listings')}
                  </button>
                  <button
                    onClick={() => setView('orders')}
                    className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-1 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl text-[9px] md:text-sm font-extrabold transition-all whitespace-nowrap relative ${
                      view === 'orders' 
                        ? 'bg-white text-blue-500 shadow-sm scale-105 md:scale-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t('orders')}
                    {orders.filter(o => o.status === 'pending' && !o.readyForPickup).length > 0 && (
                      <span className="absolute -top-1 right-1 md:-right-1 w-3.5 h-3.5 md:w-5 md:h-5 bg-rose-400 text-white text-[8px] md:text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {orders.filter(o => o.status === 'pending' && !o.readyForPickup).length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setView('transactions')}
                    className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-1 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl text-[9px] md:text-sm font-extrabold transition-all whitespace-nowrap ${
                      view === 'transactions' 
                        ? 'bg-white text-amber-500 shadow-sm scale-105 md:scale-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    <IndianRupee className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t('payments')}
                  </button>
                  <button
                    onClick={() => setView('mandi')}
                    className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-1 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl text-[9px] md:text-sm font-extrabold transition-all whitespace-nowrap ${
                      view === 'mandi' 
                        ? 'bg-white text-indigo-500 shadow-sm scale-105 md:scale-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t('mandi')}
                  </button>
                  <button
                    onClick={() => setView('khetscore')}
                    className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-1 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl text-[9px] md:text-sm font-extrabold transition-all whitespace-nowrap ${
                      view === 'khetscore' 
                        ? 'bg-white text-purple-500 shadow-sm scale-105 md:scale-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t('khetScore')}
                  </button>
                  <button
                    onClick={() => setView('transport')}
                    className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-1 py-1.5 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl text-[9px] md:text-sm font-extrabold transition-all whitespace-nowrap ${
                      view === 'transport' 
                        ? 'bg-white text-orange-500 shadow-sm scale-105 md:scale-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t('transport')}
                  </button>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-2 shrink-0">
                <LanguageSelector />
                <button
                onClick={handleLogout}
                className="p-2.5 bg-white/60 border border-white/80 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all"
                title="Logout"
                >
                <LogOut className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </div>

<div className="relative z-10 max-w-7xl mx-auto px-2 md:px-6 lg:px-8 py-3 md:py-8">        
        {/* WeatherWidget only on Desktop here, mobile renders it inside the grid */}
        {view !== 'khetscore' && (
           <div className="hidden md:block">
              <WeatherWidget location={farmerData?.location} isMobileBox={false} />
           </div>
        )}

        {view === 'mandi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 bg-white/40 backdrop-blur-xl border border-white/60 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">{t('mandiRates')} 📊</h2>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>Live
                            </span>
                        </div>
                        <p className="text-slate-500 font-bold text-xs md:text-sm mt-1">Live Agmarknet Data. Compare Grade A market prices with your Grade B/C harvest earnings.</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Rates updated dynamically based on real-time mandi feeds.</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={t('searchCrop')}
                            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white bg-white/60 backdrop-blur-sm outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-inner font-bold text-slate-800 text-sm md:text-base"
                            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        />
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px] md:min-w-[600px]">
                            <thead className="bg-white/40 border-b border-white/60 text-slate-500 text-[10px] md:text-xs uppercase font-extrabold tracking-wider">
                                <tr>
                                    <th className="px-3 py-3 md:px-6 md:py-5">Crop (Live)</th>
                                    <th className="px-3 py-3 md:px-6 md:py-5">Agmarknet (Gr A)</th>
                                    <th className="px-3 py-3 md:px-6 md:py-5 text-emerald-600">Grade B (Est.)</th>
                                    <th className="px-3 py-3 md:px-6 md:py-5 text-amber-500">Grade C (Est.)</th>
                                    <th className="px-3 py-3 md:px-6 md:py-5">Trend</th>
                                    <th className="px-3 py-3 md:px-6 md:py-5">Market Pulse</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/40">
                                {mandiRates.filter(r => r.crop.toLowerCase().includes(searchTerm)).map((rate, i) => (
                                    <tr key={i} className="hover:bg-white/60 transition-colors text-xs md:text-base">
                                        <td className="px-3 py-3 md:px-6 md:py-5 font-extrabold text-slate-800 flex items-center gap-2">
                                            {rate.crop}
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-5 font-bold text-slate-500">₹{rate.gradeA}/kg</td>
                                        <td className="px-3 py-3 md:px-6 md:py-5 font-extrabold text-emerald-500">₹{rate.gradeB}/kg</td>
                                        <td className="px-3 py-3 md:px-6 md:py-5 font-extrabold text-amber-500">₹{rate.gradeC}/kg</td>
                                        <td className="px-3 py-3 md:px-6 md:py-5">
                                            {rate.trend === 'up' && <span className="text-emerald-500 bg-emerald-50 px-1.5 md:px-2 py-1 rounded-md md:rounded-lg flex items-center gap-1 text-[9px] md:text-xs font-extrabold w-fit"><TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" /> Up</span>}
                                            {rate.trend === 'down' && <span className="text-rose-500 bg-rose-50 px-1.5 md:px-2 py-1 rounded-md md:rounded-lg flex items-center gap-1 text-[9px] md:text-xs font-extrabold w-fit"><TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3" /> Down</span>}
                                            {rate.trend === 'stable' && <span className="text-slate-500 bg-slate-50 px-1.5 md:px-2 py-1 rounded-md md:rounded-lg flex items-center gap-1 text-[9px] md:text-xs font-extrabold w-fit"><ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" /> Stable</span>}
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-5">
                                            <div className="w-16 md:w-24 h-1.5 md:h-2 bg-white/80 rounded-full overflow-hidden shadow-inner">
                                                <div 
                                                    className={`h-full rounded-full ${rate.trend === 'up' ? 'bg-emerald-400' : rate.trend === 'down' ? 'bg-rose-400' : 'bg-slate-300'}`} 
                                                    style={{ width: '70%' }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- BANK-GRADE KHETSCORE CERTIFICATE UI --- */}
        {view === 'khetscore' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 md:space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/40 backdrop-blur-xl border border-white/60 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm print:hidden mb-4 md:mb-6 gap-3 md:gap-4">
              <div>
                 <h2 className="text-xl md:text-3xl font-extrabold text-slate-800">Khetscore Profile ⭐️</h2>
                 <p className="text-slate-500 font-bold mt-0.5 md:mt-1 text-xs md:text-base">Your bank-grade credit certificate.</p>
              </div>
              <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-extrabold shadow-lg shadow-slate-200 flex items-center gap-2 hover:bg-black transition-all active:scale-95 text-sm md:text-base">
                 <Download className="w-4 h-4 md:w-5 md:h-5" /> Download PDF
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-5 md:p-12 relative overflow-hidden print:shadow-none print:border-none print:p-0" id="khetscore-certificate">
               {/* Watermark */}
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Landmark className="w-64 h-64 md:w-96 md:h-96" />
               </div>

               {/* Header */}
               <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 md:pb-6 mb-6 md:mb-8 relative z-10">
                  <div>
                     <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">KHETFLOW</h1>
                     <p className="text-[10px] md:text-sm font-extrabold text-slate-500 tracking-widest uppercase mt-0.5 md:mt-1">Verified Financial Trust Report</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase">Report Date</p>
                     <p className="text-xs md:text-sm font-extrabold text-slate-800">{new Date().toLocaleDateString()}</p>
                     <p className="text-[9px] md:text-xs font-mono font-bold text-slate-400 mt-0.5 md:mt-1">ID: KF-{user?.uid.substring(0,8).toUpperCase()}</p>
                  </div>
               </div>

               {/* Farmer Details & Score Split */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10 relative z-10">
                  <div className="space-y-4 md:space-y-6">
                     <div>
                        <p className="text-[10px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">Entity Name</p>
                        <p className="text-lg md:text-2xl font-extrabold text-slate-800">{farmerData?.farmerName || 'Registered Farmer'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">Business / Farm</p>
                        <p className="text-base md:text-lg font-extrabold text-slate-700">{farmerData?.farmName || 'Verified Farm'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">Registered Location</p>
                        <p className="text-sm md:text-base font-extrabold text-slate-700">{farmerData?.location || 'India'}</p>
                     </div>
                     
                     <div className="mt-4 md:mt-6 p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 bg-slate-50">
                        <p className="text-[10px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Risk Assessment</p>
                        {khetScore >= 750 ? (
                           <p className="text-base md:text-lg font-black text-emerald-500 uppercase flex items-center gap-1.5 md:gap-2"><Check className="w-4 h-4 md:w-6 md:h-6"/> Low Risk (Prime)</p>
                        ) : khetScore >= 600 ? (
                           <p className="text-base md:text-lg font-black text-amber-500 uppercase flex items-center gap-1.5 md:gap-2"><AlertCircle className="w-4 h-4 md:w-6 md:h-6"/> Moderate Risk</p>
                        ) : (
                           <p className="text-base md:text-lg font-black text-rose-500 uppercase flex items-center gap-1.5 md:gap-2"><X className="w-4 h-4 md:w-6 md:h-6"/> High Risk</p>
                        )}
                     </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 md:p-8 border border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50 relative">
                     <p className="text-[10px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider absolute top-4 left-4 md:top-6 md:left-6">KhetScore</p>
                     <div className="w-32 h-32 md:w-48 md:h-48 relative mt-4">
                        <svg className="w-full h-full -rotate-90 drop-shadow-sm">
                           <circle cx="50%" cy="50%" r="45%" stroke="#f1f5f9" strokeWidth="16" fill="none" />
                           <circle 
                              cx="50%" cy="50%" r="45%" 
                              stroke={khetScore >= 750 ? '#10b981' : khetScore >= 600 ? '#f59e0b' : '#f43f5e'} 
                              strokeWidth="16" 
                              fill="none" 
                              strokeDasharray="283" 
                              strokeDashoffset={283 - (283 * ((khetScore - 0) / 900))} 
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-1 md:mt-2">
                            <span className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter">{khetScore}</span>
                            <span className="text-[9px] md:text-xs font-extrabold text-slate-400 uppercase mt-0.5 md:mt-1">Out of 900</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Credit Factors Grid */}
               <div className="mb-6 md:mb-10 relative z-10">
                  <h3 className="text-xs md:text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b-2 border-slate-100 pb-2 md:pb-3 mb-3 md:mb-5">Key Financial Factors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                     <div className="p-3 md:p-5 border border-slate-100 rounded-xl md:rounded-2xl bg-white shadow-sm">
                        <p className="text-[8px] md:text-[10px] font-extrabold text-slate-400 uppercase mb-1 md:mb-2">Total Deliveries</p>
                        <p className="text-lg md:text-2xl font-black text-slate-800">{orders.filter(o => o.status === 'delivered').length}</p>
                     </div>
                     <div className="p-3 md:p-5 border border-slate-100 rounded-xl md:rounded-2xl bg-white shadow-sm">
                        <p className="text-[8px] md:text-[10px] font-extrabold text-slate-400 uppercase mb-1 md:mb-2">Platform Revenue</p>
                        <p className="text-lg md:text-2xl font-black text-slate-800 truncate">₹{totalEarnings.toFixed(0)}</p>
                     </div>
                     <div className="p-3 md:p-5 border border-slate-100 rounded-xl md:rounded-2xl bg-white shadow-sm">
                        <p className="text-[8px] md:text-[10px] font-extrabold text-slate-400 uppercase mb-1 md:mb-2">Reject / Defect Rate</p>
                        <p className="text-lg md:text-2xl font-black text-emerald-500">0.0%</p>
                     </div>
                     <div className="p-3 md:p-5 border border-slate-100 rounded-xl md:rounded-2xl bg-white shadow-sm">
                        <p className="text-[8px] md:text-[10px] font-extrabold text-slate-400 uppercase mb-1 md:mb-2">Loan Eligibility</p>
                        <p className="text-lg md:text-2xl font-black text-slate-800">{khetScore >= 650 ? 'Eligible' : 'Not Yet'}</p>
                     </div>
                  </div>
               </div>

               {/* Footer / Stamp / Barcode */}
               <div className="flex justify-between items-end pt-4 md:pt-8 border-t-2 border-slate-800 relative z-10">
                  <div className="flex flex-col gap-1 md:gap-2">
                     <div className="flex gap-[2px] md:gap-[3px] h-8 md:h-12 items-end opacity-80">
                        {[...Array(40)].map((_, i) => (
                           <div key={i} className="bg-slate-900 rounded-t-sm" style={{ width: `${Math.random() * 4 + 2}px`, height: `${Math.random() > 0.5 ? '100%' : '70%'}` }}></div>
                        ))}
                     </div>
                     <p className="text-[8px] md:text-[10px] font-mono font-bold text-slate-500 tracking-widest">{user?.uid}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <div className="w-12 h-12 md:w-20 md:h-20 border-4 border-emerald-500 rounded-full flex items-center justify-center rotate-[-15deg] opacity-90 mb-1.5 md:mb-3 shadow-sm">
                        <span className="text-[7px] md:text-[11px] font-black text-emerald-500 uppercase text-center leading-tight">Verified<br/>Asset</span>
                     </div>
                     <p className="text-[9px] md:text-xs font-extrabold text-slate-400 uppercase">Authorized by KhetFlow</p>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 print:hidden mt-4 md:mt-8">
                {/* Unlock Financial Power */}
                <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                    <h3 className="text-lg md:text-xl font-extrabold mb-3 md:mb-6 flex items-center gap-2 text-slate-800">
                        <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-400 drop-shadow-sm" />
                        Unlock Financial Power
                    </h3>
                    <p className="text-slate-600 font-medium text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                        Your main income comes from Grade A produce. KhetFlow adds to that by turning your Grade B & C 'waste' into <span className="text-emerald-600 font-extrabold">extra profit</span>. This additional cash flow proves your farming capability, building a credit history (KhetScore) that banks trust for micro-loans.
                    </p>
                    <div className="space-y-3 md:space-y-4">
                        <div className={`p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-colors ${khetScore >= 650 ? 'bg-white/80 border-emerald-200 shadow-sm' : 'bg-white/40 border-white/60 opacity-70'}`}>
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className={`mt-0.5 md:mt-1 p-1 md:p-1.5 rounded-full shrink-0 ${khetScore >= 650 ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-sm md:text-base text-slate-800">Instant Micro-Loans (₹50k)</h4>
                                    <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-0.5 md:mt-1">Buy seeds & fertilizer now, pay after harvest.</p>
                                </div>
                            </div>
                        </div>
                        <div className={`p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-colors ${khetScore >= 750 ? 'bg-white/80 border-emerald-200 shadow-sm' : 'bg-white/40 border-white/60 opacity-70'}`}>
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className={`mt-0.5 md:mt-1 p-1 md:p-1.5 rounded-full shrink-0 ${khetScore >= 750 ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-sm md:text-base text-slate-800">Premium Crop Insurance</h4>
                                    <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-0.5 md:mt-1">Zero-deductible coverage for weather damage.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it is calculated */}
                <div className="bg-white/60 backdrop-blur-2xl p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 md:w-6 md:h-6 text-blue-400 drop-shadow-sm" />
                        How KhetScore is Calculated
                    </h3>
                    <div className="space-y-2 md:space-y-4">
                        <div className="flex items-center justify-between p-3 md:p-4 bg-white/60 rounded-xl md:rounded-2xl border border-white/80 shadow-sm">
                            <span className="font-extrabold text-xs md:text-base text-slate-700">Base Score</span>
                            <span className="font-black text-sm md:text-base text-slate-800">0 pts</span>
                        </div>
                        <div className="flex items-center justify-between p-3 md:p-4 bg-emerald-50/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-emerald-100 shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xs md:text-base text-emerald-800">Reliability Bonus</span>
                                <span className="text-[9px] md:text-xs font-bold text-emerald-600 mt-0.5">Per successful delivery</span>
                            </div>
                            <span className="font-black text-sm md:text-base text-emerald-600">+25 pts</span>
                        </div>
                        <div className="flex items-center justify-between p-3 md:p-4 bg-blue-50/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xs md:text-base text-blue-800">Volume Bonus</span>
                                <span className="text-[9px] md:text-xs font-bold text-blue-600 mt-0.5">For every ₹1,000 earned</span>
                            </div>
                            <span className="font-black text-sm md:text-base text-blue-600">+5 pts</span>
                        </div>
                         <div className="flex items-center justify-between p-3 md:p-4 bg-purple-50/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-purple-100 shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xs md:text-base text-purple-800">Diversity Bonus</span>
                                <span className="text-[9px] md:text-xs font-bold text-purple-600 mt-0.5">Per unique crop type sold</span>
                            </div>
                            <span className="font-black text-sm md:text-base text-purple-600">+10 pts</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-6 pt-3 md:pt-5 border-t border-white/60">
                        <p className="text-[9px] md:text-xs font-bold text-slate-400">
                            * Maintaining a 0% Reject Rate and hitting 5+ deliveries unlocks streak bonuses. Max score is 900.
                        </p>
                    </div>
                </div>
            </div>

          </div>
        )}

        {view === 'listings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* MOBILE: STAT CARDS */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-5 mb-4 md:mb-8">
              
              {/* Weather box on Mobile view */}
              <WeatherWidget location={farmerData?.location} isMobileBox={true} />

              <div 
                onClick={() => setView('khetscore')}
                className="col-span-1 bg-white/40 backdrop-blur-xl p-2 md:p-6 rounded-[1rem] md:rounded-[2.5rem] border border-white/60 text-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all relative overflow-hidden group cursor-pointer hover:-translate-y-1 flex flex-col justify-between min-h-[90px] md:min-h-[180px]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-purple-300/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl md:blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-6 md:w-24 md:h-12 overflow-hidden relative mb-1 md:mb-3">
                         <div className="w-12 h-12 md:w-24 md:h-24 rounded-full border-[4px] md:border-[10px] border-slate-200/50 border-b-transparent border-l-transparent absolute top-0 left-0 rotate-45"></div>
                         <div 
                            className="w-12 h-12 md:w-24 md:h-24 rounded-full border-[4px] md:border-[10px] border-purple-400 border-b-transparent border-l-transparent absolute top-0 left-0 transition-all duration-1000"
                            style={{ 
                                transform: `rotate(${45 + ((khetScore - 0) / 900) * 180}deg)`,
                            }}
                         ></div>
                    </div>
                    
                    <div className="text-center -mt-2 md:-mt-4">
                        <span className="text-lg md:text-4xl font-black text-slate-800 block leading-none">{khetScore}</span>
                        <span className="text-[7px] md:text-[10px] uppercase tracking-widest font-extrabold text-slate-500 mt-0.5 md:mt-1 block">Score</span>
                    </div>
                </div>
              </div>

              <div className="col-span-1 bg-white/60 backdrop-blur-xl p-2.5 md:p-6 rounded-[1rem] md:rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:-translate-y-1 transition-transform flex flex-col justify-between min-h-[90px] md:min-h-[180px]">
                <div className="flex items-start justify-between mb-1 md:mb-5">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-lg md:rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <Package className="w-3 h-3 md:w-6 md:h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-lg md:text-4xl font-black text-slate-800 mb-0 md:mb-1">{listings.length}</div>
                  <div className="text-slate-500 font-bold text-[8px] md:text-sm leading-tight">Active</div>
                </div>
              </div>

              <div className="col-span-1 bg-white/60 backdrop-blur-xl p-2.5 md:p-6 rounded-[1rem] md:rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:-translate-y-1 transition-transform flex flex-col justify-between min-h-[90px] md:min-h-[180px]">
                <div className="flex items-start justify-between mb-1 md:mb-5">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-lg md:rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <IndianRupee className="w-3 h-3 md:w-6 md:h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-lg md:text-4xl font-black text-slate-800 mb-0 md:mb-1 truncate">₹{totalEarnings.toFixed(0)}</div>
                  <div className="text-slate-500 font-bold text-[8px] md:text-sm leading-tight">Earned</div>
                </div>
              </div>

              <div className="col-span-1 bg-white/60 backdrop-blur-xl p-2.5 md:p-6 rounded-[1rem] md:rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:-translate-y-1 transition-transform flex flex-col justify-between min-h-[90px] md:min-h-[180px]">
                <div className="flex items-start justify-between mb-1 md:mb-5">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-lg md:rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                    <Clock className="w-3 h-3 md:w-6 md:h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-lg md:text-4xl font-black text-slate-800 mb-0 md:mb-1 truncate">₹{pendingEarnings.toFixed(0)}</div>
                  <div className="text-slate-500 font-bold text-[8px] md:text-sm leading-tight">Pending</div>
                </div>
              </div>

              <div className="col-span-1 bg-white/60 backdrop-blur-xl p-2.5 md:p-6 rounded-[1rem] md:rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:-translate-y-1 transition-transform flex flex-col justify-between min-h-[90px] md:min-h-[180px]">
                <div className="flex items-start justify-between mb-1 md:mb-5">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-lg md:rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                    <TrendingUp className="w-3 h-3 md:w-6 md:h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-lg md:text-4xl font-black text-slate-800 mb-0 md:mb-1">{orders.length}</div>
                  <div className="text-slate-500 font-bold text-[8px] md:text-sm leading-tight">Orders</div>
                </div>
              </div>
            </div>

            {!showAddForm && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-8 bg-white/40 backdrop-blur-md border border-white/60 p-3 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm">
                <h2 className="text-lg md:text-2xl font-extrabold text-slate-800 pl-2">{t('yourHarvest')}</h2>
                <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                    {/* --- TRACK ORDERS HUB BUTTON --- */}
                    <button 
                        onClick={() => setShowTrackingList(true)}
                        className="flex-1 sm:flex-none bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-700 px-2 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-extrabold shadow-sm hover:bg-white hover:border-emerald-300 transition-all flex items-center justify-center gap-1.5 md:gap-2 active:scale-95 text-[10px] md:text-base"
                    >
                        <Map className="w-3.5 h-3.5 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Track Orders</span>
                        <span className="sm:hidden">Track</span>
                    </button>
                    {/* ---------------------------------- */}
                    <button 
                        onClick={() => { setScannedItems([]); setShowCameraModal(true); }}
                        className="flex-1 sm:flex-none bg-emerald-500 text-white px-2 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-extrabold shadow-[0_8px_16px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 md:gap-2 active:scale-95 text-[10px] md:text-base"
                    >
                        <ScanLine className="w-3.5 h-3.5 md:w-5 md:h-5 animate-pulse" />
                        <span className="hidden sm:inline">{t('aiScan')}</span>
                        <span className="sm:hidden">AI Scan</span>
                    </button>
                    <button
                        onClick={() => { setIsAutoFilled(false); setShowAddForm(true); }}
                        className="flex-1 sm:flex-none bg-slate-800 text-white px-2 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-extrabold shadow-[0_8px_16px_rgba(15,23,42,0.2)] hover:bg-slate-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 md:gap-2 active:scale-95 text-[10px] md:text-base"
                    >
                        <Plus className="w-3.5 h-3.5 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">{t('addProduct')}</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
              </div>
            )}

            {showAddForm && (
              <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] mb-6 md:mb-10 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <div>
                    <h2 className="text-xl md:text-3xl font-extrabold text-slate-800">{t('addNewListing')}</h2>
                    <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Details about your imperfect produce</p>
                  </div>
                  <button onClick={() => {
                      setShowAddForm(false);
                      // If they close the form but have more items in the batch queue, pop the summary back up!
                      if (scannedItems.length > 0) setShowBatchSummary(true);
                  }} className="p-2 md:p-3 bg-white border border-slate-200 shadow-sm rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddListing} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-4 md:space-y-6">
                    <label className="block w-full aspect-square md:aspect-video lg:aspect-square relative border-4 border-dashed border-slate-200/80 rounded-[1.5rem] md:rounded-[2.5rem] hover:border-emerald-300 transition-colors cursor-pointer bg-white/50 overflow-hidden group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {newListing.imagePreview ? (
                        <>
                          <img 
                            src={newListing.imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-extrabold flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm md:text-base">
                              <UploadCloud className="w-4 h-4 md:w-5 md:h-5" /> Change Photo
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 md:mb-4">
                             <UploadCloud className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                          </div>
                          <span className="font-extrabold text-slate-600 text-sm md:text-lg">Tap to upload photo</span>
                          <span className="text-xs md:text-sm font-bold text-slate-400 mt-1">Max 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    
                    {!isAutoFilled && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-5 border border-white shadow-sm space-y-3 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-extrabold text-slate-500 uppercase tracking-widest">Quick Select ✨</label>
                        <div className="flex gap-2 p-1.5 bg-white rounded-xl md:rounded-2xl border border-slate-100 overflow-x-auto shadow-inner">
                          {Object.keys(CROP_CATEGORIES).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setActiveCategory(cat)}
                              className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-sm font-extrabold transition-all whitespace-nowrap ${
                                activeCategory === cat
                                  ? 'bg-slate-800 text-white shadow-md'
                                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 max-h-24 md:max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {CROP_CATEGORIES[activeCategory].map((crop) => (
                            <button
                              key={crop}
                              type="button"
                              onClick={() => setNewListing({ ...newListing, name: crop })}
                              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-extrabold border-2 transition-all flex items-center gap-1.5 md:gap-2 ${
                                newListing.name === crop
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-400 shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-100 hover:border-emerald-200'
                              }`}
                            >
                              {newListing.name === crop && <Check className="w-3 h-3 md:w-4 md:h-4" />}
                              {crop}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-xs md:text-sm font-extrabold text-slate-700">{t('prodName')}</label>
                      <input
                        type="text"
                        disabled={isAutoFilled}
                        className={`w-full backdrop-blur-sm border-2 border-white rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 font-extrabold text-slate-800 placeholder:text-slate-400 shadow-sm text-sm md:text-base ${isAutoFilled ? 'bg-slate-200 opacity-60 cursor-not-allowed' : 'bg-white/60'}`}
                        placeholder="e.g. Red Tomatoes"
                        value={newListing.name}
                        onChange={(e) => setNewListing({...newListing, name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-5">
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm font-extrabold text-slate-700">{t('qty')}</label>
                        <input
                          type="number"
                          className="w-full bg-white/60 backdrop-blur-sm border-2 border-white rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 font-extrabold text-slate-800 placeholder:text-slate-400 shadow-sm text-sm md:text-base"
                          placeholder="0.0"
                          value={newListing.quantity}
                          onChange={(e) => setNewListing({...newListing, quantity: e.target.value})}
                          required
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm font-extrabold text-slate-700">{t('price')}</label>
                        <input
                          type="number"
                          className="w-full bg-white/60 backdrop-blur-sm border-2 border-white rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 font-extrabold text-slate-800 placeholder:text-slate-400 shadow-sm text-sm md:text-base"
                          placeholder="Leave blank for AI Pricing"
                          value={newListing.price}
                          onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-xs md:text-sm font-extrabold text-slate-700">{t('grade')}</label>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {['B', 'C'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            disabled={isAutoFilled}
                            onClick={() => setNewListing({...newListing, grade: g})}
                            className={`py-3 md:py-4 rounded-xl md:rounded-2xl border-2 font-extrabold text-sm md:text-lg transition-all ${
                              newListing.grade === g
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm'
                                : 'bg-white/60 border-white text-slate-50 hover:bg-white hover:border-emerald-200 shadow-sm'
                            } ${isAutoFilled && newListing.grade !== g ? 'opacity-30 cursor-not-allowed' : ''}`}
                          >
                            Grade {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-xs md:text-sm font-extrabold text-slate-700">{t('desc')}</label>
                      <textarea
                        disabled={isAutoFilled}
                        className={`w-full backdrop-blur-sm border-2 border-white rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 h-24 md:h-32 resize-none font-bold text-slate-800 placeholder:text-slate-400 shadow-sm text-sm md:text-base ${isAutoFilled ? 'bg-slate-200 opacity-60 cursor-not-allowed' : 'bg-white/60'}`}
                        placeholder="Describe the imperfections... (e.g., Odd shape but perfect inside)"
                        value={newListing.description}
                        onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="bg-amber-50/80 backdrop-blur-md border border-amber-200 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 shadow-sm">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <input
                          type="checkbox"
                          id="flashSale"
                          checked={newListing.isFlashSale}
                          onChange={(e) => setNewListing({...newListing, isFlashSale: e.target.checked})}
                          className="w-5 h-5 md:w-6 md:h-6 text-amber-500 rounded-md md:rounded-lg focus:ring-amber-400 border-amber-300 accent-amber-500 cursor-pointer"
                        />
                        <label htmlFor="flashSale" className="font-extrabold text-amber-800 flex items-center gap-1.5 md:gap-2 cursor-pointer select-none text-sm md:text-lg">
                          <Zap className="w-5 h-5 md:w-6 md:h-6 fill-amber-500 text-amber-500 drop-shadow-sm" />
                          Enable Flash Sale
                        </label>
                      </div>

                      {newListing.isFlashSale && (
                        <div className="grid grid-cols-2 gap-3 md:gap-5 animate-in slide-in-from-top-2 bg-white/60 p-3 md:p-4 rounded-xl md:rounded-2xl">
                          <div className="space-y-1.5 md:space-y-2">
                            <label className="text-[10px] md:text-xs font-extrabold text-amber-700 uppercase tracking-wide">Discount %</label>
                            <input
                              type="number"
                              className="w-full bg-white border border-amber-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 font-extrabold text-slate-800 shadow-sm text-sm md:text-base"
                              value={newListing.flashSaleDiscount}
                              onChange={(e) => setNewListing({...newListing, flashSaleDiscount: e.target.value})}
                              placeholder="20"
                              min="5"
                              max="90"
                            />
                          </div>
                          <div className="space-y-1.5 md:space-y-2">
                            <label className="text-[10px] md:text-xs font-extrabold text-amber-700 uppercase tracking-wide">Ends On</label>
                            <input
                              type="datetime-local"
                              className="w-full bg-white border border-amber-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 font-extrabold text-slate-800 shadow-sm text-[10px] md:text-sm"
                              value={newListing.flashSaleEndTime}
                              onChange={(e) => setNewListing({...newListing, flashSaleEndTime: e.target.value})}
                            />
                          </div>
                          {newListing.flashSaleDiscount > 0 && newListing.price > 0 && (
                            <div className="col-span-2 text-center bg-amber-100 rounded-lg md:rounded-xl py-2 md:py-3 text-amber-900 font-extrabold text-sm md:text-base border border-amber-200 shadow-sm">
                              New Price: <span className="text-lg md:text-xl">₹{(parseFloat(newListing.price) * (1 - parseFloat(newListing.flashSaleDiscount) / 100)).toFixed(2)}</span>
                              <span className="line-through text-amber-900/40 ml-2 md:ml-3 text-xs md:text-sm font-bold">₹{newListing.price}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 md:pt-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-slate-800 hover:bg-black disabled:bg-slate-400 text-white font-extrabold py-3 md:py-5 rounded-xl md:rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-1 active:scale-95 text-sm md:text-lg flex justify-center items-center gap-2"
                      >
                        {uploading ? 'Processing...' : 'Review Price & List'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {listings.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/80 p-8 md:p-20 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
                <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                  <Package className="w-10 h-10 md:w-16 md:h-16 text-slate-300" />
                </div>
                <h3 className="text-lg md:text-2xl font-extrabold text-slate-800 mb-2 md:mb-3">{t('noListings')} 🌾</h3>
                <p className="text-slate-500 font-bold mb-6 md:mb-10 max-w-sm mx-auto text-xs md:text-base">Start adding your harvest to reach buyers instantly.</p>
                <button
                  onClick={() => { setIsAutoFilled(false); setShowAddForm(true); }}
                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-extrabold shadow-sm hover:bg-emerald-100 hover:-translate-y-1 transition-all active:scale-95 text-sm md:text-lg"
                >
                  {t('createFirst')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                {listings.map((listing) => (
                  <div key={listing.id} className="group bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.1)] transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-1 md:hover:-translate-y-2">
                    <div className="relative h-32 md:h-56 bg-slate-100 overflow-hidden p-1.5 md:p-2">
                      <div className="w-full h-full rounded-[1rem] md:rounded-[2rem] overflow-hidden relative">
                          {listing.isFlashSale && (
                            <div className="absolute top-2 md:top-3 left-2 md:left-3 z-10 bg-amber-400 text-amber-950 text-[10px] md:text-xs font-black px-2.5 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg flex items-center gap-1 md:gap-1.5 backdrop-blur-sm">
                              <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 fill-amber-900" />
                              -{listing.flashSaleDiscount}%
                            </div>
                          )}
                          
                          <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] md:text-xs font-black px-2.5 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-white">
                            Grade {listing.grade}
                          </div>

                          {listing.image && listing.image.startsWith('data:') ? (
                            <img 
                              src={listing.image} 
                              alt={listing.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl bg-white">
                               {listing.image || ''}
                            </div>
                          )}
                          
                          <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-extrabold shadow-lg border border-white/10">
                            ₹{listing.price} <span className="text-slate-300 text-[9px] md:text-xs font-bold">/kg</span>
                          </div>
                      </div>
                    </div>

                    <div className="p-3 md:p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1.5 md:mb-3">
                        <h3 className="font-extrabold text-slate-800 text-base md:text-xl leading-tight">{listing.name}</h3>
                      </div>
                      
                      <p className="text-slate-500 font-semibold text-[10px] md:text-sm mb-2 md:mb-5 line-clamp-2 flex-1 leading-tight">{listing.description}</p>
                      
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6 bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                        <div className="h-1.5 md:h-2.5 flex-1 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                        </div>
                        <span className="text-[9px] md:text-xs font-extrabold text-slate-700 whitespace-nowrap">{listing.quantity} kg left</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:gap-3 mt-auto">
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowQRModal(true);
                          }}
                          className="flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-slate-200 text-slate-700 font-extrabold text-[10px] md:text-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          Code
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-3 rounded-lg md:rounded-xl bg-rose-50 text-rose-600 font-extrabold text-[10px] md:text-sm hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8 bg-white/40 backdrop-blur-md border border-white/60 p-3 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm w-fit">
              <h2 className="text-base md:text-2xl font-extrabold text-slate-800 flex items-center gap-2 md:gap-3">
                {t('receivedOrders')} 
              </h2>
              <span className="bg-blue-100 text-blue-700 text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 rounded-full font-extrabold shadow-sm">{orders.length}</span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/80 p-8 md:p-20 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
                <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                  <ShoppingBag className="w-8 h-8 md:w-16 md:h-16 text-blue-300" />
                </div>
                <h3 className="text-lg md:text-2xl font-extrabold text-slate-800 mb-2 md:mb-3">No orders yet 🏪</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto text-xs md:text-base">Wait for businesses to discover your quality produce!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {orders.map((order) => {
                  const farmerItems = order.items?.filter(item => item.farmerId === user.uid) || [];
                  const orderTotal = farmerItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
                  const farmerEarning = (orderTotal * 0.9).toFixed(2);
                  
                  return (
                    <div key={order.id} className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] p-3 md:p-8 hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.1)] transition-all duration-300 hover:-translate-y-1 group flex flex-col">
                      <div className="flex justify-between items-start mb-3 md:mb-6 pb-2.5 md:pb-6 border-b-2 border-dashed border-slate-200/50">
                        <div>
                          <p className="text-[9px] md:text-xs text-slate-400 font-mono font-bold mb-1 md:mb-1.5">#{order.id.substring(0, 8)}</p>
                          <h3 className="font-black text-slate-800 text-sm md:text-xl">{order.businessName || 'Business Buyer'}</h3>
                        </div>
                        <div className={`px-2.5 md:px-4 py-1 md:py-2 rounded-full text-[9px] md:text-xs font-black tracking-wider border shadow-sm ${
                          order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          order.status === 'picked' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                          {order.status === 'pending' ? 'Pending' : order.status === 'picked' ? 'In Transit' : 'Delivered'}
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-4 mb-3 md:mb-8 bg-slate-50/50 rounded-xl md:rounded-2xl p-2.5 md:p-4 border border-slate-100">
                        {farmerItems.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] md:text-sm">
                            <span className="text-slate-700 font-bold flex items-center gap-2 md:gap-2.5">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 shadow-sm"></span>
                              {item.name} <span className="text-slate-400">× {item.cartQuantity}kg</span>
                            </span>
                            <span className="font-black text-slate-900">₹{item.price * item.cartQuantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white rounded-xl md:rounded-2xl p-2.5 md:p-5 mb-3 md:mb-8 space-y-1.5 md:space-y-3 text-[10px] md:text-sm border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-2 md:gap-3 text-slate-600 font-bold">
                            <div className="p-1 md:p-1.5 bg-rose-50 text-rose-400 rounded-md md:rounded-lg"><MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" /></div>
                            <span className="truncate">{order.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3 text-slate-600 font-bold">
                            <div className="p-1 md:p-1.5 bg-indigo-50 text-indigo-400 rounded-md md:rounded-lg"><Phone className="w-3 h-3 md:w-4 md:h-4 shrink-0" /></div>
                            <span>{order.phone}</span>
                          </div>
                          {order.riderName && !farmerData?.hasTransport && (
                            <div className="flex items-center gap-2 md:gap-3 text-slate-600 font-bold">
                              <div className="p-1 md:p-1.5 bg-emerald-50 text-emerald-500 rounded-md md:rounded-lg"><User className="w-3 h-3 md:w-4 md:h-4 shrink-0" /></div>
                              <span>Rider: {order.riderName}</span>
                            </div>
                          )}
                          {farmerData?.hasTransport && (
                            <div className="flex items-center gap-2 md:gap-3 text-blue-600 font-black">
                              <div className="p-1 md:p-1.5 bg-blue-50 text-blue-500 rounded-md md:rounded-lg"><Truck className="w-3 h-3 md:w-4 md:h-4 shrink-0" /></div>
                              <span>Self-Delivery Mode</span>
                            </div>
                          )}
                      </div>

                      <div className="mt-auto pt-1 md:pt-2 flex flex-col gap-2 md:gap-3">
                        <div className="flex justify-between items-center mb-2 md:mb-4 bg-emerald-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-emerald-100">
                          <span className="font-extrabold text-slate-700 text-xs md:text-base">Net Earnings</span>
                          <span className="text-xl md:text-2xl font-black text-emerald-600">₹{farmerEarning}</span>
                        </div>

                        {/* --- TRACK LIVE BUTTON --- */}
                        <button
                          onClick={() => setTrackingOrder(order)}
                          className="w-full mb-1 md:mb-2 bg-white border-2 border-slate-200 text-slate-700 font-extrabold py-2 md:py-3.5 rounded-xl md:rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 text-xs md:text-base flex items-center justify-center gap-1.5 md:gap-2"
                        >
                          🗺️ Track Live Map
                        </button>
                        {/* ----------------------------------- */}

                        {order.status === 'pending' && !order.readyForPickup && (
                          <button
                            onClick={() => markReadyForPickup(order.id)}
                            className="w-full bg-slate-800 text-white font-extrabold py-2 md:py-4 rounded-xl md:rounded-2xl shadow-[0_8px_16px_rgba(15,23,42,0.2)] hover:bg-black transition-all active:scale-95 text-xs md:text-base"
                          >
                            {farmerData?.hasTransport ? 'Pack Order ' : 'Mark Ready for Pickup '}
                          </button>
                        )}
                        
                        {order.readyForPickup && order.status === 'pending' && (
                           farmerData?.hasTransport ? (
                              <button 
                                onClick={() => handleStartDelivery(order)}
                                className="w-full bg-blue-500 text-white font-extrabold py-2 md:py-4 rounded-xl md:rounded-2xl shadow-[0_8px_16px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all active:scale-95 text-xs md:text-base flex items-center justify-center gap-1.5 md:gap-2"
                              >
                                 <ScanLine className="w-4 h-4 md:w-5 md:h-5" /> Start Delivery (QC)
                              </button>
                           ) : (
                              <div className="w-full bg-white text-emerald-600 font-extrabold py-2 md:py-4 rounded-xl md:rounded-2xl text-center border-2 border-emerald-200 shadow-sm text-xs md:text-base">
                                 Waiting for Rider
                              </div>
                           )
                        )}

                        {order.status === 'picked' && farmerData?.hasTransport && (
                           <div className="w-full bg-blue-50 text-blue-700 font-extrabold py-2 md:py-4 rounded-xl md:rounded-2xl text-center border-2 border-blue-200 shadow-sm text-xs md:text-base">
                              Out for Delivery (Pool)
                           </div>
                        )}

                        {order.status === 'picked' && !farmerData?.hasTransport && (
                           <div className="w-full bg-blue-50 text-blue-700 font-extrabold py-2 md:py-4 rounded-xl md:rounded-2xl text-center border-2 border-blue-200 shadow-sm text-xs md:text-base">
                               Out for Delivery (Rider)
                           </div>
                        )}

                        {order.status === 'delivered' && (
                           <div className="w-full bg-slate-50 text-slate-500 font-extrabold py-2 md:py-4 rounded-xl md:rounded-2xl text-center border-2 border-slate-200 shadow-sm text-xs md:text-base">
                               Payment Settled
                           </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === 'transactions' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-8 bg-white/40 backdrop-blur-md border border-white/60 p-3 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm w-fit">
              <h2 className="text-base md:text-2xl font-extrabold text-slate-800 flex items-center gap-2 md:gap-3">
                {t('paymentHistory')} 
              </h2>
              <span className="bg-amber-100 text-amber-700 text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 rounded-full font-extrabold shadow-sm">{transactions.length}</span>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/80 p-8 md:p-20 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
                <div className="w-16 h-16 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                  <IndianRupee className="w-8 h-8 md:w-16 md:h-16 text-amber-400 drop-shadow-sm" />
                </div>
                <h3 className="text-lg md:text-2xl font-extrabold text-slate-800 mb-2 md:mb-3">No transactions yet</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto text-xs md:text-base">Complete deliveries to see your payments here.</p>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] overflow-hidden p-1 md:p-4">
                <div className="overflow-x-auto bg-white rounded-[1rem] md:rounded-[2rem] shadow-sm border border-slate-100">
                  <table className="w-full text-left min-w-[400px] md:min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-2 py-2 md:px-6 md:py-5 text-[8px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-2 py-2 md:px-6 md:py-5 text-[8px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-2 py-2 md:px-6 md:py-5 text-[8px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider">Details</th>
                        <th className="px-2 py-2 md:px-6 md:py-5 text-[8px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-2 py-2 md:px-6 md:py-5 text-[8px] md:text-xs font-extrabold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-[9px] md:text-base">
                      {transactions.map((txn, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-2 py-2 md:px-6 md:py-5 font-mono font-bold text-slate-500">{txn.id}</td>
                          <td className="px-2 py-2 md:px-6 md:py-5">
                            <div className="flex items-center gap-1.5 md:gap-2 text-slate-700 font-bold">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                              {txn.date}
                            </div>
                          </td>
                          <td className="px-2 py-2 md:px-6 md:py-5 text-slate-700 font-bold">
                            Order #{txn.orderId.substring(0, 8)} 
                            <span className="text-slate-400 text-[8px] md:text-xs ml-1 md:ml-2 bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">({txn.items})</span>
                          </td>
                          <td className="px-2 py-2 md:px-6 md:py-5">
                            <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <Check className="w-2.5 h-2.5 md:w-3 md:h-3" /> Done
                            </span>
                          </td>
                          <td className="px-2 py-2 md:px-6 md:py-5 text-right">
                            <span className="font-black text-emerald-500 text-xs md:text-lg flex items-center justify-end gap-0.5 md:gap-1">
                              + <IndianRupee className="w-3 h-3 md:w-4 md:h-4" />
                              {txn.amount}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'transport' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/40 backdrop-blur-md border border-white/60 p-3 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm mb-3 md:mb-8 gap-3 md:gap-4">
              <h2 className="text-lg md:text-2xl font-extrabold text-slate-800 flex items-center gap-2 md:gap-3">
                  {t('availablePools')} 
                  <span className="bg-orange-100 text-orange-600 text-[10px] md:text-xs px-2.5 md:px-3 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-ping"></span> Live</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
               {transportPools.length === 0 ? (
                  <div className="col-span-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-[1.5rem] md:rounded-[2.5rem] p-10 md:p-16 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
                      <Truck className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mx-auto mb-4 md:mb-5 drop-shadow-sm" />
                      <h3 className="font-extrabold text-lg md:text-xl text-slate-800">No trucks available right now</h3>
                      <p className="text-slate-500 font-bold mt-1.5 md:mt-2 text-xs md:text-base">Check back later when a middle-mile driver creates a route.</p>
                  </div>
               ) : (
                 transportPools.map((truck) => {
                   const percent = Math.min(100, (truck.filledCapacity / truck.totalCapacity) * 100);
                   const isFull = truck.status === 'full';

                   return (
                     <div key={truck.id} className="bg-white/80 backdrop-blur-xl border border-white rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-3 md:mb-6">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="p-1.5 md:p-3.5 bg-orange-50 border border-orange-100 text-orange-500 rounded-xl md:rounded-2xl shadow-sm">
                                        <Truck className="w-3 h-3 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-800 text-xs md:text-base">{truck.origin} ➝ {truck.destination}</h4>
                                        <span className="text-[9px] md:text-xs text-slate-500 flex items-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 font-bold">
                                            <Timer className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-400" /> {truck.departureTime ? new Date(truck.departureTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest shadow-sm ${isFull ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
                                    {isFull ? 'Full' : 'Open'}
                                </span>
                            </div>
                            
                            <div className="space-y-3 md:space-y-5 mb-3 md:mb-8 bg-slate-50 p-2.5 md:p-5 rounded-xl md:rounded-2xl border border-slate-100">
                                <div>
                                    <div className="flex justify-between text-[9px] md:text-xs text-slate-500 mb-1.5 md:mb-2 font-bold">
                                        <span>Capacity Filled</span>
                                        <span className="text-slate-800">{truck.filledCapacity}/{truck.totalCapacity} kg</span>
                                    </div>
                                    <div className="h-1.5 md:h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full rounded-full transition-all duration-700 ${isFull ? 'bg-rose-400' : 'bg-orange-400'}`} style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-[9px] md:text-xs text-slate-500 font-extrabold pt-2 border-t border-slate-200/50">
                                    <span className="flex items-center gap-1 md:gap-1.5"><Users className="w-3 h-3 md:w-4 md:h-4 text-slate-400" /> {truck.farmerCount} joined</span>
                                    <span className="flex items-center gap-1 md:gap-1.5"><User className="w-3 h-3 md:w-4 md:h-4 text-slate-400" /> {truck.driverName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Join Pool Logic for Farmers */}
                        {!isFull && farmerData?.hasTransport && (
                          joinId === truck.id ? (
                            <div className="flex flex-col gap-2 md:gap-3 bg-orange-50/50 p-2.5 md:p-4 rounded-xl md:rounded-2xl border border-orange-100 animate-in slide-in-from-bottom-2">
                              <input 
                                type="text" 
                                placeholder="Pickup Location (e.g. NH37 Gate)" 
                                value={pickupLocation}
                                onChange={e => setPickupLocation(e.target.value)}
                                className="w-full bg-white border border-orange-200 rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-3 text-[10px] md:text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 font-bold text-slate-800 shadow-sm"
                              />
                              <div className="flex gap-1.5 md:gap-2">
                                <input 
                                  type="number" 
                                  placeholder="kg" 
                                  value={joinWeight} 
                                  onChange={e => setJoinWeight(e.target.value)}
                                  className="w-16 md:w-24 bg-white border border-orange-200 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-3 text-[10px] md:text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 font-bold text-slate-800 shadow-sm text-center"
                                />
                                <button onClick={() => handleJoinPool(truck)} className="flex-1 bg-orange-500 text-white font-extrabold rounded-lg md:rounded-xl shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600 active:scale-95 transition-all text-[10px] md:text-base">Confirm</button>
                                <button onClick={() => {setJoinId(null); setPickupLocation('');}} className="px-3 md:px-4 bg-white text-slate-400 font-bold rounded-lg md:rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-sm text-[10px] md:text-base">✕</button>
                              </div>
                            </div>
                          ) : (
                            <button 
                                onClick={() => setJoinId(truck.id)}
                                className="w-full bg-white border-2 border-orange-200 text-orange-600 font-extrabold py-1.5 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-orange-50 transition-all active:scale-95 shadow-sm text-[10px] md:text-base"
                            >
                                {t('joinPool')}
                            </button>
                          )
                        )}
                        {!isFull && !farmerData?.hasTransport && (
                            <div className="w-full bg-slate-50 text-slate-500 font-bold py-1.5 md:py-3.5 rounded-xl md:rounded-2xl text-center border border-slate-100 text-[9px] md:text-sm">
                                Assigned rider will manage transport
                            </div>
                        )}
                        {isFull && (
                           <button disabled className="w-full bg-slate-100 text-slate-400 font-extrabold py-1.5 md:py-3.5 rounded-xl md:rounded-2xl cursor-not-allowed border border-slate-200 text-[10px] md:text-base">
                               Pool Full
                           </button>
                        )}
                     </div>
                   );
                 })
               )}
            </div>
          </div>
        )}

      </div>

      {/* --- AI AUTO-SCANNER SYSTEM --- */}
      {showCameraModal && (
        <AICameraModal 
            onClose={() => setShowCameraModal(false)} 
            onComplete={handleCameraComplete}
        />
      )}

      {/* --- BATCH SUMMARY POPUP --- */}
      {showBatchSummary && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 pb-4 text-center border-b border-slate-100 shrink-0">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Segregation Complete</h2>
              <p className="text-slate-500 font-medium text-xs mt-1">Pending items: {scannedItems.length}</p>
            </div>

            <div className="p-6 bg-slate-50 space-y-3 overflow-y-auto flex-1">
              {scannedItems.map((batch, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-lg text-slate-800">
                        {batch.name} <span className={batch.grade === 'B' ? 'text-emerald-500' : 'text-amber-500'}>Gr {batch.grade}</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl text-slate-900">{batch.weight.toFixed(2)}</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Est. KG</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                        setNewListing(prev => ({
                            ...prev,
                            name: batch.name,
                            grade: batch.grade,
                            quantity: batch.weight.toFixed(2),
                            description: `AI Verified Harvest Batch - Grade ${batch.grade} Quality.`,
                            imagePreview: batch.image
                        }));
                        
                        // Remove this specific item from the pending list
                        const remainingItems = scannedItems.filter((_, i) => i !== index);
                        setScannedItems(remainingItems);
                        
                        setShowBatchSummary(false);
                        setIsAutoFilled(true);
                        setShowAddForm(true); 
                    }}
                    className="w-full bg-emerald-50 text-emerald-600 border border-emerald-200 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-emerald-100 transition-colors active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create Listing
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 pt-2 shrink-0">
              <button 
                onClick={() => { setShowBatchSummary(false); setScannedItems([]); }} 
                className="w-full text-slate-400 font-bold text-sm uppercase tracking-widest py-3 hover:text-slate-600 transition-colors"
              >
                Close & Discard Remaining
              </button>
            </div>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}

// --- Main App ---

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Bypassed*/}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* component alive */}
          <Route path="/welcome" element={<FarmerLanding />} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}