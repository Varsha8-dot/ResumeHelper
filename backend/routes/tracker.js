const express = require('express');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (kanban board)
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id })
      .populate('resumeUsed', 'fileName versionName atsScore')
      .sort({ updatedAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add job
router.post('/', protect, async (req, res) => {
  try {
    const { company, role, jobUrl, status, salary, location, notes, resumeUsed } = req.body;
    if (!company || !role) return res.status(400).json({ error: 'Company and role required' });

    const job = await Job.create({
      userId: req.user._id,
      company, role, jobUrl, salary, location, notes, resumeUsed,
      status: status || 'saved',
      appliedDate: status === 'applied' ? new Date() : null
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update job status
router.patch('/:id', protect, async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date() };
    if (updates.status === 'applied' && !updates.appliedDate) {
      updates.appliedDate = new Date();
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true }
    ).populate('resumeUsed', 'fileName versionName');

    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete job
router.delete('/:id', protect, async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id });
    const stats = {
      total: jobs.length,
      applied: jobs.filter(j => j.status === 'applied').length,
      interviews: jobs.filter(j => j.status === 'interview').length,
      offers: jobs.filter(j => j.status === 'offer').length,
      rejected: jobs.filter(j => j.status === 'rejected').length,
      responseRate: jobs.length > 0 ? Math.round((jobs.filter(j => ['interview', 'offer'].includes(j.status)).length / jobs.filter(j => j.status !== 'saved').length) * 100) || 0 : 0
    };
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
