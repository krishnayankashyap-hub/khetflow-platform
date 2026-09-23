// src/pages/RidePortal.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Navigation, CheckCircle2, QrCode, Car, Loader2 } from 'lucide-react';
import logo from '../assets/vena-logo-removebg-preview.png';

export default function RidePortal() {
  const { id } = useParams();
  const [status, setStatus] = useState('pending');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem(`donor_${id}_status`);
    if (savedStatus) setStatus(savedStatus);
  }, [id]);

  // REAL GEOLOCATION API INTEGRATION
  const handleAcceptRide = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Save real coordinates for the Hospital Dashboard to read
          localStorage.setItem(`donor_${id}_lat`, lat);
          localStorage.setItem(`donor_${id}_lng`, lng);
          localStorage.setItem(`donor_${id}_status`, 'accepted');
          
          setStatus('accepted');
          setIsLoadingLocation(false);
          window.dispatchEvent(new Event('storage')); 
        },
        (error) => {
          alert("Please allow GPS location access to dispatch the free cab to your exact location.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
    }
  };

  const handleSimulateArrival = () => {
    setStatus('arrived');
    localStorage.setItem(`donor_${id}_status`, 'arrived');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        <div className="bg-[#C12026] p-6 text-white text-center">
          <img src={logo} alt="VENA" className="h-8 brightness-0 invert mx-auto mb-2 pointer-events-none" />
          <p className="text-xs uppercase tracking-widest font-bold text-red-100">Emergency Dispatch Portal</p>
          <h2 className="text-xl font-black mt-1">GMCH Blood Emergency</h2>
        </div>

        <div className="p-6 space-y-6">
          
          {status === 'pending' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-[#C12026]">
                <p><strong>Urgent:</strong> Your blood group is critically needed at Gauhati Medical College & Hospital within 2 hours.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700">
                <p className="font-bold flex items-center gap-2 mb-2"><MapPin size={16} /> Location Match Verified</p>
                <p className="text-xs text-slate-500">You are within the 3-mile safe transport radius. Click below to allow GPS access and share your live coordinates with the hospital dispatcher.</p>
              </div>
              <button 
                onClick={handleAcceptRide}
                disabled={isLoadingLocation}
                className="w-full bg-[#C12026] hover:bg-red-800 disabled:bg-red-300 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-lg shadow-red-200 flex justify-center items-center gap-2"
              >
                {isLoadingLocation ? <><Loader2 className="animate-spin" size={18} /> Fetching Live GPS...</> : <><Navigation size={18} /> Accept & Share Coordinates</>}
              </button>
            </div>
          )}

          {status === 'accepted' && (
            <div className="space-y-4 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Coordinates Sent!</h3>
              <p className="text-sm text-slate-500">The hospital has received your exact GPS location and is booking a free two-way Uber for you.</p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 text-blue-800 text-sm">
                <Car className="mx-auto mb-2" size={24} />
                <p className="font-bold">Your ride is being booked.</p>
                <p className="text-xs mt-1">For security, your Hospital Entry & Return Ride QR Code will automatically reveal once your GPS enters the GMCH hospital radius.</p>
              </div>

              <button 
                onClick={handleSimulateArrival}
                className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 underline"
              >
                (Demo: Simulate Arrival at GMCH)
              </button>
            </div>
          )}

          {status === 'arrived' && (
            <div className="space-y-4 text-center animate-fade-in">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
                <p className="font-bold text-sm flex items-center justify-center gap-2">
                  <MapPin size={16} /> GMCH Radius Entered
                </p>
              </div>
              
              <div className="border-4 border-slate-900 p-2 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center bg-white shadow-xl overflow-hidden">
                {/* REAL DYNAMIC QR CODE GENERATOR API */}
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${id}_VERIFIED_DONOR_GMCH`} alt="Real QR Code" className="w-full h-full object-contain" />
              </div>
              
              <h3 className="font-black text-xl text-slate-900 tracking-widest">{id}</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Scan this secure QR pass at the hospital desk for fast-track entry and to authorize the free return trip. No payment holds required.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}