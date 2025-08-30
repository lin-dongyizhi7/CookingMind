const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Ingredient = require('../models/Ingredient');
const { auth, checkFamilyMember } = require('../middleware/auth');
const ernieAPI = require('../config/ernie');

const router = express.Router();

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ingredient-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支持图片文件 (jpeg, jpg, png, webp)'));
    }
  }
});

// 获取家庭所有食材
router.get('/', auth, checkFamilyMember, async (req, res) => {
  try {
    const { category, storage, search, sortBy = 'purchaseDate', sortOrder = 'desc' } = req.query;
    
    let query = { familyId: req.user.familyId, isActive: true };
    
    // 按分类筛选
    if (category) {
      query.category = category;
    }
    
    // 按存储位置筛选
    if (storage) {
      query['storage.location'] = storage;
    }
    
    // 搜索功能
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // 排序
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const ingredients = await Ingredient.find(query)
      .sort(sortOptions)
      .populate('addedBy', 'username avatar');
    
    res.json({
      success: true,
      data: ingredients
    });
  } catch (error) {
    console.error('获取食材列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 通过图片识别添加食材
router.post('/recognize', auth, checkFamilyMember, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传食材图片'
      });
    }

    // 读取图片文件并转换为base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');
    
    // 调用文心API识别食材
    const recognitionResult = await ernieAPI.recognizeIngredients(imageBase64);
    
    // 解析识别结果
    let ingredients = [];
    try {
      if (recognitionResult.result && recognitionResult.result.content) {
        const content = recognitionResult.result.content;
        const parsed = JSON.parse(content);
        ingredients = parsed.ingredients || [];
      }
    } catch (parseError) {
      console.error('解析食材识别结果失败:', parseError);
      // 如果解析失败，尝试从文本中提取信息
      ingredients = [{
        name: '未知食材',
        quantity: '适量',
        freshness: '未知',
        category: 'others'
      }];
    }

    // 删除临时文件
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: '食材识别成功',
      data: {
        ingredients,
        imageUrl: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('食材识别错误:', error);
    
    // 清理临时文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: '食材识别失败，请重试'
    });
  }
});

// 手动添加食材
router.post('/', auth, checkFamilyMember, async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      quantity,
      storage,
      freshness,
      nutrition,
      usage,
      tags
    } = req.body;

    if (!name || !category || !quantity || !storage || !freshness) {
      return res.status(400).json({
        success: false,
        message: '食材名称、分类、数量、存储位置和新鲜度信息为必填项'
      });
    }

    const ingredient = new Ingredient({
      name,
      category,
      subcategory,
      quantity,
      storage,
      freshness: {
        ...freshness,
        purchaseDate: freshness.purchaseDate || new Date()
      },
      nutrition,
      usage,
      tags,
      familyId: req.user.familyId,
      addedBy: req.user._id
    });

    await ingredient.save();

    // 更新食材状态
    await ingredient.updateCondition();

    const populatedIngredient = await Ingredient.findById(ingredient._id)
      .populate('addedBy', 'username avatar');

    res.status(201).json({
      success: true,
      message: '食材添加成功',
      data: populatedIngredient
    });
  } catch (error) {
    console.error('添加食材错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个食材详情
router.get('/:id', auth, checkFamilyMember, async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({
      _id: req.params.id,
      familyId: req.user.familyId,
      isActive: true
    }).populate('addedBy', 'username avatar');

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: '食材不存在'
      });
    }

    res.json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    console.error('获取食材详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新食材信息
router.put('/:id', auth, checkFamilyMember, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name', 'category', 'subcategory', 'quantity', 'storage', 
      'freshness', 'nutrition', 'usage', 'tags'
    ];
    
    // 过滤允许更新的字段
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const ingredient = await Ingredient.findOneAndUpdate(
      {
        _id: req.params.id,
        familyId: req.user.familyId,
        isActive: true
      },
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('addedBy', 'username avatar');

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: '食材不存在'
      });
    }

    // 更新食材状态
    await ingredient.updateCondition();

    res.json({
      success: true,
      message: '食材信息更新成功',
      data: ingredient
    });
  } catch (error) {
    console.error('更新食材信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除食材（软删除）
router.delete('/:id', auth, checkFamilyMember, async (req, res) => {
  try {
    const ingredient = await Ingredient.findOneAndUpdate(
      {
        _id: req.params.id,
        familyId: req.user.familyId,
        isActive: true
      },
      { isActive: false },
      { new: true }
    );

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: '食材不存在'
      });
    }

    res.json({
      success: true,
      message: '食材删除成功'
    });
  } catch (error) {
    console.error('删除食材错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取即将过期的食材
router.get('/expiring-soon', auth, checkFamilyMember, async (req, res) => {
  try {
    const { days = 3 } = req.query;
    
    const ingredients = await Ingredient.find({
      familyId: req.user.familyId,
      isActive: true,
      'freshness.expiryDate': {
        $gte: new Date(),
        $lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      }
    }).populate('addedBy', 'username avatar');

    res.json({
      success: true,
      data: ingredients
    });
  } catch (error) {
    console.error('获取即将过期食材错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取食材统计信息
router.get('/stats/overview', auth, checkFamilyMember, async (req, res) => {
  try {
    const stats = await Ingredient.aggregate([
      {
        $match: {
          familyId: req.user.familyId,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity.amount' }
        }
      }
    ]);

    const totalIngredients = await Ingredient.countDocuments({
      familyId: req.user.familyId,
      isActive: true
    });

    const expiringSoon = await Ingredient.countDocuments({
      familyId: req.user.familyId,
      isActive: true,
      'freshness.expiryDate': {
        $gte: new Date(),
        $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      data: {
        totalIngredients,
        expiringSoon,
        byCategory: stats
      }
    });
  } catch (error) {
    console.error('获取食材统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;
