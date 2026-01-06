import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    status: { type: String, enum: ['new', 'hot', 'cold'], default: 'new' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
