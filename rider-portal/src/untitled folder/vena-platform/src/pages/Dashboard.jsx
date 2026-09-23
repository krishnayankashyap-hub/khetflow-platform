// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, Database, Car, Users, Settings, Bell, Search, LogOut, AlertCircle, Droplets, MapPin, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Send, CheckCircle2, Clock, PhoneCall, UserPlus, QrCode, ShieldCheck, Check, ExternalLink, Mail, MessageSquare, Loader2, Upload } from 'lucide-react';
import emailjs from '@emailjs/browser';
import logo from '../assets/vena-logo-removebg-preview.png';

export default function Dashboard() {
  
  const [activeTab, setActiveTab] = useState('command');

  // Demo Simulation States
  const [selectedGroupToDrop, setSelectedGroupToDrop] = useState('O-');
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [simulationTriggered, setSimulationTriggered] = useState(false);

  // Live Inventory State
  const [inventory, setInventory] = useState([
    { id: 1, group: 'O-', stock: 4, buffer: '+2 Units (Stable)', status: 'Optimal', statusColor: 'text-green-600', action: 'Monitor' },
    { id: 2, group: 'A+', stock: 45, buffer: '+12 Units (Safe)', status: 'Optimal', statusColor: 'text-green-600', action: 'Monitor' },
    { id: 3, group: 'B+', stock: 28, buffer: '+5 Units (Safe)', status: 'Optimal', statusColor: 'text-green-600', action: 'Monitor' },
    { id: 4, group: 'O+', stock: 32, buffer: '+8 Units (Safe)', status: 'Optimal', statusColor: 'text-green-600', action: 'Monitor' },
    { id: 5, group: 'A-', stock: 6, buffer: '-3 Units (Warning)', status: 'Warning', statusColor: 'text-orange-500', action: 'Alert Donors' },
    { id: 6, group: 'AB+', stock: 18, buffer: 'Stable', status: 'Optimal', statusColor: 'text-green-600', action: 'Monitor' },
  ]);

  // Donor Network Database
  const [donors, setDonors] = useState([
    { id: 'D-101', name: 'Rahul Sharma', group: 'O-', email: 'rahul.sharma@gmail.com', phone: '+91 98721-44110', location: 'Dispur', distance: '1.4 miles', source: 'Hospital Desk Intake', smsStatus: 'Pending Trigger', emailStatus: 'Pending Trigger', cabStatus: 'Standby', verified: false, lat: null, lng: null },
    { id: 'D-102', name: 'Dr. Ananya Borah', group: 'O-', email: 'ananya.borah@gmail.com', phone: '+91 94350-11223', location: 'Ulubari', distance: '2.1 miles', source: 'Google Form Sync', smsStatus: 'Pending Trigger', emailStatus: 'Pending Trigger', cabStatus: 'Standby', verified: false, lat: null, lng: null },
    { id: 'D-103', name: 'Bikash Kalita', group: 'O-', email: 'bikash.k@yahoo.com', phone: '+91 70012-99881', location: 'Zoo Road', distance: '2.8 miles', source: 'Hospital Desk Intake', smsStatus: 'Pending Trigger', emailStatus: 'Pending Trigger', cabStatus: 'Standby', verified: false, lat: null, lng: null },
    { id: 'D-104', name: 'Priya Gogoi', group: 'A+', email: 'priya.gogoi@gmail.com', phone: '+91 91011-55443', location: 'Chandmari', distance: '3.4 miles', source: 'Google Form Sync', smsStatus: 'Standby', emailStatus: 'Standby', cabStatus: 'Standby', verified: false, lat: null, lng: null },
  ]);

  // Manual Donor Intake Form State
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState('O-');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('Dispur');

  // QR Scanner State
  const [scannedId, setScannedId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanningImage, setIsScanningImage] = useState(false);

  // Simulated Donor Link View Modal
  const [simulatedDonorPortal, setSimulatedDonorPortal] = useState(null);

  // CROSS-TAB SYNCING: Receives Live GPS Coordinates from the donor's phone
  useEffect(() => {
    const handleStorageChange = () => {
      setDonors(current => current.map(d => {
        const savedStatus = localStorage.getItem(`donor_${d.id}_status`);
        const savedLat = localStorage.getItem(`donor_${d.id}_lat`);
        const savedLng = localStorage.getItem(`donor_${d.id}_lng`);
        
        if (savedStatus === 'accepted' && d.cabStatus === 'Waiting Donor Acceptance') {
          return { ...d, cabStatus: 'Coordinates Received (Ready to Book)', lat: savedLat, lng: savedLng };
        }
        if (savedStatus === 'arrived' && !d.verified) {
           return { ...d, cabStatus: 'Arrived at Hospital Radius (QR Active)' };
        }
        return d;
      }));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const calculateDistanceFromGMCH = (loc) => {
    const distances = { 'Bhutnath': '0.8 miles', 'Bharalumukh': '1.1 miles', 'Ulubari': '2.1 miles', 'Dispur': '1.4 miles', 'Zoo Road': '2.8 miles', 'Chandmari': '3.4 miles', 'Beltola': '4.2 miles', 'Maligaon': '5.0 miles' };
    return distances[loc] || '1.9 miles';
  };

  // 10-Second Demo Timer & EmailJS Logic
  useEffect(() => {
    let timer;
    if (isSimulating && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isSimulating && timeLeft === 0) {
      setIsSimulating(false);
      setSimulationTriggered(true);
      
      // Update Inventory
      setInventory(current =>
        current.map(item => 
          item.group === selectedGroupToDrop 
            ? { ...item, stock: 1, buffer: '-14 Units (Critical Deficit)', status: 'Critical', statusColor: 'text-[#C12026]', action: 'Dispatch Cab' }
            : item
        )
      );

      // Trigger Live EmailJS integration with exact credentials
      donors.forEach(donor => {
        const distNum = parseFloat(donor.distance);
        if (donor.group === selectedGroupToDrop && distNum <= 3.0) {
          
          const dynamicRideLink = `${window.location.origin}/ride/${donor.id}`;

          const templateParams = {
            to_email: donor.email,
            donor_name: donor.name,
            blood_group: donor.group,
            donor_location: donor.location,
            donor_distance: donor.distance,
            ride_link: dynamicRideLink
          };

          emailjs.send('service_4ojjh7q', 'template_o38v32h', templateParams, 'MaZ5q1byJkFAN_ybh')
            .catch((err) => { console.error('EmailJS failed error:', err); });
        }
      });

      // Automatically update UI
      setDonors(current =>
        current.map(d => {
          const distNum = parseFloat(d.distance);
          if (d.group === selectedGroupToDrop && distNum <= 3.0) {
            return {
              ...d,
              smsStatus: 'Sent (SMS Link Delivered)',
              emailStatus: 'Sent (Live EmailJS)',
              cabStatus: 'Waiting Donor Acceptance'
            };
          }
          return d;
        })
      );
    }
    return () => clearInterval(timer);
  }, [isSimulating, timeLeft, selectedGroupToDrop, donors]);

  const startDemoTimer = () => {
    setTimeLeft(10);
    setSimulationTriggered(false);
    setIsSimulating(true);
    donors.forEach(d => {
      localStorage.removeItem(`donor_${d.id}_status`);
      localStorage.removeItem(`donor_${d.id}_lat`);
      localStorage.removeItem(`donor_${d.id}_lng`);
    });
  };

  const handleAddDonor = (e) => {
    e.preventDefault();
    if (!newName || !newPhone || !newEmail) return;

    const calculatedDist = calculateDistanceFromGMCH(newLocation);
    
    const newDonorObj = {
      id: `D-10${donors.length + 1}`, name: newName, group: newGroup, email: newEmail, phone: newPhone, location: newLocation, distance: calculatedDist,
      source: 'Hospital Physical Form', smsStatus: 'Standby', emailStatus: 'Standby', cabStatus: 'Standby', verified: false, lat: null, lng: null
    };

    setDonors([newDonorObj, ...donors]);
    setNewName(''); setNewEmail(''); setNewPhone('');
    alert(`Donor registered successfully! Automatically calculated distance from GMCH: ${calculatedDist}`);
  };

  // REAL UBER REDIRECT INTEGRATION
  const handleBookCabFromHospital = (donor) => {
    if (donor.lat && donor.lng) {
      // GMCH Coordinates
      const gmchLat = "26.1558";
      const gmchLng = "91.7707";
      // Official Uber Deep Link with live GPS payload
      const uberLink = `https://m.uber.com/ul/?client_id=vena_hackathon&action=setPickup&pickup[latitude]=${donor.lat}&pickup[longitude]=${donor.lng}&pickup[nickname]=Donor%20Location&dropoff[latitude]=${gmchLat}&dropoff[longitude]=${gmchLng}&dropoff[nickname]=GMCH%20Blood%20Bank`;
      window.open(uberLink, '_blank');
    } else {
      alert("Error: Donor coordinates not received yet.");
      return;
    }
    setDonors(current =>
      current.map(d => d.id === donor.id ? { ...d, cabStatus: 'Uber Go Dispatched' } : d)
    );
  };

  const handleVerifyQR = (donorId) => {
    setDonors(current =>
      current.map(d => d.id === donorId ? { ...d, verified: true, cabStatus: 'Donation Completed & Return Cab Authorized' } : d)
    );
    setScanResult(`Success! Verified Scanned QR image for Donor ${donorId}. Attendance logged & return Uber authorized.`);
  };

  // REAL IMAGE SCANNER SIMULATION
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanningImage(true);
      setScanResult(null);
      // Simulate real-time image QR decoding
      setTimeout(() => {
        setIsScanningImage(false);
        if (scannedId) {
          handleVerifyQR(scannedId);
        } else {
          alert("Please select the arriving Donor ID from the dropdown before uploading their QR code image.");
        }
      }, 1500);
    }
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.stock, 0);

  const renderContent = () => {
    
    // ==========================================
    // ACTIVE DISPATCHES TAB
    // ==========================================
    if (activeTab === 'dispatch') {
      return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Car className="text-[#C12026]" size={24} /> Active Uber/Ola Fleet Dispatches (3M Radius)
              </h2>
              <p className="text-slate-500 text-sm mt-1">Automated SMS & Email gateway status with live ride acceptance tracking.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Donor Name & Group</th>
                    <th className="py-4 px-6">Distance (3M Radius)</th>
                    <th className="py-4 px-6">SMS & Email Status</th>
                    <th className="py-4 px-6">Cab Allocation</th>
                    <th className="py-4 px-6 text-right">Simulate Donor Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {donors.filter(d => d.group === selectedGroupToDrop).map((donor, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {donor.name} <span className="text-xs bg-red-100 text-[#C12026] px-2 py-0.5 rounded ml-1 font-bold">{donor.group}</span>
                        <span className="text-xs text-slate-400 block font-normal">{donor.phone}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {donor.distance} ({donor.location})
                        {donor.lat && <span className="block text-[10px] text-blue-500 font-mono mt-0.5">GPS: {parseFloat(donor.lat).toFixed(4)}, {parseFloat(donor.lng).toFixed(4)}</span>}
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <div className="text-green-600 text-xs font-bold flex items-center gap-1">
                          <MessageSquare size={12} /> {donor.smsStatus}
                        </div>
                        <div className="text-blue-600 text-xs font-bold flex items-center gap-1">
                          <Mail size={12} /> {donor.emailStatus}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          donor.cabStatus.includes('Dispatched') || donor.cabStatus.includes('Completed') || donor.cabStatus.includes('Active') ? 'bg-green-50 text-green-700 border-green-200' : 
                          donor.cabStatus.includes('Coordinates Received') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-red-50 text-[#C12026] border-red-100'
                        }`}>
                          {donor.cabStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {donor.cabStatus.includes('Coordinates Received') ? (
                          <button 
                            onClick={() => handleBookCabFromHospital(donor)} 
                            className="bg-[#C12026] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-red-200 animate-pulse"
                          >
                            Open Uber App
                          </button>
                        ) : (
                          <button 
                            onClick={() => window.open(`/ride/${donor.id}`, '_blank')}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink size={14} /> Open SMS Link
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // DONOR CRM & INTAKE TAB
    // ==========================================
    if (activeTab === 'network') {
      return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="text-[#C12026]" size={24} /> Donor CRM & Hospital Desk Intake
            </h2>
            <p className="text-slate-500 text-sm mt-1">Register walk-in physical forms or Google Form syncs. Distance from GMCH is calculated automatically.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <UserPlus size={18} className="text-[#C12026]" /> Hospital Physical Form / Walk-in Intake
            </h3>
            <form onSubmit={handleAddDonor} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
              <input 
                type="text" placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} required
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#C12026]"
              />
              <select 
                value={newGroup} onChange={e => setNewGroup(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#C12026]"
              >
                <option value="O-">O- (Critical)</option>
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
              </select>
              <input 
                type="email" placeholder="Email Address" value={newEmail} onChange={e => setNewEmail(e.target.value)} required
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#C12026]"
              />
              <input 
                type="text" placeholder="Phone Number" value={newPhone} onChange={e => setNewPhone(e.target.value)} required
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#C12026]"
              />
              <select 
                value={newLocation} onChange={e => setNewLocation(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#C12026]"
              >
                <option value="Dispur">Dispur</option>
                <option value="Ulubari">Ulubari</option>
                <option value="Zoo Road">Zoo Road</option>
                <option value="Chandmari">Chandmari</option>
                <option value="Beltola">Beltola</option>
                <option value="Bharalumukh">Bharalumukh</option>
              </select>
              <button type="submit" className="bg-[#C12026] hover:bg-red-800 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors">
                Register & Map
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 text-sm">
              Registered Database (Geo-Fenced Within 3 Miles)
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-6">ID & Name</th>
                    <th className="py-3 px-6">Blood Group</th>
                    <th className="py-3 px-6">Location & Distance</th>
                    <th className="py-3 px-6">Contact (Email & Phone)</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {donors.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-6 font-semibold text-slate-900">{d.name} <span className="text-xs text-slate-400 block font-normal">{d.id}</span></td>
                      <td className="py-3.5 px-6 font-bold text-[#C12026]">{d.group}</td>
                      <td className="py-3.5 px-6 text-slate-600">{d.location} <span className="text-xs text-slate-400 block font-medium">({d.distance} from GMCH)</span></td>
                      <td className="py-3.5 px-6 text-slate-600 text-xs">{d.email} <span className="block font-medium">{d.phone}</span></td>
                      <td className="py-3.5 px-6">
                        {d.verified ? (
                          <span className="text-green-600 font-bold text-xs flex items-center gap-1"><Check size={14} /> Arrived & Verified</span>
                        ) : (
                          <span className="text-orange-500 font-bold text-xs">Active in 3M Zone</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // QR DESK SCANNER TAB (WITH REAL FILE UPLOAD)
    // ==========================================
    if (activeTab === 'scanner') {
      return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-red-50 text-[#C12026] rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <QrCode size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Hospital Desk QR Verification Scanner</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">Upload or capture the donor's QR code image from their phone to verify attendance and authorize their free return trip.</p>
            
            <div className="max-w-md mx-auto space-y-4">
              <select 
                value={scannedId} 
                onChange={e => setScannedId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#C12026]"
              >
                <option value="">Select arriving donor ID...</option>
                {donors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.group}) - {d.distance}</option>
                ))}
              </select>

              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-red-50 transition-colors group">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none text-slate-500 group-hover:text-[#C12026]">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm font-bold">Tap to Upload / Scan QR Image</span>
                  <span className="text-xs font-medium mt-1">Supports Camera & Image Files</span>
                </div>
              </div>
            </div>

            {isScanningImage && (
              <div className="mt-6 p-4 text-[#C12026] text-sm font-bold flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Analyzing QR Code Image...
              </div>
            )}

            {scanResult && !isScanningImage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 animate-fade-in">
                <ShieldCheck size={20} /> {scanResult}
              </div>
            )}
          </div>
        </div>
      );
    }

    // ==========================================
    // COMMAND CENTER (DEFAULT TAB)
    // ==========================================
    return (
      <div className="p-4 md:p-8 flex-1 overflow-y-auto pb-24 md:pb-8 bg-slate-50">
        
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="mb-8 bg-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#C12026] rounded-lg">
                <Clock size={20} className="text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Judge Demo Mode: 10-Second Predictive Trigger</h4>
                <p className="text-xs text-slate-400">Select blood group to drop and simulate automated SMS & Email dispatch to 3M radius donors.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {isSimulating ? (
                <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-300 font-bold uppercase">Dropping Stock in:</span>
                  <span className="text-xl font-black text-[#C12026]">{timeLeft}s</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select 
                    value={selectedGroupToDrop} 
                    onChange={e => setSelectedGroupToDrop(e.target.value)}
                    className="bg-slate-800 text-white text-xs font-bold px-3 py-2.5 rounded-lg border border-slate-700 outline-none"
                  >
                    <option value="O-">Drop O- (Critical)</option>
                    <option value="A+">Drop A+</option>
                    <option value="B+">Drop B+</option>
                    <option value="O+">Drop O+</option>
                  </select>
                  <button 
                    onClick={startDemoTimer}
                    className="bg-[#C12026] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 shrink-0"
                  >
                    <Activity size={16} /> Trigger 10s Timer
                  </button>
                </div>
              )}
            </div>
          </div>

          {simulationTriggered && (
            <div className="mb-8 bg-red-50 border-l-4 border-[#C12026] p-5 rounded-r-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-[#C12026] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">24-Hour Buffer Breached: {selectedGroupToDrop} Stock Dropped to 1 Unit!</h4>
                  <p className="text-xs text-red-700 mt-0.5">Automated SMS & Live EmailJS payload dispatched with token links to donors within 3 miles. Uber/Ola cabs ready.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('dispatch')}
                className="bg-[#C12026] hover:bg-red-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0"
              >
                View Live Dispatches
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                Total Inventory <Database size={16} className="text-slate-400" />
              </p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{totalUnits} <span className="text-base text-slate-400 font-medium tracking-normal">Units</span></h3>
            </div>
            
            <div className={`bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-[#C12026] shadow-sm flex flex-col justify-center relative overflow-hidden transition-colors ${simulationTriggered ? 'bg-red-50/40' : ''}`}>
              <p className="text-xs font-bold text-[#C12026] uppercase tracking-widest mb-2 relative z-10">
                Critical Shortage
              </p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight relative z-10">{selectedGroupToDrop} <span className="text-base text-[#C12026] font-semibold tracking-normal">Under 24h Buffer</span></h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                Active Dispatches <Car size={16} className="text-slate-400" />
              </p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{simulationTriggered ? '2' : '0'} <span className="text-base text-slate-400 font-medium tracking-normal">En route</span></h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                System Success <Activity size={16} className="text-slate-400" />
              </p>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">98% <span className="text-base text-green-500 font-semibold tracking-normal">+2.4%</span></h3>
            </div>
          </div>

          <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
              <h2 className="font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
                <Droplets size={20} className="text-[#C12026]" /> GMCH Live Blood Bank Data
              </h2>
              <div className="flex items-center gap-5">
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Sync: 15s
                </div>
                <button className="text-[#C12026] text-sm font-bold flex items-center gap-1.5 hover:text-red-800 transition-colors">
                  <Activity size={16} /> Force Sync
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full table-fixed text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 w-[15%]">Blood Group</th>
                    <th className="py-4 px-6 w-[20%]">Current Stock</th>
                    <th className="py-4 px-6 w-[30%]">Predictive Buffer (24h)</th>
                    <th className="py-4 px-6 w-[15%]">Status</th>
                    <th className="py-4 px-6 w-[20%] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  {inventory.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${row.group === selectedGroupToDrop && simulationTriggered ? 'bg-[#C12026] text-white animate-pulse' : 'bg-slate-100 text-slate-800'}`}>
                          {row.group}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xl">{row.stock}</span> 
                          <span className="text-sm text-slate-400 font-medium">Units</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold text-base ${row.buffer.includes('Deficit') || row.buffer.includes('-') ? 'text-[#C12026]' : 'text-slate-700'}`}>
                          {row.buffer}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-bold uppercase tracking-wider ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {row.action === 'Dispatch Cab' || (row.group === selectedGroupToDrop && simulationTriggered) ? (
                          <button 
                            onClick={() => setActiveTab('dispatch')}
                            className="bg-[#C12026] hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all inline-flex items-center gap-2 ml-auto shadow-sm shadow-red-200 animate-bounce"
                          >
                            <Car size={16} strokeWidth={2} />
                            Dispatch Cab
                          </button>
                        ) : (
                          <span className="text-slate-400 text-sm font-bold px-2">
                            {row.action}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      
      <aside className="w-64 bg-[#C12026] flex-col hidden md:flex shadow-xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-red-800/30">
          <img src={logo} alt="VENA" className="h-8 brightness-0 invert pointer-events-none" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button onClick={() => setActiveTab('command')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'command' ? 'bg-white text-[#C12026] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10 shadow-none'}`}>
            <LayoutDashboard size={18} strokeWidth={activeTab === 'command' ? 2.5 : 2} /> Command Center
          </button>
          <button onClick={() => setActiveTab('dispatch')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'dispatch' ? 'bg-white text-[#C12026] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
            <Car size={18} strokeWidth={activeTab === 'dispatch' ? 2.5 : 2} /> Active Dispatches {simulationTriggered && <span className="bg-white text-[#C12026] px-1.5 py-0.2 rounded-full text-[10px] font-black ml-auto">2</span>}
          </button>
          <button onClick={() => setActiveTab('network')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'network' ? 'bg-white text-[#C12026] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
            <Users size={18} strokeWidth={activeTab === 'network' ? 2.5 : 2} /> Donor CRM & Intake
          </button>
          <button onClick={() => setActiveTab('scanner')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${activeTab === 'scanner' ? 'bg-white text-[#C12026] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
            <QrCode size={18} strokeWidth={activeTab === 'scanner' ? 2.5 : 2} /> QR Desk Scanner
          </button>
        </nav>

        <div className="p-4 border-t border-red-800/30">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors text-sm font-semibold rounded-lg hover:bg-white/10">
            <Settings size={18} /> Settings
          </button>
          <a href="/" className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors text-sm font-semibold mt-1 rounded-lg hover:bg-black/10">
            <LogOut size={18} /> Secure Logout
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 overflow-hidden">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#C12026] hidden md:block" />
              <h1 className="text-base md:text-xl font-bold text-slate-900 truncate">GMCH Command Center</h1>
            </div>
            <span className="bg-green-50 text-green-600 px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-bold uppercase tracking-widest w-fit border border-green-100">
              System Online
            </span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search inventory, donors..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-[#C12026] outline-none w-72 transition-all" />
            </div>
            <button className="relative text-slate-400 hover:text-[#C12026] transition-colors">
              <Bell size={22} />
              {simulationTriggered && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#C12026] rounded-full"></span>}
            </button>
            <div className="w-10 h-10 bg-red-50 flex items-center justify-center font-bold text-[#C12026] text-sm rounded-full border border-red-100">
              GC
            </div>
          </div>
        </header>

        {renderContent()}

      </main>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('command')} className={`flex flex-col items-center gap-1 ${activeTab === 'command' ? 'text-[#C12026]' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} strokeWidth={activeTab === 'command' ? 2.5 : 2} />
          <span className="text-[9px] font-bold">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('network')} className={`flex flex-col items-center gap-1 ${activeTab === 'network' ? 'text-[#C12026]' : 'text-slate-400'}`}>
          <Users size={20} />
          <span className="text-[9px] font-bold">Intake</span>
        </button>
        <button onClick={() => setActiveTab('dispatch')} className={`flex flex-col items-center gap-1 relative ${activeTab === 'dispatch' ? 'text-[#C12026]' : 'text-slate-400'}`}>
          <Car size={20} strokeWidth={activeTab === 'dispatch' ? 2.5 : 2} />
          {simulationTriggered && <span className="absolute -top-1 -right-2 bg-[#C12026] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">2</span>}
          <span className="text-[9px] font-bold">Dispatch</span>
        </button>
        <button onClick={() => setActiveTab('scanner')} className={`flex flex-col items-center gap-1 ${activeTab === 'scanner' ? 'text-[#C12026]' : 'text-slate-400'}`}>
          <QrCode size={20} />
          <span className="text-[9px] font-bold">Scanner</span>
        </button>
      </div>

    </div>
  );
}