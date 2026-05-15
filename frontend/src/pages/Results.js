import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ScoreRing = ({ score, size = 120 }) => {
  const r = 45; const c = 2 * Math.PI * r;
  const color = score >= 70 ? '#43e97b' : score >= 50 ? '#f7971e' : '#ff6584';
  const fill = (score / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round"/>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: size === 120 ? '1.8rem' : '1.2rem', color }}>{score}</div>
        <div style={{ fontSize: 10, color: '#8888aa' }}>/ 100</div>
      </div>
    </div>
  );
};

const AICard = ({ icon, title, desc, btnLabel, btnColor, onGenerate, loading, children }) => (
  <div className="card">
    <h3 style={{ fontFamily: 'Syne', marginBottom: 8 }}>{icon} {title}</h3>
    {!children ? (
      <>
        <p style={{ color: '#8888aa', fontSize: 14, marginBottom: 24 }}>{desc}</p>
        <button className="btn" style={{ background: btnColor || 'linear-gradient(135deg,#6c63ff,#ff6584)', color: '#fff' }}
          onClick={onGenerate} disabled={loading}>
          {loading ? '⏳ Generating...' : btnLabel}
        </button>
      </>
    ) : children}
  </div>
);

export default function Results() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState({});

  useEffect(() => {
    api.get(`/resume/${id}`)
      .then(r => setResume(r.data.resume))
      .catch(() => toast.error('Failed to load resume'))
      .finally(() => setLoading(false));
  }, [id]);

  const callAI = async (endpoint, payload, key) => {
    setAiLoading(key);
    try {
      const { data } = await api.post(`/ai/${endpoint}`, { resumeId: id, ...payload });
      setAiData(prev => ({ ...prev, [key]: data }));
      toast.success('Done! ✨');
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI request failed. Check your Gemini API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const getField = (key, field) => aiData[key]?.[field] ?? null;

  if (loading) return <div style={{ display:'flex',justifyContent:'center',alignItems:'center',height:'80vh' }}><div className="spinner"/></div>;
  if (!resume) return <div className="page"><p>Resume not found</p></div>;

  const scoreColor = s => s >= 70 ? '#43e97b' : s >= 50 ? '#f7971e' : '#ff6584';

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'suggestions', label: '🤖 AI Suggestions' },
    { id: 'cover', label: '📄 Cover Letter' },
    { id: 'interview', label: '🎤 Interview Prep' },
    { id: 'roast', label: '🔥 Roast Mode' },
    { id: 'salary', label: '💰 Salary' },
    { id: 'email', label: '📧 Cold Email' },
    { id: 'linkedin', label: '💼 LinkedIn' },
  ];

  return (
    <div className="page" style={{ position:'relative', zIndex:1 }}>
      <div className="mesh-bg"/>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32, flexWrap:'wrap', gap:16 }}>
        <div>
          <Link to="/dashboard" style={{ color:'#8888aa', fontSize:14, textDecoration:'none', display:'flex', alignItems:'center', gap:4, marginBottom:8 }}>← Back to Dashboard</Link>
          <h1 style={{ fontFamily:'Syne', fontSize:'1.8rem', marginBottom:4 }}>{resume.fileName}</h1>
          <p style={{ color:'#8888aa', fontSize:14 }}>{resume.jobRole || 'No role'} · {new Date(resume.createdAt).toLocaleDateString()}</p>
          <div style={{ marginTop:8 }} className="badge badge-purple">🤖 Powered by Google Gemini — FREE</div>
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
          <ScoreRing score={resume.atsScore || 0} size={100}/>
          {resume.jobMatchScore != null && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Syne', fontWeight:800, fontSize:'1.6rem', color:scoreColor(resume.jobMatchScore) }}>{resume.jobMatchScore}%</div>
              <div style={{ fontSize:11, color:'#8888aa' }}>Job Match</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom:28, flexWrap:'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab ${activeTab===t.id?'active':''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
          <div className="card">
            <h3 style={{ fontFamily:'Syne', marginBottom:16 }}>📋 Parsed Info</h3>
            {[['Name',resume.parsedSections?.name],['Email',resume.parsedSections?.email],['Phone',resume.parsedSections?.phone]].map(([k,v]) => v && (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:14 }}>
                <span style={{ color:'#8888aa' }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
              </div>
            ))}
            {resume.parsedSections?.skills?.length > 0 && (
              <div>
                <div style={{ color:'#8888aa', fontSize:13, marginBottom:8 }}>Skills Found</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {resume.parsedSections.skills.map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                </div>
              </div>
            )}
          </div>

          {resume.skillsGap && (
            <div className="card">
              <h3 style={{ fontFamily:'Syne', marginBottom:16 }}>📊 Skills Gap</h3>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                  <span style={{ color:'#8888aa' }}>Match Rate</span>
                  <span style={{ color:scoreColor(resume.skillsGap.matchPercent), fontWeight:700 }}>{resume.skillsGap.matchPercent}%</span>
                </div>
                <div className="progress"><div className="progress-fill" style={{ width:`${resume.skillsGap.matchPercent}%`, background:scoreColor(resume.skillsGap.matchPercent) }}/></div>
              </div>
              {resume.skillsGap.matched?.length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, color:'#43e97b', marginBottom:6 }}>✅ Matched Skills</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>{resume.skillsGap.matched.map(s => <span key={s} className="badge badge-green">{s}</span>)}</div>
                </div>
              )}
              {resume.skillsGap.missing?.length > 0 && (
                <div>
                  <div style={{ fontSize:12, color:'#ff6584', marginBottom:6 }}>❌ Missing Skills</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>{resume.skillsGap.missing.map(s => <span key={s} className="badge badge-red">{s}</span>)}</div>
                </div>
              )}
            </div>
          )}

          <div className="card" style={{ border:'1px solid rgba(108,99,255,0.2)' }}>
            <h3 style={{ fontFamily:'Syne', marginBottom:16 }}>⚡ Quick AI Actions</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'🤖 Get AI Suggestions', tab:'suggestions' },
                { label:'📄 Generate Cover Letter', tab:'cover' },
                { label:'🎤 Practice Interview', tab:'interview' },
                { label:'🔥 Roast My Resume', tab:'roast' },
                { label:'💰 Check Salary', tab:'salary' },
                { label:'💼 Optimize LinkedIn', tab:'linkedin' },
              ].map(a => (
                <button key={a.tab} className="btn btn-outline btn-sm" style={{ justifyContent:'flex-start' }} onClick={() => setActiveTab(a.tab)}>{a.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AI SUGGESTIONS ── */}
      {activeTab === 'suggestions' && (
        <div>
          {!aiData.suggestions && !resume.aiSuggestions?.length ? (
            <AICard icon="🤖" title="AI Improvement Suggestions" desc="Gemini AI will analyze your resume and give section-by-section improvement tips" btnLabel="🤖 Generate AI Suggestions"
              onGenerate={() => callAI('suggestions', { jobRole: resume.jobRole }, 'suggestions')} loading={aiLoading === 'suggestions'}/>
          ) : (
            (aiData.suggestions || resume.aiSuggestions).map((s, i) => (
              <div key={i} className="card" style={{ marginBottom:12, borderLeft:`3px solid ${s.priority==='high'?'#ff6584':s.priority==='medium'?'#f7971e':'#43e97b'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#6c63ff' }}>{s.section}</span>
                  <span className={`badge badge-${s.priority==='high'?'red':s.priority==='medium'?'yellow':'green'}`}>{s.priority} priority</span>
                </div>
                <p style={{ fontSize:14, color:'#ff6584', marginBottom:6 }}>⚠️ {s.issue}</p>
                <p style={{ fontSize:14, color:'#ccccee', lineHeight:1.6 }}>💡 {s.suggestion}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── COVER LETTER ── */}
      {activeTab === 'cover' && (
        <div className="card">
          <h3 style={{ fontFamily:'Syne', marginBottom:16 }}>📄 AI Cover Letter Generator</h3>
          {!getField('cover','coverLetter') ? (
            <>
              <input className="input" placeholder="Company name (e.g. Google, TCS, Infosys...)" id="company" style={{ marginBottom:12 }}/>
              <select className="input" id="tone" style={{ marginBottom:20, cursor:'pointer' }}>
                <option value="professional">Professional</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="concise">Concise & Direct</option>
              </select>
              <button className="btn btn-gradient" disabled={aiLoading==='cover'}
                onClick={() => callAI('cover-letter', { jobRole:resume.jobRole, company:document.getElementById('company').value, tone:document.getElementById('tone').value }, 'cover')}>
                {aiLoading==='cover' ? '⏳ Writing...' : '✍️ Generate Cover Letter'}
              </button>
            </>
          ) : (
            <>
              <div style={{ whiteSpace:'pre-wrap', lineHeight:1.8, fontSize:14, color:'#ccccee', marginBottom:20, padding:'20px', background:'rgba(255,255,255,0.03)', borderRadius:10 }}>
                {getField('cover','coverLetter')}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary btn-sm" onClick={() => { navigator.clipboard.writeText(getField('cover','coverLetter')); toast.success('Copied!'); }}>📋 Copy</button>
                <button className="btn btn-outline btn-sm" onClick={() => setAiData(p => ({...p, cover:null}))}>↺ Regenerate</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── INTERVIEW ── */}
      {activeTab === 'interview' && (
        <div>
          {!getField('interview','questions') ? (
            <AICard icon="🎤" title="AI Interview Coach" desc="Get 8 role-specific questions with answer hints based on YOUR resume"
              btnLabel="🎤 Generate Questions" onGenerate={() => callAI('interview-questions', { jobRole:resume.jobRole }, 'interview')} loading={aiLoading==='interview'}/>
          ) : (
            getField('interview','questions').map((q, i) => (
              <div key={i} className="card" style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                  <span style={{ fontFamily:'Syne', fontWeight:600, flex:1 }}>Q{i+1}. {q.question}</span>
                  <span className={`badge badge-${q.type==='technical'?'purple':q.type==='behavioral'?'green':'yellow'}`}>{q.type}</span>
                </div>
                {q.hint && <p style={{ fontSize:13, color:'#8888aa', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:10, marginTop:10 }}>💡 Hint: {q.hint}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── ROAST MODE ── */}
      {activeTab === 'roast' && (
        <div className="card" style={{ border:'1px solid rgba(255,101,132,0.3)' }}>
          <h3 style={{ fontFamily:'Syne', marginBottom:8 }}>🔥 Resume Roast Mode</h3>
          <p style={{ color:'#8888aa', fontSize:14, marginBottom:20 }}>Brutally honest (but funny) AI feedback — warning: may hurt 😂</p>
          {!getField('roast','roast') ? (
            <button className="btn" style={{ background:'linear-gradient(135deg,#ff6584,#f7971e)', color:'#fff' }}
              onClick={() => callAI('roast', {}, 'roast')} disabled={aiLoading==='roast'}>
              {aiLoading==='roast' ? '⏳ Roasting...' : '🔥 Roast My Resume!'}
            </button>
          ) : (
            <>
              <div style={{ whiteSpace:'pre-wrap', lineHeight:1.8, fontSize:15, color:'#f0f0ff', padding:'20px', background:'rgba(255,101,132,0.05)', borderRadius:10, border:'1px solid rgba(255,101,132,0.1)', marginBottom:16 }}>
                {getField('roast','roast')}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary btn-sm" onClick={() => { navigator.clipboard.writeText(getField('roast','roast')); toast.success('Copied! Share on LinkedIn 😂'); }}>📋 Copy & Share</button>
                <button className="btn btn-outline btn-sm" onClick={() => setAiData(p => ({...p, roast:null}))}>↺ Re-roast</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── SALARY ── */}
      {activeTab === 'salary' && (
        <div className="card">
          <h3 style={{ fontFamily:'Syne', marginBottom:16 }}>💰 Salary Estimator</h3>
          {!getField('salary','salaryData') ? (
            <>
              <input className="input" placeholder="Your location (e.g. Hyderabad, India / Bangalore / Mumbai)" id="location" style={{ marginBottom:16 }}/>
              <button className="btn btn-gradient" onClick={() => callAI('salary', { location:document.getElementById('location').value }, 'salary')} disabled={aiLoading==='salary'}>
                {aiLoading==='salary' ? '⏳ Estimating...' : '💰 Estimate My Salary'}
              </button>
            </>
          ) : (
            <div>
              {getField('salary','salaryData')?.experienceLevel && (
                <div style={{ marginBottom:16 }}>
                  <span className="badge badge-purple">Level: {getField('salary','salaryData').experienceLevel}</span>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
                {[['Min', getField('salary','salaryData')?.minSalary],['Mid',getField('salary','salaryData')?.midSalary],['Max',getField('salary','salaryData')?.maxSalary]].map(([l,v]) => (
                  <div key={l} style={{ textAlign:'center', padding:'20px', background:'rgba(255,255,255,0.04)', borderRadius:12 }}>
                    <div style={{ color:'#8888aa', fontSize:13, marginBottom:8 }}>{l}</div>
                    <div style={{ fontFamily:'Syne', fontSize:'1.4rem', fontWeight:800, color:l==='Mid'?'#6c63ff':'#f0f0ff' }}>
                      {v?.toLocaleString() || 'N/A'}
                    </div>
                    <div style={{ fontSize:11, color:'#8888aa' }}>{getField('salary','salaryData')?.unit || 'per year'}</div>
                  </div>
                ))}
              </div>
              {getField('salary','salaryData')?.topSkillsThatIncreaseSalary && (
                <div style={{ marginBottom:16 }}>
                  <p style={{ fontSize:13, color:'#8888aa', marginBottom:8 }}>🚀 Learn these to earn more:</p>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {getField('salary','salaryData').topSkillsThatIncreaseSalary.map(s => <span key={s} className="badge badge-yellow">{s}</span>)}
                  </div>
                </div>
              )}
              {getField('salary','salaryData')?.notes && <p style={{ fontSize:13, color:'#8888aa', lineHeight:1.7 }}>{getField('salary','salaryData').notes}</p>}
              <button className="btn btn-outline btn-sm" style={{ marginTop:16 }} onClick={() => setAiData(p => ({...p, salary:null}))}>↺ Re-estimate</button>
            </div>
          )}
        </div>
      )}

      {/* ── COLD EMAIL ── */}
      {activeTab === 'email' && (
        <div className="card">
          <h3 style={{ fontFamily:'Syne', marginBottom:16 }}>📧 Cold Recruiter Email</h3>
          {!getField('email','email') ? (
            <>
              <input className="input" id="rname" placeholder="Recruiter name (optional)" style={{ marginBottom:12 }}/>
              <input className="input" id="cname" placeholder="Company name (e.g. Wipro, Amazon)" style={{ marginBottom:12 }}/>
              <input className="input" id="rrole" placeholder="Role applying for" style={{ marginBottom:20 }}/>
              <button className="btn btn-gradient" disabled={aiLoading==='email'}
                onClick={() => callAI('cold-email', { recruiterName:document.getElementById('rname').value, company:document.getElementById('cname').value, role:document.getElementById('rrole').value }, 'email')}>
                {aiLoading==='email' ? '⏳ Writing...' : '📧 Generate Cold Email'}
              </button>
            </>
          ) : (
            <>
              <div style={{ whiteSpace:'pre-wrap', lineHeight:1.8, fontSize:14, color:'#ccccee', padding:'20px', background:'rgba(255,255,255,0.03)', borderRadius:10, marginBottom:16 }}>
                {getField('email','email')}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary btn-sm" onClick={() => { navigator.clipboard.writeText(getField('email','email')); toast.success('Copied!'); }}>📋 Copy</button>
                <button className="btn btn-outline btn-sm" onClick={() => setAiData(p => ({...p, email:null}))}>↺ Regenerate</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── LINKEDIN OPTIMIZER ── */}
      {activeTab === 'linkedin' && (
        <div>
          {!getField('linkedin','linkedin') ? (
            <AICard icon="💼" title="LinkedIn Profile Optimizer" desc="AI generates an optimized headline, About section, and skill recommendations for your LinkedIn profile"
              btnLabel="💼 Optimize My LinkedIn" btnColor="linear-gradient(135deg,#0077b5,#00a0dc)"
              onGenerate={() => callAI('linkedin', {}, 'linkedin')} loading={aiLoading==='linkedin'}/>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="card" style={{ border:'1px solid rgba(0,119,181,0.3)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <h3 style={{ fontFamily:'Syne' }}>💼 Optimized Headline</h3>
                  {getField('linkedin','linkedin')?.profileStrength && (
                    <span className="badge badge-green">⭐ {getField('linkedin','linkedin').profileStrength}</span>
                  )}
                </div>
                <div style={{ padding:'14px', background:'rgba(0,119,181,0.08)', borderRadius:10, fontSize:15, fontWeight:600, marginBottom:12 }}>
                  {getField('linkedin','linkedin')?.headline}
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard.writeText(getField('linkedin','linkedin')?.headline); toast.success('Headline copied!'); }}>📋 Copy Headline</button>
              </div>

              <div className="card">
                <h3 style={{ fontFamily:'Syne', marginBottom:12 }}>📝 Optimized About Section</h3>
                <div style={{ whiteSpace:'pre-wrap', lineHeight:1.8, fontSize:14, color:'#ccccee', padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:10, marginBottom:12 }}>
                  {getField('linkedin','linkedin')?.summary}
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard.writeText(getField('linkedin','linkedin')?.summary); toast.success('Summary copied!'); }}>📋 Copy Summary</button>
              </div>

              {getField('linkedin','linkedin')?.skillsToAdd?.length > 0 && (
                <div className="card">
                  <h3 style={{ fontFamily:'Syne', marginBottom:12 }}>🏷️ Skills to Add on LinkedIn</h3>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {getField('linkedin','linkedin').skillsToAdd.map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                  </div>
                </div>
              )}

              {getField('linkedin','linkedin')?.headlineTips?.length > 0 && (
                <div className="card">
                  <h3 style={{ fontFamily:'Syne', marginBottom:12 }}>💡 Headline Tips</h3>
                  {getField('linkedin','linkedin').headlineTips.map((t, i) => (
                    <div key={i} style={{ display:'flex', gap:10, marginBottom:10, fontSize:14, color:'#ccccee' }}>
                      <span style={{ color:'#6c63ff', fontWeight:700 }}>{i+1}.</span>{t}
                    </div>
                  ))}
                </div>
              )}

              <button className="btn btn-outline btn-sm" style={{ alignSelf:'flex-start' }} onClick={() => setAiData(p => ({...p, linkedin:null}))}>↺ Regenerate</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
