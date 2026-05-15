const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fetch = require('node-fetch');

const parseResume = async (fileUrl, fileType) => {
  try {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();

    let text = '';
    if (fileType === 'pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    return text.trim();
  } catch (err) {
    throw new Error('Failed to parse resume: ' + err.message);
  }
};

const calculateATSScore = (text, jobDescription = '') => {
  let score = 0;
  const checks = [];

  // Check for key sections
  const sections = ['experience', 'education', 'skills', 'summary', 'objective', 'projects'];
  const foundSections = sections.filter(s => text.toLowerCase().includes(s));
  score += (foundSections.length / sections.length) * 25;
  checks.push({ name: 'Section headings', score: Math.round((foundSections.length / sections.length) * 25) });

  // Check for contact info
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /[\+\d][\d\s\-\(\)]{7,}/.test(text);
  const contactScore = (hasEmail ? 10 : 0) + (hasPhone ? 5 : 0);
  score += contactScore;
  checks.push({ name: 'Contact information', score: contactScore });

  // Check for quantified achievements
  const quantifiedCount = (text.match(/\d+%|\$\d+|\d+\+|\d+ years?/gi) || []).length;
  const quantScore = Math.min(quantifiedCount * 3, 20);
  score += quantScore;
  checks.push({ name: 'Quantified achievements', score: quantScore });

  // Check length (ideal: 400-800 words)
  const wordCount = text.split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 300 && wordCount <= 1000) lengthScore = 15;
  else if (wordCount >= 200) lengthScore = 10;
  score += lengthScore;
  checks.push({ name: 'Resume length', score: lengthScore });

  // Job description keyword match
  let keywordScore = 0;
  if (jobDescription) {
    const jdWords = jobDescription.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const uniqueJdWords = [...new Set(jdWords)];
    const matched = uniqueJdWords.filter(w => text.toLowerCase().includes(w));
    keywordScore = Math.min(Math.round((matched.length / Math.max(uniqueJdWords.length, 1)) * 25), 25);
  } else {
    keywordScore = 15; // default if no JD
  }
  score += keywordScore;
  checks.push({ name: 'Keyword match', score: keywordScore });

  return { score: Math.round(Math.min(score, 100)), checks };
};

const extractSections = (text) => {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+\d][\d\s\-\(\)]{7,}/);

  // Extract skills (common patterns)
  const skillKeywords = ['javascript', 'python', 'react', 'node', 'mongodb', 'sql', 'java', 'css', 'html', 'typescript', 'express', 'git', 'docker', 'aws', 'figma', 'tailwind', 'vue', 'angular', 'graphql', 'rest', 'api'];
  const foundSkills = skillKeywords.filter(skill => text.toLowerCase().includes(skill));

  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const name = lines[0]?.trim() || '';

  return {
    name,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    skills: foundSkills,
    summary: '',
  };
};

module.exports = { parseResume, calculateATSScore, extractSections };
