import mongoose from 'mongoose';

// Define schema
const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  mentorUsername: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'unassigned'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
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

// Indexes (only defined once, not duplicated)
collegeSchema.index({ name: 1 });              // Ensures fast lookup by name
collegeSchema.index({ mentorUsername: 1 });    // For mentor assignments
collegeSchema.index({ isActive: 1 });          // For filtering active colleges

// Virtual: Mentor details
collegeSchema.virtual('mentor', {
  ref: 'User',
  localField: 'mentorUsername',
  foreignField: 'gitlabUsername',
  justOne: true
});

// Virtual: Intern count per college
collegeSchema.virtual('internsCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'college',
  count: true,
  match: { role: 'intern', isActive: true }
});

// Serialize virtuals
collegeSchema.set('toJSON', { virtuals: true });

// Pre-save hook to update timestamp
collegeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Reuse User model safely
const User = mongoose.models.User || mongoose.model('User');

// Static Methods
collegeSchema.statics.findByMentor = function (mentorUsername) {
  return this.findOne({
    mentorUsername: mentorUsername.toLowerCase(),
    isActive: true
  }).populate('mentor');
};

collegeSchema.statics.getAllActive = function () {
  return this.find({ isActive: true })
    .populate('mentor')
    .populate('internsCount');
};

// Instance Methods
collegeSchema.methods.getInterns = function () {
  return User.find({
    college: this._id,
    role: 'intern',
    isActive: true
  });
};

collegeSchema.methods.addIntern = function (internData) {
  return new User({
    ...internData,
    role: 'intern',
    college: this._id
  }).save();
};

// Export model
export default mongoose.models.College || mongoose.model('College', collegeSchema);
