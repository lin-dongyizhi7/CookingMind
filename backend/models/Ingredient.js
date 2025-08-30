const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'meat', 'seafood', 'dairy', 'grains', 'spices', 'others']
  },
  subcategory: String, // 子分类，如：'leafy-greens', 'root-vegetables'
  image: String, // 食材图片URL
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['g', 'kg', 'ml', 'l', 'piece', 'bunch', 'head', 'slice']
    },
    description: String // 如："大约2个拳头大小"
  },
  storage: {
    location: {
      type: String,
      required: true,
      enum: ['refrigerator', 'freezer', 'pantry', 'counter']
    },
    temperature: Number, // 存储温度（摄氏度）
    humidity: Number,   // 湿度百分比
    specialInstructions: String // 特殊存储说明
  },
  freshness: {
    purchaseDate: {
      type: Date,
      required: true
    },
    expiryDate: Date, // 过期日期
    estimatedShelfLife: Number, // 预计保质期（天）
    currentCondition: {
      type: String,
      enum: ['fresh', 'good', 'fair', 'poor', 'expired'],
      default: 'fresh'
    },
    notes: String // 新鲜度备注
  },
  nutrition: {
    caloriesPer100g: Number,
    protein: Number, // 蛋白质（克/100g）
    carbs: Number,   // 碳水化合物（克/100g）
    fat: Number,     // 脂肪（克/100g）
    fiber: Number,   // 膳食纤维（克/100g）
    vitamins: [String], // 维生素
    minerals: [String]  // 矿物质
  },
  usage: {
    commonRecipes: [String], // 常见用途
    cookingMethods: [String], // 烹饪方法
    pairing: [String], // 搭配建议
    substitutes: [String] // 替代品
  },
  tags: [String], // 标签，如：['organic', 'local', 'seasonal']
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 索引优化查询性能
ingredientSchema.index({ familyId: 1, category: 1 });
ingredientSchema.index({ familyId: 1, expiryDate: 1 });
ingredientSchema.index({ familyId: 1, storage: { location: 1 } });

// 计算剩余保质期
ingredientSchema.methods.getDaysUntilExpiry = function() {
  if (!this.freshness.expiryDate) return null;
  const now = new Date();
  const expiry = new Date(this.freshness.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 检查是否即将过期
ingredientSchema.methods.isExpiringSoon = function(daysThreshold = 3) {
  const daysUntilExpiry = this.getDaysUntilExpiry();
  return daysUntilExpiry !== null && daysUntilExpiry <= daysThreshold;
};

// 更新食材状态
ingredientSchema.methods.updateCondition = function() {
  const daysUntilExpiry = this.getDaysUntilExpiry();
  
  if (daysUntilExpiry === null) {
    this.freshness.currentCondition = 'good';
  } else if (daysUntilExpiry < 0) {
    this.freshness.currentCondition = 'expired';
  } else if (daysUntilExpiry <= 1) {
    this.freshness.currentCondition = 'poor';
  } else if (daysUntilExpiry <= 3) {
    this.freshness.currentCondition = 'fair';
  } else {
    this.freshness.currentCondition = 'good';
  }
  
  return this.save();
};

// 获取营养信息
ingredientSchema.methods.getNutritionInfo = function(quantity) {
  const multiplier = quantity / 100; // 假设营养信息是每100g的
  return {
    calories: this.nutrition.caloriesPer100g * multiplier,
    protein: this.nutrition.protein * multiplier,
    carbs: this.nutrition.carbs * multiplier,
    fat: this.nutrition.fat * multiplier,
    fiber: this.nutrition.fiber * multiplier
  };
};

module.exports = mongoose.model('Ingredient', ingredientSchema);
