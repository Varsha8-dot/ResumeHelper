const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: { type: String, required: true },
  role: { type: String, required: true },
  jobUrl: { type: String },
  status: {
    type: String,
    enum: ['saved', 'applied', 'interview', 'offer', 'rejected'],
    default: 'saved'
  },
  resumeUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  appliedDate: { type: Date },
  notes: { type: String },
  salary: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
