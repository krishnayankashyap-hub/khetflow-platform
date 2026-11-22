import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, query, where, serverTimestamp, increment, onSnapshot, orderBy, arrayUnion } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Leaf, Package, ShoppingBag, Clock, LogOut, Plus, Trash2, X, Download, 
  QrCode, ChevronRight, UploadCloud, TrendingUp, MapPin, Phone, User, 
  Zap, Check, IndianRupee, CloudRain, Sun, Wind, Droplets, Calendar, Globe,
  Camera, Aperture, Wand2, ScanLine, Settings, AlertCircle, CreditCard, Landmark,
  ShieldCheck, TrendingDown, Percent, Info, Sprout, Briefcase, MessageCircle, Send, HelpCircle, Bot, MessageSquare,
  Truck, Users, ArrowRight, Timer, Search, BarChart3, Map, Navigation, CheckCircle2, MessageCircle as ChatIcon, Bell, ArrowLeft,
  Star, Thermometer, Bug, Tag, Box, Layers, Crosshair, RefreshCw
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
    login_subtitle: "Access your fleet dispatch & routing console",
    register_subtitle: "Register your commercial or last-mile vehicle",
    login: "Log In",
    register: "Register",
    create_account: "Create Fleet Account",
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
    rating: "FLEET RATING",
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
    btn_accept: "Accept Dispatch",
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
    alert_offline: "Your status is currently set to Offline. Switch to Active to receive live dispatches.",
    no_orders: "No active dispatches in this queue.",
    fastest_growing: "Enterprise Agri-Logistics Network",
    pool_title: "Transport Pooling (Milk Run)",
    create_pool: "Create Route",
    join_pool: "Join Route",
    capacity: "Capacity",
    filled: "Utilized",
    farmers_joined: "Nodes Joined",
    route: "Transit Route",
    status_full: "AT CAPACITY",
    status_open: "ACCEPTING CARGO",
    btn_create_route: "Initialize Milk-Run Route",
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
    tab_pool: "मिल्क रन",
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
    pool_title: "परिवहन पूलिंग (मिल्क रन)",
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

// Free, reliable, zero-API-key OpenStreetMap tile loader
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const loadLeafletAssets = (onReady) => {
  if (window.L) {
    onReady();
    return;
  }
  if (!document.getElementById('leaflet-css-cdn')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css-cdn';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  const existingScript = document.getElementById('leaflet-js-cdn');
  if (existingScript) {
    existingScript.addEventListener('load', onReady);
  } else {
    const script = document.createElement('script');
    script.id = 'leaflet-js-cdn';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = onReady;
    document.head.appendChild(script);
  }
};

// Deterministic metric helper so pool UI never flickers on re-render
const getPoolMetrics = (pool) => {
  const seed = (pool.id || 'KF01').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const stops = Math.max(2, (pool.farmerCount || 0) + 2);
  const distanceKm = Number((((seed % 12) + 4) + ((seed % 9) / 10)).toFixed(1));
  const pickupAwayKm = Number((((seed % 18) + 2) / 10).toFixed(1));
  const estExtra = Math.round((pool.totalCapacity || 100) * 0.5) + ((pool.farmerCount || 0) * 35);
  return { stops, distanceKm, pickupAwayKm, estExtra };
};

// ==========================================
// 1. CORPORATE DESIGN SYSTEM & MOBILE CSS
// ==========================================
function AnimatedBackground() {
  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 12% 8%, rgba(15, 118, 110, 0.06) 0%, transparent 40%), radial-gradient(circle at 88% 18%, rgba(22, 163, 74, 0.05) 0%, transparent 38%), #F4F7FA',
        zIndex: -1
      }}></div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

        * { box-sizing: border-box; }
        body {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: #0F172A;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          background: #F4F7FA;
        }

        /* Subtle corporate map styling on OpenStreetMap tiles */
        .corporate-map .leaflet-tile-pane {
          filter: saturate(0.82) contrast(1.03) brightness(1.01);
        }
        .leaflet-control-attribution {
          font-size: 10px !important;
          background: rgba(255,255,255,0.85) !important;
          backdrop-filter: blur(4px);
          border-top-left-radius: 6px;
        }

        .tab-btn {
          position: relative;
          padding: 0.9rem 1.25rem;
          font-weight: 600;
          color: #64748B;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
          font-size: 0.9rem;
          user-select: none;
        }
        .tab-btn.active {
          color: #0F766E;
          border-bottom: 2px solid #0F766E;
          font-weight: 700;
          background: rgba(15, 118, 110, 0.03);
        }
        .tab-btn:hover:not(.active) {
          color: #0F172A;
          background: #F8FAFC;
        }

        .dashboard-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03);
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .dashboard-card:hover {
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.07);
          border-color: #CBD5E1;
        }

        .stat-card-interactive {
          cursor: pointer;
        }
        .stat-card-interactive:hover {
          transform: translateY(-2px);
        }

        .form-input {
          width: 100%;
          padding: 0.78rem 1rem;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          color: #0F172A;
          font-size: 0.92rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: #94A3B8; font-weight: 400; }
        .form-input:focus {
          border-color: #0F766E;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.14);
        }

        .btn-primary {
          background: linear-gradient(135deg, #0F766E 0%, #15803D 100%);
          color: #FFFFFF;
          padding: 0.75rem 1.4rem;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 2px 6px rgba(15, 118, 110, 0.24);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(15, 118, 110, 0.3);
          filter: brightness(1.04);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled {
          background: #94A3B8;
          box-shadow: none;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #FFFFFF;
          color: #1E293B;
          padding: 0.75rem 1.4rem;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-secondary:hover:not(:disabled) {
          background: #F8FAFC;
          border-color: #94A3B8;
          color: #0F172A;
        }
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .corp-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.28rem 0.7rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .dashboard-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: 1.45fr 1fr 1fr;
          gap: 1rem;
        }

        /* --- RESPONSIVE MOBILE OPTIMIZATIONS --- */
        @media (max-width: 768px) {
          .responsive-pad { padding: 0.9rem !important; }
          .dashboard-card { border-radius: 14px !important; }
          .kpi-grid { grid-template-columns: 1fr 1fr !important; }
          .kpi-earnings-card { grid-column: 1 / -1 !important; }
          .responsive-grid { grid-template-columns: 1fr !important; }

          .landing-nav { padding: 0.75rem 1rem !important; }
          .landing-container { padding: 1rem !important; padding-top: 4.5rem !important; }
          .landing-badge { margin-bottom: 0.75rem !important; font-size: 0.7rem !important; padding: 0.3rem 0.65rem !important; }
          .responsive-text { font-size: 2rem !important; line-height: 1.12 !important; margin-bottom: 0.5rem !important; }
          .responsive-sub { font-size: 0.9rem !important; margin-bottom: 1.5rem !important; line-height: 1.45 !important; }

          .landing-features {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
            margin-bottom: 1.5rem !important;
          }
          .feature-card { padding: 1.15rem !important; }

          .milk-run-banner { padding: 1.35rem !important; gap: 1rem !important; margin-bottom: 1.75rem !important; border-radius: 16px !important; }
          .milk-run-header h3 { font-size: 1.25rem !important; }
          .milk-run-header p { font-size: 0.85rem !important; }
          .milk-run-grid { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
          .milk-run-card { padding: 1rem !important; }
          .milk-run-card p { font-size: 0.85rem !important; line-height: 1.5 !important; }

          .responsive-btn-container { flex-direction: row !important; gap: 0.5rem !important; flex-wrap: wrap !important; }
          .responsive-btn { min-width: 0 !important; flex: 1; padding: 0.7rem 0.6rem !important; font-size: 0.84rem !important; }

          .auth-card { padding: 1.5rem !important; }
          .auth-header { margin-bottom: 1.25rem !important; }
          .form-input { padding: 0.68rem 0.85rem !important; font-size: 0.88rem !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ==========================================
// 1.5 REAL RIDER HOME MAP COMPONENT (FIXED OSM)
// ==========================================
function RiderHomeMap({ isOnline, activeOrdersCount = 0 }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [location, setLocation] = useState([26.1445, 91.7362]); // Default Guwahati, Assam
  const [gpsStatus, setGpsStatus] = useState('Guwahati Logistics Zone');
  const [error, setError] = useState(null);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextCoords = [position.coords.latitude, position.coords.longitude];
          setLocation(nextCoords);
          setGpsStatus('Live GPS Locked');
          setError(null);
          if (mapRef.current) {
            mapRef.current.flyTo(nextCoords, 14, { duration: 0.8 });
          }
        },
        () => {
          setError("GPS unavailable — showing Guwahati Hub");
          setGpsStatus('Guwahati Logistics Zone');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initMap = () => {
      if (!isMounted || mapRef.current || !mapContainerRef.current || !window.L) return;

      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false
      }).setView(location, 13);

      window.L.tileLayer(OSM_TILE_URL, {
        attribution: OSM_ATTRIBUTION,
        maxZoom: 19
      }).addTo(map);

      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Hub reference markers around Guwahati corridor
      const hubs = [
        { coords: [26.1158, 91.7086], title: 'Azara Farm Aggregation Node' },
        { coords: [26.1402, 91.7305], title: 'Jalukbari Transit Cross-Dock' },
        { coords: [26.1850, 91.7700], title: 'Guwahati HORECA Dispatch Zone' }
      ];

      hubs.forEach((hub) => {
        const hubIcon = window.L.divIcon({
          html: `<div style="background:#0F172A;color:#FFF;width:24px;height:24px;border-radius:8px;border:2px solid #FFF;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;box-shadow:0 3px 8px rgba(15,23,42,0.25);">K</div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        window.L.marker(hub.coords, { icon: hubIcon }).addTo(map).bindPopup(`<b>${hub.title}</b>`);
      });

      const userIcon = window.L.divIcon({
        html: `<div style="background:${isOnline ? '#10B981' : '#64748B'};width:18px;height:18px;border-radius:50%;border:3px solid #FFFFFF;animation:${isOnline ? 'pulseRing 2s infinite' : 'none'};box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      markerRef.current = window.L.marker(location, { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Your Vehicle Location</b>');

      mapRef.current = map;
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 250);
    };

    loadLeafletAssets(initMap);

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current && window.L) {
      mapRef.current.setView(location, 13);
      const userIcon = window.L.divIcon({
        html: `<div style="background:${isOnline ? '#10B981' : '#64748B'};width:18px;height:18px;border-radius:50%;border:3px solid #FFFFFF;animation:${isOnline ? 'pulseRing 2s infinite' : 'none'};box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      markerRef.current.setIcon(userIcon);
      markerRef.current.setLatLng(location);
    }
  }, [location, isOnline]);

  return (
    <div className="dashboard-card corporate-map" style={{ padding: 0, overflow: 'hidden', height: '310px', position: 'relative', marginBottom: '1.5rem', zIndex: 10 }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1, position: 'absolute', inset: 0 }}></div>

      {/* Top Left Telemetry Pill */}
      <div style={{
        position: 'absolute', top: '0.9rem', left: '0.9rem', zIndex: 400,
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
        padding: '0.55rem 0.95rem', borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)', border: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', gap: '0.6rem'
      }}>
        <div style={{
          width: '9px', height: '9px', borderRadius: '50%',
          background: isOnline ? '#10B981' : '#94A3B8',
          animation: isOnline ? 'pulseRing 2s infinite' : 'none'
        }}></div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0F172A', lineHeight: 1.2 }}>
            {isOnline ? (activeOrdersCount > 0 ? `${activeOrdersCount} Active Dispatches Nearby` : 'Radar Active • Scanning Zone') : 'Fleet Unit Offline'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '500' }}>{gpsStatus}</div>
        </div>
      </div>

      {/* Top Right Recenter Button */}
      <button
        type="button"
        onClick={requestLocation}
        title="Recenter to Live GPS"
        style={{
          position: 'absolute', top: '0.9rem', right: '0.9rem', zIndex: 400,
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.55rem 0.8rem',
          display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)', color: '#0F766E', fontWeight: '600', fontSize: '0.78rem'
        }}
      >
        <Crosshair size={15} /> Recenter
      </button>

      {error && (
        <div style={{
          position: 'absolute', bottom: '0.9rem', left: '0.9rem', zIndex: 400,
          background: 'rgba(254, 242, 242, 0.96)', color: '#B91C1C',
          padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.73rem',
          fontWeight: '600', border: '1px solid #FECACA'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. POOLING COMPONENT (FULLY WORKABLE)
// ==========================================
function TransportPooling({ user, riderData }) {
  const { t } = useContext(LanguageContext);
  const [pools, setPools] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [joinId, setJoinId] = useState(null);
  const [poolTab, setPoolTab] = useState('available');
  const [activeRun, setActiveRun] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [joinedIdsLocal, setJoinedIdsLocal] = useState([]);
  const [statusBanner, setStatusBanner] = useState(null);

  const [newPool, setNewPool] = useState({ origin: '', destination: '', capacity: '', departureTime: '' });
  const [joinWeight, setJoinWeight] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'transport_pools'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setPools(data);
    }, (err) => {
      console.error('Transport pools listener error:', err);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg, type = 'success') => {
    setStatusBanner({ msg, type });
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!newPool.origin || !newPool.destination || !newPool.capacity || !newPool.departureTime) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'transport_pools'), {
        origin: newPool.origin.trim(),
        destination: newPool.destination.trim(),
        totalCapacity: parseInt(newPool.capacity, 10),
        filledCapacity: 0,
        departureTime: newPool.departureTime,
        farmerCount: 0,
        status: 'open',
        createdBy: user.uid,
        joinedRiders: [user.uid],
        driverName: riderData?.riderName || 'Fleet Partner',
        vehicleType: riderData?.vehicleType || 'tempo',
        vehicleNumber: riderData?.vehicleNumber || '',
        createdAt: serverTimestamp()
      });
      setShowCreate(false);
      setNewPool({ origin: '', destination: '', capacity: '', departureTime: '' });
      setPoolTab('my_pools');
      showToast('Milk-Run route initialized and published to the network.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinPool = async (pool) => {
    if (!joinWeight || !pickupLocation.trim()) {
      showToast('Please enter both cargo weight (kg) and your pickup point.', 'error');
      return;
    }
    const weight = parseInt(joinWeight, 10);
    if (isNaN(weight) || weight <= 0) {
      showToast('Enter a valid positive weight in kg.', 'error');
      return;
    }
    const remaining = (pool.totalCapacity || 0) - (pool.filledCapacity || 0);
    if (weight > remaining) {
      showToast(`Exceeds capacity! Only ${remaining} kg remaining on this route.`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const isFull = ((pool.filledCapacity || 0) + weight) >= (pool.totalCapacity || 0);

      await updateDoc(doc(db, 'transport_pools', pool.id), {
        filledCapacity: increment(weight),
        farmerCount: increment(1),
        status: isFull ? 'full' : 'open',
        joinedRiders: arrayUnion(user.uid)
      });

      await addDoc(collection(db, `transport_pools/${pool.id}/joiners`), {
        riderId: user.uid,
        riderName: riderData?.riderName || 'Rider',
        riderPhone: riderData?.phone || '',
        weightAdded: weight,
        pickupLocation: pickupLocation.trim(),
        timestamp: serverTimestamp()
      });

      setJoinedIdsLocal(prev => [...new Set([...prev, pool.id])]);
      setJoinId(null);
      setJoinWeight('');
      setPickupLocation('');
      setPoolTab('my_pools');
      showToast(`Joined Pool #${pool.id.substring(0, 8).toUpperCase()} (+${weight} kg reserved).`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const ActiveRunView = ({ pool, onClose }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const routeLayerRef = useRef(null);
    const markersRef = useRef([]);
    const [joiners, setJoiners] = useState([]);
    const [currentStopIdx, setCurrentStopIdx] = useState(0);
    const [optimizedFlag, setOptimizedFlag] = useState(false);

    const metrics = getPoolMetrics(pool);

    // Fetch real joiners for this pool from Firestore
    useEffect(() => {
      const q = query(collection(db, `transport_pools/${pool.id}/joiners`), orderBy('timestamp', 'asc'));
      const unsub = onSnapshot(q, (snap) => {
        setJoiners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    }, [pool.id]);

    const baseStops = [
      {
        name: pool.origin || 'Azara Farm Aggregation Point',
        contact: pool.driverName || 'Rohit Sharma',
        address: `${pool.origin || 'VIP Road, Borjhar, Azara'}, Guwahati, Assam`,
        weight: `${pool.filledCapacity || 45} kg`,
        coords: [26.1158, 91.7086],
        distance: '0.8 km away',
        phone: '+917099803533'
      },
      ...(joiners.length > 0
        ? joiners.slice(0, 2).map((j, idx) => ({
            name: j.pickupLocation || `Collection Node #${idx + 2}`,
            contact: j.riderName || 'Partner Node',
            address: `${j.pickupLocation || 'NH-37 Corridor'}, Kamrup, Assam`,
            weight: `${j.weightAdded || 25} kg`,
            coords: idx === 0 ? [26.1402, 91.7305] : [26.1620, 91.7510],
            distance: `${(2.1 + idx * 1.6).toFixed(1)} km away`,
            phone: j.riderPhone || '+917099803533'
          }))
        : [
            {
              name: 'Jalukbari Transit Hub',
              contact: 'Khogen Das (Farmer Collective)',
              address: 'Jalukbari Rotary, NH-27, Guwahati, Assam',
              weight: '35 kg',
              coords: [26.1402, 91.7305],
              distance: '2.4 km away',
              phone: '+917099803533'
            },
            {
              name: 'Bharalumukh Cross-Dock',
              contact: 'Assam Valley Growers',
              address: 'AT Road, Bharalumukh, Guwahati, Assam',
              weight: '40 kg',
              coords: [26.1620, 91.7510],
              distance: '4.1 km away',
              phone: '+917099803533'
            }
          ]),
      {
        name: pool.destination || 'Guwahati HORECA Wholesale Hub',
        contact: 'KhetFlow Commercial Receiving',
        address: `${pool.destination || 'Fancy Bazar / GS Road'}, Guwahati, Assam`,
        weight: `Total ${pool.filledCapacity || pool.totalCapacity || 120} kg`,
        coords: [26.1850, 91.7700],
        distance: `${metrics.distanceKm} km total`,
        phone: '+917099803533'
      }
    ];

    const stops = optimizedFlag && baseStops.length > 3
      ? [baseStops[0], baseStops[2], baseStops[1], baseStops[baseStops.length - 1]]
      : baseStops;

    const currentStop = stops[Math.min(currentStopIdx, stops.length - 1)];
    const isFinished = currentStopIdx >= stops.length;

    const renderMapRoute = (map) => {
      if (!map || !window.L) return;
      if (routeLayerRef.current) map.removeLayer(routeLayerRef.current);
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];

      const coords = stops.map(s => s.coords);
      routeLayerRef.current = window.L.polyline(coords, {
        color: '#0F766E',
        weight: 4,
        opacity: 0.9,
        dashArray: optimizedFlag ? '8, 6' : null
      }).addTo(map);

      stops.forEach((stop, i) => {
        const isDone = i < currentStopIdx;
        const isNext = i === currentStopIdx;
        const bg = isDone ? '#94A3B8' : isNext ? '#0F766E' : '#16A34A';
        const icon = window.L.divIcon({
          html: `<div style="background:${bg};width:28px;height:28px;border-radius:50%;border:3px solid #FFFFFF;display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-weight:800;font-size:12px;box-shadow:0 3px 10px rgba(15,23,42,0.3);">${isDone ? '✓' : i + 1}</div>`,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = window.L.marker(stop.coords, { icon })
          .addTo(map)
          .bindPopup(`<b>Stop ${i + 1}: ${stop.name}</b><br/>${stop.contact} • ${stop.weight}`);
        markersRef.current.push(marker);
      });

      map.fitBounds(window.L.latLngBounds(coords).pad(0.25));
    };

    useEffect(() => {
      let isMounted = true;
      const initMap = () => {
        if (!isMounted || mapRef.current || !mapContainerRef.current || !window.L) return;
        const map = window.L.map(mapContainerRef.current, { zoomControl: false }).setView([26.1500, 91.7400], 12);

        window.L.tileLayer(OSM_TILE_URL, {
          attribution: OSM_ATTRIBUTION,
          maxZoom: 19
        }).addTo(map);

        mapRef.current = map;
        renderMapRoute(map);
        setTimeout(() => { if (mapRef.current) mapRef.current.invalidateSize(); }, 250);
      };

      loadLeafletAssets(initMap);

      return () => {
        isMounted = false;
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      };
    }, []);

    useEffect(() => {
      if (mapRef.current) renderMapRoute(mapRef.current);
    }, [currentStopIdx, optimizedFlag, joiners.length]);

    const handleCenterMap = () => {
      if (mapRef.current && window.L) {
        mapRef.current.fitBounds(window.L.latLngBounds(stops.map(s => s.coords)).pad(0.25));
      }
    };

    const handleNavigateExternal = () => {
      const dest = currentStop.coords.join(',');
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`, '_blank');
    };

    return (
      <div className="corporate-map" style={{ position: 'fixed', inset: 0, background: '#F4F7FA', zIndex: 10000, display: 'flex', flexDirection: 'column' }}>
        {/* Executive Top Bar */}
        <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0F766E 100%)', padding: '1rem 1.5rem', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 500, boxShadow: '0 4px 12px rgba(15,23,42,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', cursor: 'pointer', padding: '0.45rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>Active Milk-Run Dispatch</h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', opacity: 0.85 }}>
                Pool #{pool.id.substring(0, 8).toUpperCase()} • {pool.origin || 'Origin'} → {pool.destination || 'Destination'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="corp-pill" style={{ background: 'rgba(16,185,129,0.2)', color: '#A7F3D0', border: '1px solid rgba(16,185,129,0.35)' }}>
              Stop {Math.min(currentStopIdx + 1, stops.length)} / {stops.length}
            </span>
          </div>
        </div>

        {/* Map Canvas + Overlays */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '420px' }}>
          <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 1, minHeight: '100%' }}></div>

          {/* Route Summary Banner */}
          <div style={{
            position: 'absolute', top: '1rem', left: '1rem', right: '1rem', maxWidth: '640px', margin: '0 auto',
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)', borderRadius: '14px',
            padding: '1rem 1.25rem', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', border: '1px solid #E2E8F0', zIndex: 450
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#0F172A', fontWeight: '700' }}>
                  {pool.origin || 'Azara'} → {pool.destination || 'Guwahati Market'}
                </h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#475569', fontWeight: '500' }}>
                  {stops.length} Stops • {optimizedFlag ? (metrics.distanceKm * 0.88).toFixed(1) : metrics.distanceKm} km • Est. Extra ₹{metrics.estExtra}
                </p>
              </div>
              <span className="corp-pill" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                {optimizedFlag ? 'AI Optimized' : 'Active'}
              </span>
            </div>
          </div>

          {/* Floating Controls */}
          <div style={{ position: 'absolute', bottom: '205px', left: '1rem', right: '1rem', maxWidth: '640px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', zIndex: 450, pointerEvents: 'none' }}>
            <button
              type="button"
              onClick={() => setOptimizedFlag(prev => !prev)}
              className="btn-secondary"
              style={{ pointerEvents: 'auto', padding: '0.55rem 1rem', fontSize: '0.82rem', boxShadow: '0 4px 12px rgba(15,23,42,0.12)' }}
            >
              <RefreshCw size={14} /> {optimizedFlag ? 'Reset Route' : 'Re-optimize Route'}
            </button>
            <button
              type="button"
              onClick={handleCenterMap}
              className="btn-secondary"
              title="Center Map on Route"
              style={{ pointerEvents: 'auto', width: '40px', height: '40px', padding: 0, borderRadius: '50%', boxShadow: '0 4px 12px rgba(15,23,42,0.12)' }}
            >
              <Crosshair size={18} color="#0F766E" />
            </button>
          </div>

          {/* Next Stop Action Sheet */}
          <div style={{
            position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', maxWidth: '640px', margin: '0 auto',
            background: '#FFFFFF', borderRadius: '16px', padding: '1.25rem',
            boxShadow: '0 12px 32px rgba(15,23,42,0.16)', border: '1px solid #E2E8F0', zIndex: 450
          }}>
            {isFinished ? (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <CheckCircle2 size={32} color="#16A34A" style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#0F172A' }}>Milk-Run Completed!</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748B' }}>All {stops.length} stops verified. Extra payout ₹{metrics.estExtra} queued.</p>
                <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>Return to Fleet Console</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '0.75rem', color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {currentStopIdx === stops.length - 1 ? 'Final Drop-Off Hub' : `Next Pickup Stop (${currentStopIdx + 1} of ${stops.length})`}
                  </p>
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>
                    {currentStop.weight}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ width: '28px', height: '28px', background: '#0F766E', borderRadius: '50%', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                      {currentStopIdx + 1}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '700', color: '#0F172A' }}>{currentStop.name}</h4>
                      <p style={{ margin: '0.2rem 0', fontSize: '0.82rem', color: '#64748B' }}>{currentStop.contact} • {currentStop.address}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '600', color: '#0F766E' }}>{currentStop.distance}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { window.location.href = `tel:${currentStop.phone}`; }}
                    style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', padding: '0.55rem', borderRadius: '10px', cursor: 'pointer' }}
                    title="Call Contact"
                  >
                    <Phone size={18} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={handleNavigateExternal} className="btn-secondary" style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.86rem' }}>
                    <Navigation size={15} /> Google Maps
                  </button>
                  <button type="button" onClick={() => setCurrentStopIdx(prev => prev + 1)} className="btn-primary" style={{ flex: 1.3, padding: '0.65rem 1rem', fontSize: '0.86rem' }}>
                    <Check size={16} /> {currentStopIdx === stops.length - 1 ? 'Complete Run' : 'Confirm Stop'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const myPools = pools.filter(p =>
    p.createdBy === user?.uid ||
    (Array.isArray(p.joinedRiders) && p.joinedRiders.includes(user?.uid)) ||
    joinedIdsLocal.includes(p.id)
  );
  const availablePools = pools.filter(p => p.status !== 'full');
  const visiblePools = poolTab === 'available' ? availablePools : myPools;

  return (
    <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
      {activeRun && <ActiveRunView pool={activeRun} onClose={() => setActiveRun(null)} />}

      {/* Corporate Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #0F766E 100%)',
        padding: '1.5rem 1.75rem', color: '#FFFFFF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <span className="corp-pill" style={{ background: 'rgba(255,255,255,0.12)', color: '#A7F3D0', marginBottom: '0.5rem' }}>
            <Layers size={12} /> Shared Corridor Logistics
          </span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>{t('pool_title')}</h2>
          <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0', opacity: 0.85 }}>Pool multi-farm pickups along one route & maximize per-trip earnings</p>
        </div>
        <button
          type="button"
          onClick={() => { setPoolTab('available'); setShowCreate(prev => !prev); }}
          style={{
            background: '#FFFFFF', color: '#0F766E', border: 'none', borderRadius: '10px',
            padding: '0.65rem 1.1rem', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <Plus size={16} /> {showCreate ? 'Close Form' : t('create_pool')}
        </button>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <div onClick={() => setPoolTab('available')} className={`tab-btn ${poolTab === 'available' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
          Available Pools ({availablePools.length})
        </div>
        <div onClick={() => setPoolTab('my_pools')} className={`tab-btn ${poolTab === 'my_pools' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
          My Active Runs ({myPools.length})
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Inline Toast Banner */}
        {statusBanner && (
          <div style={{
            padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
            background: statusBanner.type === 'error' ? '#FEF2F2' : '#ECFDF5',
            border: `1px solid ${statusBanner.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
            color: statusBanner.type === 'error' ? '#B91C1C' : '#065F46',
            fontSize: '0.86rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            {statusBanner.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {statusBanner.msg}
          </div>
        )}

        {/* Create Route Form */}
        {showCreate && (
          <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', border: '1px solid #CBD5E1' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#0F172A', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} color="#0F766E" /> {t('btn_create_route')}
            </h3>
            <form onSubmit={handleCreatePool} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>ORIGIN HUB</label>
                  <input className="form-input" placeholder="e.g. Azara / Jorhat Mandi" value={newPool.origin} onChange={e => setNewPool({ ...newPool, origin: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>DESTINATION MARKET</label>
                  <input className="form-input" placeholder="e.g. Guwahati Fancy Bazar" value={newPool.destination} onChange={e => setNewPool({ ...newPool, destination: e.target.value })} required />
                </div>
              </div>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>TOTAL CARGO CAPACITY (KG)</label>
                  <input className="form-input" type="number" min="20" placeholder="e.g. 500" value={newPool.capacity} onChange={e => setNewPool({ ...newPool, capacity: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>{t('departure_time').toUpperCase()}</label>
                  <input className="form-input" type="datetime-local" value={newPool.departureTime} onChange={e => setNewPool({ ...newPool, departureTime: e.target.value })} required />
                </div>
              </div>
              <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary responsive-btn" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary responsive-btn" style={{ flex: 2 }}>
                  {submitting ? 'Publishing...' : 'Publish Milk-Run Route'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pool List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {visiblePools.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#F8FAFC', borderRadius: '14px', border: '1px dashed #CBD5E1' }}>
              <Truck size={40} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ margin: '0 0 0.4rem 0', fontWeight: '700', color: '#0F172A', fontSize: '0.98rem' }}>
                {poolTab === 'my_pools' ? 'You have not joined or created any Milk-Run routes yet.' : 'No open Milk-Run pools right now.'}
              </p>
              <p style={{ margin: '0 0 1.25rem 0', color: '#64748B', fontSize: '0.84rem' }}>
                {poolTab === 'my_pools' ? 'Switch to Available Pools to join an active corridor or create your own route.' : 'Initialize a new route to start pooling nearby farm harvests.'}
              </p>
              <button
                type="button"
                onClick={() => poolTab === 'my_pools' ? setPoolTab('available') : setShowCreate(true)}
                className="btn-primary"
              >
                {poolTab === 'my_pools' ? 'Browse Available Pools' : '+ Initialize First Route'}
              </button>
            </div>
          ) : (
            visiblePools.map((pool, index) => {
              const totalCap = Math.max(1, pool.totalCapacity || 100);
              const filledCap = Math.min(totalCap, pool.filledCapacity || 0);
              const fillPct = Math.round((filledCap / totalCap) * 100);
              const remainingCap = Math.max(0, totalCap - filledCap);
              const isFull = pool.status === 'full' || remainingCap === 0;
              const isJoinedByMe =
                pool.createdBy === user?.uid ||
                (Array.isArray(pool.joinedRiders) && pool.joinedRiders.includes(user?.uid)) ||
                joinedIdsLocal.includes(pool.id);
              const metrics = getPoolMetrics(pool);

              return (
                <div key={pool.id} style={{
                  background: '#FFFFFF', borderRadius: '14px', padding: '1.35rem',
                  border: index === 0 && poolTab === 'available' ? '1.5px solid #0F766E' : '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)', position: 'relative'
                }}>
                  {/* Badges Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {index === 0 && poolTab === 'available' && (
                        <span className="corp-pill" style={{ background: '#F0FDFA', color: '#0F766E', border: '1px solid #99F6E4' }}>
                          <Bell size={11} /> Recommended Route
                        </span>
                      )}
                      <span className="corp-pill" style={{ background: '#F1F5F9', color: '#475569' }}>
                        #{pool.id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className="corp-pill" style={{
                        background: isFull ? '#FEF2F2' : '#ECFDF5',
                        color: isFull ? '#DC2626' : '#059669'
                      }}>
                        {isFull ? t('status_full') : t('status_open')}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Est. Extra Payout</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#15803D' }}>₹{metrics.estExtra}</span>
                    </div>
                  </div>

                  {/* Route Title & Meta */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span>{pool.origin || 'Azara Hub'}</span>
                      <ArrowRight size={16} color="#0F766E" />
                      <span>{pool.destination || 'Guwahati Market'}</span>
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.4rem', fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><User size={13} /> {pool.driverName || 'Fleet Partner'} ({(pool.vehicleType || 'tempo').toUpperCase()})</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {metrics.stops} Stops • {metrics.distanceKm} km</span>
                      {pool.departureTime && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {new Date(pool.departureTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      )}
                    </div>
                  </div>

                  {/* Visual Route Nodes */}
                  <div style={{ position: 'relative', height: '30px', margin: '0.75rem 0 1rem' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '3%', right: '3%', borderTop: '2px dashed #0F766E', opacity: 0.5, transform: 'translateY(-50%)' }}></div>
                    {['3%', '35%', '67%', '97%'].map((pos, idx) => (
                      <div key={pos} style={{
                        position: 'absolute', top: '50%', left: pos, transform: 'translate(-50%, -50%)',
                        width: idx === 3 ? '14px' : '11px', height: idx === 3 ? '14px' : '11px',
                        borderRadius: '50%', background: idx === 3 ? '#16A34A' : '#0F766E',
                        border: '2px solid #FFFFFF', boxShadow: '0 0 0 1.5px #0F766E', zIndex: 2
                      }}></div>
                    ))}
                  </div>

                  {/* Capacity Bar */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem 0.9rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#334155' }}>Cargo Utilization: {filledCap} / {totalCap} kg ({fillPct}%)</span>
                      <span style={{ color: remainingCap > 0 ? '#0F766E' : '#DC2626' }}>{remainingCap} kg available</span>
                    </div>
                    <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${fillPct}%`, height: '100%',
                        background: fillPct >= 90 ? '#DC2626' : 'linear-gradient(90deg, #0F766E, #16A34A)',
                        borderRadius: '999px', transition: 'width 0.4s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Actions */}
                  {joinId === pool.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Pickup Location along corridor (e.g. NH-37 Azara Gate)"
                        value={pickupLocation}
                        onChange={e => setPickupLocation(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          className="form-input"
                          type="number"
                          min="1"
                          max={remainingCap}
                          placeholder={`Weight (max ${remainingCap} kg)`}
                          autoFocus
                          value={joinWeight}
                          onChange={e => setJoinWeight(e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <button type="button" disabled={submitting} onClick={() => handleJoinPool(pool)} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                          {submitting ? '...' : 'Confirm'}
                        </button>
                        <button type="button" onClick={() => { setJoinId(null); setPickupLocation(''); setJoinWeight(''); }} className="btn-secondary" style={{ padding: '0 0.85rem' }}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.75rem' }}>
                      {poolTab === 'available' && !isFull && (
                        <button
                          type="button"
                          onClick={() => setJoinId(pool.id)}
                          className="btn-primary responsive-btn"
                          style={{ flex: 1.4 }}
                        >
                          <Plus size={16} /> {isJoinedByMe ? 'Add More Cargo' : 'Join Milk-Run Pool'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveRun(pool)}
                        className={poolTab === 'my_pools' || isJoinedByMe ? 'btn-primary responsive-btn' : 'btn-secondary responsive-btn'}
                        style={{ flex: 1 }}
                      >
                        <Navigation size={15} /> Open Live Route Map
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* How It Works */}
        {poolTab === 'available' && (
          <div style={{ marginTop: '1.75rem', padding: '1.15rem 1.25rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', color: '#0F172A', fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Milk-Run Protocol</h4>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#334155', fontWeight: '500' }}>
                <MapPin size={16} color="#0F766E" style={{ flexShrink: 0 }} /> Pool nearby farm stops along one corridor
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#334155', fontWeight: '500' }}>
                <Navigation size={16} color="#0F766E" style={{ flexShrink: 0 }} /> Follow the AI-optimized live OpenStreetMap route
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#334155', fontWeight: '500' }}>
                <IndianRupee size={16} color="#0F766E" style={{ flexShrink: 0 }} /> Cut empty miles & multiply payout per trip
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
      type="button"
      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
      className="lang-toggle-btn"
      style={{
        background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.5rem 0.85rem',
        fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04)', color: '#1E293B', transition: 'all 0.2s', ...style
      }}
    >
      <Globe size={14} color="#0F766E" /> {lang === 'en' ? 'हिन्दी' : 'English'}
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
      alert('Issue reported. Fleet Operations Support will contact you shortly.');
      onClose();
    } catch (e) {
      alert(e.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '2rem', width: '100%', maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
            <AlertCircle size={20} color="#DC2626" /> {t('report_title')}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>{t('issue_type')}</label>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
            <option value="breakdown">Vehicle Breakdown</option>
            <option value="accident">Road Incident / Accident</option>
            <option value="shop_closed">Farm / Commercial Kitchen Closed</option>
            <option value="wrong_location">Incorrect Coordinates / Address</option>
            <option value="other">Other Operational Issue</option>
          </select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>{t('desc')}</label>
          <textarea className="form-input" placeholder="Provide brief incident details for rapid dispatch support..." value={desc} onChange={e => setDesc(e.target.value)} rows="4" style={{ resize: 'none' }} />
        </div>
        <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary responsive-btn" onClick={onClose} style={{ flex: 1 }}>{t('btn_cancel')}</button>
          <button className="btn-primary responsive-btn" onClick={handleSubmit} disabled={submitting} style={{ flex: 1.2, background: '#DC2626', boxShadow: 'none' }}>{submitting ? 'Sending...' : t('btn_submit')}</button>
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

  const totalSettled = history.reduce((sum, o) => sum + Math.floor((o.deliveryFee || 150) * 0.9), 0);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: 0, width: '100%', maxWidth: '520px', maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#0F172A', color: '#FFFFFF' }}>
          <div>
            <h2 style={{ fontSize: '1.08rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="#34D399" /> {t('earnings_history')}
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>
              {history.length} settled dispatches • ₹{totalSettled} verified payouts
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#FFFFFF', display: 'flex' }}><X size={18} /></button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '1rem 1.25rem' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
              <Briefcase size={32} color="#CBD5E1" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>No completed settlements yet.</p>
            </div>
          ) : (
            history.map(order => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.95rem 0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '0.9rem' }}>Dispatch #{order.id.substring(0, 8).toUpperCase()}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {order.deliveredAt ? new Date(order.deliveredAt.seconds * 1000).toLocaleDateString() : 'Settled'} • {order.businessName || 'HORECA Buyer'}
                  </div>
                </div>
                <div style={{ fontWeight: '700', color: '#15803D', background: '#F0FDF4', padding: '4px 10px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="dashboard-card responsive-pad" style={{ padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '52px', height: '52px', background: '#ECFDF5', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.9rem', border: '1px solid #A7F3D0' }}>
            <CheckCircle2 size={26} color="#059669" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{t('confirm_delivery')}</h2>
          <p style={{ color: '#64748B', marginTop: '0.4rem', fontSize: '0.88rem' }}>Verify buyer drop-off to release instant settlement.</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #0F766E 100%)', padding: '1.4rem', borderRadius: '14px', marginBottom: '1.5rem', textAlign: 'center', color: '#FFFFFF' }}>
          <p style={{ color: '#A7F3D0', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Net Rider Settlement</p>
          <p style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>₹{riderEarnings}</p>
          <p style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.35rem', marginBottom: 0 }}>90% Driver Share • Base Fare + Corridor Bonus</p>
        </div>

        {isCOD ? (
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', padding: '0.95rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <IndianRupee size={20} color="#C2410C" />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#9A3412', fontWeight: '700', fontSize: '0.92rem', margin: 0 }}>Collect Payment: ₹{order.totalAmount}</p>
                <p style={{ fontSize: '0.78rem', color: '#C2410C', margin: '0.15rem 0 0 0' }}>Customer settles via Cash or UPI at drop-off</p>
              </div>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.75rem', border: '1.5px dashed #CBD5E1', borderRadius: '12px', cursor: 'pointer', background: paymentPhoto ? '#F0FDF4' : '#F8FAFC', transition: 'all 0.2s' }}>
              <Camera size={24} color="#0F766E" style={{ marginBottom: '0.5rem' }} />
              <span style={{ color: '#334155', fontWeight: '600', fontSize: '0.88rem' }}>{paymentPhoto ? 'Payment Proof Attached' : t('upload_proof')}</span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} style={{ display: 'none' }} />
            </label>
            {!paymentPhoto && (
              <button
                type="button"
                onClick={() => setPaymentPhoto('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><rect fill="%2316a34a" width="300" height="150"/><text fill="white" x="150" y="80" text-anchor="middle" font-size="16" font-family="sans-serif" font-weight="bold">UPI PAYMENT RECEIVED: ₹' + (order.totalAmount || 0) + '</text></svg>')}
                className="btn-secondary"
                style={{ marginTop: '0.75rem', width: '100%', padding: '0.55rem', fontSize: '0.82rem', borderColor: '#16A34A', color: '#15803D' }}
              >
                ⚡ Attach Verified Demo Payment Proof
              </button>
            )}
            {paymentPhoto && <img src={paymentPhoto} alt="Proof" style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />}
          </div>
        ) : (
          <div style={{ marginBottom: '1.75rem', padding: '1rem', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <CreditCard size={20} color="#2563EB" />
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#1E3A8A', fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>Pre-Paid Escrow Order</p>
              <p style={{ color: '#3B82F6', fontSize: '0.8rem', margin: '0.15rem 0 0 0' }}>Do not collect cash. Handover cargo to buyer directly.</p>
            </div>
          </div>
        )}

        <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.85rem' }}>
          <button onClick={onClose} className="btn-secondary responsive-btn" style={{ flex: 1 }}>{t('btn_cancel')}</button>
          <button onClick={handleSubmit} disabled={isUploading || (isCOD && !paymentPhoto)} className="btn-primary responsive-btn" style={{ flex: 1.5 }}>{isUploading ? 'Settling...' : t('btn_finish')}</button>
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
          () => {}
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '0', maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{t('quality_check')}</h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>SHA-256 Crate Verification & Custody Check</p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.35rem', color: '#475569', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!scannedData ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '14px', border: '1.5px dashed #CBD5E1' }}>
              <QrCode size={36} color="#0F766E" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', fontWeight: '700', color: '#0F172A' }}>Step 1: Scan Farm SHA-256 QR</h3>
              <p style={{ color: '#64748B', marginBottom: '1.25rem', fontSize: '0.84rem' }}>Align camera with the sealed crate label</p>
              <div id="qr-reader" style={{ borderRadius: '10px', margin: '0 auto', maxWidth: '300px', overflow: 'hidden' }}></div>
              <button
                type="button"
                onClick={() => {
                  const firstItem = order?.items?.[0] || {};
                  setScannedData({
                    id: firstItem.id || order.id,
                    name: firstItem.name || 'Organic Farm Produce',
                    farmName: order.farmName || firstItem.farmName || 'Azara Valley Farm',
                    grade: firstItem.grade || 'B',
                    quantity: firstItem.cartQuantity || firstItem.quantity || order.totalItems || 20
                  });
                  setChecklist({
                    freshness: true, packaging: true, quantity: true, noticeable_damage: true,
                    temperature_check: true, color_check: true, no_pests: true, labeling_correct: true
                  });
                  setPhotos(['data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%2316a34a" width="100" height="100"/><text fill="white" x="50" y="55" text-anchor="middle" font-size="12">Verified Cargo</text></svg>']);
                }}
                className="btn-secondary"
                style={{ marginTop: '1rem', padding: '0.55rem 1.1rem', fontSize: '0.84rem', borderColor: '#16A34A', color: '#15803D' }}
              >
                ⚡ One-Click Demo Verification
              </button>
            </div>
          ) : (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={22} color="#16A34A" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Farm Batch Cryptographically Verified</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#15803D', fontWeight: '500' }}>{scannedData.farmName}</p>
                </div>
              </div>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: '600', marginBottom: '0.2rem' }}>COMMODITY</span>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>{scannedData.name}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: '600', marginBottom: '0.2rem' }}>GRADE</span>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>Grade {scannedData.grade}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: '600', marginBottom: '0.2rem' }}>WEIGHT</span>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>{scannedData.quantity} kg</span>
                </div>
              </div>
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.9rem', fontWeight: '700', color: '#0F172A' }}>Step 2: 8-Point Quality Inspection</h3>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.65rem' }}>
                {checkListConfig.map((item) => (
                  <label key={item.key} style={{
                    display: 'flex', alignItems: 'center', padding: '0.7rem 0.8rem',
                    background: checklist[item.key] ? '#F0FDF4' : '#FFFFFF',
                    borderRadius: '10px', cursor: 'pointer',
                    border: checklist[item.key] ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                    transition: 'all 0.2s', userSelect: 'none'
                  }}>
                    <input type="checkbox" checked={checklist[item.key]} onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })} style={{ width: '16px', height: '16px', marginRight: '0.65rem', cursor: 'pointer', accentColor: '#16A34A' }} />
                    <span style={{ color: checklist[item.key] ? '#16A34A' : '#64748B', marginRight: '0.45rem', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: '600', color: checklist[item.key] ? '#15803D' : '#334155' }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {scannedData && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: '700', color: '#0F172A' }}>Step 3: Photographic Evidence</h3>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.35rem', border: '1.5px dashed #CBD5E1', borderRadius: '10px', cursor: 'pointer', background: '#F8FAFC' }}>
                <Camera size={22} color="#0F766E" style={{ marginBottom: '0.4rem' }} />
                <span style={{ color: '#0F766E', fontWeight: '600', fontSize: '0.88rem' }}>Capture Verification Photos</span>
                <input type="file" accept="image/*" multiple capture="environment" onChange={handlePhotoCapture} style={{ display: 'none' }} />
              </label>
              {photos.length > 0 && (
                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.85rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Evidence ${i}`} style={{ width: '62px', height: '62px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {scannedData && (
            <div>
              <textarea className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal logistics inspection notes (optional)..." rows="2" style={{ resize: 'none' }} />
            </div>
          )}
        </div>

        {scannedData && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', position: 'sticky', bottom: 0 }}>
            <button onClick={handleVerify} disabled={!Object.values(checklist).every(v => v) || photos.length === 0} className="btn-primary" style={{ width: '100%' }}>
              {Object.values(checklist).every(v => v) && photos.length > 0 ? 'Confirm Custody Transfer' : 'Complete Checklist & Photo to Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- HANDSHAKE MODAL FOR TRUCK / MIDDLE-MILE DRIVERS ---
function HandshakeModal({ user, riderData, onClose, onConfirm }) {
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
          () => {}
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '0', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Middle-Mile Custody Handoff</h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>Scan crate QR to assume transit custody</p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.35rem', color: '#475569', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!scannedData ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '14px', border: '1.5px dashed #CBD5E1' }}>
              <QrCode size={36} color="#0F766E" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', fontWeight: '700', color: '#0F172A' }}>Scan Handoff QR</h3>
              <p style={{ color: '#64748B', marginBottom: '1.25rem', fontSize: '0.84rem' }}>Scan the QR seal from the farmer or first-mile partner</p>
              <div id="handshake-qr-reader" style={{ borderRadius: '10px', margin: '0 auto', maxWidth: '300px', overflow: 'hidden' }}></div>
              <button
                type="button"
                onClick={() => {
                  setScannedData({
                    farmName: 'Azara Valley Farm',
                    farmerId: 'farmer_demo_1',
                    name: 'Organic Grade B Tomatoes',
                    quantity: 50
                  });
                }}
                className="btn-secondary"
                style={{ marginTop: '1.25rem', padding: '0.6rem 1.2rem', fontSize: '0.84rem', borderColor: '#16A34A', color: '#15803D' }}
              >
                ⚡ One-Click Demo Custody Transfer
              </button>
            </div>
          ) : (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={22} color="#16A34A" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Cargo Verified</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#15803D' }}>Ready for middle-mile custody transfer</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.2rem' }}>ORIGIN FARM</span>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>{scannedData.farmName || 'Unknown Farm'}</span>
                </div>
                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #DCFCE7', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.2rem' }}>COMMODITY</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{scannedData.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.2rem' }}>WEIGHT</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{scannedData.quantity} kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {scannedData && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', position: 'sticky', bottom: 0 }}>
            <button onClick={handleConfirm} disabled={isTransferring} className="btn-primary" style={{ width: '100%' }}>
              {isTransferring ? 'Transferring Custody...' : 'Confirm Custody Transfer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- LIVE TRACKING MAP MODAL (FIXED OSM) ---
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
    let isMounted = true;
    const initMap = () => {
      if (!isMounted || mapRef.current || !mapContainerRef.current || !window.L) return;

      const map = window.L.map(mapContainerRef.current, { zoomControl: false }).setView([26.1500, 91.7400], 12);

      window.L.tileLayer(OSM_TILE_URL, {
        attribution: OSM_ATTRIBUTION,
        maxZoom: 19
      }).addTo(map);

      window.L.control.zoom({ position: 'topright' }).addTo(map);

      const route = [
        [26.1158, 91.7086],
        [26.1450, 91.7340],
        [26.1850, 91.7700]
      ];

      window.L.polyline(route, { color: '#0F766E', weight: 4, dashArray: '8, 8' }).addTo(map);

      const originIcon = window.L.divIcon({
        html: `<div style="background:#2563EB;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: '', iconSize: [16, 16], iconAnchor: [8, 8]
      });
      window.L.marker(route[0], { icon: originIcon }).addTo(map).bindPopup(`<b>Pickup:</b> ${order.farmName || 'Azara Farm Collective'}`);

      const destIcon = window.L.divIcon({
        html: `<div style="background:#16A34A;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: '', iconSize: [16, 16], iconAnchor: [8, 8]
      });
      window.L.marker(route[2], { icon: destIcon }).addTo(map).bindPopup(`<b>Drop-Off:</b> ${order.businessName || 'Guwahati HORECA Buyer'}`);

      const ratio = progressPercent / 100;
      const currentLat = route[0][0] + (route[2][0] - route[0][0]) * ratio;
      const currentLng = route[0][1] + (route[2][1] - route[0][1]) * ratio;

      const truckIcon = window.L.divIcon({
        html: `<div style="background:#0F172A;border:2.5px solid #34D399;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(15,23,42,0.35);"><span style="font-size:15px;">${isFarmerDriving ? '🧑' : '🚛'}</span></div>`,
        className: '', iconSize: [34, 34], iconAnchor: [17, 17]
      });
      window.L.marker([currentLat, currentLng], { icon: truckIcon }).addTo(map);

      map.fitBounds(window.L.latLngBounds(route).pad(0.3));
      mapRef.current = map;

      setTimeout(() => { if (mapRef.current) mapRef.current.invalidateSize(); }, 250);
    };

    loadLeafletAssets(initMap);

    return () => {
      isMounted = false;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [progressPercent, isFarmerDriving]);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.72)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000, padding: '1.25rem'
    }}>
      <div className="dashboard-card corporate-map" style={{ maxWidth: '820px', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', color: '#FFFFFF' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
               Live Dispatch Telemetry
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>Dispatch Ref: #{order.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '0.35rem', color: '#FFFFFF', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '380px', background: '#E2E8F0', overflow: 'hidden' }}>
          <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 1, minHeight: '100%' }}></div>

          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', zIndex: 450, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)', borderRadius: '14px', padding: '1.25rem 1.5rem 2rem', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', border: '1px solid #E2E8F0' }}>
            <div style={{ position: 'relative', width: '100%', height: '12px' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '3px dashed #CBD5E1', transform: 'translateY(-50%)' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: 0, height: '4px', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #0F766E, #16A34A)', borderRadius: '4px', transform: 'translateY(-50%)', transition: 'width 1s ease' }}></div>

              {[0, 33, 66, 100].map((pos) => (
                <div key={pos} style={{ position: 'absolute', top: '50%', left: `${pos}%`, transform: 'translate(-50%, -50%)', width: '13px', height: '13px', borderRadius: '50%', background: progressPercent >= pos ? '#0F766E' : '#FFFFFF', border: `2.5px solid ${progressPercent >= pos ? '#0F766E' : '#CBD5E1'}` }}></div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.7rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              <span>Dispatched</span>
              <span>At Farm</span>
              <span>In Transit</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.65rem', background: '#F0FDFA', borderRadius: '10px', border: '1px solid #CCFBF1', color: '#0F766E' }}><Package size={20} /></div>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', margin: '0 0 0.15rem 0', textTransform: 'uppercase' }}>Cargo Load</p>
              <p style={{ fontSize: '0.94rem', color: '#0F172A', fontWeight: '700', margin: 0 }}>{order.totalItems || order.items?.reduce((acc, i) => acc + (i.cartQuantity || 1), 0) || 15} kg Grade B/C Produce</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.65rem', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', color: '#16A34A' }}><ShieldCheck size={20} /></div>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', margin: '0 0 0.15rem 0', textTransform: 'uppercase' }}>Escrow Telemetry</p>
              <p style={{ fontSize: '0.94rem', color: '#0F172A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                <CheckCircle2 size={16} color="#16A34A" /> SHA-256 Network Tracked
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. LANDING PAGE (CORPORATE ENTERPRISE UI)
// ==========================================
function RiderLanding() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <AnimatedBackground />

      {/* Corporate Navbar */}
      <header className="landing-nav" style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0', padding: '0.9rem 2rem'
      }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0F766E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,118,110,0.28)' }}>
              <Truck size={19} />
            </div>
            <div>
              <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0F172A', letterSpacing: '-0.02em' }}>KhetFlow</span>
              <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0F766E', marginLeft: '0.25rem' }}>Logistics</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <LanguageToggle />
            <button onClick={() => navigate('/login')} className="btn-secondary hide-mobile" style={{ padding: '0.5rem 1.1rem', fontSize: '0.84rem' }}>{t('login')}</button>
            <button onClick={() => navigate('/register')} className="btn-primary hide-mobile" style={{ padding: '0.5rem 1.1rem', fontSize: '0.84rem' }}>{t('register')}</button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="landing-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1060px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div className="landing-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#FFFFFF', padding: '0.45rem 1rem', borderRadius: '999px',
            border: '1px solid #CBD5E1', marginBottom: '1.5rem', color: '#0F766E',
            fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <Zap size={14} color="#16A34A" /> {t('fastest_growing')}
          </div>

          <h1 className="responsive-text" style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.85rem)', fontWeight: '800', marginBottom: '1rem',
            color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.12
          }}>
            Asset-Light Fleet Dispatch for <span style={{ color: '#0F766E' }}>Bharat's Supply Chain</span>
          </h1>

          <p className="responsive-sub" style={{
            fontSize: '1.08rem', color: '#475569', margin: '0 auto 2.25rem',
            maxWidth: '660px', lineHeight: 1.65, fontWeight: '400'
          }}>
            Connect directly with verified farms and commercial HORECA kitchens. Execute QR-verified handoffs, pool nearby pickups via Milk Runs, and unlock assured settlements.
          </p>

          <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button onClick={() => navigate('/login')} className="btn-primary responsive-btn" style={{ minWidth: '190px', padding: '0.88rem 1.75rem', fontSize: '0.95rem' }}>
              {t('login')} to Console <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/register')} className="btn-secondary responsive-btn" style={{ minWidth: '190px', padding: '0.88rem 1.75rem', fontSize: '0.95rem' }}>
              {t('become_rider')}
            </button>
          </div>

          {/* 3 Enterprise Feature Pillars */}
          <div className="landing-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { label: '90% Driver Share', value: 'Assured Payouts', icon: <IndianRupee size={22} color="#15803D" />, bg: '#F0FDF4', desc: 'Transparent per-dispatch & shared Milk-Run earnings ledger.' },
              { label: 'GIS Corridor Routing', value: 'Smart Milk Runs', icon: <Map size={22} color="#0F766E" />, bg: '#F0FDFA', desc: 'Automatically pool Grade B/C pickups along active transit routes.' },
              { label: 'Zero-Dispute Custody', value: 'SHA-256 QR Seals', icon: <ShieldCheck size={22} color="#2563EB" />, bg: '#EFF6FF', desc: '8-point mobile cargo inspection & instant digital handoffs.' }
            ].map((stat, i) => (
              <div key={i} className="dashboard-card feature-card" style={{ padding: '1.6rem', textAlign: 'left' }}>
                <div className="feature-icon-wrapper" style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {stat.icon}
                </div>
                <div className="feature-val" style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.2rem' }}>{stat.value}</div>
                <div className="feature-lbl" style={{ color: '#0F766E', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>{stat.label}</div>
                <div className="feature-desc" style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* MILK RUN ADVANTAGE BANNER */}
          <div className="milk-run-banner" style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #115E59 100%)',
            borderRadius: '20px', padding: '2.5rem', textAlign: 'left', color: 'white',
            display: 'flex', flexDirection: 'column', gap: '1.75rem',
            boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.3)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-90px', right: '-90px', width: '280px', height: '280px', background: 'rgba(52, 211, 153, 0.14)', borderRadius: '50%', filter: 'blur(45px)', pointerEvents: 'none' }}></div>

            <div className="milk-run-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 10 }}>
              <div className="milk-run-icon-bg" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.18)' }}>
                <Layers size={28} color="#34D399" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.02em' }}>The "Milk Run" Advantage</h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.98rem', color: '#A7F3D0', fontWeight: '600' }}>'मिल्क रन' का फायदा • Zero Empty Backhauls</p>
              </div>
            </div>

            <div className="milk-run-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', position: 'relative', zIndex: 10 }}>
              <div className="milk-run-card" style={{ background: 'rgba(255,255,255,0.06)', padding: '1.35rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ margin: 0, fontSize: '0.96rem', lineHeight: 1.65, color: '#F1F5F9', fontWeight: '400' }}>
                  Got a half-empty tempo, van, or truck? Don't waste the payload. KhetFlow's intelligent Milk Run system automatically pools Grade B & C produce from nearby farms along your existing transit routes—filling your spare capacity, cutting fuel overhead, and multiplying earnings per trip.
                </p>
              </div>
              <div className="milk-run-card hide-mobile" style={{ background: 'rgba(255,255,255,0.06)', padding: '1.35rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.7, color: '#F1F5F9', fontWeight: '400' }}>
                  क्या आपका ट्रक या टेम्पो आधा खाली है? जगह बर्बाद न करें। खेतफ्लो का स्मार्ट 'मिल्क रन' सिस्टम आपके रास्ते में पड़ने वाले खेतों से ग्रेड B और C की उपज को खुद-ब-खुद जोड़ लेता है। हम आपकी बची हुई जगह भरते हैं, आप ईंधन बचाते हैं, और हर चक्कर में अपनी कमाई कई गुना बढ़ाते हैं।
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 6. AUTH (CORPORATE ENTERPRISE UI)
// ==========================================
function AuthPage({ isLogin }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({ identifier: '', password: '', riderName: '', phone: '', vehicleType: 'tempo', vehicleNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let emailToUse = (form.identifier || '').trim();
    if (/^\d{10}$/.test(emailToUse)) {
      emailToUse = `${emailToUse}@rider.khetflow.com`;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, emailToUse, form.password);
        navigate('/dashboard');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, emailToUse, form.password);
        const riderPhone = /^\d{10}$/.test(form.identifier) ? form.identifier : (form.phone || '');
        await setDoc(doc(db, 'riders', userCred.user.uid), {
          riderName: form.riderName || 'KhetFlow Logistics Partner',
          email: emailToUse,
          phone: riderPhone,
          vehicleType: form.vehicleType || 'tempo',
          vehicleNumber: form.vehicleNumber || '',
          userType: 'rider',
          totalDeliveries: 0,
          totalEarnings: 0,
          rating: 5.0,
          createdAt: serverTimestamp(),
          isOnline: true
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace('auth/', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="responsive-pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      <AnimatedBackground />

      <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', zIndex: 20 }}>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}>
          <ArrowLeft size={14} /> Home
        </button>
      </div>
      <div className="lang-toggle-wrap" style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 20 }}><LanguageToggle /></div>

      <div className="dashboard-card auth-card" style={{ padding: '2.5rem', maxWidth: '460px', width: '100%', position: 'relative', zIndex: 10 }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '58px', height: '58px', margin: '0 auto 1rem', background: 'linear-gradient(135deg, #0F172A, #0F766E)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(15,118,110,0.22)' }}>
            <Truck size={28} color="#FFFFFF" />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: '800', marginBottom: '0.35rem', color: '#0F172A', letterSpacing: '-0.02em' }}>{isLogin ? t('welcome') : t('become_rider')}</h1>
          <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>{isLogin ? t('login_subtitle') : t('register_subtitle')}</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.84rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {!isLogin && (
            <>
              <input className="form-input" type="text" placeholder={t('full_name')} value={form.riderName} onChange={(e) => setForm({ ...form, riderName: e.target.value })} required />
              <input className="form-input" type="tel" placeholder={t('phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </>
          )}
          <input className="form-input" type="text" placeholder="Email Address or 10-digit Phone" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} required />
          <input className="form-input" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {!isLogin && (
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <select className="form-input" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} style={{ cursor: 'pointer' }}>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="auto">Auto</option>
                <option value="tempo">Tempo</option>
                <option value="van">Van</option>
                <option value="car">Car</option>
                <option value="truck">Truck</option>
                <option value="bus">Bus</option>
              </select>
              <input className="form-input" type="text" placeholder={t('plate_no')} value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} required />
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
            {loading ? 'Authenticating...' : (isLogin ? t('login') : t('create_account'))}
          </button>
        </form>

        <div className="auth-footer" style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            {isLogin ? t('dont_have_account') + " " : t('already_have_account') + " "}
            <span onClick={() => navigate(isLogin ? '/register' : '/login')} style={{ color: '#0F766E', fontWeight: '700', cursor: 'pointer' }}>
              {isLogin ? t('register') : t('login')}
            </span>
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
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F7FA' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #CBD5E1', borderTopColor: '#0F766E', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }}></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

// ==========================================
// 7. ENTERPRISE FLEET DASHBOARD
// ==========================================
function Dashboard() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [user, setUser] = useState(null);
  const [riderData, setRiderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [poolsCount, setPoolsCount] = useState(0);
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
    let poolsUnsubscribe;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await fetchRiderData(u);

        const q = query(collection(db, 'orders'));
        ordersUnsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
          setOrders(data);
        });

        const pq = query(collection(db, 'transport_pools'));
        poolsUnsubscribe = onSnapshot(pq, (snapshot) => {
          setPoolsCount(snapshot.docs.filter(d => d.data().status !== 'full').length);
        });
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (ordersUnsubscribe) ordersUnsubscribe();
      if (poolsUnsubscribe) poolsUnsubscribe();
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
          vehicleType: 'tempo',
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
    try {
      if (user) await updateDoc(doc(db, 'riders', user.uid), { isOnline: newState });
    } catch (error) {
      setIsOnline(!newState);
    }
  };

  const openDirections = (origin, destination) => {
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`, '_blank');
  };
  const callNumber = (number) => { window.location.href = `tel:${number}`; };

  const handleAcceptOrder = async (order) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'accepted',
        riderId: user.uid,
        riderName: riderData?.riderName || 'Unknown',
        riderPhone: riderData?.phone || '',
        acceptedAt: serverTimestamp()
      });
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
      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        status: 'delivered',
        paymentStatus: 'paid',
        paymentProof: paymentPhoto || null,
        deliveredAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'riders', user.uid), {
        totalEarnings: increment(earnings),
        totalDeliveries: increment(1)
      });
      setRiderData(prev => ({
        ...prev,
        totalEarnings: (prev.totalEarnings || 0) + earnings,
        totalDeliveries: (prev.totalDeliveries || 0) + 1
      }));
      setShowDeliveryModal(false);
      setSelectedOrder(null);
      setFilter('delivered');
    } catch (e) { alert(e.message); }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F7FA' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #CBD5E1', borderTopColor: '#0F766E', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }}></div>
      </div>
    );
  }

  const isMiddleMileVehicle = riderData?.vehicleType === 'truck' || riderData?.vehicleType === 'bus';

  const pendingCount = isOnline ? orders.filter(o => o.status === 'pending' && !o.farmerSelfDelivery && !isMiddleMileVehicle).length : 0;
  const acceptedCount = orders.filter(o => o.status === 'accepted' && o.riderId === user?.uid).length;
  const pickedCount = orders.filter(o => o.status === 'picked' && o.riderId === user?.uid).length;
  const deliveredCount = orders.filter(o => o.status === 'delivered' && o.riderId === user?.uid).length;

  const filteredOrders = orders.filter(order => {
    if (filter === 'pooling') return false;
    if (isMiddleMileVehicle && filter === 'pending') return false;
    if (!isOnline && filter === 'pending') return false;

    if (filter === 'pending') {
      if (order.status !== 'pending') return false;
      if (order.farmerSelfDelivery === true) return false;
      return true;
    }

    if (filter === 'accepted') return order.status === 'accepted' && order.riderId === user.uid;
    if (filter === 'picked') return order.status === 'picked' && order.riderId === user.uid;
    if (filter === 'delivered') return order.status === 'delivered' && order.riderId === user.uid;
    return false;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <AnimatedBackground />

      {/* --- ALL MODALS --- */}
      {trackingOrder && <LiveTrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}

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

      {showDeliveryModal && selectedOrder && (
        <DeliveryPaymentModal
          order={selectedOrder}
          onClose={() => { setShowDeliveryModal(false); setSelectedOrder(null); }}
          onConfirm={handleDeliveryComplete}
        />
      )}
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

      {/* Sticky Corporate Top Command Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div className="responsive-pad" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0F172A, #0F766E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(15, 118, 110, 0.25)'
            }}>
              {riderData?.vehicleType === 'truck' || riderData?.vehicleType === 'bus' ? <Truck size={22} /> : riderData?.vehicleType === 'van' || riderData?.vehicleType === 'tempo' ? <Box size={22} /> : <Zap size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  {riderData?.riderName || 'Fleet Partner'}
                </h1>
                <span className="hide-mobile" style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', background: '#F1F5F9', padding: '2px 7px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  {riderData?.vehicleType || 'Fleet'} {riderData?.vehicleNumber ? `• ${riderData.vehicleNumber}` : ''}
                </span>
              </div>
              <div
                onClick={toggleOnlineStatus}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  padding: '2px 8px', borderRadius: '999px', marginTop: '0.2rem',
                  background: isOnline ? '#ECFDF5' : '#F1F5F9',
                  border: `1px solid ${isOnline ? '#A7F3D0' : '#CBD5E1'}`
                }}
              >
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isOnline ? '#10B981' : '#94A3B8' }}></div>
                <span style={{ color: isOnline ? '#059669' : '#64748B', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {isOnline ? `${t('online')} • Tap to Pause` : `${t('offline')} • Tap to Go Active`}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setShowReportModal(true)} className="btn-secondary" style={{ padding: '0.5rem 0.7rem' }} title={t('report_issue')}>
              <AlertCircle size={17} color="#64748B" />
            </button>
            <LanguageToggle />
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 0.7rem', borderColor: '#FECACA', background: '#FEF2F2' }} title={t('logout')}>
              <LogOut size={17} color="#DC2626" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="responsive-pad" style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Executive KPI Strip */}
        <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
          <div
            onClick={() => setShowEarningsModal(true)}
            className="dashboard-card stat-card-interactive kpi-earnings-card"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #0F766E 100%)',
              padding: '1.4rem 1.6rem', border: 'none', color: '#FFFFFF',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <div>
              <p style={{ fontSize: '0.72rem', color: '#A7F3D0', margin: '0 0 0.35rem 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t('total_earnings')}
              </p>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '800', lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>
                ₹{riderData?.totalEarnings || 0}
              </h2>
              <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.75rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                View Transaction Ledger <ChevronRight size={13} />
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '0.75rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.18)' }}>
              <IndianRupee size={26} color="#34D399" />
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: '1.35rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('deliveries')}</span>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#F0FDFA', color: '#0F766E' }}><Package size={18} /></div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', marginTop: '0.5rem' }}>{riderData?.totalDeliveries || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: '600', marginTop: '0.25rem' }}>{acceptedCount + pickedCount} active in queue</div>
          </div>

          <div className="dashboard-card" style={{ padding: '1.35rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('rating')}</span>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#FFFBEB', color: '#D97706' }}><Star size={18} /></div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', marginTop: '0.5rem' }}>{Number(riderData?.rating || 5.0).toFixed(1)}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500', marginTop: '0.25rem' }}>Verified Fleet Tier</div>
          </div>
        </div>

        {/* Middle-Mile Custody Handoff Button */}
        {isMiddleMileVehicle && (
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowHandshakeModal(true)} className="btn-primary">
              <QrCode size={17} /> {t('btn_receive_cargo') || 'Execute Custody Transfer'}
            </button>
          </div>
        )}

        {/* Navigation Pill Bar */}
        <div style={{
          display: 'flex', gap: '0.55rem', marginBottom: '1.5rem',
          overflowX: 'auto', paddingBottom: '0.35rem', scrollbarWidth: 'none'
        }}>
          {[
            { key: 'pending', label: t('tab_new'), count: pendingCount },
            { key: 'accepted', label: t('tab_farm'), count: acceptedCount },
            { key: 'picked', label: t('tab_drop'), count: pickedCount },
            { key: 'delivered', label: t('tab_done'), count: deliveredCount },
            { key: 'pooling', label: t('tab_pool'), count: poolsCount }
          ].map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  background: active ? '#0F172A' : '#FFFFFF',
                  border: active ? '1px solid #0F172A' : '1px solid #E2E8F0',
                  color: active ? '#FFFFFF' : '#475569',
                  padding: '0.65rem 1.2rem', borderRadius: '999px',
                  fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: active ? '0 4px 12px rgba(15,23,42,0.16)' : '0 1px 2px rgba(15,23,42,0.03)'
                }}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span style={{
                    fontSize: '0.7rem', padding: '2px 7px', borderRadius: '999px',
                    background: active ? '#0F766E' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#0F172A', fontWeight: '800'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Fleet Dispatch Map (Shown on Dispatch Tabs) */}
        {filter !== 'pooling' && (
          <RiderHomeMap isOnline={isOnline} activeOrdersCount={pendingCount + acceptedCount + pickedCount} />
        )}

        {/* Main Workspace Content */}
        <div>
          {filter === 'pooling' ? (
            <TransportPooling user={user} riderData={riderData} />
          ) : (
            <>
              {filter === 'pending' && !isOnline && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} /> {t('alert_offline')}
                </div>
              )}

              {filteredOrders.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', borderStyle: 'dashed' }}>
                  <Package size={44} color="#CBD5E1" style={{ margin: '0 auto 0.85rem' }} />
                  <p style={{ fontSize: '0.98rem', color: '#334155', fontWeight: '700', margin: 0 }}>{t('no_orders')}</p>
                  {filter === 'pending' && isMiddleMileVehicle ? (
                    <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '0.45rem' }}>
                      Large-capacity vehicles operate via Corridor Milk Runs. Open the <b>Milk Run</b> tab to initialize or manage shared routes.
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                      New dispatches will appear automatically in real time.
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1.25rem' }} className="responsive-grid">
                  {filteredOrders.map((order) => {
                    const farmName = order.farmName || order.items?.[0]?.farmName || 'Azara Valley Farm';
                    const farmAddress = order.farmAddress || order.items?.[0]?.farmLocation || 'Azara, Kamrup, Assam';
                    const deliveryAddress = order.deliveryAddress || 'Guwahati Commercial Market, Assam';
                    const totalWeight = order.totalItems || order.items?.reduce((sum, item) => sum + (Number(item.cartQuantity) || Number(item.quantity) || 1), 0) || 15;
                    const accentColor = order.status === 'pending' ? '#D97706' : order.status === 'accepted' ? '#2563EB' : order.status === 'picked' ? '#7C3AED' : '#059669';
                    const accentBg = order.status === 'pending' ? '#FFFBEB' : order.status === 'accepted' ? '#EFF6FF' : order.status === 'picked' ? '#F5F3FF' : '#ECFDF5';

                    return (
                      <div key={order.id} className="dashboard-card" style={{ padding: '1.4rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: accentColor }}></div>

                        <div>
                          {/* Header Row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', paddingLeft: '0.4rem' }}>
                            <span style={{ background: '#F8FAFC', padding: '4px 9px', borderRadius: '7px', fontSize: '0.75rem', fontWeight: '700', color: '#475569', border: '1px solid #E2E8F0' }}>
                              Ref: #{order.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="corp-pill" style={{ background: accentBg, color: accentColor }}>
                              {order.status === 'pending' && t('status_waiting')}
                              {order.status === 'accepted' && t('status_go_farm')}
                              {order.status === 'picked' && t('status_on_way')}
                              {order.status === 'delivered' && t('status_completed')}
                            </span>
                          </div>

                          {/* Route Timeline */}
                          <div style={{ paddingLeft: '0.4rem', position: 'relative', marginBottom: '1.25rem' }}>
                            <div style={{ position: 'absolute', left: '0.72rem', top: '14px', bottom: '26px', borderLeft: '2px dashed #CBD5E1', zIndex: 0 }}></div>

                            <div style={{ display: 'flex', gap: '0.9rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                              <div style={{ width: '11px', height: '11px', background: '#2563EB', borderRadius: '50%', marginTop: '5px', border: '2px solid white', boxShadow: '0 0 0 1.5px #2563EB', flexShrink: 0 }}></div>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700', margin: '0 0 2px 0', letterSpacing: '0.06em' }}>ORIGIN PICKUP</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{farmName}</p>
                                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0.15rem 0 0 0' }}>{farmAddress}</p>
                              </div>
                              {order.farmerPhone && (
                                <button onClick={() => callNumber(order.farmerPhone)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px', height: '32px' }} title="Call Farmer">
                                  <Phone size={14} color="#0F766E" />
                                </button>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.9rem', position: 'relative', zIndex: 1 }}>
                              <div style={{ width: '11px', height: '11px', background: '#10B981', borderRadius: '50%', marginTop: '5px', border: '2px solid white', boxShadow: '0 0 0 1.5px #10B981', flexShrink: 0 }}></div>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700', margin: '0 0 2px 0', letterSpacing: '0.06em' }}>HORECA DESTINATION</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{order.businessName || 'Commercial Kitchen Buyer'}</p>
                                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0.15rem 0 0 0' }}>{deliveryAddress}</p>
                              </div>
                              {order.businessPhone && (
                                <button onClick={() => callNumber(order.businessPhone)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px', height: '32px' }} title="Call Buyer">
                                  <Phone size={14} color="#0F766E" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Metadata Chips */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', paddingLeft: '0.4rem', marginBottom: '1.2rem' }}>
                            <span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '7px', fontSize: '0.78rem', color: '#334155', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Package size={13} color="#0F766E" /> {totalWeight} kg
                            </span>
                            <span style={{ background: order.paymentMethod === 'cod' ? '#FFF7ED' : '#EFF6FF', padding: '4px 10px', borderRadius: '7px', fontSize: '0.78rem', color: order.paymentMethod === 'cod' ? '#C2410C' : '#1D4ED8', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <IndianRupee size={13} /> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pre-Paid Escrow'}
                            </span>
                          </div>
                        </div>

                        <div>
                          {/* Navigation Actions */}
                          {(order.status === 'accepted' || order.status === 'picked') && (
                            <div className="responsive-btn-container" style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.9rem', marginLeft: '0.4rem' }}>
                              <button onClick={() => setTrackingOrder(order)} className="btn-secondary responsive-btn" style={{ flex: 1, padding: '0.58rem', fontSize: '0.82rem' }}>
                                 Internal Tracker
                              </button>
                              <button onClick={() => openDirections(farmAddress, deliveryAddress)} className="btn-secondary responsive-btn" style={{ flex: 1, borderColor: '#BFDBFE', color: '#2563EB', background: '#EFF6FF', padding: '0.58rem', fontSize: '0.82rem' }}>
                                <Navigation size={15} /> Google Maps
                              </button>
                            </div>
                          )}

                          {/* Payout & Primary CTA */}
                          <div style={{ background: '#F8FAFC', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '0.4rem', gap: '0.75rem' }}>
                            <div>
                              <p style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700', margin: '0 0 2px 0', letterSpacing: '0.05em' }}>RIDER PAYOUT</p>
                              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#15803D', margin: 0 }}>₹{Math.floor((order.deliveryFee || 150) * 0.9)}</p>
                            </div>
                            {order.status === 'pending' && <button onClick={() => handleAcceptOrder(order)} className="btn-primary" style={{ padding: '0.62rem 1.25rem', fontSize: '0.85rem' }}>{t('btn_accept')}</button>}
                            {order.status === 'accepted' && <button onClick={() => handleVerifyPickup(order)} className="btn-primary" style={{ padding: '0.62rem 1.25rem', fontSize: '0.85rem' }}><QrCode size={15} /> {t('btn_verify')}</button>}
                            {order.status === 'picked' && <button onClick={() => handleDeliverOrder(order)} className="btn-primary" style={{ padding: '0.62rem 1.25rem', fontSize: '0.85rem' }}>{t('btn_finish')}</button>}
                            {order.status === 'delivered' && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#15803D', fontWeight: '700', fontSize: '0.86rem', background: '#F0FDF4', padding: '5px 10px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                                <CheckCircle2 size={16} /> Settled
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;

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

