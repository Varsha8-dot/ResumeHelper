const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'docx'], required: true },
  versionName: { type: String, default: 'Default' },
  parsedText: { type: String },
  parsedSections: {
    name: String,
    email: String,
    phone: String,
    summary: String,
    skills: [String],
    experience: [{ title: String, company: String, duration: String, description: String }],
    education: [{ degree: String, institution: String, year: String }],
    certifications: [String],
    projects: [{ name: String, description: String, tech: [String] }]
  },
  atsScore: { type: Number, min: 0, max: 100 },
  jobRole: { type: String },
  jobDescription: { type: String },
  jobMatchScore: { type: Number, min: 0, max: 100 },
  aiSuggestions: [{
    section: String,
    issue: String,
    suggestion: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] }
  }],
  skillsGap: {
    matched: [String],
    missing: [String],
    matchPercent: Number
  },
  coverLetter: { type: String },
  improvedResume: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
