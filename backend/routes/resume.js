const express = require('express');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');
const { parseResume, calculateATSScore, extractSections } = require('../utils/parser');

const router = express.Router();

// Upload and analyze resume
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { jobRole, jobDescription, versionName } = req.body;
    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'docx';

    // Parse resume text
    const parsedText = await parseResume(req.file.path, fileType);
    const parsedSections = extractSections(parsedText);

    // Calculate ATS score
    const { score: atsScore, checks } = calculateATSScore(parsedText, jobDescription);

    // Skills gap analysis
    let skillsGap = null;
    if (jobDescription) {
      const jdSkills = jobDescription.toLowerCase().match(/\b(javascript|python|react|node|mongodb|sql|java|css|html|typescript|express|git|docker|aws|figma|tailwind|vue|angular|graphql|rest|api|management|leadership|communication|agile|scrum|devops|kubernetes|redis|postgresql|mysql)\b/gi) || [];
      const uniqueJdSkills = [...new Set(jdSkills.map(s => s.toLowerCase()))];
      const matched = uniqueJdSkills.filter(s => parsedSections.skills.includes(s));
      const missing = uniqueJdSkills.filter(s => !parsedSections.skills.includes(s));
      skillsGap = {
        matched,
        missing,
        matchPercent: Math.round((matched.length / Math.max(uniqueJdSkills.length, 1)) * 100)
      };
    }

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileType,
      versionName: versionName || 'Default',
      parsedText,
      parsedSections,
      atsScore,
      jobRole,
      jobDescription,
      jobMatchScore: skillsGap?.matchPercent || null,
      skillsGap
    });

    // Increment user scan count
    req.user.scansUsed = (req.user.scansUsed || 0) + 1;
    await req.user.save({ validateBeforeSave: false });

    res.status(201).json({
      message: 'Resume analyzed successfully',
      resume: {
        id: resume._id,
        atsScore,
        checks,
        parsedSections,
        skillsGap,
        jobRole,
        fileName: resume.fileName,
        versionName: resume.versionName,
        createdAt: resume.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get resume history
router.get('/history', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-parsedText -aiSuggestions')
      .sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single resume
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update resume version name
router.patch('/:id', protect, async (req, res) => {
  try {
    const { versionName } = req.body;
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { versionName },
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete resume
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
