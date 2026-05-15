import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'saved', label: '🔖 Saved', color: '#8888aa' },
  { id: 'applied', label: '📤 Applied', color: '#6c63ff' },
  { id: 'interview', label: '🎤 Interview', color: '#f7971e' },
  { id: 'offer', label: '🎉 Offer', color: '#43e97b' },
  { id: 'rejected', label: '❌ Rejected', color: '#ff6584' },
];

export default function Tracker() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', jobUrl: '', status: 'saved', salary: '', location: '', notes: '' });
  const [adding, setAdding] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  const fetchData = async () => {
    try {
      const [jRes, sRes] = await Promise.all([api.get('/tracker'), api.get('/tracker/stats/summary')]);
      setJobs(jRes.data.jobs);
      setStats(sRes.data.stats);
    } catch { toast.error('Failed to load tracker'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const addJob = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) { toast.error('Company and role required'); return; }
    setAdding(true);
    try {
      const { data } = await api.post('/tracker', form);
      setJobs(prev => [data.job, ...prev]);
      setShowAdd(false);
      setForm({ company: '', role: '', jobUrl: '', status: 'saved', salary: '', location: '', notes: '' });
      toast.success('Job added!');
      fetchData();
    } catch { toast.error('Failed to add job'); }
    finally { setAdding(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/tracker/${id}`, { status });
      setJobs(prev => prev.map(j => j._id === id ? data.job : j));
      fetchData();
    } catch { toast.error('Failed to update'); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Remove this job?')) return;
    try {
      await api.delete(`/tracker/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Removed');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const handleDrop = (e, toStatus) => {
    e.preventDefault();
    if (draggedId) updateStatus(draggedId, toStatus);
    setDraggedId(null);
  };

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <div className="mesh-bg" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 4 }}>🎯 Job Tracker</h1>
          <p style={{ color: '#8888aa' }}>Track your job applications in a Kanban board</p>
        </div>
        <button className="btn btn-gradient" onClick={() => setShowAdd(!showAdd)}>+ Add Job</button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total', val: stats.total, color: '#8888aa' },
            { label: 'Applied', val: stats.applied, color: '#6c63ff' },
            { label: 'Interviews', val: stats.interviews, color: '#f7971e' },
            { label: 'Offers', val: stats.offers, color: '#43e97b' },
            { label: 'Response Rate', val: stats.responseRate + '%', color: '#ff6584' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontFamily: 'Syne', fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#8888aa', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Job Form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 28, border: '1px solid rgba(108,99,255,0.3)' }}>
          <h3 style={{ fontFamily: 'Syne', marginBottom: 20 }}>Add New Job</h3>
          <form onSubmit={addJob}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 16 }}>
              <div><label className="label">Company *</label><input className="input" placeholder="Google, Amazon..." value={form.company} onChange={e => setForm({...form,company:e.target.value})} required /></div>
              <div><label className="label">Role *</label><input className="input" placeholder="Frontend Developer..." value={form.role} onChange={e => setForm({...form,role:e.target.value})} required /></div>
              <div><label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm({...form,status:e.target.value})} style={{ cursor: 'pointer' }}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div><label className="label">Location</label><input className="input" placeholder="Hyderabad, Remote..." value={form.location} onChange={e => setForm({...form,location:e.target.value})} /></div>
              <div><label className="label">Salary Range</label><input className="input" placeholder="₹12-15 LPA..." value={form.salary} onChange={e => setForm({...form,salary:e.target.value})} /></div>
              <div><label className="label">Job URL</label><input className="input" placeholder="https://..." value={form.jobUrl} onChange={e => setForm({...form,jobUrl:e.target.value})} /></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Notes</label>
              <textarea className="input" rows={2} placeholder="Any notes about this application..." value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-gradient" disabled={adding}>{adding ? '⏳ Adding...' : '+ Add Job'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="kanban">
          {COLUMNS.map(col => {
            const colJobs = jobs.filter(j => j.status === col.id);
            return (
              <div key={col.id} className="kanban-col"
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, col.id)}>
                <div className="kanban-col-header" style={{ color: col.color }}>
                  {col.label}
                  <span style={{ background: `${col.color}22`, color: col.color, padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{colJobs.length}</span>
                </div>
                {colJobs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: '#8888aa', fontSize: 12, borderRadius: 8, border: '1px dashed rgba(255,255,255,0.08)' }}>
                    Drop here
                  </div>
                )}
                {colJobs.map(job => (
                  <div key={job._id} className="kanban-card" draggable
                    onDragStart={() => setDraggedId(job._id)}
                    onDragEnd={() => setDraggedId(null)}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{job.company}</div>
                    <div style={{ fontSize: 12, color: col.color, marginBottom: 8 }}>{job.role}</div>
                    {job.location && <div style={{ fontSize: 11, color: '#8888aa', marginBottom: 4 }}>📍 {job.location}</div>}
                    {job.salary && <div style={{ fontSize: 11, color: '#8888aa', marginBottom: 8 }}>💰 {job.salary}</div>}
                    {job.appliedDate && <div style={{ fontSize: 11, color: '#8888aa', marginBottom: 8 }}>📅 Applied {new Date(job.appliedDate).toLocaleDateString()}</div>}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      <select style={{ flex: 1, padding: '4px 6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0f0ff', fontSize: 11, cursor: 'pointer' }}
                        value={job.status} onChange={e => updateStatus(job._id, e.target.value)}>
                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label.split(' ')[1]}</option>)}
                      </select>
                      {job.jobUrl && <a href={job.jobUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}>🔗</a>}
                      <button onClick={() => deleteJob(job._id)} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
