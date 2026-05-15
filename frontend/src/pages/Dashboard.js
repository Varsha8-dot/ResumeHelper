import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, sRes] = await Promise.all([
          api.get('/resume/history'),
          api.get('/tracker/stats/summary')
        ]);
        setResumes(rRes.data.resumes);
        setStats(sRes.data.stats);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(r => r.filter(x => x._id !== id));
      toast.success('Resume deleted');
    } catch { toast.error('Delete failed'); }
  };

  const scoreColor = s => s >= 70 ? '#43e97b' : s >= 50 ? '#f7971e' : '#ff6584';
  const scoreLabel = s => s >= 70 ? '🟢 Great' : s >= 50 ? '🟡 Decent' : '🔴 Needs Work';

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <div className="mesh-bg" />

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 8 }}>
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#8888aa' }}>Here's your career dashboard</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Resumes Analyzed', val: resumes.length, icon: '📄', color: '#6c63ff' },
          { label: 'Avg ATS Score', val: resumes.length ? Math.round(resumes.reduce((a,r)=>a+(r.atsScore||0),0)/resumes.length) + '/100' : 'N/A', icon: '🎯', color: '#43e97b' },
          { label: 'Jobs Tracked', val: stats?.total || 0, icon: '💼', color: '#f7971e' },
          { label: 'Interview Rate', val: stats?.responseRate ? stats.responseRate + '%' : 'N/A', icon: '🎤', color: '#ff6584' },
        ].map(s => (
          <div key={s.label} className="card" style={{ border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 13, color: '#8888aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 40 }}>
        <Link to="/analyze" className="card" style={{ textDecoration: 'none', cursor: 'pointer', border: '1px solid rgba(108,99,255,0.3)', background: 'linear-gradient(135deg,rgba(108,99,255,0.1),rgba(255,101,132,0.05))', transition: 'transform 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <h3 style={{ fontFamily: 'Syne', marginBottom: 4 }}>Analyze New Resume</h3>
          <p style={{ fontSize: 13, color: '#8888aa' }}>Upload PDF or DOCX for instant ATS score + AI feedback</p>
        </Link>
        <Link to="/tracker" className="card" style={{ textDecoration: 'none', cursor: 'pointer', border: '1px solid rgba(67,233,123,0.2)', background: 'linear-gradient(135deg,rgba(67,233,123,0.08),transparent)', transition: 'transform 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <h3 style={{ fontFamily: 'Syne', marginBottom: 4 }}>Job Tracker</h3>
          <p style={{ fontSize: 13, color: '#8888aa' }}>Track applications, interviews and offers in a Kanban board</p>
        </Link>
      </div>

      {/* Resume history */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '1.3rem' }}>Resume History</h2>
          <Link to="/analyze" className="btn btn-primary btn-sm">+ New Analysis</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : resumes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px', color: '#8888aa' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <h3 style={{ fontFamily: 'Syne', marginBottom: 8, color: '#f0f0ff' }}>No resumes yet</h3>
            <p style={{ marginBottom: 24 }}>Upload your first resume to get started</p>
            <Link to="/analyze" className="btn btn-gradient">Analyze My Resume</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {resumes.map(r => (
              <div key={r._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.fileName}</div>
                    <div style={{ fontSize: 12, color: '#8888aa' }}>
                      {r.versionName} · {r.jobRole || 'No role specified'} · {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {r.atsScore !== undefined && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 800, color: scoreColor(r.atsScore) }}>{r.atsScore}</div>
                      <div style={{ fontSize: 11, color: '#8888aa' }}>ATS Score</div>
                    </div>
                  )}
                  <span className="badge" style={{ background: `${scoreColor(r.atsScore)}22`, color: scoreColor(r.atsScore) }}>{scoreLabel(r.atsScore)}</span>
                  <Link to={`/results/${r._id}`} className="btn btn-primary btn-sm">View →</Link>
                  <button onClick={() => deleteResume(r._id)} className="btn btn-danger btn-sm">🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
