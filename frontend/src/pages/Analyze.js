import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JOB_ROLES = ['Frontend Developer','Backend Developer','Full Stack Developer','Data Scientist','Machine Learning Engineer','DevOps Engineer','Product Manager','UI/UX Designer','Software Engineer','Cloud Architect','Cybersecurity Analyst','Data Analyst'];

export default function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [versionName, setVersionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const onDrop = useCallback(accepted => {
    if (accepted[0]) { setFile(accepted[0]); setStep(2); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const handleSubmit = async () => {
    if (!file) { toast.error('Please upload a resume'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobRole) formData.append('jobRole', jobRole);
      if (jobDescription) formData.append('jobDescription', jobDescription);
      formData.append('versionName', versionName || 'Default');

      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Resume analyzed! 🎉');
      navigate(`/results/${data.resume.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Check your file and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <div className="mesh-bg" />

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 8 }}>Analyze Resume</h1>
        <p style={{ color: '#8888aa', marginBottom: 40 }}>Upload your resume and get instant AI-powered insights</p>

        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
          {[['1','Upload Resume'],['2','Add Job Details'],['3','View Results']].map(([num, label], i) => (
            <React.Fragment key={num}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                  background: step >= i+1 ? 'linear-gradient(135deg,#6c63ff,#ff6584)' : 'rgba(255,255,255,0.08)',
                  color: step >= i+1 ? '#fff' : '#8888aa',
                  border: step === i+1 ? '2px solid #6c63ff' : '2px solid transparent',
                  transition: 'all 0.3s'
                }}>{num}</div>
                <span style={{ fontSize: 12, color: step >= i+1 ? '#f0f0ff' : '#8888aa', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: step > i+1 ? '#6c63ff' : 'rgba(255,255,255,0.08)', margin: '0 8px', marginBottom: 20, transition: 'all 0.3s' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Drop zone */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>📄 Upload Resume</h3>
          <div {...getRootProps()} style={{
            border: `2px dashed ${isDragActive ? '#6c63ff' : file ? '#43e97b' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 12, padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
            background: isDragActive ? 'rgba(108,99,255,0.08)' : file ? 'rgba(67,233,123,0.05)' : 'transparent',
            transition: 'all 0.3s'
          }}>
            <input {...getInputProps()} />
            <div style={{ fontSize: 48, marginBottom: 16 }}>{file ? '✅' : '📁'}</div>
            {file ? (
              <>
                <p style={{ fontWeight: 600, marginBottom: 4, color: '#43e97b' }}>{file.name}</p>
                <p style={{ fontSize: 13, color: '#8888aa' }}>{(file.size / 1024).toFixed(0)} KB · Click to change</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>Drag & Drop or <span style={{ color: '#6c63ff' }}>Choose file</span></p>
                <p style={{ fontSize: 13, color: '#8888aa' }}>Supports PDF and DOCX · Max 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Job details */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>🎯 Job Details <span style={{ fontSize: 13, fontFamily: 'DM Sans', color: '#8888aa', fontWeight: 400 }}>(optional but recommended)</span></h3>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Target Job Role</label>
            <select className="input" value={jobRole} onChange={e => setJobRole(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select a role...</option>
              {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Job Description <span style={{ color: '#8888aa' }}>(paste for better matching)</span></label>
            <textarea className="input" rows={5} placeholder="Paste the job description here for accurate ATS keyword matching and skills gap analysis..."
              value={jobDescription} onChange={e => setJobDescription(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'DM Sans' }} />
          </div>

          <div>
            <label className="label">Resume Version Name</label>
            <input className="input" placeholder="e.g. React-Focused, Senior Roles, Startup..." value={versionName} onChange={e => setVersionName(e.target.value)} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading || !file} className="btn btn-gradient"
          style={{ width: '100%', justifyContent: 'center', fontSize: 17, padding: '16px', opacity: !file ? 0.5 : 1 }}>
          {loading ? (
            <><div className="spinner" style={{ width: 20, height: 20, marginRight: 8 }} /> Analyzing with AI...</>
          ) : '🚀 Analyze My Resume →'}
        </button>

        {loading && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <p style={{ color: '#8888aa', fontSize: 14 }}>⏳ Parsing resume · Calculating ATS score · Running AI analysis...</p>
          </div>
        )}
      </div>
    </div>
  );
}
