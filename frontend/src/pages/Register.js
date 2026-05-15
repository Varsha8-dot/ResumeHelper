import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ff6584', '#f7971e', '#43e97b'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0a0f' }}>
      <div className="mesh-bg" />

      {/* Left */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#lgR)"/>
            <path d="M8 10h10M8 14h8M8 18h12M8 22h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="24" cy="20" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
            <path d="M22 20l1.5 1.5L26 18.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="lgR" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#6c63ff"/><stop offset="1" stopColor="#ff6584"/></linearGradient></defs>
          </svg>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeHelper</span>
        </Link>

        <h1 style={{ fontFamily: 'Syne', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
          Start your<br/>journey 🚀
        </h1>
        <p style={{ color: '#8888aa', fontSize: 16, lineHeight: 1.7, maxWidth: 360, marginBottom: 40 }}>
          Join 50,000+ job seekers who use ResumeHelper to get more interviews and better offers.
        </p>

        {/* Testimonial */}
        <div className="card" style={{ maxWidth: 380, padding: '20px', border: '1px solid rgba(67,233,123,0.2)' }}>
          <p style={{ fontSize: 14, color: '#ccccee', lineHeight: 1.7, marginBottom: 12 }}>
            "ResumeHelper gave me an 87/100 ATS score and the cover letter generator was incredible. Got 4 interviews in one week!"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#43e97b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>P</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Priya Sharma</div>
              <div style={{ fontSize: 12, color: '#8888aa' }}>Frontend Developer @ Google</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div className="card" style={{ width: '100%', padding: '40px', border: '1px solid rgba(108,99,255,0.2)' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '1.6rem', marginBottom: 8 }}>Create Account</h2>
          <p style={{ color: '#8888aa', fontSize: 14, marginBottom: 32 }}>
            Already have an account? <Link to="/login" style={{ color: '#6c63ff', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          <form onSubmit={handle}>
            <div style={{ marginBottom: 18 }}>
              <label className="label">Full Name</label>
              <input className="input" type="text" placeholder="Rahul Kumar" required
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" required
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>

            {/* Password strength */}
            {form.password && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: strengthColors[strength] }}>{strengthLabels[strength]}</div>
              </div>
            )}

            <button type="submit" className="btn btn-gradient" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px' }} disabled={loading}>
              {loading ? '⏳ Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: '#8888aa', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
            By signing up, you agree to our Terms of Service and Privacy Policy. 100% free, no credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
