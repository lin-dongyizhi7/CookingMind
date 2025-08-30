<template>
  <div class="ingredients-page">
    <AppHeader />
    <div class="ingredients-layout">
      <AppSider />
      <div class="main-content">
        <div class="content-area">
          <div class="page-header">
            <h1>食材管理</h1>
            <p>管理您的食材库存，智能识别食材，跟踪保质期</p>
          </div>

          <div class="actions-bar">
            <a-space>
              <a-button type="primary" @click="showAddModal = true">
                <PlusOutlined />
                添加食材
              </a-button>
              <a-button @click="showRecognizeModal = true">
                <CameraOutlined />
                拍照识别
              </a-button>
            </a-space>
          </div>

          <a-table
            :columns="columns"
            :data-source="ingredients"
            :loading="loading"
            row-key="id"
            class="ingredients-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'image'">
                <a-image
                  :src="record.image || '/placeholder.jpg'"
                  :width="60"
                  :height="60"
                  class="ingredient-image"
                />
              </template>
              
              <template v-else-if="column.key === 'freshness'">
                <a-tag :color="getFreshnessColor(record.freshness)">
                  {{ getFreshnessText(record.freshness) }}
                </a-tag>
              </template>
              
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="editIngredient(record)">
                    编辑
                  </a-button>
                  <a-button type="link" size="small" @click="deleteIngredient(record)">
                    删除
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>

    <!-- 添加食材模态框 -->
    <a-modal
      v-model:open="showAddModal"
      title="添加食材"
      @ok="handleAddIngredient"
      @cancel="showAddModal = false"
    >
      <a-form :model="newIngredient" layout="vertical">
        <a-form-item label="食材名称" name="name">
          <a-input v-model:value="newIngredient.name" placeholder="请输入食材名称" />
        </a-form-item>
        
        <a-form-item label="分类" name="category">
          <a-select v-model:value="newIngredient.category" placeholder="选择分类">
            <a-select-option value="vegetables">蔬菜</a-select-option>
            <a-select-option value="fruits">水果</a-select-option>
            <a-select-option value="meat">肉类</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="数量" name="quantity">
          <a-input-number v-model:value="newIngredient.quantity" :min="0" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, CameraOutlined } from '@ant-design/icons-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'

const loading = ref(false)
const showAddModal = ref(false)

const newIngredient = reactive({
  name: '',
  category: '',
  quantity: 1
})

const ingredients = ref([
  {
    id: '1',
    name: '番茄',
    category: 'vegetables',
    image: '/tomato.jpg',
    quantity: 5,
    freshness: 'fresh'
  },
  {
    id: '2',
    name: '鸡蛋',
    category: 'dairy',
    image: '/egg.jpg',
    quantity: 12,
    freshness: 'good'
  }
])

const columns = [
  {
    title: '图片',
    dataIndex: 'image',
    key: 'image',
    width: 80
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category'
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: '新鲜程度',
    dataIndex: 'freshness',
    key: 'freshness'
  },
  {
    title: '操作',
    key: 'actions',
    width: 120
  }
]

const handleAddIngredient = () => {
  message.success('食材添加成功')
  showAddModal.value = false
}

const editIngredient = (ingredient: any) => {
  message.info(`编辑食材：${ingredient.name}`)
}

const deleteIngredient = (ingredient: any) => {
  message.info(`删除食材：${ingredient.name}`)
}

const getFreshnessColor = (freshness: string) => {
  const colors: Record<string, string> = {
    fresh: 'green',
    good: 'blue',
    fair: 'orange',
    poor: 'red'
  }
  return colors[freshness] || 'default'
}

const getFreshnessText = (freshness: string) => {
  const texts: Record<string, string> = {
    fresh: '新鲜',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return texts[freshness] || freshness
}
</script>

<style scoped>
.ingredients-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.ingredients-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  margin-left: 200px;
}

.content-area {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.actions-bar {
  margin-bottom: 24px;
}

.ingredients-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ingredient-image {
  border-radius: 8px;
  object-fit: cover;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }
}
</style>
