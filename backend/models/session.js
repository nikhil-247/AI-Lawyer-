const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    audioUrl: { type: String },
    duration: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
