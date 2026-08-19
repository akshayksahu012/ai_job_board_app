import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    skills: [{ type: String }],
    jobTitle: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
