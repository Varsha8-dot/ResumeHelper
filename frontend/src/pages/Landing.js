import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🎯', title: 'ATS Score', desc: 'Instant score out of 100 with detailed breakdown' },
  { icon: '🤖', title: 'AI Suggestions', desc: 'GPT-4 powered feedback for each resume section' },
  { icon: '📄', title: 'Cover Letter', desc: 'Auto-generate tailored cover letters in seconds' },
  { icon: '🎤', title: 'Interview Coach', desc: 'Practice with AI-generated role-specific questions' },
  { icon: '🔥', title: 'Roast Mode', desc: 'Brutally honest feedback that goes viral on LinkedIn' },
  { icon: '💰', title: 'Salary Estimator', desc: 'Know your market value before negotiating' },
  { icon: '📊', title: 'Job Tracker', desc: 'Kanban board to manage your entire job search' },
  { icon: '📈', title: 'Skills Gap', desc: 'Visual chart of your skills vs. job requirements' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0ff' }}>
      <div className="mesh-bg" />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#lg2)"/>
            <path d="M8 10h10M8 14h8M8 18h12M8 22h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="24" cy="20" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
            <path d="M22 20l1.5 1.5L26 18.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="lg2" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#6c63ff"/><stop offset="1" stopColor="#ff6584"/>
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ResumeHelper
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-outline">Log In</Link>
          <Link to="/register" className="btn btn-gradient">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="badge badge-purple" style={{ marginBottom: 24, fontSize: 13 }}>
          ✨ AI-Powered Resume Intelligence
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
          Land <span style={{ background: 'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>3x More</span><br/>
          Interview Callbacks
        </h1>
        <p style={{ fontSize: 18, color: '#8888aa', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Upload your resume, get an instant ATS score, AI suggestions, cover letters,
          interview prep and salary insights — all in one place.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-gradient" style={{ fontSize: 17, padding: '14px 32px' }}>
            Analyze My Resume Free →
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ fontSize: 17, padding: '14px 32px' }}>
            View Sample Report
          </Link>
        </div>

        {/* Floating stats */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}>
          {[['50K+','Resumes Analyzed'],['94%','ATS Pass Rate'],['3x','Interview Rate'],['Free','No Credit Card']].map(([val,label]) => (
            <div key={label} className="card" style={{ padding: '16px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontFamily: 'Syne', fontWeight: 800, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</div>
              <div style={{ fontSize: 12, color: '#8888aa', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontFamily: 'Syne', marginBottom: 48 }}>
          Everything You Need to Get Hired
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} className="card" style={{ transition: 'transform 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#8888aa', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="card" style={{ maxWidth: 640, margin: '0 auto', padding: '48px', background: 'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(255,101,132,0.1))' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 16 }}>Ready to land your dream job?</h2>
          <p style={{ color: '#8888aa', marginBottom: 32, lineHeight: 1.7 }}>Join thousands of job seekers who improved their resume and landed offers.</p>
          <Link to="/register" className="btn btn-gradient" style={{ fontSize: 16, padding: '14px 36px' }}>
            Start For Free →
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 40px', textAlign: 'center', color: '#8888aa', fontSize: 13, position: 'relative', zIndex: 1 }}>
        © 2025 ResumeHelper · Built with ❤️ using React, Node.js & MongoDB
      </footer>
    </div>
  );
}
