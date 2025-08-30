const express = require('express');
const Recipe = require('../models/Recipe');
const { auth, checkFamilyMember } = require('../middleware/auth');
const ernieAPI = require('../config/ernie');

const router = express.Router();

// 获取烹饪指导步骤
router.get('/:recipeId/steps', auth, checkFamilyMember, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      familyId: req.user.familyId,
      isActive: true
    }).populate('ingredients.ingredientId');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    res.json({
      success: true,
      data: {
        recipe: {
          title: recipe.title,
          description: recipe.description,
          totalTime: recipe.totalTime,
          servings: recipe.servings
        },
        steps: recipe.steps,
        ingredients: recipe.ingredients
      }
    });
  } catch (error) {
    console.error('获取烹饪步骤错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 生成烹饪指导视频
router.post('/:recipeId/generate-video', auth, checkFamilyMember, async (req, res) => {
  try {
    const { stepIndex, stepDescription } = req.body;
    
    if (stepIndex === undefined || !stepDescription) {
      return res.status(400).json({
        success: false,
        message: '步骤索引和描述为必填项'
      });
    }

    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      familyId: req.user.familyId,
      isActive: true
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    if (stepIndex < 0 || stepIndex >= recipe.steps.length) {
      return res.status(400).json({
        success: false,
        message: '步骤索引无效'
      });
    }

    const step = recipe.steps[stepIndex];
    const ingredients = recipe.ingredients.map(i => i.name);

    // 调用文心API生成烹饪指导视频
    const videoResult = await ernieAPI.generateCookingVideo(stepDescription, ingredients);
    
    // 更新步骤的视频URL
    step.videoUrl = videoResult.videoUrl || '';
    await recipe.save();

    res.json({
      success: true,
      message: '烹饪指导视频生成成功',
      data: {
        stepIndex,
        videoUrl: step.videoUrl,
        step: step
      }
    });
  } catch (error) {
    console.error('生成烹饪指导视频错误:', error);
    res.status(500).json({
      success: false,
      message: '视频生成失败，请重试'
    });
  }
});

// 获取烹饪进度
router.get('/:recipeId/progress', auth, checkFamilyMember, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      familyId: req.user.familyId,
      isActive: true
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    // 这里可以实现烹饪进度跟踪逻辑
    // 暂时返回基本信息
    res.json({
      success: true,
      data: {
        recipeId: recipe._id,
        title: recipe.title,
        totalSteps: recipe.steps.length,
        currentStep: 0,
        completedSteps: [],
        estimatedTimeRemaining: recipe.totalTime
      }
    });
  } catch (error) {
    console.error('获取烹饪进度错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新烹饪进度
router.put('/:recipeId/progress', auth, checkFamilyMember, async (req, res) => {
  try {
    const { currentStep, completedSteps, notes } = req.body;
    
    if (currentStep === undefined) {
      return res.status(400).json({
        success: false,
        message: '当前步骤为必填项'
      });
    }

    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      familyId: req.user.familyId,
      isActive: true
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    // 记录烹饪历史
    recipe.cookingHistory.push({
      userId: req.user._id,
      date: new Date(),
      notes: notes || `完成到第${currentStep + 1}步`,
      modifications: []
    });

    await recipe.save();

    res.json({
      success: true,
      message: '烹饪进度更新成功',
      data: {
        currentStep,
        completedSteps,
        totalSteps: recipe.steps.length
      }
    });
  } catch (error) {
    console.error('更新烹饪进度错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取烹饪技巧和建议
router.get('/:recipeId/tips', auth, checkFamilyMember, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      familyId: req.user.familyId,
      isActive: true
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    // 收集所有步骤的技巧和注意事项
    const tips = [];
    const warnings = [];

    recipe.steps.forEach((step, index) => {
      if (step.tips && step.tips.length > 0) {
        tips.push({
          stepIndex: index,
          stepNumber: step.stepNumber,
          tips: step.tips
        });
      }
      
      if (step.warnings && step.warnings.length > 0) {
        warnings.push({
          stepIndex: index,
          stepNumber: step.stepNumber,
          warnings: step.warnings
        });
      }
    });

    res.json({
      success: true,
      data: {
        tips,
        warnings,
        generalTips: [
          '准备食材时注意卫生',
          '控制火候，避免糊底',
          '调味时先少后多，逐步调整'
        ]
      }
    });
  } catch (error) {
    console.error('获取烹饪技巧错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 语音提问烹饪问题
router.post('/:recipeId/ask-question', auth, checkFamilyMember, async (req, res) => {
  try {
    const { question, audioBase64, stepIndex } = req.body;
    
    if (!question && !audioBase64) {
      return res.status(400).json({
        success: false,
        message: '请提供问题或语音'
      });
    }

    const recipe = await Recipe.findOne({
      _id: req.params.recipeId,
      familyId: req.user.familyId,
      isActive: true
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: '食谱不存在'
      });
    }

    let questionText = question;
    
    // 如果有语音，先转换为文本
    if (audioBase64) {
      try {
        const speechResult = await ernieAPI.speechToText(audioBase64);
        questionText = speechResult.result || question;
      } catch (speechError) {
        console.error('语音识别失败:', speechError);
        // 如果语音识别失败，使用文本问题
      }
    }

    // 这里可以调用文心API来回答问题
    // 暂时返回一个示例回答
    const answer = {
      question: questionText,
      answer: `关于"${questionText}"的问题，建议您：\n1. 仔细阅读步骤说明\n2. 控制好火候和时间\n3. 如有疑问可以查看烹饪技巧`,
      stepIndex: stepIndex,
      timestamp: new Date()
    };

    res.json({
      success: true,
      message: '问题处理成功',
      data: answer
    });
  } catch (error) {
    console.error('处理烹饪问题错误:', error);
    res.status(500).json({
      success: false,
      message: '问题处理失败，请重试'
    });
  }
});

module.exports = router;
