import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, query, where, serverTimestamp, increment, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Leaf, Package, ShoppingBag, Clock, LogOut, Plus, Trash2, X, Download, 
  QrCode, ChevronRight, UploadCloud, TrendingUp, MapPin, Phone, User, 
  Zap, Check, IndianRupee, CloudRain, Sun, Wind, Droplets, Calendar, Globe,
  Camera, Aperture, Wand2, ScanLine, Settings, AlertCircle, CreditCard, Landmark,
  ShieldCheck, TrendingDown, Percent, Info, Sprout, Briefcase, MessageCircle, Send, HelpCircle, Bot, MessageSquare,
  Truck, Users, ArrowRight, Timer, Search, BarChart3, Map, Navigation, CheckCircle2, MessageCircle as ChatIcon, Bell, ArrowLeft,
  Star, Thermometer, Bug, Tag, Box, Layers
} from 'lucide-react';

// ==========================================
// 0. LANGUAGE & TRANSLATIONS
// ==========================================
const LanguageContext = createContext();

const TRANSLATIONS = {
  en: {
    app_name: "KhetFlow Logistics",
    welcome: "Welcome Back",
    become_rider: "Join Logistics Fleet",
    login_subtitle: "Access your delivery dashboard",
    register_subtitle: "Register your fleet vehicle",
    login: "Log In",
    register: "Register",
    create_account: "Create Account",
    dont_have_account: "Don't have an account?",
    already_have_account: "Already have an account?",
    full_name: "Full Name",
    phone: "Phone Number",
    vehicle_type: "Vehicle Type",
    plate_no: "License Plate No.",
    online: "Active",
    offline: "Offline",
    total_earnings: "TOTAL EARNINGS",
    deliveries: "DELIVERIES",
    rating: "RATING",
    logout: "Sign Out",
    report_issue: "Report Issue",
    tab_new: "Pending",
    tab_farm: "Pickup",
    tab_drop: "In Transit",
    tab_done: "Completed",
    tab_pool: "Milk Run",
    status_waiting: "AWAITING RIDER",
    status_go_farm: "PROCEED TO FARM",
    status_on_way: "IN TRANSIT",
    status_completed: "DELIVERED",
    btn_accept: "Accept Order",
    btn_verify: "Verify Cargo",
    btn_finish: "Complete Delivery",
    btn_cancel: "Cancel",
    btn_submit: "Submit Request",
    quality_check: "Cargo Quality Inspection",
    confirm_delivery: "Confirm Delivery & Payment",
    upload_proof: "Upload Proof of Delivery/Payment",
    earnings_history: "Transaction Ledger",
    report_title: "Logistics Support",
    issue_type: "Incident Category",
    desc: "Incident Details",
    alert_offline: "Your status is currently set to Offline. Go Active to receive dispatches.",
    no_orders: "No active dispatches in this queue.",
    fastest_growing: "Enterprise Agri-Logistics Network",
    pool_title: "Transport Pooling",
    create_pool: "Create Route",
    join_pool: "Join Route",
    capacity: "Capacity",
    filled: "Utilized",
    farmers_joined: "Nodes Joined",
    route: "Transit Route",
    status_full: "AT CAPACITY",
    status_open: "ACCEPTING CARGO",
    btn_create_route: "Initialize Route",
    btn_add_goods: "Add Cargo",
    departure_time: "Scheduled Departure",
    btn_receive_cargo: "Execute Custody Transfer"
  },
  hi: {
    app_name: "खेत-फ्लो राइडर",
    welcome: "वापसी पर स्वागत है",
    become_rider: "राइडर बनें",
    login_subtitle: "ऑर्डर देखने के लिए लॉगिन करें",
    register_subtitle: "जुड़ने के लिए फॉर्म भरें",
    login: "लॉगिन",
    register: "रजिस्टर",
    create_account: "खाता बनाएं",
    dont_have_account: "खाता नहीं है?",
    already_have_account: "पहले से खाता है?",
    full_name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    vehicle_type: "वाहन प्रकार",
    plate_no: "गाड़ी नंबर",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    total_earnings: "कुल कमाई",
    deliveries: "डिलीवरी",
    rating: "रेटिंग",
    logout: "लॉगआउट",
    report_issue: "समस्या बताएं",
    tab_new: "नये",
    tab_farm: "फार्म जाओ",
    tab_drop: "रास्ते में",
    tab_done: "पूर्ण",
    tab_pool: "पूलिंग",
    status_waiting: "राइडर का इंतज़ार",
    status_go_farm: "फार्म पर जाएं",
    status_on_way: "रास्ते में है",
    status_completed: "पूरा हुआ",
    btn_accept: "स्वीकार करें",
    btn_verify: "सत्यापित करें",
    btn_finish: "समाप्त करें",
    btn_cancel: "रद्द करें",
    btn_submit: "जमा करें",
    quality_check: "गुणवत्ता जाँच",
    confirm_delivery: "डिलीवरी की पुष्टि",
    upload_proof: "भुगतान सबूत अपलोड करें",
    earnings_history: "कमाई का इतिहास",
    report_title: "समस्या रिपोर्ट करें",
    issue_type: "समस्या का प्रकार",
    desc: "विवरण",
    alert_offline: "आप अभी ऑफलाइन हैं। नए ऑर्डर देखने के लिए ऑनलाइन आएं।",
    no_orders: "यहाँ कोई ऑर्डर नहीं है।",
    fastest_growing: "सबसे तेजी से बढ़ता डिलीवरी नेटवर्क",
    pool_title: "परिवहन पूलिंग",
    create_pool: "पूल बनाएं",
    join_pool: "पूल में जुड़ें",
    capacity: "क्षमता",
    filled: "भरा हुआ",
    farmers_joined: "किसान/राइडर्स",
    route: "रूट",
    status_full: "पूर्ण",
    status_open: "खुला है",
    btn_create_route: "रूट बनाएं",
    btn_add_goods: "सामान जोड़ें",
    departure_time: "प्रस्थान का समय",
    btn_receive_cargo: "स्थानांतरित माल प्राप्त करें"
  },
  as: {
    heroSubtitle: 'অসম্পূৰ্ণ উৎপাদনক সঠিক লাভলৈ পৰিৱৰ্তন কৰক',
    heroDesc: 'গ্ৰেড বি আৰু চি সামগ্ৰী বিক্ৰী কৰক যি নহলে নষ্ট হৈ যাব। শূন্য আৱৰ্জনা, উন্নত আয়।',
    startSelling: 'এতিয়াই বিক্ৰী আৰম্ভ কৰক',
    betterPrices: 'উন্নত দাম',
    zeroWaste: 'শূন্য আৱৰ্জনা',
    happyBuyers: 'সুখী ক্ৰেতা',
    welcomeBack: 'স্বাগতম',
    joinKhetFlow: 'KhetFlow ত যোগদান কৰক',
    loginDesc: 'আপোনাৰ কৃষি পৰিচালনা কৰিবলৈ লগ ইন কৰক',
    regDesc: 'অধিক উপাৰ্জন কৰিবলৈ পঞ্জীয়ন কৰক',
    yourName: 'আপোনাৰ নাম',
    farmName: 'খেতিৰ নাম',
    email: 'ইমেইল ঠিকনা',
    password: 'পাছৱৰ্ড',
    phone: 'ফোন নম্বৰ',
    location: 'খেতিৰ স্থান',
    login: 'লগ ইন',
    createAccount: 'একাউণ্ট সৃষ্টি কৰক',
    dontHaveAcc: "একাউণ্ট নাই নেকি?",
    alreadyHaveAcc: "ইতিমধ্যে একাউণ্ট আছে?",
    createFarmerAcc: 'কৃষকৰ একাউণ্ট খোলক',
    loginHere: 'ইয়াত লগ ইন কৰক',
    listings: 'তালিকা',
    orders: 'অৰ্ডাৰ',
    payments: 'পেমেন্ট',
    active: 'সক্ৰিয়',
    earned: 'উপাৰ্জন',
    pending: 'বাকী',
    yourHarvest: 'আপোনাৰ ফচল',
    addProduct: 'সামগ্ৰী যোগ কৰক',
    addNewListing: 'নতুন তালিকা যোগ কৰক',
    prodName: 'সামগ্ৰীৰ নাম',
    qty: 'পৰিমাণ (কেজি)',
    price: 'দাম / কেজি (₹)',
    grade: 'গ্ৰেড',
    desc: 'বিৱৰণ',
    publish: 'প্ৰকাশ কৰক',
    noListings: 'কোনো তালিকা নাই',
    createFirst: 'প্ৰথম তালিকা সৃষ্টি কৰক',
    receivedOrders: 'প্ৰাপ্ত অৰ্ডাৰ',
    paymentHistory: 'পেমেন্টৰ ইতিহাস',
    farmerDash: 'কৃষক ডেশ্ববৰ্ড',
    aiScan: 'AI স্কেন',
    scanProduce: 'সামগ্ৰী স্কেন কৰক',
    khetScore: 'খেত স্কোৰ',
    creditHistory: 'ক্ৰেডিট ইতিহাস',
    loanEligible: 'ঋণৰ যোগ্যতা',
    scoreGood: 'ভাল',
    scoreLow: 'উন্নতিৰ প্ৰয়োজন',
    scoreExcellent: 'অতি উত্তম',
    buildScore: 'স্কোৰ বঢ়াবলৈ অধিক বিক্ৰী কৰক',
    transport: 'পৰিবহণ',
    shareTruck: 'ট্ৰাক ভাগ কৰক',
    availablePools: 'উপলব্ধ ট্ৰাক',
    joinPool: 'যোগদান কৰক',
    capacityLeft: 'বাকী থকা ক্ষমতা',
    mandiRates: 'বজাৰৰ দৰ',
    mandi: 'মাণ্ডি',
    searchCrop: 'শস্য বিচাৰক...',
    priceTrend: 'দৰৰ প্ৰৱণতা'
  },
  pa: {
    heroSubtitle: 'ਅਧੂਰੀ ਉਪਜ ਨੂੰ ਪੂਰੇ ਮੁਨਾਫੇ ਵਿੱਚ ਬਦਲੋ',
    heroDesc: 'ਗ੍ਰੇਡ ਬੀ ਅਤੇ ਸੀ ਉਪਜ ਵੇਚੋ ਜੋ ਨਹੀਂ ਤਾਂ ਵਿਅਰਥ ਜਾਵੇਗੀ। ਜ਼ੀਰੋ ਵੇਸਟ, ਬਿਹਤਰ ਆਮਦਨ।',
    startSelling: 'ਹੁਣੇ ਵੇਚਣਾ ਸ਼ੁਰੂ ਕਰੋ',
    betterPrices: 'ਵਧੀਆ ਕੀਮਤਾਂ',
    zeroWaste: 'ਜ਼ੀਰੋ ਵੇਸਟ',
    happyBuyers: 'ਖੁਸ਼ ਖਰੀਦਦਾਰ',
    welcomeBack: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    joinKhetFlow: 'ਖੇਤਫਲੋ ਨਾਲ ਜੁੜੋ',
    loginDesc: 'ਆਪਣੀ ਫਸਲ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ',
    regDesc: 'ਵਧੇਰੇ ਕਮਾਈ ਕਰਨ ਲਈ ਰਜਿਸਟਰ ਕਰੋ',
    yourName: 'ਤੁਹਾਡਾ ਨਾਮ',
    farmName: 'ਖੇਤ ਦਾ ਨਾਮ',
    email: 'ਈਮੇਲ ਪਤਾ',
    password: 'ਪਾਸਵਰਡ',
    phone: 'ਫੋਨ ਨੰਬਰ',
    location: 'ਖੇਤ ਦਾ ਟਿਕਾਣਾ',
    login: 'ਲੌਗਇਨ',
    createAccount: 'ਖਾਤਾ ਬਣਾਓ',
    dontHaveAcc: "ਕੀ ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    alreadyHaveAcc: "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
    createFarmerAcc: 'ਕਿਸਾਨ ਖਾਤਾ ਬਣਾਓ',
    loginHere: 'ਇੱਥੇ ਲੌਗਇਨ ਕਰੋ',
    listings: 'ਸੂਚੀਆਂ',
    orders: 'ਆਰਡਰ',
    payments: 'ਭੁਗਤਾਨ',
    active: 'ਸਰਗਰਮ',
    earned: 'ਕਮਾਈ',
    pending: 'ਬਕਾਇਆ',
    yourHarvest: 'ਤੁਹਾਡੀ ਫਸਲ',
    addProduct: 'ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ',
    addNewListing: 'ਨਵੀਂ ਸੂਚੀ ਸ਼ਾਮਲ ਕਰੋ',
    prodName: 'ਉਤਪਾਦ ਦਾ ਨਾਮ',
    qty: 'ਮਾਤਰਾ (ਕਿਲੋ)',
    price: 'ਕੀਮਤ / ਕਿਲੋ (₹)',
    grade: 'ਗ੍ਰੇਡ',
    desc: 'ਵੇਰਵਾ',
    publish: 'ਸੂਚੀ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ',
    noListings: 'ਅਜੇ ਕੋਈ ਸੂਚੀ ਨਹੀਂ',
    createFirst: 'ਪਹਿਲੀ ਸੂਚੀ ਬਣਾਓ',
    receivedOrders: 'ਪ੍ਰਾਪਤ ਆਰਡਰ',
    paymentHistory: 'ਭੁਗਤਾਨ ਇਤਿਹਾਸ',
    farmerDash: 'ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ',
    aiScan: 'AI ਸਕੈਨ',
    scanProduce: 'ਉਪਜ ਸਕੈਨ ਕਰੋ',
    khetScore: 'ਖੇਤ ਸਕੋਰ',
    creditHistory: 'ਕ੍ਰੈਡਿਟ ਇਤਿਹਾਸ',
    loanEligible: 'ਕਰਜ਼ਾ ਯੋਗਤਾ',
    scoreGood: 'ਵਧੀਆ',
    scoreLow: 'ਸੁਧਾਰ ਦੀ ਲੋੜ',
    scoreExcellent: 'ਬਹੁਤ ਵਧੀਆ',
    buildScore: 'ਸਕੋਰ ਵਧਾਉਣ ਲਈ ਹੋਰ ਵੇਚੋ',
    transport: 'ਆਵਾਜਾਈ',
    shareTruck: 'ਟਰੱਕ ਸਾਂਝਾ ਕਰੋ',
    availablePools: 'ਉਪਲਬਧ ਟਰੱਕ',
    joinPool: 'ਸ਼ਾਮਲ ਹੋਵੋ',
    capacityLeft: 'ਬਾਕੀ ਸਮਰੱਥਾ',
    mandiRates: 'ਮੰਡੀ ਦੇ ਭਾਅ',
    mandi: 'ਮੰਡੀ',
    searchCrop: 'ਫਸਲ ਖੋਜੋ...',
    priceTrend: 'ਕੀਮਤ ਦਾ ਰੁਝਾਨ'
  },
  ur: {
    heroSubtitle: 'نامکمل پیداوار کو مکمل منافع میں بدلیں',
    heroDesc: 'گریڈ بی اور سی کی پیداوار بیچیں جو ورنہ ضائع ہو جاتی۔ صفر فضلہ، بہتر آمدنی۔',
    startSelling: 'اب بیچنا شروع کریں',
    betterPrices: 'بہتر قیمتیں',
    zeroWaste: 'صفر فضلہ',
    happyBuyers: 'خوش خریدار',
    welcomeBack: 'خوش آمدید',
    joinKhetFlow: 'کھیت فلو میں شامل ہوں',
    loginDesc: 'اپنی فصل کا انتظام کرنے کے لیے لاگ ان کریں',
    regDesc: 'مزید کمانے کے لیے رجسٹر کریں',
    yourName: 'آپ کا نام',
    farmName: 'کھیت کا نام',
    email: 'ای میل پتہ',
    password: 'پاس ورڈ',
    phone: 'فون نمبر',
    location: 'کھیت کا مقام',
    login: 'لاگ ان',
    createAccount: 'اکاؤنٹ بنائیں',
    dontHaveAcc: "اکاؤنٹ نہیں ہے؟",
    alreadyHaveAcc: "پہلے سے اکاؤنٹ ہے؟",
    createFarmerAcc: 'کسان اکاؤنٹ بنائیں',
    loginHere: 'یہاں لاگ ان کریں',
    listings: 'فہرستیں',
    orders: 'آرڈرز',
    payments: 'ادائیگیاں',
    active: 'فعال',
    earned: 'کمایا',
    pending: 'زیر التوا',
    yourHarvest: 'آپ کی فصل',
    addProduct: 'پروڈکٹ شامل کریں',
    addNewListing: 'نئی فہرست شامل کریں',
    prodName: 'پروڈکٹ کا نام',
    qty: 'مقدار (کلوگرام)',
    price: 'قیمت / کلوگرام (₹)',
    grade: 'گریڈ',
    desc: 'تفصیل',
    publish: 'فہرست شائع کریں',
    noListings: 'ابھی کوئی فہرست نہیں',
    createFirst: 'پہلی فہرست بنائیں',
    receivedOrders: 'موصولہ آرڈرز',
    paymentHistory: 'ادائیگی کی تاریخ',
    farmerDash: 'کسان ڈیش بورڈ',
    aiScan: 'AI اسکین',
    scanProduce: 'پیداوار اسکین کریں',
    khetScore: 'کھیت اسکور',
    creditHistory: 'کریڈٹ ہسٹری',
    loanEligible: 'قرض کی اہلیت',
    scoreGood: 'اچھا',
    scoreLow: 'بہتری کی ضرورت',
    scoreExcellent: 'بہترین',
    buildScore: 'اسکور بڑھانے کے لیے مزید بیچیں',
    transport: 'نقل و حمل',
    shareTruck: 'ٹرک شیئر کریں',
    availablePools: 'دستیاب ٹرک',
    joinPool: 'شامل ہوں',
    capacityLeft: 'باقی گنجائش',
    mandiRates: 'منڈی کے نرخ',
    mandi: 'منڈی',
    searchCrop: 'فصل تلاش کریں...',
    priceTrend: 'قیمت کا رجحان'
  },
  hr: {
    heroSubtitle: 'हल्की फसल का भी बढ़िया मुनाफा कमाओ',
    heroDesc: 'B और C ग्रेड की फसल बेचो जो वैसे ही खराब हो जावे थी। ना बर्बादी, ज्यादा कमाई, खुशहाली।',
    startSelling: 'इब बेचना शुरू करो',
    betterPrices: 'बढ़िया भाव',
    zeroWaste: 'ना होवे बर्बादी',
    happyBuyers: 'राजी गाहक',
    welcomeBack: 'राम राम जी',
    joinKhetFlow: 'खेतफ्लो तै जुड़ो',
    loginDesc: 'अपनी फसल सम्भालण खातिर लॉगिन करो',
    regDesc: 'फालतू कमावण खातिर रजिस्टर करो',
    yourName: 'थारा नाम',
    farmName: 'खेत का नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    phone: 'फोन नंबर',
    location: 'खेत कित्त सै',
    login: 'लॉगिन',
    createAccount: 'खाता बणाओ',
    dontHaveAcc: "खाता कोनी के?",
    alreadyHaveAcc: "पहलां ई खाता सै?",
    createFarmerAcc: 'जमींदार खाता बणाओ',
    loginHere: 'उरे लॉगिन करो',
    listings: 'लिस्टिंग',
    orders: 'ऑर्डर',
    payments: 'रुपये',
    active: 'चालू',
    earned: 'कमाई',
    pending: 'रुक रया',
    yourHarvest: 'थारी फसल',
    addProduct: 'फसल जोड़ो',
    addNewListing: 'नई फसल चढ़ाओ',
    prodName: 'फसल का नाम',
    qty: 'वजन (किलो)',
    price: 'भाव / किलो (₹)',
    grade: 'ग्रेड',
    desc: 'ब्यौरा',
    publish: 'लिस्टिंग लगाओ',
    noListings: 'इब तक कोई फसल कोनी',
    createFirst: 'पहली फसल चढ़ाओ',
    receivedOrders: 'आये होये ऑर्डर',
    paymentHistory: 'लेन-देन का हिसाब',
    farmerDash: 'जमींदार डैशबोर्ड',
    aiScan: 'AI स्कैन',
    scanProduce: 'फसल देखो',
    khetScore: 'खेत स्कोर',
    creditHistory: 'उधारी खाता',
    loanEligible: 'लोन मिल सकै',
    scoreGood: 'बढ़िया',
    scoreLow: 'हल्का सै',
    scoreExcellent: 'कती ए जहर',
    buildScore: 'स्कोर बढ़ावण खातिर और बेचो',
    transport: 'ढुलाई',
    shareTruck: 'ट्रक साझा करो',
    availablePools: 'चालू ट्रक',
    joinPool: 'मिल के चलो',
    capacityLeft: 'जगह बची सै',
    mandiRates: 'मंडी का भाव',
    mandi: 'मंडी',
    searchCrop: 'फसल ढूंढो...',
    priceTrend: 'भाव का हाल'
  }
};

// ==========================================
// 1. ANIMATED BACKGROUND & MOBILE CSS
// ==========================================
function AnimatedBackground() {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: '#F8FAFC', zIndex: -1 }}></div>
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0F172A; margin: 0; padding: 0; }
        
        .tab-btn { 
            position: relative; padding: 0.75rem 1rem; font-weight: 600; color: #64748B; 
            border-bottom: 2px solid transparent; transition: all 0.2s; cursor: pointer; font-size: 0.9rem;
        }
        .tab-btn.active { color: #16A34A; border-bottom: 2px solid #16A34A; font-weight: 700; }
        .tab-btn:hover:not(.active) { color: #334155; }
        
        .dashboard-card {
            background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: box-shadow 0.2s, transform 0.2s;
        }
        .dashboard-card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transform: translateY(-2px); }

        .form-input {
            width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #CBD5E1; 
            background: #FFFFFF; color: #0F172A; font-size: 0.95rem; outline: none; transition: all 0.2s; box-sizing: border-box;
        }
        .form-input:focus { border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }
        
        .btn-primary {
            background: #16A34A; color: #FFFFFF; padding: 0.75rem 1.5rem; border-radius: 8px; border: none;
            font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .btn-primary:hover { background: #15803D; }
        .btn-primary:disabled { background: #94A3B8; cursor: not-allowed; }

        .btn-secondary {
            background: #FFFFFF; color: #334155; padding: 0.75rem 1.5rem; border-radius: 8px; border: 1px solid #CBD5E1;
            font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .btn-secondary:hover { background: #F8FAFC; border-color: #94A3B8; }

        /* --- EXTREME MOBILE COMPRESSION CSS --- */
        @media (max-width: 768px) {
            .responsive-pad { padding: 1rem !important; }
            .dashboard-card { padding: 1rem !important; }
            
            /* Landing Page Compression */
            .landing-container { padding: 0.5rem !important; align-items: flex-start !important; padding-top: 3.5rem !important; }
            .landing-badge { margin-bottom: 0.5rem !important; font-size: 0.7rem !important; padding: 0.25rem 0.5rem !important; }
            .responsive-text { font-size: 2rem !important; line-height: 1.1 !important; margin-bottom: 0.25rem !important; }
            .responsive-sub { font-size: 0.85rem !important; margin-bottom: 1rem !important; line-height: 1.3 !important; }
            
            /* Squeeze the 3 feature cards into 3 columns */
            .landing-features { 
                grid-template-columns: repeat(3, 1fr) !important; 
                gap: 0.5rem !important; 
                margin-bottom: 1rem !important; 
            }
            .feature-card { padding: 0.5rem !important; text-align: center !important; }
            .feature-icon-wrapper { margin-bottom: 0.25rem !important; }
            .feature-icon-wrapper svg { width: 18px !important; height: 18px !important; margin: 0 auto; }
            .feature-val { font-size: 1rem !important; margin-bottom: 0 !important; }
            .feature-lbl { font-size: 0.7rem !important; margin-bottom: 0 !important; }
            .feature-desc { font-size: 0.55rem !important; line-height: 1.1 !important; }
            
            /* Milk run banner shrink */
            .milk-run-banner { padding: 1rem !important; gap: 0.75rem !important; margin-bottom: 1rem !important; border-radius: 16px !important; }
            .milk-run-header { gap: 0.5rem !important; }
            .milk-run-header h3 { font-size: 1.1rem !important; }
            .milk-run-header p { font-size: 0.7rem !important; }
            .milk-run-header svg { width: 20px !important; height: 20px !important; }
            .milk-run-icon-bg { padding: 0.5rem !important; border-radius: 8px !important; }
            
            .milk-run-grid { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
            .milk-run-card { padding: 0.75rem !important; }
            .milk-run-card p { font-size: 0.75rem !important; line-height: 1.4 !important; }
            
            /* Buttons & Auth Forms */
            .responsive-btn-container { flex-direction: row !important; gap: 0.5rem !important; justify-content: center !important; flex-wrap: nowrap !important; }
            .responsive-btn { min-width: 0 !important; width: 100% !important; flex: 1; padding: 0.75rem 0.25rem !important; font-size: 0.85rem !important; }
            
            .auth-card { padding: 1.5rem !important; }
            .auth-header { margin-bottom: 1rem !important; }
            .auth-header svg { width: 24px !important; height: 24px !important; }
            .auth-header h1 { font-size: 1.2rem !important; margin-bottom: 0.2rem !important; }
            .auth-header p { font-size: 0.75rem !important; }
            .form-input { padding: 0.6rem 0.8rem !important; font-size: 0.85rem !important; }
            .auth-form { gap: 0.5rem !important; }
            .auth-footer { margin-top: 1rem !important; padding-top: 1rem !important; }

            .lang-toggle-wrap { top: 0.5rem !important; right: 0.5rem !important; }
            .lang-toggle-btn { padding: 4px 8px !important; font-size: 0.75rem !important; }
            .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ==========================================
// 1.5 REAL RIDER HOME MAP COMPONENT
// ==========================================
function RiderHomeMap({ isOnline }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [location, setLocation] = useState([26.1445, 91.7362]); // Default Guwahati
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          setError("Location access denied. Using default map center.");
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const initMap = () => {
        if (mapRef.current || !mapContainerRef.current) return;
        const map = window.L.map(mapContainerRef.current, { zoomControl: false }).setView(location, 14);
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const userIcon = window.L.divIcon({
            html: `<div style="background: ${isOnline ? '#10B981' : '#94A3B8'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.3)'};"></div>`,
            className: '', iconSize: [20, 20], iconAnchor: [10, 10]
        });

        markerRef.current = window.L.marker(location, { icon: userIcon }).addTo(map);
        mapRef.current = map;
    };

    if (!window.L) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = initMap; document.head.appendChild(script);
    } else {
        initMap();
    }

    return () => {
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []); 

  // Update map view & marker when location or online status changes without re-initializing
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
        mapRef.current.setView(location, 14);
        const userIcon = window.L.divIcon({
            html: `<div style="background: ${isOnline ? '#10B981' : '#94A3B8'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.3)'};"></div>`,
            className: '', iconSize: [20, 20], iconAnchor: [10, 10]
        });
        markerRef.current.setIcon(userIcon);
        markerRef.current.setLatLng(location);
    }
  }, [location, isOnline]);

  return (
    <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', height: '300px', position: 'relative', marginBottom: '2rem', zIndex: 10 }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1, position: 'absolute', inset: 0 }}></div>
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? '#10B981' : '#94A3B8' }}></div>
            <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#0F172A' }}>{isOnline ? 'Searching for nearby dispatches...' : 'You are offline'}</span>
        </div>
        {error && <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10, background: '#FEF2F2', color: '#DC2626', padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #FECACA' }}>{error}</div>}
    </div>
  );
}

// ==========================================
// 2. POOLING COMPONENT
// ==========================================
function TransportPooling({ user, riderData }) {
  const { t } = useContext(LanguageContext);
  const [pools, setPools] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [joinId, setJoinId] = useState(null);
  const [poolTab, setPoolTab] = useState('available');
  const [activeRun, setActiveRun] = useState(null);
  
  const isMiddleMileVehicle = riderData?.vehicleType === 'truck' || riderData?.vehicleType === 'bus';

  const [newPool, setNewPool] = useState({ origin: '', destination: '', capacity: '', departureTime: '' });
  const [joinWeight, setJoinWeight] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'transport_pools'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPools(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!newPool.origin || !newPool.destination || !newPool.capacity || !newPool.departureTime) return;
    
    try {
      await addDoc(collection(db, 'transport_pools'), {
        origin: newPool.origin,
        destination: newPool.destination,
        totalCapacity: parseInt(newPool.capacity),
        filledCapacity: 0,
        departureTime: newPool.departureTime, 
        farmerCount: 0,
        status: 'open',
        createdBy: user.uid,
        driverName: riderData?.riderName || 'Driver',
        vehicleType: riderData?.vehicleType || 'truck',
        createdAt: serverTimestamp()
      });
      setShowCreate(false);
      setNewPool({ origin: '', destination: '', capacity: '', departureTime: '' });
      alert("Route created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoinPool = async (pool) => {
    if (!joinWeight || !pickupLocation) {
        alert("Please provide both weight and your pickup location along the route.");
        return;
    }
    const weight = parseInt(joinWeight);
    
    if (pool.filledCapacity + weight > pool.totalCapacity) {
      alert("Exceeds capacity! Only " + (pool.totalCapacity - pool.filledCapacity) + "kg space left.");
      return;
    }

    try {
      const isFull = (pool.filledCapacity + weight) >= pool.totalCapacity;
      
      await updateDoc(doc(db, 'transport_pools', pool.id), {
        filledCapacity: increment(weight),
        farmerCount: increment(1),
        status: isFull ? 'full' : 'open'
      });

      await addDoc(collection(db, `transport_pools/${pool.id}/joiners`), {
          riderId: user.uid,
          riderName: riderData?.riderName,
          weightAdded: weight,
          pickupLocation: pickupLocation,
          timestamp: serverTimestamp()
      });

      setJoinId(null);
      setJoinWeight('');
      setPickupLocation('');
      alert("Successfully joined the transport pool!");
    } catch (err) {
      alert(err.message);
    }
  };

  const ActiveRunView = ({ pool, onClose }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const initMap = () => {
            if (mapRef.current || !mapContainerRef.current) return;
            
            // Initialize Leaflet Map over Bengaluru (to match screenshot)
            const map = window.L.map(mapContainerRef.current, { zoomControl: false }).setView([12.99, 77.61], 13);
            
            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
            }).addTo(map);

            // Mock coordinates for stops
            const route = [
                [12.9716, 77.5946], // Stop 1
                [12.9850, 77.6050], // Stop 2
                [13.0050, 77.6200], // Stop 3
                [13.0200, 77.6400]  // Stop 4
            ];

            // Draw Route
            window.L.polyline(route, { color: '#0F172A', weight: 4 }).addTo(map);

            // Add Markers
            route.forEach((coord, i) => {
                const isNext = i === 0;
                const icon = window.L.divIcon({
                    html: `<div style="background: ${isNext ? '#0F766E' : '#16A34A'}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${i + 1}</div>`,
                    className: '', iconSize: [24, 24], iconAnchor: [12, 12]
                });
                window.L.marker(coord, { icon }).addTo(map);
            });

            map.fitBounds(window.L.latLngBounds(route).pad(0.2));
            mapRef.current = map;

            setTimeout(() => { map.invalidateSize(); }, 300);
        };

        if (!window.L) {
            const link = document.createElement('link');
            link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }

        return () => {
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        };
    }, [pool]);

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#F8FAFC', zIndex: 10000, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0F766E', padding: '1rem 1.5rem', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0 }}><ArrowLeft size={24}/></button>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Active Run</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Pool ID: #{pool.id.substring(0,8).toUpperCase()}</p>
                    </div>
                </div>
                <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><ChatIcon size={18}/></button>
            </div>

            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
                {/* Guaranteed Real Map Container */}
                <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 1, minHeight: '100%' }}></div>

                {/* Overlays matching screenshot perfectly */}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', background: '#FFFFFF', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', zIndex: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: '#0F766E', fontWeight: '700' }}>Transport Pooling (Milk Run)</h4>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B', fontWeight: '500' }}>{pool.farmerCount || 0 + 2} Stops • {Math.floor(Math.random() * 10 + 5)} km • Est. Extra ₹{(pool.totalCapacity || 100) * 0.5}</p>
                        </div>
                        <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Active</span>
                    </div>
                </div>

                {/* Float Buttons */}
                <button className="btn-secondary" style={{ position: 'absolute', bottom: '140px', left: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 10 }}>Re-optimize</button>
                <button className="btn-secondary" style={{ position: 'absolute', bottom: '140px', right: '1rem', width: '40px', height: '40px', padding: 0, borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 10 }}><MapPin size={18}/></button>

                {/* Next Stop Card */}
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', zIndex: 10 }}>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: '600', fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Stop</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ width: '24px', height: '24px', background: '#0F766E', borderRadius: '50%', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>Rohit Sharma</h4>
                                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#64748B' }}>221B, 7th Cross, Koramangala, Bengaluru</p>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: '#0F172A' }}>0.8 km away</p>
                            </div>
                        </div>
                        <button style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F766E', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><Phone size={18}/></button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button onClick={onClose} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Navigate</button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      
      {activeRun && <ActiveRunView pool={activeRun} onClose={() => setActiveRun(null)} />}

      <div style={{ background: '#0F766E', padding: '1.5rem', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Transport Pooling</h2>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0', opacity: 0.9 }}>Earn More with Milk Run</p>
        </div>
        <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={24} color="white"/>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
          <div onClick={() => setPoolTab('available')} className={`tab-btn flex-1 text-center ${poolTab === 'available' ? 'active' : ''}`}>
              Available Pools
          </div>
          <div onClick={() => setPoolTab('my_pools')} className={`tab-btn flex-1 text-center ${poolTab === 'my_pools' ? 'active' : ''}`}>
              My Pools
          </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        
        {isMiddleMileVehicle && poolTab === 'available' && !showCreate && (
            <button onClick={() => setShowCreate(true)} style={{ width: '100%', background: '#F8FAFC', border: '1px dashed #94A3B8', color: '#0F766E', padding: '1rem', borderRadius: '8px', fontWeight: '600', marginBottom: '1.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                + Create New Milk Run Route
            </button>
        )}

        {showCreate && isMiddleMileVehicle && (
          <div className="responsive-pad" style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#0F172A', fontSize: '1rem', fontWeight: '600' }}>{t('btn_create_route')}</h3>
            <form onSubmit={handleCreatePool} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="form-input" placeholder="Origin (e.g. Nashik)" value={newPool.origin} onChange={e => setNewPool({...newPool, origin: e.target.value})} required />
                <input className="form-input" placeholder="Destination (e.g. Mumbai)" value={newPool.destination} onChange={e => setNewPool({...newPool, destination: e.target.value})} required />
              </div>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input className="form-input" type="number" placeholder="Total Capacity (kg)" value={newPool.capacity} onChange={e => setNewPool({...newPool, capacity: e.target.value})} required />
                <input className="form-input" type="datetime-local" placeholder={t('departure_time')} value={newPool.departureTime} onChange={e => setNewPool({...newPool, departureTime: e.target.value})} required />
              </div>
              <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary responsive-btn" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary responsive-btn" style={{ flex: 2 }}>Create Route</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pools.length === 0 ? <p style={{ textAlign: 'center', color: '#64748B', padding: '2rem', fontSize: '0.95rem' }}>No pools available right now.</p> : null}
          
          {pools.filter(p => poolTab === 'available' ? p.status !== 'full' : true).map((pool, index) => {
            const isFull = pool.status === 'full';
            
            return (
              <div key={pool.id} className="dashboard-card" style={{ padding: '1.25rem', position: 'relative' }}>
                
                {index === 0 && poolTab === 'available' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0F766E', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Bell size={12} /> Recommended Route
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0F172A', fontWeight: '600' }}>Pool ID: #{pool.id.substring(0,8).toUpperCase()}</h4>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>{pool.farmerCount || 0 + 2} Stops • {Math.floor(Math.random() * 10 + 5)}.{Math.floor(Math.random() * 9)} km</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>Est. Extra</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A' }}>₹{(pool.totalCapacity || 100) * 0.5}</span>
                    </div>
                </div>

                <div style={{ position: 'relative', height: '40px', margin: '1rem 0' }}>
                   <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', height: '2px', background: 'transparent', borderTop: '2px dashed #0F766E', transform: 'translateY(-50%)' }}></div>
                   <div style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#0F766E', zIndex: 2 }}></div>
                   <div style={{ position: 'absolute', top: '50%', left: '35%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#0F766E', zIndex: 2 }}></div>
                   <div style={{ position: 'absolute', top: '50%', left: '65%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#0F766E', zIndex: 2 }}></div>
                   <div style={{ position: 'absolute', top: '50%', left: '95%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#0F766E', border: '2px solid white', boxShadow: '0 0 0 1px #0F766E', zIndex: 2 }}></div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0 0 1.25rem 0', fontWeight: '500' }}>
                    Pickup: {(Math.random() * 2 + 0.1).toFixed(1)} km away
                </p>

                {poolTab === 'available' ? (
                    joinId === pool.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <input 
                            className="form-input"
                            type="text" 
                            placeholder="Pickup Location (e.g. NH37 Gate)" 
                            value={pickupLocation}
                            onChange={e => setPickupLocation(e.target.value)}
                            style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input 
                                className="form-input"
                                type="number" 
                                placeholder="kg" 
                                autoFocus
                                value={joinWeight} 
                                onChange={e => setJoinWeight(e.target.value)}
                                style={{ width: '80px', padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                              />
                              <button onClick={() => handleJoinPool(pool)} className="btn-primary" style={{ flex: 1, padding: '0.6rem' }}>Confirm</button>
                              <button onClick={() => {setJoinId(null); setPickupLocation('');}} className="btn-secondary" style={{ padding: '0 1rem' }}><X size={16}/></button>
                          </div>
                        </div>
                    ) : (
                        <button 
                          onClick={() => setJoinId(pool.id)}
                          className={isFull ? 'btn-secondary' : 'btn-primary'}
                          style={{ width: '100%' }}
                          disabled={isFull}
                        >
                          {isFull ? 'Pool Full' : 'Join Pool'}
                        </button>
                    )
                ) : (
                    <button 
                      onClick={() => setActiveRun(pool)}
                      className="btn-secondary"
                      style={{ width: '100%', borderColor: '#0F766E', color: '#0F766E' }}
                    >
                      View Active Run
                    </button>
                )}
              </div>
            );
          })}
        </div>

        {poolTab === 'available' && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#0F172A', fontSize: '0.95rem', fontWeight: '600' }}>How it Works</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                        <MapPin size={16} color="#0F766E" /> Join a pool with multiple stops
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                        <Navigation size={16} color="#0F766E" /> Follow the optimized route
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                        <IndianRupee size={16} color="#0F766E" /> Complete all stops & earn extra
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 3. MODALS 
// ==========================================

function LanguageToggle({ style }) {
  const { lang, setLang } = useContext(LanguageContext);
  return (
    <button 
      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
      className="lang-toggle-btn"
      style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px 12px',
        fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)', color: '#334155', ...style
      }}
    >
      <Globe size={14} /> {lang === 'en' ? 'Hindi' : 'English'}
    </button>
  );
}

function ReportIssueModal({ user, onClose }) {
  const { t } = useContext(LanguageContext);
  const [type, setType] = useState('breakdown');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!desc) return alert('Please describe the issue');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'issues'), {
        riderId: user.uid,
        type,
        description: desc,
        status: 'open',
        timestamp: serverTimestamp()
      });
      alert('Issue reported. Support will contact you shortly.');
      onClose();
    } catch (e) {
      alert(e.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}><AlertCircle size={20} color="#DC2626"/> {t('report_title')}</h2>
        <div style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>{t('issue_type')}</label>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
            <option value="breakdown">Vehicle Breakdown</option>
            <option value="accident">Accident</option>
            <option value="shop_closed">Shop/Farm Closed</option>
            <option value="wrong_location">Wrong Location</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>{t('desc')}</label>
          <textarea className="form-input" value={desc} onChange={e => setDesc(e.target.value)} rows="4" style={{ resize: 'none' }} />
        </div>
        <div className="responsive-btn-container" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary responsive-btn" onClick={onClose} style={{ flex: 1 }}>{t('btn_cancel')}</button>
          <button className="btn-primary responsive-btn" onClick={handleSubmit} disabled={submitting} style={{ flex: 1, background: '#DC2626' }}>{submitting ? '...' : t('btn_submit')}</button>
        </div>
      </div>
    </div>
  );
}

function EarningsModal({ orders, onClose }) {
  const { t } = useContext(LanguageContext);
  const history = orders
    .filter(o => o.status === 'delivered')
    .sort((a, b) => (b.deliveredAt?.seconds || 0) - (a.deliveredAt?.seconds || 0));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: 0, width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18}/> {t('earnings_history')}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20}/></button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748B', marginTop: '2rem', fontSize: '0.9rem' }}>No history yet.</p>
          ) : (
            history.map(order => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '0.9rem' }}>#{order.id.substring(0,6)}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {order.deliveredAt ? new Date(order.deliveredAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: '#16A34A' }}>
                  + ₹{Math.floor((order.deliveryFee || 150) * 0.9)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DeliveryPaymentModal({ order, onClose, onConfirm }) {
  const { t } = useContext(LanguageContext);
  const [paymentPhoto, setPaymentPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const deliveryFee = order.deliveryFee || 150; 
  const riderEarnings = Math.floor(deliveryFee * 0.90);
  const isCOD = order.paymentMethod === 'cod' || order.paymentMethod === 'pay_on_delivery';

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { alert('Photo too large!'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setPaymentPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (isCOD && !paymentPhoto) {
      alert("⚠️ Since this is Pay on Delivery, you must upload a photo of the received payment (Cash or UPI screen).");
      return;
    }
    setIsUploading(true);
    await onConfirm(paymentPhoto, riderEarnings);
    setIsUploading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="dashboard-card responsive-pad" style={{ padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: '#ECFDF5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><CheckCircle2 size={24} color="#10B981"/></div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{t('confirm_delivery')}</h2>
          <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '0.9rem' }}>Complete this order to get paid.</p>
        </div>
        
        <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Earnings</p>
          <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>₹{riderEarnings}</p>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.5rem', margin: 0 }}>Base Fare + Surge Bonus included</p>
        </div>

        {isCOD ? (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <IndianRupee size={20} color="#C2410C" />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#9A3412', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>Collect Cash: ₹{order.totalAmount}</p>
                <p style={{ fontSize: '0.8rem', color: '#C2410C', margin: 0 }}>Customer pays via Cash or UPI</p>
              </div>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '1px dashed #CBD5E1', borderRadius: '8px', cursor: 'pointer', background: paymentPhoto ? '#F8FAFC' : '#FFFFFF', transition: 'all 0.2s' }}>
              <Camera size={24} color="#64748B" style={{ marginBottom: '0.5rem' }}/>
              <span style={{ color: '#475569', fontWeight: '500', fontSize: '0.9rem' }}>{paymentPhoto ? 'Proof Captured' : t('upload_proof')}</span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} style={{ display: 'none' }} />
            </label>
            {paymentPhoto && <img src={paymentPhoto} alt="Proof" style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '1rem', borderRadius: '8px' }} />}
          </div>
        ) : (
          <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CreditCard size={20} color="#3B82F6" />
            <div style={{ textAlign: 'left' }}>
                <p style={{ color: '#1E40AF', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>Pre-paid Order</p>
                <p style={{ color: '#64748B', fontSize: '0.8rem', margin: 0 }}>Do not collect any cash from customer.</p>
            </div>
          </div>
        )}

        <div className="responsive-btn-container" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onClose} className="btn-secondary responsive-btn" style={{ flex: 1 }}>{t('btn_cancel')}</button>
          <button onClick={handleSubmit} disabled={isUploading || (isCOD && !paymentPhoto)} className="btn-primary responsive-btn" style={{ flex: 1.5 }}>{isUploading ? 'Verifying...' : t('btn_finish')}</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. QR SCANNER + VERIFICATION MODAL
// ==========================================
function VerificationModal({ order, onClose, onVerify, riderData }) {
  const { t } = useContext(LanguageContext);
  const [scannedData, setScannedData] = useState(null);
   
  const [checklist, setChecklist] = useState({
    freshness: false, packaging: false, quantity: false, noticeable_damage: false,
    temperature_check: false, color_check: false, no_pests: false, labeling_correct: false
  });
   
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState('');
  const [scannerInitialized, setScannnerInitialized] = useState(false);

  useEffect(() => {
    let scanner = null;

    const initScanner = () => {
      const element = document.getElementById('qr-reader');
      if (element && !scanner) {
        scanner = new Html5QrcodeScanner('qr-reader', {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [0, 1] 
        }, false);

        scanner.render(
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              setScannedData(data);
              scanner.clear();
            } catch (e) {
              alert('Invalid QR code format! Must be JSON.');
            }
          },
          (error) => { /* Ignore scan errors */ }
        );
        setScannnerInitialized(true);
      }
    };

    const timer = setTimeout(initScanner, 200);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(err => console.error("Scanner cleanup error", err));
      }
    };
  }, []);

  const handlePhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVerify = async () => {
    if (!scannedData) { alert('Please scan QR code first!'); return; }
    if (!Object.values(checklist).every(v => v)) { alert('Please complete the entire quality checklist!'); return; }
    if (photos.length === 0) { alert('Please take at least one photo!'); return; }

    try {
      await addDoc(collection(db, 'verifications'), {
        orderId: order.id,
        riderId: riderData.uid, 
        riderName: riderData.riderName,
        scannedProduct: scannedData,
        checklist: checklist,
        photos: photos,
        notes: notes,
        timestamp: serverTimestamp(),
        status: 'verified'
      });

      await updateDoc(doc(db, 'orders', order.id), {
        status: 'picked',
        verificationCompleted: true,
        verificationPhotos: photos,
        verificationNotes: notes,
        updatedAt: serverTimestamp()
      });

      onVerify();
    } catch (error) {
      alert('Error verifying: ' + error.message);
    }
  };

  const checkListConfig = [
    { key: 'freshness', label: 'Freshness Check', icon: <Leaf size={16} /> },
    { key: 'packaging', label: 'Packaging Secure', icon: <Box size={16} /> },
    { key: 'quantity', label: 'Weight Verified', icon: <MapPin size={16} /> },
    { key: 'noticeable_damage', label: 'No Damage', icon: <Search size={16} /> },
    { key: 'temperature_check', label: 'Temperature', icon: <Thermometer size={16} /> },
    { key: 'color_check', label: 'Color Natural', icon: <Sun size={16} /> },
    { key: 'no_pests', label: 'No Pests', icon: <Bug size={16} /> },
    { key: 'labeling_correct', label: 'Labels OK', icon: <Tag size={16} /> }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '0', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{t('quality_check')}</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>Verify items before pickup</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!scannedData ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <QrCode size={32} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600', color: '#0F172A' }}>Step 1: Scan Farm QR</h3>
              <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Point your camera at the crate's QR code</p>
              <div id="qr-reader" style={{ borderRadius: '8px', margin: '0 auto', maxWidth: '300px', overflow: 'hidden' }}></div>
            </div>
          ) : (
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="#16A34A" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0F172A', margin: 0 }}>Farm Verified</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>{scannedData.farmName}</p>
                </div>
              </div>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Product</span>
                  <span style={{ fontWeight: '600', color: '#0F172A' }}>{scannedData.name}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Grade</span>
                  <span style={{ fontWeight: '600', color: '#0F172A' }}>{scannedData.grade}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Weight</span>
                  <span style={{ fontWeight: '600', color: '#0F172A' }}>{scannedData.quantity} kg</span>
                </div>
              </div>
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '600', color: '#0F172A' }}>Step 2: Quality Checklist</h3>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {checkListConfig.map((item) => (
                  <label key={item.key} style={{
                    display: 'flex', alignItems: 'center', padding: '0.75rem',
                    background: checklist[item.key] ? '#F0FDF4' : '#FFFFFF',
                    borderRadius: '8px', cursor: 'pointer',
                    border: checklist[item.key] ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                    transition: 'all 0.2s', userSelect: 'none'
                  }}>
                    <input type="checkbox" checked={checklist[item.key]} onChange={(e) => setChecklist({...checklist, [item.key]: e.target.checked})} style={{ width: '16px', height: '16px', marginRight: '0.75rem', cursor: 'pointer', accentColor: '#16A34A' }} />
                    <span style={{ color: checklist[item.key] ? '#16A34A' : '#64748B', marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500', color: checklist[item.key] ? '#15803D' : '#334155' }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '600', color: '#0F172A' }}>Step 3: Evidence</h3>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', border: '1px dashed #CBD5E1', borderRadius: '8px', cursor: 'pointer', background: '#F8FAFC', transition: 'all 0.2s' }}>
                <Camera size={24} color="#64748B" style={{ marginBottom: '0.5rem' }}/>
                <span style={{ color: '#0F766E', fontWeight: '500', fontSize: '0.9rem' }}>Capture Verification Photos</span>
                <input type="file" accept="image/*" multiple capture="environment" onChange={handlePhotoCapture} style={{ display: 'none' }} />
              </label>
              {photos.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Evidence ${i}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '1rem' }}>
              <textarea className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal logistics notes (optional)..." rows="2" style={{ resize: 'none' }} />
            </div>
          )}
        </div>

        {scannedData && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', position: 'sticky', bottom: 0 }}>
            <button onClick={handleVerify} disabled={!Object.values(checklist).every(v => v) || photos.length === 0} className="btn-primary" style={{ width: '100%' }}>
              {Object.values(checklist).every(v => v) && photos.length > 0 ? 'Confirm Custody Transfer' : 'Complete Checklist to Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- NEW HANDSHAKE MODAL FOR TRUCK DRIVERS ---
function HandshakeModal({ user, riderData, onClose, onConfirm }) {
  const { t } = useContext(LanguageContext);
  const [scannedData, setScannedData] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    let scanner = null;
    const initScanner = () => {
      const element = document.getElementById('handshake-qr-reader');
      if (element && !scanner) {
        element.innerHTML = ''; 
        scanner = new Html5QrcodeScanner('handshake-qr-reader', {
          fps: 10, 
          qrbox: { width: 250, height: 250 }, 
          aspectRatio: 1.0, 
          supportedScanTypes: [0, 1] 
        }, false);
        scanner.render(
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              setScannedData(data);
              scanner.clear();
            } catch (e) { 
              alert('Invalid QR format! Must be KhetFlow standard QR.'); 
            }
          },
          (error) => {}
        );
      }
    };
    const timer = setTimeout(initScanner, 250);
    return () => { 
      clearTimeout(timer); 
      if (scanner) scanner.clear().catch(e => console.error(e)); 
    };
  }, []);

  const handleConfirm = async () => {
    if (!scannedData) return;
    setIsTransferring(true);
    try {
      await addDoc(collection(db, 'transfers'), {
        middleMileRiderId: user.uid,
        middleMileRiderName: riderData.riderName,
        scannedData: scannedData,
        timestamp: serverTimestamp()
      });

      const q = query(collection(db, 'orders'), where('status', '==', 'picked'));
      const snapshot = await getDocs(q);
      
      let foundOrder = false;
      for (const document of snapshot.docs) {
        const oData = document.data();
        if (oData.farmName === scannedData.farmName || (oData.items && oData.items.some(i => i.farmerId === scannedData.farmerId))) {
           await updateDoc(doc(db, 'orders', document.id), {
             riderId: user.uid,
             riderName: riderData.riderName,
             riderPhone: riderData.phone || '',
             vehicleType: riderData.vehicleType || 'truck',
             transferredAt: serverTimestamp()
           });
           foundOrder = true;
        }
      }
      
      if (!foundOrder) {
          console.warn("No active order found for this farm transfer.");
      }

      onConfirm();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setIsTransferring(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '0', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Receive Cargo</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>Scan crate to take custody</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!scannedData ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <QrCode size={32} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600', color: '#0F172A' }}>Scan Handoff QR</h3>
              <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Scan the QR code from the farmer or first-mile rider</p>
              <div id="handshake-qr-reader" style={{ borderRadius: '8px', margin: '0 auto', maxWidth: '300px', overflow: 'hidden' }}></div>
            </div>
          ) : (
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="#16A34A" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0F172A', margin: 0 }}>Cargo Identified</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Ready for transfer</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.2rem' }}>ORIGIN (FARM)</span>
                  <span style={{ fontWeight: '600', color: '#0F172A' }}>{scannedData.farmName || 'Unknown Farm'}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                   <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.2rem' }}>COMMODITY</span>
                      <span style={{ fontWeight: '600', color: '#0F172A' }}>{scannedData.name}</span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.2rem' }}>WEIGHT</span>
                      <span style={{ fontWeight: '600', color: '#0F172A' }}>{scannedData.quantity} kg</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {scannedData && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', position: 'sticky', bottom: 0 }}>
            <button onClick={handleConfirm} disabled={isTransferring} className="btn-primary" style={{ width: '100%' }}>
              {isTransferring ? 'Transferring Custody...' : 'Confirm Custody Transfer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- LIVE TRACKING MAP MODAL (REAL MAP) ---
function LiveTrackingModal({ order, onClose }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const getStatusIndex = () => {
    if (order.status === 'pending' && !order.readyForPickup) return 0; 
    if (order.status === 'pending' && order.readyForPickup) return 1; 
    if (order.status === 'accepted') return 1;
    if (order.status === 'picked') return 2; 
    if (order.status === 'delivered') return 3; 
    return 0;
  };

  const statusIndex = getStatusIndex();
  const progressPercent = statusIndex === 0 ? 10 : statusIndex === 1 ? 33 : statusIndex === 2 ? 66 : 100;
  const isFarmerDriving = order.farmerSelfDelivery;

  useEffect(() => {
    const initMap = () => {
        if (mapRef.current || !mapContainerRef.current) return;
        
        // Initialize Leaflet Map over Bengaluru
        const map = window.L.map(mapContainerRef.current, { zoomControl: false }).setView([12.99, 77.61], 13);
        
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }).addTo(map);

        const route = [
            [12.9716, 77.5946], // Origin
            [13.0200, 77.6400]  // Destination
        ];

        window.L.polyline(route, { color: '#0F766E', weight: 4, dashArray: '10, 10' }).addTo(map);

        // Origin Marker
        const originIcon = window.L.divIcon({
            html: `<div style="background: #0F766E; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
            className: '', iconSize: [16, 16], iconAnchor: [8, 8]
        });
        window.L.marker(route[0], { icon: originIcon }).addTo(map);

        // Destination Marker
        const destIcon = window.L.divIcon({
            html: `<div style="background: #16A34A; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
            className: '', iconSize: [16, 16], iconAnchor: [8, 8]
        });
        window.L.marker(route[1], { icon: destIcon }).addTo(map);

        // Truck Marker (Positioned based on status)
        const currentLat = route[0][0] + (route[1][0] - route[0][0]) * (progressPercent / 100);
        const currentLng = route[0][1] + (route[1][1] - route[0][1]) * (progressPercent / 100);
        
        const truckIcon = window.L.divIcon({
            html: `<div style="background: white; border: 2px solid #0F766E; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"><span style="font-size: 16px;">${isFarmerDriving ? '🧑' : '🚛'}</span></div>`,
            className: '', iconSize: [32, 32], iconAnchor: [16, 16]
        });
        window.L.marker([currentLat, currentLng], { icon: truckIcon }).addTo(map);

        map.fitBounds(window.L.latLngBounds(route).pad(0.3));
        mapRef.current = map;

        setTimeout(() => { map.invalidateSize(); }, 300);
    };

    if (!window.L) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initMap;
        document.head.appendChild(script);
    } else {
        initMap();
    }

    return () => {
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [progressPercent, isFarmerDriving]);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000, padding: '1.5rem'
    }}>
      <div className="dashboard-card" style={{
        maxWidth: '800px', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Map size={20} color="#0F766E" /> Active Route
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Disptach Ref: {order.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Real Map Container - Using Absolute Positioning to Ensure Map Renders Perfectly behind overlays */}
        <div style={{ position: 'relative', width: '100%', height: '350px', background: '#E2E8F0', overflow: 'hidden' }}>
          <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 1, minHeight: '100%' }}></div>
          
          {/* Timeline Overlay at the bottom of the map */}
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
             <div style={{ position: 'relative', width: '100%', height: '12px' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '4px', background: 'transparent', borderTop: '2px dashed #CBD5E1', transform: 'translateY(-50%)' }}></div>
                <div style={{ position: 'absolute', top: '50%', left: 0, height: '4px', width: `${progressPercent}%`, background: '#0F766E', borderRadius: '4px', transform: 'translateY(-50%)', transition: 'width 1.5s ease-in-out' }}></div>
                
                {[0, 33, 66, 100].map((pos) => (
                   <div key={pos} style={{ position: 'absolute', top: '50%', left: `${pos}%`, transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: progressPercent >= pos ? '#0F766E' : '#FFFFFF', border: `2px solid ${progressPercent >= pos ? '#0F766E' : '#CBD5E1'}`, transition: 'all 0.5s' }}></div>
                ))}
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0%', transform: 'translateX(-50%)', color: '#334155', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', width: '60px' }}>Dispatched</div>
                <div style={{ position: 'absolute', left: '33%', transform: 'translateX(-50%)', color: '#334155', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', width: '60px' }}>At Origin</div>
                <div style={{ position: 'absolute', left: '66%', transform: 'translateX(-50%)', color: '#334155', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', width: '60px' }}>In Transit</div>
                <div style={{ position: 'absolute', left: '100%', transform: 'translateX(-50%)', color: '#334155', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', width: '60px' }}>Delivered</div>
             </div>
          </div>
        </div>

        {/* Details Footer */}
        <div style={{ padding: '1.5rem', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#0F766E' }}><Package size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', margin: '0 0 0.2rem 0' }}>COMMODITY</p>
              <p style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: '600', margin: 0 }}>{order.totalItems || order.items?.reduce((acc, i) => acc + i.cartQuantity, 0)}kg Cargo</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#16A34A' }}><Navigation size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', margin: '0 0 0.2rem 0' }}>LOGISTICS STATUS</p>
              <p style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <CheckCircle2 size={16} color="#16A34A"/> Network Tracked
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. LANDING PAGE
// ==========================================
function RiderLanding() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />
      <div className="lang-toggle-wrap" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 20 }}><LanguageToggle /></div>

      <div style={{ maxWidth: '1000px', textAlign: 'center', position: 'relative', zIndex: 10, width: '100%' }}>
        <div className="landing-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '2rem', color: '#0F766E', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Zap size={14} /> {t('fastest_growing')}
        </div>

        <h1 className="responsive-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', marginBottom: '1rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          KhetFlow <span style={{ color: '#16A34A' }}>Logistics</span>
        </h1>

        <p className="responsive-sub" style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Manage your fleet operations efficiently. Seamlessly connect with farms and businesses to execute optimized delivery routes.
        </p>

        <div className="landing-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Weekly Payouts', value: 'Assured', icon: <IndianRupee size={28} color="#16A34A" />, desc: 'Transparent earnings model' },
            { label: 'Route Optimization', value: 'Smart', icon: <Map size={28} color="#3B82F6" />, desc: 'Milk run technology' },
            { label: 'Fleet Management', value: 'Unified', icon: <Truck size={28} color="#0F766E" />, desc: 'Manage all vehicles' }
          ].map((stat, i) => (
            <div key={i} className="dashboard-card feature-card" style={{ padding: '2rem', textAlign: 'left' }}>
              <div className="feature-icon-wrapper" style={{ marginBottom: '1rem' }}>{stat.icon}</div>
              <div className="feature-val" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.25rem' }}>{stat.value}</div>
              <div className="feature-lbl" style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>{stat.label}</div>
              <div className="feature-desc" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* MILK RUN EXPLANATION SECTION - HIGHLY CORPORATE */}
        <div className="milk-run-banner" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0F766E 100%)', borderRadius: '24px', padding: '3rem', textAlign: 'left', color: 'white', display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem', boxShadow: '0 20px 40px -10px rgba(15, 118, 110, 0.4)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
            
            <div className="milk-run-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 10 }}>
                <div className="milk-run-icon-bg" style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Layers size={32} color="white" className="milk-run-icon"/>
                </div>
                <div>
                    <h3 className="milk-run-title" style={{ margin: 0, fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>The "Milk Run" Advantage</h3>
                    <p className="milk-run-sub" style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', color: '#A7F3D0', fontWeight: '600' }}>'मिल्क रन' का फायदा</p>
                </div>
            </div>
            
            <div className="milk-run-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', position: 'relative', zIndex: 10 }}>
                <div className="milk-run-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <p className="milk-run-text" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.7, opacity: 0.95, fontWeight: '500' }}>
                        Got a half-empty truck? Don't waste the space. KhetFlow's intelligent Milk Run system automatically pools Grade B & C produce from nearby farms along your existing transit routes. We fill your remaining capacity, you save on fuel overhead, and instantly multiply your earnings per trip.
                    </p>
                </div>
                <div className="milk-run-card hide-mobile" style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <p className="milk-run-text" style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.95, fontWeight: '500' }}>
                        क्या आपका ट्रक आधा खाली है? जगह बर्बाद न करें। खेतफ्लो का स्मार्ट 'मिल्क रन' सिस्टम आपके रास्ते में पड़ने वाले खेतों से ग्रेड B और C की उपज को खुद-ब-खुद जोड़ लेता है। हम आपकी बची हुई जगह भरते हैं, आप ईंधन बचाते हैं, और हर चक्कर में अपनी कमाई कई गुना बढ़ाते हैं।
                    </p>
                </div>
            </div>
        </div>

        <div className="responsive-btn-container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login')} className="btn-primary responsive-btn" style={{ minWidth: '180px' }}>
            {t('login')}
          </button>
          <button onClick={() => navigate('/register')} className="btn-secondary responsive-btn" style={{ minWidth: '180px' }}>
            {t('register')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. AUTH
// ==========================================
function AuthPage({ isLogin }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({ email: '', password: '', riderName: '', phone: '', vehicleType: 'bike', vehicleNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        navigate('/dashboard');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await setDoc(doc(db, 'riders', userCred.user.uid), { ...form, userType: 'rider', totalDeliveries: 0, totalEarnings: 0, rating: 5.0, createdAt: serverTimestamp(), isOnline: true });
        navigate('/dashboard');
      }
    } catch (err) { setError(err.message.replace('Firebase: ', '').replace('auth/', '')); } finally { setLoading(false); }
  };

  return (
    <div className="responsive-pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      <AnimatedBackground />
      <div className="lang-toggle-wrap" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 20 }}><LanguageToggle /></div>

      <div className="dashboard-card auth-card" style={{ padding: '3rem', maxWidth: '480px', width: '100%', position: 'relative', zIndex: 10 }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={32} color="#0F766E" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0F172A' }}>{isLogin ? t('welcome') : t('become_rider')}</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{isLogin ? t('login_subtitle') : t('register_subtitle')}</p>
        </div>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={16}/> {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <>
              <input className="form-input" type="text" placeholder={t('full_name')} value={form.riderName} onChange={(e) => setForm({...form, riderName: e.target.value})} required />
              <input className="form-input" type="tel" placeholder={t('phone')} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required />
            </>
          )}
          <input className="form-input" type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          <input className="form-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
          {!isLogin && (
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <select className="form-input" value={form.vehicleType} onChange={(e) => setForm({...form, vehicleType: e.target.value})} style={{ cursor: 'pointer' }}>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="tempo">Tempo</option>
                <option value="auto">Auto</option>
                <option value="truck">Truck</option>
                <option value="bus">Bus</option>
              </select>
              <input className="form-input" type="text" placeholder={t('plate_no')} value={form.vehicleNumber} onChange={(e) => setForm({...form, vehicleNumber: e.target.value})} required />
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : (isLogin ? t('login') : t('create_account'))}
          </button>
        </form>

        <div className="auth-footer" style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            {isLogin ? t('dont_have_account') + " " : t('already_have_account') + " "}
            <span onClick={() => navigate(isLogin ? '/register' : '/login')} style={{ color: '#16A34A', fontWeight: '600', cursor: 'pointer' }}>{isLogin ? t('register') : t('login')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

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
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}><div style={{ width: '32px', height: '32px', border: '3px solid #CBD5E1', borderTopColor: '#0F766E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>;
  }
  return user ? children : <Navigate to="/login" />;
}

// ==========================================
// 7. DASHBOARD
// ==========================================
function Dashboard() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [user, setUser] = useState(null);
  const [riderData, setRiderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [isOnline, setIsOnline] = useState(true);
   
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showHandshakeModal, setShowHandshakeModal] = useState(false); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null); 

  useEffect(() => {
    let ordersUnsubscribe;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await fetchRiderData(u);

        const q = query(collection(db, 'orders'));
        ordersUnsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(data);
        });
      }
      loading && setLoading(false);
    });

    return () => {
      unsubscribe();
      if (ordersUnsubscribe) ordersUnsubscribe(); 
    };
  }, []);

  const fetchRiderData = async (currentUser) => {
    try {
      const docRef = doc(db, 'riders', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRiderData({ uid: currentUser.uid, ...data });
        setIsOnline(data.isOnline !== false);
      } else {
        const defaultData = {
          riderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Rider',
          email: currentUser.email,
          phone: '',
          vehicleType: 'bike',
          vehicleNumber: '',
          userType: 'rider',
          totalDeliveries: 0,
          totalEarnings: 0,
          rating: 5.0,
          createdAt: serverTimestamp(),
          isOnline: true
        };
        await setDoc(docRef, defaultData);
        setRiderData({ uid: currentUser.uid, ...defaultData });
      }
    } catch (error) {
      console.error('Error fetching rider data:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    try { if (user) await updateDoc(doc(db, 'riders', user.uid), { isOnline: newState }); } 
    catch (error) { setIsOnline(!newState); }
  };

  const openDirections = (origin, destination) => { 
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`, '_blank'); 
  };
  const callNumber = (number) => { window.location.href = `tel:${number}`; };

  const handleAcceptOrder = async (order) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: 'accepted', riderId: user.uid, riderName: riderData?.riderName || 'Unknown', riderPhone: riderData?.phone || '', acceptedAt: serverTimestamp() });
      setFilter('accepted');
    } catch (error) { alert('Error: ' + error.message); }
  };

  const handleVerifyPickup = (order) => {
    if (!riderData) { alert("Rider data still loading. Please wait a moment."); return; }
    setSelectedOrder(order);
    setShowVerificationModal(true);
  };

  const handleDeliverOrder = (order) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };

  const handleDeliveryComplete = async (paymentPhoto, earnings) => {
    try {
      await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'delivered', paymentStatus: 'paid', paymentProof: paymentPhoto || null, deliveredAt: serverTimestamp() });
      await updateDoc(doc(db, 'riders', user.uid), { totalEarnings: increment(earnings), totalDeliveries: increment(1) });
      setRiderData(prev => ({ ...prev, totalEarnings: (prev.totalEarnings || 0) + earnings, totalDeliveries: (prev.totalDeliveries || 0) + 1 }));
      setShowDeliveryModal(false);
      setSelectedOrder(null);
    } catch (e) { alert(e.message); }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}><div style={{ width: '32px', height: '32px', border: '3px solid #CBD5E1', borderTopColor: '#0F766E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>;

  const isMiddleMileVehicle = riderData?.vehicleType === 'truck' || riderData?.vehicleType === 'bus';

  const filteredOrders = orders.filter(order => {
    if (filter === 'pooling') return false; 
    if (isMiddleMileVehicle) return false; 
    if (!isOnline && filter === 'pending') return false;
    
    if (filter === 'pending') {
      if (order.status !== 'pending') return false;
      if (order.farmerSelfDelivery === true) return false; 
      if (isMiddleMileVehicle) return false; 
      return true; 
    }
    
    if (filter === 'accepted') return order.status === 'accepted' && order.riderId === user.uid;
    if (filter === 'picked') return order.status === 'picked' && order.riderId === user.uid;
    if (filter === 'delivered') return order.status === 'delivered' && order.riderId === user.uid;
    return false;
  });

  return (
    <div className="responsive-pad" style={{ minHeight: '100vh', padding: '1.5rem', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatedBackground />

      {/* --- ALL MODALS --- */}
      {trackingOrder && (
         <LiveTrackingModal 
            order={trackingOrder} 
            onClose={() => setTrackingOrder(null)} 
         />
      )}

      {showVerificationModal && selectedOrder && riderData && (
        <VerificationModal
          order={selectedOrder}
          riderData={riderData}
          onClose={() => { setShowVerificationModal(false); setSelectedOrder(null); }}
          onVerify={async () => {
            setShowVerificationModal(false);
            setSelectedOrder(null);
            setFilter('picked');
          }}
        />
      )}

      {showDeliveryModal && selectedOrder && <DeliveryPaymentModal order={selectedOrder} onClose={() => { setShowDeliveryModal(false); setSelectedOrder(null); }} onConfirm={handleDeliveryComplete} />}
      {showReportModal && <ReportIssueModal user={user} onClose={() => setShowReportModal(false)} />}
      {showEarningsModal && <EarningsModal orders={orders.filter(o => o.riderId === user.uid)} onClose={() => setShowEarningsModal(false)} />}
      
      {showHandshakeModal && riderData && (
         <HandshakeModal
           user={user}
           riderData={riderData}
           onClose={() => setShowHandshakeModal(false)}
           onConfirm={async () => {
             setShowHandshakeModal(false);
             setFilter('picked'); 
           }}
         />
      )}

      {/* Header */}
      <div className="dashboard-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F766E' }}>
            {riderData?.vehicleType === 'truck' ? <Truck /> : <Truck />}
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.2rem', color: '#0F172A' }}>{riderData?.riderName || 'Rider'}</h1>
            <div onClick={toggleOnlineStatus} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', background: isOnline ? '#ECFDF5' : '#F1F5F9', border: `1px solid ${isOnline ? '#A7F3D0' : '#E2E8F0'}` }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#10B981' : '#94A3B8' }}></div>
              <p style={{ color: isOnline ? '#059669' : '#64748B', fontSize: '0.75rem', fontWeight: '600', margin: 0, textTransform: 'uppercase' }}>{isOnline ? t('online') : t('offline')}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowReportModal(true)} className="btn-secondary" style={{ padding: '0.5rem' }} title={t('report_issue')}><AlertCircle size={18} color="#64748B"/></button>
          <LanguageToggle style={{ padding: '0.5rem' }} />
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem' }} title={t('logout')}><LogOut size={18} color="#DC2626"/></button>
        </div>
      </div>

      {/* Stats */}
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
        <div onClick={() => setShowEarningsModal(true)} className="dashboard-card" style={{ cursor: 'pointer', background: '#0F766E', padding: '1.5rem', gridColumn: '1 / -1', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#CCFBF1', marginBottom: '0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('total_earnings')}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1, color: '#FFFFFF', margin: 0 }}>₹{riderData?.totalEarnings || 0}</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}><IndianRupee size={24} color="#FFFFFF"/></div>
          </div>
        </div>
        <div className="dashboard-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '0.5rem' }}><Package size={20} color="#0F766E"/></div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A' }}>{riderData?.totalDeliveries || 0}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginTop: '0.2rem' }}>{t('deliveries')}</div>
        </div>
        <div className="dashboard-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '0.5rem' }}><Star size={20} color="#F59E0B"/></div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A' }}>{riderData?.rating || 5.0}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginTop: '0.2rem' }}>{t('rating')}</div>
        </div>
      </div>

      {/* NEW HANDSHAKE BUTTON FOR MIDDLE MILE VEHICLES */}
      {isMiddleMileVehicle && (
        <div style={{ position: 'relative', zIndex: 10, marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setShowHandshakeModal(true)} 
            className="btn-primary"
          >
            <Camera size={18} /> {t('btn_receive_cargo') || 'Receive Transferred Cargo'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', position: 'relative', zIndex: 10, overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        {[
          { key: 'pending', label: t('tab_new') },
          { key: 'accepted', label: t('tab_farm') },
          { key: 'picked', label: t('tab_drop') },
          { key: 'delivered', label: t('tab_done') },
          { key: 'pooling', label: t('tab_pool') }
        ].map((tab) => (
          <button 
            key={tab.key} 
            onClick={() => setFilter(tab.key)} 
            style={{ 
               background: filter === tab.key ? '#0F172A' : '#FFFFFF', 
               border: filter === tab.key ? '1px solid #0F172A' : '1px solid #E2E8F0', 
               color: filter === tab.key ? '#FFFFFF' : '#475569', 
               padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' 
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* NEW UBER-STYLE HOME MAP */}
      <RiderHomeMap isOnline={isOnline} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {filter === 'pooling' ? (
          <TransportPooling user={user} riderData={riderData} />
        ) : (
          <>
            {filter === 'pending' && !isOnline && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>{t('alert_offline')}</div>}

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                <Package size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem' }}/>
                <p style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: '500', margin: 0 }}>{t('no_orders')}</p>
                {filter === 'pending' && isMiddleMileVehicle && (
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.5rem' }}>Your vehicle is set to Large Capacity. Check the Pooling tab to create routes.</p>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.map((order) => (
                  <div key={order.id} className="dashboard-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: order.status === 'pending' ? '#F59E0B' : order.status === 'accepted' ? '#3B82F6' : order.status === 'picked' ? '#8B5CF6' : '#10B981' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                      <span style={{ background: '#F8FAFC', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#64748B', border: '1px solid #E2E8F0' }}>Ref: #{order.id.substring(0, 8)}</span>
                      <span style={{ color: order.status === 'pending' ? '#D97706' : order.status === 'accepted' ? '#2563EB' : order.status === 'picked' ? '#7C3AED' : '#059669', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {order.status === 'pending' && t('status_waiting')}
                        {order.status === 'accepted' && t('status_go_farm')}
                        {order.status === 'picked' && t('status_on_way')}
                        {order.status === 'delivered' && t('status_completed')}
                      </span>
                    </div>

                    {/* Locations Timeline */}
                    <div style={{ paddingLeft: '0.5rem', position: 'relative', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'absolute', left: '0.8rem', top: '10px', bottom: '25px', width: '2px', borderLeft: '2px solid #E2E8F0', zIndex: 0 }}></div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '10px', height: '10px', background: '#3B82F6', borderRadius: '50%', marginTop: '6px', border: '2px solid white', boxShadow: '0 0 0 1px #3B82F6' }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                  <div><p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600', marginBottom: '2px', letterSpacing: '0.05em' }}>ORIGIN</p><p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{order.farmName || 'Green Valley Farms'}</p><p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.1rem 0 0 0' }}>{order.farmAddress || 'Sector 4, Nashik Road'}</p></div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '50%', marginTop: '6px', border: '2px solid white', boxShadow: '0 0 0 1px #10B981' }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                  <div><p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600', marginBottom: '2px', letterSpacing: '0.05em' }}>DESTINATION</p><p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{order.businessName || 'Fresh Mart'}</p><p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.1rem 0 0 0' }}>{order.deliveryAddress}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', paddingLeft: '0.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#334155', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Package size={14}/> {order.totalItems} kg</div>
                      <div style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#334155', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><IndianRupee size={14}/> {order.paymentMethod === 'cod' ? 'Cash Collect' : 'Pre-Paid'}</div>
                    </div>

                    {/* NEW NAVIGATION BUTTONS */}
                    {(order.status === 'accepted' || order.status === 'picked') && (
                        <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', marginLeft: '0.5rem' }}>
                            <button 
                                onClick={() => setTrackingOrder(order)}
                                className="btn-secondary responsive-btn"
                                style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                            >
                                <Map size={16} /> Internal Tracker
                            </button>
                            <button 
                                onClick={() => openDirections(order.farmAddress || 'Nashik', order.deliveryAddress)}
                                className="btn-secondary responsive-btn"
                                style={{ flex: 1, borderColor: '#3B82F6', color: '#3B82F6', padding: '0.6rem', fontSize: '0.85rem' }}
                            >
                                <MapPin size={16} /> Google Maps
                            </button>
                        </div>
                    )}

                    <div className="responsive-btn-container" style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '0.5rem', gap: '1rem' }}>
                      <div><p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600', marginBottom: '2px', letterSpacing: '0.05em' }}>PAYOUT</p><p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#16A34A', margin: 0 }}>₹{Math.floor((order.deliveryFee || 150) * 0.9)}</p></div>
                      {order.status === 'pending' && <button onClick={() => handleAcceptOrder(order)} className="btn-primary responsive-btn" style={{ padding: '0.6rem 1.5rem' }}>{t('btn_accept')}</button>}
                      {order.status === 'accepted' && <button onClick={() => handleVerifyPickup(order)} className="btn-primary responsive-btn" style={{ padding: '0.6rem 1.5rem' }}>{t('btn_verify')}</button>}
                      {order.status === 'picked' && <button onClick={() => handleDeliverOrder(order)} className="btn-primary responsive-btn" style={{ padding: '0.6rem 1.5rem' }}>{t('btn_finish')}</button>}
                      {order.status === 'delivered' && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: '600', fontSize: '0.9rem' }}><CheckCircle2 size={18}/> Settled</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RiderLanding />} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}