const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    mediaUrls: [{ type: String }],
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Memory', memorySchema);
