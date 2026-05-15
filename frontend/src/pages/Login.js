import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0a0f' }}>
      <div className="mesh-bg" />

      {/* Left decorative panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#lgL)"/>
            <path d="M8 10h10M8 14h8M8 18h12M8 22h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="24" cy="20" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
            <path d="M22 20l1.5 1.5L26 18.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="lgL" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#6c63ff"/><stop offset="1" stopColor="#ff6584"/></linearGradient></defs>
          </svg>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeHelper</span>
        </Link>

        <h1 style={{ fontFamily: 'Syne', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
          Welcome<br/>back 👋
        </h1>
        <p style={{ color: '#8888aa', fontSize: 16, lineHeight: 1.7, maxWidth: 360, marginBottom: 40 }}>
          Log in to access your resume analysis, job tracker, and AI career tools.
        </p>

        {/* Feature bullets */}
        {['ATS Score & AI Suggestions','Cover Letter Generator','Interview Coach & Roast Mode','Job Application Tracker'].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>
            <span style={{ fontSize: 14, color: '#ccccee' }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Right form panel */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div className="card" style={{ width: '100%', padding: '40px', border: '1px solid rgba(108,99,255,0.2)' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '1.6rem', marginBottom: 8 }}>Sign In</h2>
          <p style={{ color: '#8888aa', fontSize: 14, marginBottom: 32 }}>
            Don't have an account? <Link to="/register" style={{ color: '#6c63ff', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
          </p>

          <form onSubmit={handle}>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-gradient" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(108,99,255,0.08)', borderRadius: 10, fontSize: 13, color: '#8888aa', textAlign: 'center' }}>
            🔒 Secured with JWT authentication & encrypted storage
          </div>
        </div>
      </div>
    </div>
  );
}
