const mongoose = require('mongoose');

const ingredientItemSchema = new mongoose.Schema({
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient'
  },
  name: String, // 食材名称（冗余存储，便于查询）
  quantity: {
    amount: Number,
    unit: String
  },
  isOptional: {
    type: Boolean,
    default: false
  },
  notes: String // 特殊说明，如："切丝"、"去皮"
});

const stepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: Number, // 预计时间（分钟）
  temperature: Number, // 温度（摄氏度）
  videoUrl: String, // 步骤视频URL
  imageUrl: String, // 步骤图片URL
  tips: [String], // 小贴士
  warnings: [String], // 注意事项
  ingredients: [ingredientItemSchema], // 这一步需要的食材
  tools: [String] // 需要的工具
});

const nutritionSchema = new mongoose.Schema({
  calories: Number, // 总热量
  protein: Number, // 蛋白质（克）
  carbs: Number,   // 碳水化合物（克）
  fat: Number,     // 脂肪（克）
  fiber: Number,   // 膳食纤维（克）
  sodium: Number,  // 钠（毫克）
  sugar: Number,   // 糖（克）
  vitamins: [String], // 维生素
  minerals: [String]  // 矿物质
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']
  },
  cuisine: {
    type: String,
    required: true,
    enum: ['chinese', 'western', 'japanese', 'korean', 'thai', 'indian', 'italian', 'french', 'other']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  prepTime: Number, // 准备时间（分钟）
  cookTime: Number, // 烹饪时间（分钟）
  totalTime: Number, // 总时间（分钟）
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  ingredients: [ingredientItemSchema],
  steps: [stepSchema],
  nutrition: nutritionSchema,
  images: [String], // 成品图片URLs
  videoUrl: String, // 完整烹饪视频URL
  tags: [String], // 标签，如：['vegetarian', 'quick', 'healthy']
  dietaryInfo: {
    isVegetarian: Boolean,
    isVegan: Boolean,
    isGlutenFree: Boolean,
    isDairyFree: Boolean,
    isLowCarb: Boolean,
    isLowFat: Boolean,
    allergens: [String] // 过敏原
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  cookingHistory: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    modifications: [String] // 修改记录
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 索引优化查询性能
recipeSchema.index({ familyId: 1, category: 1 });
recipeSchema.index({ familyId: 1, cuisine: 1 });
recipeSchema.index({ familyId: 1, difficulty: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ isPublic: 1, rating: { average: -1 } });

// 计算总时间
recipeSchema.pre('save', function(next) {
  if (this.prepTime && this.cookTime) {
    this.totalTime = this.prepTime + this.cookTime;
  }
  next();
});

// 添加评论
recipeSchema.methods.addReview = function(userId, rating, comment) {
  const review = {
    userId,
    rating,
    comment
  };
  
  this.reviews.push(review);
  
  // 更新平均评分
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
  
  return this.save();
};

// 检查食材是否足够
recipeSchema.methods.checkIngredientsAvailability = function(availableIngredients) {
  const missingIngredients = [];
  const availableMap = new Map();
  
  // 创建可用食材的映射
  availableIngredients.forEach(ingredient => {
    availableMap.set(ingredient.name.toLowerCase(), ingredient);
  });
  
  this.ingredients.forEach(recipeIngredient => {
    const available = availableMap.get(recipeIngredient.name.toLowerCase());
    if (!available || available.quantity.amount < recipeIngredient.quantity.amount) {
      missingIngredients.push({
        name: recipeIngredient.name,
        required: recipeIngredient.quantity,
        available: available ? available.quantity : null
      });
    }
  });
  
  return {
    canCook: missingIngredients.length === 0,
    missingIngredients
  };
};

// 获取营养信息（按份数）
recipeSchema.methods.getNutritionPerServing = function() {
  if (!this.nutrition) return null;
  
  const nutrition = {};
  Object.keys(this.nutrition).forEach(key => {
    if (typeof this.nutrition[key] === 'number') {
      nutrition[key] = this.nutrition[key] / this.servings;
    } else {
      nutrition[key] = this.nutrition[key];
    }
  });
  
  return nutrition;
};

module.exports = mongoose.model('Recipe', recipeSchema);
