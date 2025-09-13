<template>
  <div class="family-page">
    <div class="page-header">
      <h1>家庭管理</h1>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        创建家庭
      </el-button>
    </div>
    
    <div class="families-grid">
      <el-card
        v-for="family in families"
        :key="family.id"
        class="family-card"
        @click="viewFamily(family)"
      >
        <div class="family-content">
          <h3>{{ family.name }}</h3>
          <p>{{ family.description }}</p>
          <div class="family-meta">
            <div class="members">
              <el-icon><UserFilled /></el-icon>
              <span>{{ family.members.length }}位成员</span>
            </div>
            <div class="created-date">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(family.createdAt) }}</span>
            </div>
          </div>
          <div class="member-list">
            <el-avatar
              v-for="member in family.members.slice(0, 3)"
              :key="member.userId"
              :size="32"
            >
              {{ member.role.charAt(0).toUpperCase() }}
            </el-avatar>
            <span v-if="family.members.length > 3" class="more-members">
              +{{ family.members.length - 3 }}
            </span>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 创建家庭对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建家庭"
      width="500px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="家庭名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入家庭名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入家庭描述（可选）"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleCreate">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { Plus, UserFilled, Calendar } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Family } from '@/types'

const appStore = useAppStore()

const showCreateDialog = ref(false)
const isLoading = ref(false)

const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  description: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入家庭名称', trigger: 'blur' }
  ]
}

const families = computed(() => appStore.families)

const viewFamily = (family: Family) => {
  appStore.setCurrentFamily(family)
  // 可以添加查看详情的逻辑
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    description: ''
  })
}

const handleCreate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isLoading.value = true
    
    await appStore.createFamily(form)
    ElMessage.success('家庭创建成功')
    showCreateDialog.value = false
    resetForm()
  } catch (error) {
    console.error('创建家庭失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.family-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.families-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.family-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.family-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.family-content {
  padding: 20px;
}

.family-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.family-content p {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.family-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.members,
.created-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
}

.member-list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.more-members {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .families-grid {
    grid-template-columns: 1fr;
  }
}
</style>