const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const { auth, checkFamilyMember } = require('../middleware/auth');

const router = express.Router();

// 获取家庭营养概览
router.get('/overview', auth, checkFamilyMember, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // 这里可以实现更复杂的营养计算逻辑
    // 暂时返回基本信息
    const nutritionOverview = {
      date: targetDate,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      },
      recommendations: [
        '建议增加蔬菜摄入',
        '注意控制盐分摄入',
        '保持水分充足'
      ]
    };

    res.json({
      success: true,
      data: nutritionOverview
    });
  } catch (error) {
    console.error('获取营养概览错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 计算食谱营养信息
router.post('/calculate-recipe', auth, checkFamilyMember, async (req, res) => {
  try {
    const { ingredients, servings = 1 } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: '食材列表为必填项'
      });
    }

    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
      sugar: 0
    };

    // 计算每种食材的营养贡献
    for (const ingredient of ingredients) {
      const { name, quantity } = ingredient;
      
      // 查找食材的营养信息
      const ingredientInfo = await Ingredient.findOne({
        name: { $regex: new RegExp(name, 'i') },
        familyId: req.user.familyId,
        isActive: true
      });

      if (ingredientInfo && ingredientInfo.nutrition) {
        const multiplier = quantity / 100; // 假设营养信息是每100g的
        
        totalNutrition.calories += (ingredientInfo.nutrition.caloriesPer100g || 0) * multiplier;
        totalNutrition.protein += (ingredientInfo.nutrition.protein || 0) * multiplier;
        totalNutrition.carbs += (ingredientInfo.nutrition.carbs || 0) * multiplier;
        totalNutrition.fat += (ingredientInfo.nutrition.fat || 0) * multiplier;
        totalNutrition.fiber += (ingredientInfo.nutrition.fiber || 0) * multiplier;
      }
    }

    // 按份数计算
    const nutritionPerServing = {};
    Object.keys(totalNutrition).forEach(key => {
      nutritionPerServing[key] = totalNutrition[key] / servings;
    });

    res.json({
      success: true,
      data: {
        totalNutrition,
        nutritionPerServing,
        servings,
        ingredients: ingredients.length
      }
    });
  } catch (error) {
    console.error('计算食谱营养信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取营养建议
router.get('/recommendations', auth, checkFamilyMember, async (req, res) => {
  try {
    const { age, gender, activityLevel, healthGoals } = req.query;
    
    // 基于用户信息生成营养建议
    const recommendations = {
      dailyCalories: 2000, // 默认值，实际应该根据用户信息计算
      macronutrients: {
        protein: {
          amount: 50, // 克
          percentage: 20,
          recommendation: '建议摄入优质蛋白质，如瘦肉、鱼类、豆类'
        },
        carbs: {
          amount: 250, // 克
          percentage: 50,
          recommendation: '选择全谷物和复合碳水化合物'
        },
        fat: {
          amount: 67, // 克
          percentage: 30,
          recommendation: '优先选择健康脂肪，如橄榄油、坚果'
        }
      },
      vitamins: [
        {
          name: '维生素C',
          recommendation: '多吃新鲜水果和蔬菜',
          sources: ['橙子', '草莓', '西兰花', '菠菜']
        },
        {
          name: '维生素D',
          recommendation: '适量晒太阳，食用富含维生素D的食物',
          sources: ['鱼类', '蛋黄', '奶制品']
        }
      ],
      minerals: [
        {
          name: '钙',
          recommendation: '保证充足的钙摄入，特别是青少年和老年人',
          sources: ['奶制品', '豆制品', '绿叶蔬菜']
        },
        {
          name: '铁',
          recommendation: '注意铁的摄入，特别是女性',
          sources: ['红肉', '豆类', '坚果', '深色蔬菜']
        }
      ],
      generalTips: [
        '保持饮食多样化',
        '控制盐分和糖分摄入',
        '多喝水，保持水分充足',
        '适量运动，保持健康体重'
      ]
    };

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('获取营养建议错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取营养报告
router.get('/report', auth, checkFamilyMember, async (req, res) => {
  try {
    const { period = 'week', startDate, endDate } = req.query;
    
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // 默认获取最近一周的数据
      end = new Date();
      start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // 这里应该实现实际的营养数据统计
    // 暂时返回示例数据
    const nutritionReport = {
      period,
      startDate: start,
      endDate: end,
      summary: {
        totalMeals: 21,
        averageCalories: 1850,
        averageProtein: 75,
        averageCarbs: 220,
        averageFat: 65
      },
      trends: [
        {
          date: '2024-01-01',
          calories: 1900,
          protein: 80,
          carbs: 230,
          fat: 70
        },
        {
          date: '2024-01-02',
          calories: 1800,
          protein: 70,
          carbs: 210,
          fat: 60
        }
      ],
      insights: [
        '本周蛋白质摄入达标',
        '碳水化合物摄入略高，建议适当减少',
        '脂肪摄入在合理范围内',
        '建议增加蔬菜摄入'
      ]
    };

    res.json({
      success: true,
      data: nutritionReport
    });
  } catch (error) {
    console.error('获取营养报告错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 设置营养目标
router.post('/goals', auth, async (req, res) => {
  try {
    const { nutritionGoals } = req.body;
    
    if (!nutritionGoals) {
      return res.status(400).json({
        success: false,
        message: '营养目标为必填项'
      });
    }

    // 更新用户的营养目标
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nutritionGoals },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: '营养目标设置成功',
      data: user.nutritionGoals
    });
  } catch (error) {
    console.error('设置营养目标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取营养目标
router.get('/goals', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('nutritionGoals');
    
    res.json({
      success: true,
      data: user.nutritionGoals || {}
    });
  } catch (error) {
    console.error('获取营养目标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;
