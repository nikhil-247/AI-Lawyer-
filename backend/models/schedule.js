const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    time: { type: String, required: true },
    days: [{ type: String, required: true }],
    isActive: { type: Boolean, default: true },
    outputDevice: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
