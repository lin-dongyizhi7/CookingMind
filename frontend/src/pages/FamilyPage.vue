<template>
  <div class="family-page">
    <a-row :gutter="24">
      <!-- 家庭信息 -->
      <a-col :span="24">
        <a-card title="家庭信息" :bordered="false" class="family-info-card">
          <a-row :gutter="16">
            <a-col :span="8">
              <div class="family-avatar">
                <a-avatar :size="120" :src="familyInfo.avatar || '/default-family.jpg'" />
                <h2>{{ familyInfo.name }}</h2>
                <p class="family-description">{{ familyInfo.description }}</p>
              </div>
            </a-col>
            <a-col :span="16">
              <a-descriptions :column="2" bordered>
                <a-descriptions-item label="家庭ID">{{ familyInfo.id }}</a-descriptions-item>
                <a-descriptions-item label="创建时间">{{ familyInfo.createdAt }}</a-descriptions-item>
                <a-descriptions-item label="成员数量">{{ familyInfo.memberCount }}人</a-descriptions-item>
                <a-descriptions-item label="家庭状态">
                  <a-tag :color="familyInfo.status === 'active' ? 'green' : 'red'">
                    {{ familyInfo.status === 'active' ? '活跃' : '非活跃' }}
                  </a-tag>
                </a-descriptions-item>
              </a-descriptions>
              
              <div class="family-actions" v-if="isOwner">
                <a-button type="primary" @click="showEditFamilyModal">
                  编辑家庭信息
                </a-button>
                <a-button @click="showFamilySettingsModal">
                  家庭设置
                </a-button>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <!-- 成员管理 -->
      <a-col :span="24">
        <a-card title="成员管理" :bordered="false">
          <div class="member-actions">
            <a-button type="primary" @click="showInviteModal" v-if="canInvite">
              邀请新成员
            </a-button>
            <a-button @click="refreshMembers">
              刷新成员列表
            </a-button>
          </div>

          <a-table
            :columns="memberColumns"
            :data-source="familyMembers"
            :loading="membersLoading"
            :pagination="false"
            row-key="userId"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'avatar'">
                <a-avatar :src="record.avatar || '/default-avatar.jpg'" />
              </template>
              <template v-else-if="column.key === 'role'">
                <a-tag :color="getRoleColor(record.role)">
                  {{ getRoleText(record.role) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'healthStatus'">
                <a-tag :color="getHealthStatusColor(record.healthStatus)">
                  {{ getHealthStatusText(record.healthStatus) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button size="small" @click="viewMemberProfile(record)">
                    查看
                  </a-button>
                  <a-button 
                    size="small" 
                    @click="editMember(record)"
                    v-if="canEditMember(record)"
                  >
                    编辑
                  </a-button>
                  <a-popconfirm
                    title="确定要移除此成员吗？"
                    @confirm="removeMember(record)"
                    v-if="canRemoveMember(record)"
                  >
                    <a-button size="small" danger>
                      移除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- 家庭活动 -->
      <a-col :span="12">
        <a-card title="最近活动" :bordered="false">
          <a-timeline>
            <a-timeline-item 
              v-for="activity in recentActivities" 
              :key="activity.id"
              :color="getActivityColor(activity.type)"
            >
              <template #dot>
                <a-icon :type="getActivityIcon(activity.type)" />
              </template>
              <p class="activity-content">{{ activity.content }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>

      <!-- 家庭统计 -->
      <a-col :span="12">
        <a-card title="家庭统计" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-statistic title="本月烹饪次数" :value="familyStats.cookingCount" />
            </a-col>
            <a-col :span="12">
              <a-statistic title="平均评分" :value="familyStats.avgRating" :precision="1" />
            </a-col>
          </a-row>
          <a-row :gutter="16" style="margin-top: 16px;">
            <a-col :span="12">
              <a-statistic title="健康指数" :value="familyStats.healthIndex" suffix="%" />
            </a-col>
            <a-col :span="12">
              <a-statistic title="营养达标率" :value="familyStats.nutritionRate" suffix="%" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <!-- 邀请成员模态框 -->
    <a-modal
      v-model:open="inviteModalVisible"
      title="邀请新成员"
      @ok="sendInvitation"
      @cancel="inviteModalVisible = false"
      :confirm-loading="inviteLoading"
    >
      <a-form :model="inviteForm" layout="vertical">
        <a-form-item label="邮箱地址" required>
          <a-input 
            v-model:value="inviteForm.email" 
            placeholder="请输入邮箱地址"
            type="email"
          />
        </a-form-item>
        <a-form-item label="角色" required>
          <a-select v-model:value="inviteForm.role" placeholder="请选择角色">
            <a-select-option value="member">普通成员</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="邀请消息">
          <a-textarea 
            v-model:value="inviteForm.message" 
            placeholder="请输入邀请消息（可选）"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑家庭信息模态框 -->
    <a-modal
      v-model:open="editFamilyModalVisible"
      title="编辑家庭信息"
      @ok="updateFamilyInfo"
      @cancel="editFamilyModalVisible = false"
      :confirm-loading="updateLoading"
    >
      <a-form :model="editFamilyForm" layout="vertical">
        <a-form-item label="家庭名称" required>
          <a-input 
            v-model:value="editFamilyForm.name" 
            placeholder="请输入家庭名称"
          />
        </a-form-item>
        <a-form-item label="家庭描述">
          <a-textarea 
            v-model:value="editFamilyForm.description" 
            placeholder="请输入家庭描述"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="家庭头像">
          <a-upload
            v-model:file-list="editFamilyForm.avatarFileList"
            :before-upload="beforeAvatarUpload"
            :max-count="1"
            list-type="picture-card"
          >
            <div>
              <plus-outlined />
              <div style="margin-top: 8px">上传</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑成员模态框 -->
    <a-modal
      v-model:open="editMemberModalVisible"
      title="编辑成员信息"
      @ok="updateMemberInfo"
      @cancel="editMemberModalVisible = false"
      :confirm-loading="updateMemberLoading"
    >
      <a-form :model="editMemberForm" layout="vertical">
        <a-form-item label="角色">
          <a-select v-model:value="editMemberForm.role" placeholder="请选择角色">
            <a-select-option value="member">普通成员</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="owner">所有者</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number 
            v-model:value="editMemberForm.age" 
            :min="1" 
            :max="120"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="editMemberForm.gender">
            <a-radio value="male">男</a-radio>
            <a-radio value="female">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="健康状况">
          <a-select v-model:value="editMemberForm.healthStatus" placeholder="请选择健康状况">
            <a-select-option value="excellent">优秀</a-select-option>
            <a-select-option value="good">良好</a-select-option>
            <a-select-option value="fair">一般</a-select-option>
            <a-select-option value="poor">较差</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="饮食限制">
          <a-select
            v-model:value="editMemberForm.dietaryRestrictions"
            mode="multiple"
            placeholder="请选择饮食限制"
          >
            <a-select-option value="vegetarian">素食</a-select-option>
            <a-select-option value="vegan">纯素</a-select-option>
            <a-select-option value="gluten-free">无麸质</a-select-option>
            <a-select-option value="dairy-free">无乳制品</a-select-option>
            <a-select-option value="nut-free">无坚果</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="过敏原">
          <a-select
            v-model:value="editMemberForm.allergies"
            mode="multiple"
            placeholder="请选择过敏原"
          >
            <a-select-option value="peanuts">花生</a-select-option>
            <a-select-option value="shellfish">海鲜</a-select-option>
            <a-select-option value="eggs">鸡蛋</a-select-option>
            <a-select-option value="milk">牛奶</a-select-option>
            <a-select-option value="soy">大豆</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

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

// 表格列定义
const memberColumns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 80
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 80
  },
  {
    title: '健康状况',
    dataIndex: 'healthStatus',
    key: 'healthStatus',
    width: 100
  },
  {
    title: '加入时间',
    dataIndex: 'joinDate',
    key: 'joinDate',
    width: 120
  },
  {
    title: '操作',
    key: 'actions',
    width: 200
  }
]

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
const getRoleColor = (role: string) => {
  const colors = {
    owner: 'red',
    admin: 'blue',
    member: 'green'
  }
  return colors[role] || 'default'
}

const getRoleText = (role: string) => {
  const texts = {
    owner: '所有者',
    admin: '管理员',
    member: '成员'
  }
  return texts[role] || '未知'
}

const getHealthStatusColor = (status: string) => {
  const colors = {
    excellent: 'green',
    good: 'blue',
    fair: 'orange',
    poor: 'red'
  }
  return colors[status] || 'default'
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

const getActivityColor = (type: string) => {
  const colors = {
    cooking: 'green',
    invite: 'blue',
    recipe: 'orange'
  }
  return colors[type] || 'default'
}

const getActivityIcon = (type: string) => {
  const icons = {
    cooking: 'fire',
    invite: 'user-add',
    recipe: 'book'
  }
  return icons[type] || 'info'
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
  message.info('家庭设置功能开发中...')
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
  message.info(`查看 ${member.username} 的详细资料`)
}

const refreshMembers = () => {
  membersLoading.value = true
  setTimeout(() => {
    membersLoading.value = false
    message.success('成员列表已刷新')
  }, 1000)
}

const sendInvitation = async () => {
  if (!inviteForm.email) {
    message.error('请输入邮箱地址')
    return
  }
  
  inviteLoading.value = true
  try {
    // 这里应该调用API发送邀请
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.success('邀请已发送')
    inviteModalVisible.value = false
  } catch (error) {
    message.error('发送邀请失败')
  } finally {
    inviteLoading.value = false
  }
}

const updateFamilyInfo = async () => {
  if (!editFamilyForm.name) {
    message.error('请输入家庭名称')
    return
  }
  
  updateLoading.value = true
  try {
    // 这里应该调用API更新家庭信息
    await new Promise(resolve => setTimeout(resolve, 2000))
    familyInfo.name = editFamilyForm.name
    familyInfo.description = editFamilyForm.description
    message.success('家庭信息已更新')
    editFamilyModalVisible.value = false
  } catch (error) {
    message.error('更新家庭信息失败')
  } finally {
    updateLoading.value = false
  }
}

const updateMemberInfo = async () => {
  updateMemberLoading.value = true
  try {
    // 这里应该调用API更新成员信息
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.success('成员信息已更新')
    editMemberModalVisible.value = false
  } catch (error) {
    message.error('更新成员信息失败')
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
    message.success(`${member.username} 已从家庭中移除`)
  } catch (error) {
    message.error('移除成员失败')
  }
}

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

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.family-page {
  padding: 24px;
}

.family-info-card {
  margin-bottom: 24px;
}

.family-avatar {
  text-align: center;
}

.family-avatar h2 {
  margin: 16px 0 8px 0;
  color: #1890ff;
}

.family-description {
  color: #666;
  margin-bottom: 16px;
}

.family-actions {
  margin-top: 16px;
}

.family-actions .ant-btn {
  margin-right: 8px;
}

.member-actions {
  margin-bottom: 16px;
}

.member-actions .ant-btn {
  margin-right: 8px;
}

.activity-content {
  margin-bottom: 4px;
  font-weight: 500;
}

.activity-time {
  color: #999;
  font-size: 12px;
  margin: 0;
}

.text-right {
  text-align: right;
}
</style>
