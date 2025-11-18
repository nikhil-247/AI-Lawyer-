const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    emoji: { type: String, required: true },
    notes: { type: String },
    anxietyLevel: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
