import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all your pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RidePortal from './pages/RidePortal';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Make the new animated Landing page the main Homepage */}
        <Route path="/" element={<Landing />} />
        
        {/* Keep your Login page available at /login */}
        <Route path="/login" element={<Login />} />
        
        {/* Command Center Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Emergency Ride Portal for Donors */}
        <Route path="/ride/:id" element={<RidePortal />} />
        
        {/* Fallback: redirect any unknown links to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}