<template>
  <div class="profile-page">
    <el-row :gutter="24">
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="profile-card" shadow="never">
          <template #header>
            <span class="card-title">个人信息</span>
          </template>
          <div class="profile-avatar">
            <el-upload
              v-model:file-list="avatarFileList"
              :before-upload="beforeAvatarUpload"
              :max-count="1"
              list-type="picture-circle"
              :show-file-list="false"
            >
              <div class="avatar-upload">
                <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" />
                <div v-else class="avatar-placeholder">
                  <el-icon><User /></el-icon>
                  <div>上传头像</div>
                </div>
              </div>
            </el-upload>
            <h2 class="profile-name">{{ userInfo.username }}</h2>
            <p class="user-email">{{ userInfo.email }}</p>
          </div>

          <el-divider />

          <div class="profile-stats">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-statistic title="烹饪次数" :value="profileStats.cookingCount" />
              </el-col>
              <el-col :span="12">
                <el-statistic title="食谱数量" :value="profileStats.recipeCount" />
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-top: 16px;">
              <el-col :span="12">
                <el-statistic title="平均评分" :value="profileStats.avgRating" :precision="1" />
              </el-col>
              <el-col :span="12">
                <el-statistic title="活跃天数" :value="profileStats.activeDays" />
              </el-col>
            </el-row>
          </div>

          <el-divider />

          <div class="profile-actions">
            <el-button type="primary" @click="showEditProfileModal" size="large" style="width: 100%">
              编辑资料
            </el-button>
            <el-button @click="showChangePasswordModal" size="large" style="width: 100%; margin-top: 8px;">
              修改密码
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 详细信息 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="detail-card" shadow="never">
          <template #header>
            <span class="card-title">详细信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.phone || '未设置' }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ userInfo.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ userInfo.lastLogin }}</el-descriptions-item>
            <el-descriptions-item label="账户状态">
              <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'">
                {{ userInfo.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 偏好设置 -->
        <el-card class="preferences-card" shadow="never" style="margin-top: 24px;">
          <template #header>
            <span class="card-title">偏好设置</span>
          </template>
          <el-form :model="preferences" label-width="120px" size="large">
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="默认菜系">
                  <el-select v-model="preferences.defaultCuisine" placeholder="请选择默认菜系" style="width: 100%">
                    <el-option label="中餐" value="chinese" />
                    <el-option label="西餐" value="western" />
                    <el-option label="日料" value="japanese" />
                    <el-option label="韩料" value="korean" />
                    <el-option label="泰餐" value="thai" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="难度偏好">
                  <el-select v-model="preferences.difficultyLevel" placeholder="请选择难度偏好" style="width: 100%">
                    <el-option label="初学者" value="beginner" />
                    <el-option label="中级" value="intermediate" />
                    <el-option label="高级" value="advanced" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="口味偏好">
                  <el-select
                    v-model="preferences.tastePreferences"
                    multiple
                    placeholder="请选择口味偏好"
                    style="width: 100%"
                  >
                    <el-option label="辣" value="spicy" />
                    <el-option label="甜" value="sweet" />
                    <el-option label="酸" value="sour" />
                    <el-option label="咸" value="salty" />
                    <el-option label="鲜" value="umami" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="烹饪时间偏好">
                  <el-select v-model="preferences.cookingTime" placeholder="请选择烹饪时间偏好" style="width: 100%">
                    <el-option label="快速（15分钟内）" value="quick" />
                    <el-option label="中等（15-45分钟）" value="medium" />
                    <el-option label="慢炖（45分钟以上）" value="slow" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="savePreferences" size="large">
                保存偏好设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 营养目标 -->
        <el-card class="nutrition-card" shadow="never" style="margin-top: 24px;">
          <template #header>
            <span class="card-title">营养目标</span>
          </template>
          <el-form :model="nutritionGoals" label-width="140px" size="large">
            <el-row :gutter="16">
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="每日热量目标 (kcal)">
                  <el-input-number 
                    v-model="nutritionGoals.dailyCalories" 
                    :min="1000" 
                    :max="5000"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="蛋白质目标 (g)">
                  <el-input-number 
                    v-model="nutritionGoals.protein" 
                    :min="20" 
                    :max="200"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="碳水化合物目标 (g)">
                  <el-input-number 
                    v-model="nutritionGoals.carbs" 
                    :min="50" 
                    :max="500"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="脂肪目标 (g)">
                  <el-input-number 
                    v-model="nutritionGoals.fat" 
                    :min="20" 
                    :max="150"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="膳食纤维目标 (g)">
                  <el-input-number 
                    v-model="nutritionGoals.fiber" 
                    :min="10" 
                    :max="50"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="水分目标 (ml)">
                  <el-input-number 
                    v-model="nutritionGoals.water" 
                    :min="1000" 
                    :max="5000"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="saveNutritionGoals" size="large">
                保存营养目标
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑资料模态框 -->
    <el-dialog
      v-model="editProfileModalVisible"
      title="编辑个人资料"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="editProfileForm" label-width="100px" size="large">
        <el-form-item label="用户名" required>
          <el-input 
            v-model="editProfileForm.username" 
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input 
            v-model="editProfileForm.email" 
            placeholder="请输入邮箱"
            type="email"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input 
            v-model="editProfileForm.phone" 
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input 
            v-model="editProfileForm.bio" 
            placeholder="请输入个人简介"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editProfileModalVisible = false">取消</el-button>
          <el-button type="primary" @click="updateProfile" :loading="updateProfileLoading">
            更新
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改密码模态框 -->
    <el-dialog
      v-model="changePasswordModalVisible"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="changePasswordForm" label-width="100px" size="large">
        <el-form-item label="当前密码" required>
          <el-input 
            v-model="changePasswordForm.currentPassword" 
            placeholder="请输入当前密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input 
            v-model="changePasswordForm.newPassword" 
            placeholder="请输入新密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认新密码" required>
          <el-input 
            v-model="changePasswordForm.confirmPassword" 
            placeholder="请再次输入新密码"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changePasswordModalVisible = false">取消</el-button>
          <el-button type="primary" @click="changePassword" :loading="changePasswordLoading">
            修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'

// 响应式数据
const editProfileModalVisible = ref(false)
const changePasswordModalVisible = ref(false)
const updateProfileLoading = ref(false)
const changePasswordLoading = ref(false)
const avatarFileList = ref([])

// 用户信息
const userInfo = reactive({
  id: 'U001',
  username: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  avatar: '/avatar.jpg',
  bio: '热爱烹饪的美食爱好者',
  createdAt: '2024-01-01',
  lastLogin: '2024-01-15 14:30',
  status: 'active'
})

// 个人统计
const profileStats = reactive({
  cookingCount: 45,
  recipeCount: 12,
  avgRating: 4.3,
  activeDays: 28
})

// 偏好设置
const preferences = reactive({
  defaultCuisine: 'chinese',
  difficultyLevel: 'intermediate',
  tastePreferences: ['spicy', 'umami'],
  cookingTime: 'medium'
})

// 营养目标
const nutritionGoals = reactive({
  dailyCalories: 2200,
  protein: 80,
  carbs: 250,
  fat: 70,
  fiber: 25,
  water: 2000
})

// 编辑资料表单
const editProfileForm = reactive({
  username: '',
  email: '',
  phone: '',
  bio: ''
})

// 修改密码表单
const changePasswordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 方法
const beforeAvatarUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const showEditProfileModal = () => {
  editProfileForm.username = userInfo.username
  editProfileForm.email = userInfo.email
  editProfileForm.phone = userInfo.phone || ''
  editProfileForm.bio = userInfo.bio || ''
  editProfileModalVisible.value = true
}

const showChangePasswordModal = () => {
  changePasswordForm.currentPassword = ''
  changePasswordForm.newPassword = ''
  changePasswordForm.confirmPassword = ''
  changePasswordModalVisible.value = true
}

const updateProfile = async () => {
  if (!editProfileForm.username || !editProfileForm.email) {
    ElMessage.error('请填写必填项')
    return
  }
  
  updateProfileLoading.value = true
  try {
    // 这里应该调用API更新用户信息
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    userInfo.username = editProfileForm.username
    userInfo.email = editProfileForm.email
    userInfo.phone = editProfileForm.phone
    userInfo.bio = editProfileForm.bio
    
    ElMessage.success('个人资料已更新')
    editProfileModalVisible.value = false
  } catch (error) {
    ElMessage.error('更新个人资料失败')
  } finally {
    updateProfileLoading.value = false
  }
}

const changePassword = async () => {
  if (!changePasswordForm.currentPassword || !changePasswordForm.newPassword || !changePasswordForm.confirmPassword) {
    ElMessage.error('请填写所有密码字段')
    return
  }
  
  if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }
  
  if (changePasswordForm.newPassword.length < 6) {
    ElMessage.error('新密码长度不能少于6位')
    return
  }
  
  changePasswordLoading.value = true
  try {
    // 这里应该调用API修改密码
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('密码修改成功')
    changePasswordModalVisible.value = false
    
    // 清空表单
    changePasswordForm.currentPassword = ''
    changePasswordForm.newPassword = ''
    changePasswordForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error('密码修改失败')
  } finally {
    changePasswordLoading.value = false
  }
}

const savePreferences = async () => {
  try {
    // 这里应该调用API保存偏好设置
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('偏好设置已保存')
  } catch (error) {
    ElMessage.error('保存偏好设置失败')
  }
}

const saveNutritionGoals = async () => {
  try {
    // 这里应该调用API保存营养目标
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('营养目标已保存')
  } catch (error) {
    ElMessage.error('保存营养目标失败')
  }
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="less" scoped>
.profile-page {
  padding: 0;
}

.profile-card,
.detail-card,
.preferences-card,
.nutrition-card {
  margin-bottom: 24px;
  border: none;
  box-shadow: none;
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.profile-avatar {
  text-align: center;
  margin-bottom: 24px;
  
  .profile-name {
    margin: 16px 0 8px 0;
    color: #409eff;
    font-size: 20px;
    font-weight: 600;
  }
  
  .user-email {
    color: #606266;
    margin-bottom: 16px;
    line-height: 1.6;
  }
}

.avatar-upload {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  text-align: center;
  color: #909399;
  
  .el-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
}

.profile-stats {
  margin: 24px 0;
}

.profile-actions {
  margin-top: 24px;
  
  .el-button {
    margin-bottom: 8px;
  }
}

.dialog-footer {
  text-align: right;
}

// 移动端适配
@media (max-width: 768px) {
  .profile-page {
    padding: 0;
    
    .profile-card,
    .detail-card,
    .preferences-card,
    .nutrition-card {
      margin: 0 0 16px 0;
      border-radius: 0;
    }
  }
  
  .profile-avatar {
    .profile-name {
      font-size: 18px;
    }
  }
  
  .el-form-item {
    .el-form-item__label {
      text-align: left;
    }
  }
}

@media (max-width: 480px) {
  .profile-card,
  .detail-card,
  .preferences-card,
  .nutrition-card {
    .card-title {
      font-size: 16px;
    }
  }
  
  .profile-avatar {
    .profile-name {
      font-size: 16px;
    }
  }
}
</style>
