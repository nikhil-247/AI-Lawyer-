const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    // userId is optional for now because the frontend does not send it
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    dementiaStage: { type: String, required: true },
    relationship: { type: String, required: true },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
