const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const { auth, checkFamilyMember } = require('../middleware/auth');
const ernieAPI = require('../config/ernie');

const router = express.Router();

// 获取家庭食谱列表
router.get('/', auth, checkFamilyMember, async (req, res) => {
  try {
    const { category, cuisine, difficulty, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { familyId: req.user.familyId, isActive: true };
    
    // 按分类筛选
    if (category) {
      query.category = category;
    }
    
    // 按菜系筛选
    if (cuisine) {
      query.cuisine = cuisine;
    }
    
    // 按难度筛选
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // 搜索功能
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // 排序
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const recipes = await Recipe.find(query)
      .sort(sortOptions)
      .populate('createdBy', 'username avatar')
      .populate('ingredients.ingredientId');
    
    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('获取食谱列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 基于现有食材生成食谱
router.post('/generate', auth, checkFamilyMember, async (req, res) => {
  try {
    const { requirements, ingredients } = req.body;
    
    if (!requirements) {
      return res.status(400).json({
        success: false,
        message: '请描述您的食谱需求'
      });
    }

    // 获取家庭可用食材
    const availableIngredients = await Ingredient.find({
      familyId: req.user.familyId,
      isActive: true
    });

    // 调用文心API生成食谱
    const ingredientNames = ingredients ? ingredients.map(i => i.name) : availableIngredients.map(i => i.name);
    const recipeResult = await ernieAPI.generateRecipe(ingredientNames, requirements);
    
    // 解析生成的食谱
    let generatedRecipe = null;
    try {
      if (recipeResult.result && recipeResult.result.content) {
        // 这里需要根据实际的API返回格式进行解析
        generatedRecipe = {
          title: 'AI生成的食谱',
          description: requirements,
          ingredients: ingredientNames,
          content: recipeResult.result.content
        };
      }
    } catch (parseError) {
      console.error('解析食谱生成结果失败:', parseError);
    }

    res.json({
      success: true,
      message: '食谱生成成功',
      data: generatedRecipe
    });
  } catch (error) {
    console.error('生成食谱错误:', error);
    res.status(500).json({
      success: false,
      message: '食谱生成失败，请重试'
    });
  }
});

// 创建新食谱
router.post('/', auth, checkFamilyMember, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      cuisine,
      difficulty,
      prepTime,
      cookTime,
      servings,
      ingredients,
      steps,
      nutrition,
      images,
      videoUrl,
      tags,
      dietaryInfo
    } = req.body;

    if (!title || !category || !cuisine || !difficulty || !servings || !ingredients || !steps) {
      return res.status(400).json({
        success: false,
        message: '食谱标题、分类、菜系、难度、份数、食材和步骤为必填项'
      });
    }

    const recipe = new Recipe({
      title,
      description,
      category,
      cuisine,
      difficulty,
      prepTime,
      cookTime,
      servings,
      ingredients,
      steps,
      nutrition,
      images,
      videoUrl,
      tags,
      dietaryInfo,
      familyId: req.user.familyId,
      createdBy: req.user._id
    });

    await recipe.save();

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('createdBy', 'username avatar')
      .populate('ingredients.ingredientId');

    res.status(201).json({
      success: true,
      message: '食谱创建成功',
      data: populatedRecipe
    });
  } catch (error) {
    console.error('创建食谱错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取食谱详情
router.get('/:id', auth, checkFamilyMember, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      familyId: req.user.familyId,
      isActive: true
    })
    .populate('createdBy', 'username avatar')
    .populate('ingredients.ingredientId')
    .populate('reviews.userId', 'username avatar');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('获取食谱详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新食谱
router.put('/:id', auth, checkFamilyMember, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'title', 'description', 'category', 'cuisine', 'difficulty',
      'prepTime', 'cookTime', 'servings', 'ingredients', 'steps',
      'nutrition', 'images', 'videoUrl', 'tags', 'dietaryInfo'
    ];
    
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const recipe = await Recipe.findOneAndUpdate(
      {
        _id: req.params.id,
        familyId: req.user.familyId,
        isActive: true
      },
      filteredUpdates,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'username avatar')
    .populate('ingredients.ingredientId');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    res.json({
      success: true,
      message: '食谱更新成功',
      data: recipe
    });
  } catch (error) {
    console.error('更新食谱错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除食谱
router.delete('/:id', auth, checkFamilyMember, async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      {
        _id: req.params.id,
        familyId: req.user.familyId,
        isActive: true
      },
      { isActive: false },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    res.json({
      success: true,
      message: '食谱删除成功'
    });
  } catch (error) {
    console.error('删除食谱错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 添加食谱评论
router.post('/:id/reviews', auth, checkFamilyMember, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: '请提供1-5星的评分'
      });
    }

    const recipe = await Recipe.findOne({
      _id: req.params.id,
      familyId: req.user.familyId,
      isActive: true
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    await recipe.addReview(req.user._id, rating, comment);

    const updatedRecipe = await Recipe.findById(recipe._id)
      .populate('createdBy', 'username avatar')
      .populate('ingredients.ingredientId')
      .populate('reviews.userId', 'username avatar');

    res.json({
      success: true,
      message: '评论添加成功',
      data: updatedRecipe
    });
  } catch (error) {
    console.error('添加评论错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 检查食材是否足够制作食谱
router.get('/:id/check-ingredients', auth, checkFamilyMember, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      familyId: req.user.familyId,
      isActive: true
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    const availableIngredients = await Ingredient.find({
      familyId: req.user.familyId,
      isActive: true
    });

    const availability = recipe.checkIngredientsAvailability(availableIngredients);

    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('检查食材可用性错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;
