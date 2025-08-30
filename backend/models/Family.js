const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'member', 'child', 'elder'],
    default: 'member'
  },
  age: Number,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  healthConditions: [String], // 健康状况，如：['diabetes', 'hypertension']
  dietaryRestrictions: [String], // 饮食限制
  allergies: [String], // 过敏原
  nutritionNeeds: {
    dailyCalories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    vitamins: [String], // 需要的维生素
    minerals: [String]  // 需要的矿物质
  }
});

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  members: [familyMemberSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    mealReminders: {
      enabled: { type: Boolean, default: true },
      breakfast: { time: String, default: '08:00' },
      lunch: { time: String, default: '12:00' },
      dinner: { time: String, default: '18:00' }
    },
    ingredientExpiryReminders: {
      enabled: { type: Boolean, default: true },
      daysBeforeExpiry: { type: Number, default: 2 }
    },
    nutritionTracking: {
      enabled: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true }
    }
  },
  preferences: {
    cuisinePreferences: [String], // 偏好菜系
    mealSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    cookingTime: {
      type: String,
      enum: ['quick', 'moderate', 'slow'],
      default: 'moderate'
    },
    spiceLevel: {
      type: String,
      enum: ['none', 'mild', 'medium', 'hot'],
      default: 'medium'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 添加家庭成员
familySchema.methods.addMember = function(memberData) {
  this.members.push(memberData);
  return this.save();
};

// 移除家庭成员
familySchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.userId.toString() !== userId.toString()
  );
  return this.save();
};

// 获取家庭成员信息
familySchema.methods.getMemberInfo = function(userId) {
  return this.members.find(member => 
    member.userId.toString() === userId.toString()
  );
};

module.exports = mongoose.model('Family', familySchema);
