import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  role: { 
    type: String, 
    required: true,
    trim: true 
  },
  specialty: { 
    type: String, 
    required: true,
    trim: true,
    default: '' 
  },
  bio: { 
    type: String, 
    required: true,
    trim: true,
    default: '' 
  },
  initials: {
    type: String,
    maxlength: 3,
    uppercase: true
  },
  image: { 
    type: String, 
    default: '' 
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Auto-generate initials from name if not provided
teamMemberSchema.pre('save', function(next) {
  if (!this.initials && this.name) {
    const nameParts = this.name.trim().split(' ');
    this.initials = nameParts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 3);
  }
  next();
});

export default mongoose.model('TeamMember', teamMemberSchema);