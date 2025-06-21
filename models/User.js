import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  gitlabUsername: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  gitlabId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'mentor', 'intern'],
    default: 'intern'
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: function () {
      return this.role === 'intern';
    }
  },
  assignedBy: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: null
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ✅ Keep only non-redundant indexes
userSchema.index({ role: 1 });
userSchema.index({ college: 1 });

// Virtual for college name (populated)
userSchema.virtual('collegeName', {
  ref: 'College',
  localField: 'college',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to update timestamps
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Static methods
userSchema.statics.findByGitLabUsername = function (username) {
  return this.findOne({ gitlabUsername: username.toLowerCase(), isActive: true });
};

userSchema.statics.findByRole = function (role, collegeId = null) {
  const query = { role, isActive: true };
  if (collegeId) {
    query.college = collegeId;
  }
  return this.find(query).populate('college');
};

userSchema.statics.getAdmins = function () {
  return this.find({ role: 'admin', isActive: true });
};

userSchema.statics.getMentorsByCollege = function (collegeId) {
  return this.find({ role: 'mentor', college: collegeId, isActive: true }).populate('college');
};

userSchema.statics.getInternsByMentor = function (mentorUsername) {
  return this.findOne({ gitlabUsername: mentorUsername, role: 'mentor' })
    .populate('college')
    .then(mentor => {
      if (!mentor) return [];
      return this.find({ role: 'intern', college: mentor.college, isActive: true }).populate('college');
    });
};

// Instance methods
userSchema.methods.canManageUser = function (targetUser) {
  if (this.role === 'admin') return true;
  if (this.role === 'mentor' && targetUser.role === 'intern') {
    return this.college.toString() === targetUser.college.toString();
  }
  return false;
};

userSchema.methods.canAccessCollege = function (collegeId) {
  if (this.role === 'admin') return true;
  if (this.role === 'mentor' || this.role === 'intern') {
    return this.college.toString() === collegeId.toString();
  }
  return false;
};

userSchema.methods.updateLastLogin = function () {
  this.lastLoginAt = new Date();
  return this.save();
};

export default mongoose.models.User || mongoose.model('User', userSchema);
