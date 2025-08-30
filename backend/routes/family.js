const express = require('express');
const Family = require('../models/Family');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 创建家庭
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, preferences } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '家庭名称为必填项'
      });
    }

    // 检查用户是否已经属于某个家庭
    if (req.user.familyId) {
      return res.status(400).json({
        success: false,
        message: '您已经属于一个家庭'
      });
    }

    const family = new Family({
      name,
      description,
      preferences,
      owner: req.user._id,
      members: [{
        userId: req.user._id,
        role: 'owner'
      }]
    });

    await family.save();

    // 更新用户的家庭ID
    await User.findByIdAndUpdate(req.user._id, { familyId: family._id });

    const populatedFamily = await Family.findById(family._id)
      .populate('members.userId', 'username avatar email')
      .populate('owner', 'username avatar email');

    res.status(201).json({
      success: true,
      message: '家庭创建成功',
      data: populatedFamily
    });
  } catch (error) {
    console.error('创建家庭错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取家庭信息
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.familyId) {
      return res.status(404).json({
        success: false,
        message: '您不属于任何家庭'
      });
    }

    const family = await Family.findById(req.user.familyId)
      .populate('members.userId', 'username avatar email phone')
      .populate('owner', 'username avatar email');

    if (!family) {
      return res.status(404).json({
        success: false,
        message: '家庭不存在'
      });
    }

    res.json({
      success: true,
      data: family
    });
  } catch (error) {
    console.error('获取家庭信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新家庭信息
router.put('/', auth, async (req, res) => {
  try {
    if (!req.user.familyId) {
      return res.status(404).json({
        success: false,
        message: '您不属于任何家庭'
      });
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: '家庭不存在'
      });
    }

    // 检查是否为家庭所有者
    if (family.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '只有家庭所有者可以修改家庭信息'
      });
    }

    const updates = req.body;
    const allowedUpdates = ['name', 'description', 'preferences', 'settings'];
    
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedFamily = await Family.findByIdAndUpdate(
      req.user.familyId,
      filteredUpdates,
      { new: true, runValidators: true }
    )
    .populate('members.userId', 'username avatar email phone')
    .populate('owner', 'username avatar email');

    res.json({
      success: true,
      message: '家庭信息更新成功',
      data: updatedFamily
    });
  } catch (error) {
    console.error('更新家庭信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 邀请家庭成员
router.post('/invite', auth, async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱为必填项'
      });
    }

    if (!req.user.familyId) {
      return res.status(404).json({
        success: false,
        message: '您不属于任何家庭'
      });
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: '家庭不存在'
      });
    }

    // 检查是否为家庭所有者
    if (family.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '只有家庭所有者可以邀请成员'
      });
    }

    // 查找用户
    const invitedUser = await User.findOne({ email });
    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查用户是否已经属于某个家庭
    if (invitedUser.familyId) {
      return res.status(400).json({
        success: false,
        message: '该用户已经属于其他家庭'
      });
    }

    // 检查是否已经是家庭成员
    const isAlreadyMember = family.members.some(
      member => member.userId.toString() === invitedUser._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: '该用户已经是家庭成员'
      });
    }

    // 这里应该发送邀请邮件或通知
    // 暂时直接添加成员
    family.members.push({
      userId: invitedUser._id,
      role: role
    });

    await family.save();

    // 更新用户的家庭ID
    await User.findByIdAndUpdate(invitedUser._id, { familyId: family._id });

    const updatedFamily = await Family.findById(family._id)
      .populate('members.userId', 'username avatar email phone')
      .populate('owner', 'username avatar email');

    res.json({
      success: true,
      message: '成员邀请成功',
      data: updatedFamily
    });
  } catch (error) {
    console.error('邀请家庭成员错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 移除家庭成员
router.delete('/members/:userId', auth, async (req, res) => {
  try {
    if (!req.user.familyId) {
      return res.status(404).json({
        success: false,
        message: '您不属于任何家庭'
      });
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: '家庭不存在'
      });
    }

    // 检查是否为家庭所有者
    if (family.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '只有家庭所有者可以移除成员'
      });
    }

    // 不能移除自己
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能移除自己'
      });
    }

    // 移除成员
    await family.removeMember(req.params.userId);

    // 更新用户的家庭ID
    await User.findByIdAndUpdate(req.params.userId, { familyId: null });

    const updatedFamily = await Family.findById(family._id)
      .populate('members.userId', 'username avatar email phone')
      .populate('owner', 'username avatar email');

    res.json({
      success: true,
      message: '成员移除成功',
      data: updatedFamily
    });
  } catch (error) {
    console.error('移除家庭成员错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 离开家庭
router.post('/leave', auth, async (req, res) => {
  try {
    if (!req.user.familyId) {
      return res.status(404).json({
        success: false,
        message: '您不属于任何家庭'
      });
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: '家庭不存在'
      });
    }

    // 家庭所有者不能离开，需要先转让所有权
    if (family.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '家庭所有者不能离开，请先转让所有权'
      });
    }

    // 移除成员
    await family.removeMember(req.user._id);

    // 更新用户的家庭ID
    await User.findByIdAndUpdate(req.user._id, { familyId: null });

    res.json({
      success: true,
      message: '已成功离开家庭'
    });
  } catch (error) {
    console.error('离开家庭错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 转让家庭所有权
router.post('/transfer-ownership', auth, async (req, res) => {
  try {
    const { newOwnerId } = req.body;
    
    if (!newOwnerId) {
      return res.status(400).json({
        success: false,
        message: '新所有者ID为必填项'
      });
    }

    if (!req.user.familyId) {
      return res.status(404).json({
        success: false,
        message: '您不属于任何家庭'
      });
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: '家庭不存在'
      });
    }

    // 检查是否为当前家庭所有者
    if (family.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '只有家庭所有者可以转让所有权'
      });
    }

    // 检查新所有者是否为家庭成员
    const newOwner = family.members.find(
      member => member.userId.toString() === newOwnerId
    );

    if (!newOwner) {
      return res.status(400).json({
        success: false,
        message: '新所有者必须是家庭成员'
      });
    }

    // 转让所有权
    family.owner = newOwnerId;
    
    // 更新角色
    family.members.forEach(member => {
      if (member.userId.toString() === req.user._id.toString()) {
        member.role = 'member';
      } else if (member.userId.toString() === newOwnerId) {
        member.role = 'owner';
      }
    });

    await family.save();

    const updatedFamily = await Family.findById(family._id)
      .populate('members.userId', 'username avatar email phone')
      .populate('owner', 'username avatar email');

    res.json({
      success: true,
      message: '所有权转让成功',
      data: updatedFamily
    });
  } catch (error) {
    console.error('转让所有权错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;
