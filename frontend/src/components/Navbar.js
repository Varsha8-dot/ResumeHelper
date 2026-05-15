import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/analyze', label: '🔍 Analyze' },
    { to: '/tracker', label: '🎯 Job Tracker' },
  ];

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 64
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#lg1)"/>
          <path d="M8 10h10M8 14h8M8 18h12M8 22h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="24" cy="20" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
          <path d="M22 20l1.5 1.5L26 18.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#6c63ff"/>
              <stop offset="1" stopColor="#ff6584"/>
            </linearGradient>
          </defs>
        </svg>
        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ResumeHelper
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            textDecoration: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            color: location.pathname === l.to ? '#6c63ff' : '#8888aa',
            background: location.pathname === l.to ? 'rgba(108,99,255,0.12)' : 'transparent',
            transition: 'all 0.2s'
          }}>{l.label}</Link>
        ))}
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 13, color: '#8888aa' }}>
          👋 {user?.name?.split(' ')[0]}
        </div>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
      </div>
    </nav>
  );
}
