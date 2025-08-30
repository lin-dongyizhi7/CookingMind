<template>
  <div class="family-page">
    <el-row :gutter="24">
      <!-- 家庭信息 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="family-info-card" shadow="never">
          <template #header>
            <span class="card-title">家庭信息</span>
          </template>
          <el-row :gutter="16">
            <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
              <div class="family-avatar">
                <el-avatar :size="120" :src="familyInfo.avatar || '/default-family.jpg'" />
                <h2 class="family-name">{{ familyInfo.name }}</h2>
                <p class="family-description">{{ familyInfo.description }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="家庭ID">{{ familyInfo.id }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ familyInfo.createdAt }}</el-descriptions-item>
                <el-descriptions-item label="成员数量">{{ familyInfo.memberCount }}人</el-descriptions-item>
                <el-descriptions-item label="家庭状态">
                  <el-tag :type="familyInfo.status === 'active' ? 'success' : 'danger'">
                    {{ familyInfo.status === 'active' ? '活跃' : '非活跃' }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
              
              <div class="family-actions" v-if="isOwner">
                <el-button type="primary" @click="showEditFamilyModal" size="large">
                  编辑家庭信息
                </el-button>
                <el-button @click="showFamilySettingsModal" size="large">
                  家庭设置
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 成员管理 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="member-card" shadow="never">
          <template #header>
            <span class="card-title">成员管理</span>
          </template>
          <div class="member-actions">
            <el-button type="primary" @click="showInviteModal" v-if="canInvite" size="large">
              邀请新成员
            </el-button>
            <el-button @click="refreshMembers" size="large">
              刷新成员列表
            </el-button>
          </div>

          <el-table
            :data="familyMembers"
            :loading="membersLoading"
            style="width: 100%"
            size="large"
          >
            <el-table-column label="头像" width="80">
              <template #default="{ row }">
                <el-avatar :src="row.avatar || '/default-avatar.jpg'" />
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" />
            <el-table-column label="角色" width="100">
              <template #default="{ row }">
                <el-tag :type="getRoleType(row.role)">
                  {{ getRoleText(row.role) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="80" />
            <el-table-column label="性别" width="80">
              <template #default="{ row }">
                {{ row.gender === 'male' ? '男' : '女' }}
              </template>
            </el-table-column>
            <el-table-column label="健康状况" width="100">
              <template #default="{ row }">
                <el-tag :type="getHealthStatusType(row.healthStatus)">
                  {{ getHealthStatusText(row.healthStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="joinDate" label="加入时间" width="120" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-space>
                  <el-button size="small" @click="viewMemberProfile(row)">
                    查看
                  </el-button>
                  <el-button 
                    size="small" 
                    @click="editMember(row)"
                    v-if="canEditMember(row)"
                  >
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要移除此成员吗？"
                    @confirm="removeMember(row)"
                    v-if="canRemoveMember(row)"
                  >
                    <template #reference>
                      <el-button size="small" type="danger">
                        移除
                      </el-button>
                    </template>
                  </el-popconfirm>
                </el-space>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 家庭活动 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="activity-card" shadow="never">
          <template #header>
            <span class="card-title">最近活动</span>
          </template>
          <el-timeline>
            <el-timeline-item 
              v-for="activity in recentActivities" 
              :key="activity.id"
              :type="getActivityType(activity.type)"
              :color="getActivityColor(activity.type)"
              size="large"
            >
              <template #icon>
                <el-icon>
                  <component :is="getActivityIcon(activity.type)" />
                </el-icon>
              </template>
              <p class="activity-content">{{ activity.content }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 家庭统计 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="stats-card" shadow="never">
          <template #header>
            <span class="card-title">家庭统计</span>
          </template>
          <el-row :gutter="16">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-statistic title="本月烹饪次数" :value="familyStats.cookingCount" />
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-statistic title="平均评分" :value="familyStats.avgRating" :precision="1" />
            </el-col>
          </el-row>
          <el-row :gutter="16" style="margin-top: 16px;">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-statistic title="健康指数" :value="familyStats.healthIndex" suffix="%" />
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-statistic title="营养达标率" :value="familyStats.nutritionRate" suffix="%" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 邀请成员模态框 -->
    <el-dialog
      v-model="inviteModalVisible"
      title="邀请新成员"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="inviteForm" label-width="100px" size="large">
        <el-form-item label="邮箱地址" required>
          <el-input 
            v-model="inviteForm.email" 
            placeholder="请输入邮箱地址"
            type="email"
          />
        </el-form-item>
        <el-form-item label="角色" required>
          <el-select v-model="inviteForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="普通成员" value="member" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="邀请消息">
          <el-input 
            v-model="inviteForm.message" 
            placeholder="请输入邀请消息（可选）"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="inviteModalVisible = false">取消</el-button>
          <el-button type="primary" @click="sendInvitation" :loading="inviteLoading">
            发送邀请
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑家庭信息模态框 -->
    <el-dialog
      v-model="editFamilyModalVisible"
      title="编辑家庭信息"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="editFamilyForm" label-width="100px" size="large">
        <el-form-item label="家庭名称" required>
          <el-input 
            v-model="editFamilyForm.name" 
            placeholder="请输入家庭名称"
          />
        </el-form-item>
        <el-form-item label="家庭描述">
          <el-input 
            v-model="editFamilyForm.description" 
            placeholder="请输入家庭描述"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="家庭头像">
          <el-upload
            v-model:file-list="editFamilyForm.avatarFileList"
            :before-upload="beforeAvatarUpload"
            :max-count="1"
            list-type="picture-card"
            style="width: 100%"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editFamilyModalVisible = false">取消</el-button>
          <el-button type="primary" @click="updateFamilyInfo" :loading="updateLoading">
            更新
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑成员模态框 -->
    <el-dialog
      v-model="editMemberModalVisible"
      title="编辑成员信息"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="editMemberForm" label-width="100px" size="large">
        <el-form-item label="角色">
          <el-select v-model="editMemberForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="普通成员" value="member" />
            <el-option label="管理员" value="admin" />
            <el-option label="所有者" value="owner" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number 
            v-model="editMemberForm.age" 
            :min="1" 
            :max="120"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editMemberForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="健康状况">
          <el-select v-model="editMemberForm.healthStatus" placeholder="请选择健康状况" style="width: 100%">
            <el-option label="优秀" value="excellent" />
            <el-option label="良好" value="good" />
            <el-option label="一般" value="fair" />
            <el-option label="较差" value="poor" />
          </el-select>
        </el-form-item>
        <el-form-item label="饮食限制">
          <el-select
            v-model="editMemberForm.dietaryRestrictions"
            multiple
            placeholder="请选择饮食限制"
            style="width: 100%"
          >
            <el-option label="素食" value="vegetarian" />
            <el-option label="纯素" value="vegan" />
            <el-option label="无麸质" value="gluten-free" />
            <el-option label="无乳制品" value="dairy-free" />
            <el-option label="无坚果" value="nut-free" />
          </el-select>
        </el-form-item>
        <el-form-item label="过敏原">
          <el-select
            v-model="editMemberForm.allergies"
            multiple
            placeholder="请选择过敏原"
            style="width: 100%"
          >
            <el-option label="花生" value="peanuts" />
            <el-option label="海鲜" value="shellfish" />
            <el-option label="鸡蛋" value="eggs" />
            <el-option label="牛奶" value="milk" />
            <el-option label="大豆" value="soy" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editMemberModalVisible = false">取消</el-button>
          <el-button type="primary" @click="updateMemberInfo" :loading="updateMemberLoading">
            更新
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Cooking, UserAdd, Document } from '@element-plus/icons-vue'

// 响应式数据
const inviteModalVisible = ref(false)
const editFamilyModalVisible = ref(false)
const editMemberModalVisible = ref(false)
const inviteLoading = ref(false)
const updateLoading = ref(false)
const updateMemberLoading = ref(false)
const membersLoading = ref(false)

// 家庭信息
const familyInfo = reactive({
  id: 'F001',
  name: '快乐家庭',
  description: '一个充满爱和美食的家庭',
  avatar: '/family-avatar.jpg',
  createdAt: '2024-01-01',
  memberCount: 4,
  status: 'active'
})

// 邀请表单
const inviteForm = reactive({
  email: '',
  role: 'member',
  message: ''
})

// 编辑家庭表单
const editFamilyForm = reactive({
  name: '',
  description: '',
  avatarFileList: []
})

// 编辑成员表单
const editMemberForm = reactive({
  role: '',
  age: 0,
  gender: '',
  healthStatus: '',
  dietaryRestrictions: [],
  allergies: []
})

// 家庭成员
const familyMembers = ref([
  {
    userId: 'U001',
    username: '张三',
    avatar: '/avatar1.jpg',
    role: 'owner',
    age: 35,
    gender: 'male',
    healthStatus: 'excellent',
    dietaryRestrictions: [],
    allergies: [],
    joinDate: '2024-01-01'
  },
  {
    userId: 'U002',
    username: '李四',
    avatar: '/avatar2.jpg',
    role: 'admin',
    age: 32,
    gender: 'female',
    healthStatus: 'good',
    dietaryRestrictions: ['vegetarian'],
    allergies: ['peanuts'],
    joinDate: '2024-01-15'
  },
  {
    userId: 'U003',
    username: '王五',
    avatar: '/avatar3.jpg',
    role: 'member',
    age: 28,
    gender: 'male',
    healthStatus: 'good',
    dietaryRestrictions: [],
    allergies: ['shellfish'],
    joinDate: '2024-02-01'
  }
])

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'cooking',
    content: '张三完成了红烧肉的烹饪',
    time: '2小时前'
  },
  {
    id: 2,
    type: 'invite',
    content: '新成员王五加入了家庭',
    time: '1天前'
  },
  {
    id: 3,
    type: 'recipe',
    content: '李四创建了新的食谱',
    time: '2天前'
  }
])

// 家庭统计
const familyStats = reactive({
  cookingCount: 15,
  avgRating: 4.5,
  healthIndex: 85,
  nutritionRate: 78
})

// 计算属性
const isOwner = computed(() => {
  // 这里应该根据当前用户判断是否为家庭所有者
  return true
})

const canInvite = computed(() => {
  return isOwner.value || familyMembers.value.some(member => 
    member.userId === 'currentUserId' && member.role === 'admin'
  )
})

// 方法
const getRoleType = (role: string) => {
  const types = {
    owner: 'danger',
    admin: 'warning',
    member: 'success'
  }
  return types[role] || 'info'
}

const getRoleText = (role: string) => {
  const texts = {
    owner: '所有者',
    admin: '管理员',
    member: '成员'
  }
  return texts[role] || '未知'
}

const getHealthStatusType = (status: string) => {
  const types = {
    excellent: 'success',
    good: 'primary',
    fair: 'warning',
    poor: 'danger'
  }
  return types[status] || 'info'
}

const getHealthStatusText = (status: string) => {
  const texts = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return texts[status] || '未知'
}

const getActivityType = (type: string) => {
  const types = {
    cooking: 'success',
    invite: 'primary',
    recipe: 'warning'
  }
  return types[type] || 'info'
}

const getActivityColor = (type: string) => {
  const colors = {
    cooking: '#67c23a',
    invite: '#409eff',
    recipe: '#e6a23c'
  }
  return colors[type] || '#909399'
}

const getActivityIcon = (type: string) => {
  const icons = {
    cooking: 'Cooking',
    invite: 'UserAdd',
    recipe: 'Document'
  }
  return icons[type] || 'InfoFilled'
}

const canEditMember = (member: any) => {
  return isOwner.value || member.userId === 'currentUserId'
}

const canRemoveMember = (member: any) => {
  return isOwner.value && member.role !== 'owner'
}

const showInviteModal = () => {
  inviteForm.email = ''
  inviteForm.role = 'member'
  inviteForm.message = ''
  inviteModalVisible.value = true
}

const showEditFamilyModal = () => {
  editFamilyForm.name = familyInfo.name
  editFamilyForm.description = familyInfo.description
  editFamilyForm.avatarFileList = []
  editFamilyModalVisible.value = true
}

const showFamilySettingsModal = () => {
  ElMessage.info('家庭设置功能开发中...')
}

const editMember = (member: any) => {
  editMemberForm.role = member.role
  editMemberForm.age = member.age
  editMemberForm.gender = member.gender
  editMemberForm.healthStatus = member.healthStatus
  editMemberForm.dietaryRestrictions = [...member.dietaryRestrictions]
  editMemberForm.allergies = [...member.allergies]
  editMemberModalVisible.value = true
}

const viewMemberProfile = (member: any) => {
  ElMessage.info(`查看 ${member.username} 的详细资料`)
}

const refreshMembers = () => {
  membersLoading.value = true
  setTimeout(() => {
    membersLoading.value = false
    ElMessage.success('成员列表已刷新')
  }, 1000)
}

const sendInvitation = async () => {
  if (!inviteForm.email) {
    ElMessage.error('请输入邮箱地址')
    return
  }
  
  inviteLoading.value = true
  try {
    // 这里应该调用API发送邀请
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('邀请已发送')
    inviteModalVisible.value = false
  } catch (error) {
    ElMessage.error('发送邀请失败')
  } finally {
    inviteLoading.value = false
  }
}

const updateFamilyInfo = async () => {
  if (!editFamilyForm.name) {
    ElMessage.error('请输入家庭名称')
    return
  }
  
  updateLoading.value = true
  try {
    // 这里应该调用API更新家庭信息
    await new Promise(resolve => setTimeout(resolve, 2000))
    familyInfo.name = editFamilyForm.name
    familyInfo.description = editFamilyForm.description
    ElMessage.success('家庭信息已更新')
    editFamilyModalVisible.value = false
  } catch (error) {
    ElMessage.error('更新家庭信息失败')
  } finally {
    updateLoading.value = false
  }
}

const updateMemberInfo = async () => {
  updateMemberLoading.value = true
  try {
    // 这里应该调用API更新成员信息
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('成员信息已更新')
    editMemberModalVisible.value = false
  } catch (error) {
    ElMessage.error('更新成员信息失败')
  } finally {
    updateMemberLoading.value = false
  }
}

const removeMember = async (member: any) => {
  try {
    // 这里应该调用API移除成员
    await new Promise(resolve => setTimeout(resolve, 1000))
    familyMembers.value = familyMembers.value.filter(m => m.userId !== member.userId)
    familyInfo.memberCount--
    ElMessage.success(`${member.username} 已从家庭中移除`)
  } catch (error) {
    ElMessage.error('移除成员失败')
  }
}

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

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="less" scoped>
.family-page {
  padding: 0;
}

.family-info-card,
.member-card,
.activity-card,
.stats-card {
  margin-bottom: 24px;
  border: none;
  box-shadow: none;
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.family-avatar {
  text-align: center;
  
  .family-name {
    margin: 16px 0 8px 0;
    color: #409eff;
    font-size: 20px;
    font-weight: 600;
  }
  
  .family-description {
    color: #606266;
    margin-bottom: 16px;
    line-height: 1.6;
  }
}

.family-actions {
  margin-top: 24px;
  
  .el-button {
    margin-right: 12px;
  }
}

.member-actions {
  margin-bottom: 24px;
  
  .el-button {
    margin-right: 12px;
  }
}

.activity-content {
  margin-bottom: 4px;
  font-weight: 500;
  color: #303133;
}

.activity-time {
  color: #909399;
  font-size: 12px;
  margin: 0;
}

.dialog-footer {
  text-align: right;
}

// 移动端适配
@media (max-width: 768px) {
  .family-page {
    padding: 0;
    
    .family-info-card,
    .member-card,
    .activity-card,
    .stats-card {
      margin: 0 0 16px 0;
      border-radius: 0;
    }
  }
  
  .family-avatar {
    .family-name {
      font-size: 18px;
    }
  }
  
  .family-actions,
  .member-actions {
    .el-button {
      width: 100%;
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
  
  .el-table {
    font-size: 12px;
    
    .el-table__cell {
      padding: 8px 4px;
    }
  }
}

@media (max-width: 480px) {
  .family-info-card,
  .member-card,
  .activity-card,
  .stats-card {
    .card-title {
      font-size: 16px;
    }
  }
  
  .family-avatar {
    .family-name {
      font-size: 16px;
    }
  }
}
</style>
