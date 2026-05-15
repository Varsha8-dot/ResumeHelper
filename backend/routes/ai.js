const express = require('express');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');
const { callGemini, callGeminiJSON } = require('../utils/gemini');

const router = express.Router();

// 1. AI SUGGESTIONS
router.post('/suggestions', protect, async (req, res) => {
  try {
    const { resumeId, jobRole } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const system = `You are an expert resume coach and ATS specialist with 10+ years experience.`;
    const prompt = `Analyze this resume for the role of "${jobRole || 'Software Engineer'}".
Resume:
${resume.parsedText?.substring(0, 3000)}

Return a JSON array of up to 8 suggestions. Each item:
- section: string
- issue: string (what is wrong)
- suggestion: string (exactly what to fix)
- priority: "high" | "medium" | "low"`;

    const suggestions = await callGeminiJSON(system, prompt);
    const arr = Array.isArray(suggestions) ? suggestions : [{ section: 'General', issue: 'Review needed', suggestion: suggestions.raw || 'See raw output', priority: 'medium' }];
    resume.aiSuggestions = arr;
    await resume.save();
    res.json({ suggestions: arr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. COVER LETTER
router.post('/cover-letter', protect, async (req, res) => {
  try {
    const { resumeId, jobRole, company, tone } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const system = `You are an expert cover letter writer. Write compelling, personalized cover letters.`;
    const prompt = `Write a ${tone || 'professional'} cover letter.
Company: ${company || 'the company'}
Role: ${jobRole || resume.jobRole || 'Software Engineer'}
Resume: ${resume.parsedText?.substring(0, 2000)}
Write 3 paragraphs: hook, achievements, CTA. Under 300 words.`;

    const coverLetter = await callGemini(system, prompt);
    resume.coverLetter = coverLetter;
    await resume.save();
    res.json({ coverLetter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. INTERVIEW QUESTIONS
router.post('/interview-questions', protect, async (req, res) => {
  try {
    const { resumeId, jobRole } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const system = `You are a senior technical interviewer at a top tech company.`;
    const prompt = `Generate 8 interview questions for this ${jobRole || 'Software Engineer'} candidate.
Resume: ${resume.parsedText?.substring(0, 2000)}
Return JSON array of 8 objects each with: question, type ("behavioral"|"technical"|"situational"), hint (answer tip).`;

    const questions = await callGeminiJSON(system, prompt);
    const arr = Array.isArray(questions) ? questions : [];
    res.json({ questions: arr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ROAST MODE
router.post('/roast', protect, async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const system = `You are a brutally honest, witty career coach. Funny and sarcastic but genuinely helpful.`;
    const prompt = `Roast this resume! Be funny and brutally honest but constructive.
Resume: ${resume.parsedText?.substring(0, 2000)}
Format:
🔥 THE ROAST (2-3 funny but accurate observations)
💡 3 THINGS TO FIX RIGHT NOW:
1. [fix]
2. [fix]
3. [fix]
Under 200 words total.`;

    const roast = await callGemini(system, prompt);
    res.json({ roast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. SALARY ESTIMATOR
router.post('/salary', protect, async (req, res) => {
  try {
    const { resumeId, location } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const system = `You are a compensation expert with deep knowledge of tech salaries globally including India (LPA).`;
    const prompt = `Estimate salary for this candidate in ${location || 'India'}.
Resume: ${resume.parsedText?.substring(0, 1500)}
Return JSON: role, location, currency, unit, minSalary (number), midSalary (number), maxSalary (number), experienceLevel, topSkillsThatIncreaseSalary (array of 3), notes.`;

    const salaryData = await callGeminiJSON(system, prompt);
    res.json({ salaryData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. COLD EMAIL
router.post('/cold-email', protect, async (req, res) => {
  try {
    const { resumeId, recruiterName, company, role } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const system = `You write short, compelling cold emails to recruiters that get replies.`;
    const prompt = `Write a cold email to ${recruiterName || 'Hiring Manager'} at ${company || 'the company'} for ${role || 'Software Engineer'}.
Candidate: ${resume.parsedText?.substring(0, 1000)}
Rules: Under 120 words, include Subject line, 3 paragraphs, end with "Best regards, [Your Name]".`;

    const email = await callGemini(system, prompt);
    res.json({ email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. LINKEDIN OPTIMIZER
router.post('/linkedin', protect, async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const system = `You are a LinkedIn profile optimization expert.`;
    const prompt = `Based on this resume, suggest LinkedIn improvements.
Resume: ${resume.parsedText?.substring(0, 2000)}
Return JSON: headline (string), summary (string, 3 paragraphs), headlineTips (array of 3), skillsToAdd (array of 5), profileStrength.`;

    const linkedin = await callGeminiJSON(system, prompt);
    res.json({ linkedin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
