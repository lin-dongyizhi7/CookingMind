<template>
  <div class="profile-page">
    <a-row :gutter="24">
      <!-- 个人信息 -->
      <a-col :span="8">
        <a-card title="个人信息" :bordered="false" class="profile-card">
          <div class="profile-avatar">
            <a-upload
              v-model:file-list="avatarFileList"
              :before-upload="beforeAvatarUpload"
              :max-count="1"
              list-type="picture-circle"
              :show-upload-list="false"
            >
              <div class="avatar-upload">
                <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" />
                <div v-else class="avatar-placeholder">
                  <user-outlined />
                  <div>上传头像</div>
                </div>
              </div>
            </a-upload>
            <h2>{{ userInfo.username }}</h2>
            <p class="user-email">{{ userInfo.email }}</p>
          </div>

          <a-divider />

          <div class="profile-stats">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-statistic title="烹饪次数" :value="profileStats.cookingCount" />
              </a-col>
              <a-col :span="12">
                <a-statistic title="食谱数量" :value="profileStats.recipeCount" />
              </a-col>
            </a-row>
            <a-row :gutter="16" style="margin-top: 16px;">
              <a-col :span="12">
                <a-statistic title="平均评分" :value="profileStats.avgRating" :precision="1" />
              </a-col>
              <a-col :span="12">
                <a-statistic title="活跃天数" :value="profileStats.activeDays" />
              </a-col>
            </a-row>
          </div>

          <a-divider />

          <div class="profile-actions">
            <a-button type="primary" @click="showEditProfileModal" block>
              编辑资料
            </a-button>
            <a-button @click="showChangePasswordModal" style="margin-top: 8px;" block>
              修改密码
            </a-button>
          </div>
        </a-card>
      </a-col>

      <!-- 详细信息 -->
      <a-col :span="16">
        <a-card title="详细信息" :bordered="false">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="用户名">{{ userInfo.username }}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{ userInfo.email }}</a-descriptions-item>
            <a-descriptions-item label="手机号">{{ userInfo.phone || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="注册时间">{{ userInfo.createdAt }}</a-descriptions-item>
            <a-descriptions-item label="最后登录">{{ userInfo.lastLogin }}</a-descriptions-item>
            <a-descriptions-item label="账户状态">
              <a-tag :color="userInfo.status === 'active' ? 'green' : 'red'">
                {{ userInfo.status === 'active' ? '正常' : '禁用' }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 偏好设置 -->
        <a-card title="偏好设置" :bordered="false" style="margin-top: 24px;">
          <a-form :model="preferences" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="默认菜系">
                  <a-select v-model:value="preferences.defaultCuisine" placeholder="请选择默认菜系">
                    <a-select-option value="chinese">中餐</a-select-option>
                    <a-select-option value="western">西餐</a-select-option>
                    <a-select-option value="japanese">日料</a-select-option>
                    <a-select-option value="korean">韩料</a-select-option>
                    <a-select-option value="thai">泰餐</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="难度偏好">
                  <a-select v-model:value="preferences.difficultyLevel" placeholder="请选择难度偏好">
                    <a-select-option value="beginner">初学者</a-select-option>
                    <a-select-option value="intermediate">中级</a-select-option>
                    <a-select-option value="advanced">高级</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="口味偏好">
                  <a-select
                    v-model:value="preferences.tastePreferences"
                    mode="multiple"
                    placeholder="请选择口味偏好"
                  >
                    <a-select-option value="spicy">辣</a-select-option>
                    <a-select-option value="sweet">甜</a-select-option>
                    <a-select-option value="sour">酸</a-select-option>
                    <a-select-option value="salty">咸</a-select-option>
                    <a-select-option value="umami">鲜</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="烹饪时间偏好">
                  <a-select v-model:value="preferences.cookingTime" placeholder="请选择烹饪时间偏好">
                    <a-select-option value="quick">快速（15分钟内）</a-select-option>
                    <a-select-option value="medium">中等（15-45分钟）</a-select-option>
                    <a-select-option value="slow">慢炖（45分钟以上）</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" @click="savePreferences">
                保存偏好设置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 营养目标 -->
        <a-card title="营养目标" :bordered="false" style="margin-top: 24px;">
          <a-form :model="nutritionGoals" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="每日热量目标 (kcal)">
                  <a-input-number 
                    v-model:value="nutritionGoals.dailyCalories" 
                    :min="1000" 
                    :max="5000"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="蛋白质目标 (g)">
                  <a-input-number 
                    v-model:value="nutritionGoals.protein" 
                    :min="20" 
                    :max="200"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="碳水化合物目标 (g)">
                  <a-input-number 
                    v-model:value="nutritionGoals.carbs" 
                    :min="50" 
                    :max="500"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="脂肪目标 (g)">
                  <a-input-number 
                    v-model:value="nutritionGoals.fat" 
                    :min="20" 
                    :max="150"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="膳食纤维目标 (g)">
                  <a-input-number 
                    v-model:value="nutritionGoals.fiber" 
                    :min="10" 
                    :max="50"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="水分目标 (ml)">
                  <a-input-number 
                    v-model:value="nutritionGoals.water" 
                    :min="1000" 
                    :max="5000"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" @click="saveNutritionGoals">
                保存营养目标
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <!-- 编辑资料模态框 -->
    <a-modal
      v-model:open="editProfileModalVisible"
      title="编辑个人资料"
      @ok="updateProfile"
      @cancel="editProfileModalVisible = false"
      :confirm-loading="updateProfileLoading"
    >
      <a-form :model="editProfileForm" layout="vertical">
        <a-form-item label="用户名" required>
          <a-input 
            v-model:value="editProfileForm.username" 
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item label="邮箱" required>
          <a-input 
            v-model:value="editProfileForm.email" 
            placeholder="请输入邮箱"
            type="email"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input 
            v-model:value="editProfileForm.phone" 
            placeholder="请输入手机号"
          />
        </a-form-item>
        <a-form-item label="个人简介">
          <a-textarea 
            v-model:value="editProfileForm.bio" 
            placeholder="请输入个人简介"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 修改密码模态框 -->
    <a-modal
      v-model:open="changePasswordModalVisible"
      title="修改密码"
      @ok="changePassword"
      @cancel="changePasswordModalVisible = false"
      :confirm-loading="changePasswordLoading"
    >
      <a-form :model="changePasswordForm" layout="vertical">
        <a-form-item label="当前密码" required>
          <a-input-password 
            v-model:value="changePasswordForm.currentPassword" 
            placeholder="请输入当前密码"
          />
        </a-form-item>
        <a-form-item label="新密码" required>
          <a-input-password 
            v-model:value="changePasswordForm.newPassword" 
            placeholder="请输入新密码"
          />
        </a-form-item>
        <a-form-item label="确认新密码" required>
          <a-input-password 
            v-model:value="changePasswordForm.confirmPassword" 
            placeholder="请再次输入新密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'

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
    message.error('只能上传 JPG/PNG 格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
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
    message.error('请填写必填项')
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
    
    message.success('个人资料已更新')
    editProfileModalVisible.value = false
  } catch (error) {
    message.error('更新个人资料失败')
  } finally {
    updateProfileLoading.value = false
  }
}

const changePassword = async () => {
  if (!changePasswordForm.currentPassword || !changePasswordForm.newPassword || !changePasswordForm.confirmPassword) {
    message.error('请填写所有密码字段')
    return
  }
  
  if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
    message.error('两次输入的新密码不一致')
    return
  }
  
  if (changePasswordForm.newPassword.length < 6) {
    message.error('新密码长度不能少于6位')
    return
  }
  
  changePasswordLoading.value = true
  try {
    // 这里应该调用API修改密码
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.success('密码修改成功')
    changePasswordModalVisible.value = false
    
    // 清空表单
    changePasswordForm.currentPassword = ''
    changePasswordForm.newPassword = ''
    changePasswordForm.confirmPassword = ''
  } catch (error) {
    message.error('密码修改失败')
  } finally {
    changePasswordLoading.value = false
  }
}

const savePreferences = async () => {
  try {
    // 这里应该调用API保存偏好设置
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('偏好设置已保存')
  } catch (error) {
    message.error('保存偏好设置失败')
  }
}

const saveNutritionGoals = async () => {
  try {
    // 这里应该调用API保存营养目标
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('营养目标已保存')
  } catch (error) {
    message.error('保存营养目标失败')
  }
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.profile-page {
  padding: 24px;
}

.profile-card {
  height: 100%;
}

.profile-avatar {
  text-align: center;
  margin-bottom: 24px;
}

.profile-avatar h2 {
  margin: 16px 0 8px 0;
  color: #1890ff;
}

.user-email {
  color: #666;
  margin-bottom: 16px;
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
  color: #999;
}

.avatar-placeholder .anticon {
  font-size: 24px;
  margin-bottom: 8px;
}

.profile-stats {
  margin: 24px 0;
}

.profile-actions {
  margin-top: 24px;
}

.profile-actions .ant-btn {
  margin-bottom: 8px;
}
</style>
