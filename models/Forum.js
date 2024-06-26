import mongoose from 'mongoose';

const ForumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
ForumSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Forum || mongoose.model('Forum', ForumSchema);
