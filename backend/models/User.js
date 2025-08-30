const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  preferences: {
    dietaryRestrictions: [String], // 饮食限制，如：['vegetarian', 'gluten-free']
    allergies: [String], // 过敏原，如：['peanuts', 'shellfish']
    cookingLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    preferredCuisine: [String], // 偏好菜系
    spiceTolerance: {
      type: String,
      enum: ['none', 'mild', 'medium', 'hot'],
      default: 'medium'
    }
  },
  nutritionGoals: {
    dailyCalories: Number,
    protein: Number, // 克
    carbs: Number,   // 克
    fat: Number,     // 克
    fiber: Number    // 克
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 获取用户公开信息
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
