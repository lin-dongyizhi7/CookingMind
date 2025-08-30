<template>
  <div class="ingredients-page">
    <AppHeader />
    <AppSider />
    
    <div class="main-content">
      <div class="page-header">
        <h1>食材管理</h1>
        <p>管理您的食材库存，支持拍照识别</p>
      </div>
      
      <div class="actions-bar">
        <el-space>
          <el-button type="primary" @click="showAddModal = true">
            <el-icon><Plus /></el-icon>
            添加食材
          </el-button>
          <el-button @click="showRecognizeModal = true">
            <el-icon><Camera /></el-icon>
            拍照识别
          </el-button>
        </el-space>
      </div>
      
      <el-table
        :data="ingredients"
        :loading="loading"
        class="ingredients-table"
      >
        <el-table-column prop="image" label="图片" width="80">
          <template #default="{ record }">
            <el-image
              :src="record.image || '/placeholder-ingredient.jpg'"
              :preview-src-list="[record.image || '/placeholder-ingredient.jpg']"
              fit="cover"
              class="ingredient-image"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="freshness" label="新鲜度">
          <template #default="{ record }">
            <el-tag :type="getFreshnessType(record.freshness)">
              {{ record.freshness }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150">
          <template #default="{ record }">
            <el-space>
              <el-button type="primary" link size="small" @click="editIngredient(record)">
                编辑
              </el-button>
              <el-button type="danger" link size="small" @click="deleteIngredient(record)">
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 添加食材模态框 -->
    <el-dialog
      v-model="showAddModal"
      title="添加食材"
      width="500px"
    >
      <el-form :model="newIngredient" label-width="80px">
        <el-form-item label="食材名称">
          <el-input v-model="newIngredient.name" placeholder="请输入食材名称" />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="newIngredient.category" placeholder="选择分类" style="width: 100%">
            <el-option value="vegetables" label="蔬菜" />
            <el-option value="fruits" label="水果" />
            <el-option value="meat" label="肉类" />
            <el-option value="seafood" label="海鲜" />
            <el-option value="dairy" label="乳制品" />
            <el-option value="grains" label="谷物" />
            <el-option value="spices" label="调味料" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="数量">
          <el-input-number v-model="newIngredient.quantity" :min="0" style="width: 100%" />
        </el-form-item>
        
        <el-form-item label="单位">
          <el-select v-model="newIngredient.unit" placeholder="选择单位" style="width: 100%">
            <el-option value="个" label="个" />
            <el-option value="斤" label="斤" />
            <el-option value="克" label="克" />
            <el-option value="包" label="包" />
            <el-option value="瓶" label="瓶" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="新鲜度">
          <el-select v-model="newIngredient.freshness" placeholder="选择新鲜度" style="width: 100%">
            <el-option value="新鲜" label="新鲜" />
            <el-option value="一般" label="一般" />
            <el-option value="需要处理" label="需要处理" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="过期时间">
          <el-date-picker
            v-model="newIngredient.expiryDate"
            type="date"
            placeholder="选择过期时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-space>
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="handleAddIngredient">确定</el-button>
        </el-space>
      </template>
    </el-dialog>
    
    <!-- 拍照识别模态框 -->
    <el-dialog
      v-model="showRecognizeModal"
      title="拍照识别食材"
      width="600px"
    >
      <div class="recognize-content">
        <div class="camera-area">
          <el-button type="primary" size="large">
            <el-icon><Camera /></el-icon>
            拍照识别
          </el-button>
          <p class="camera-tip">点击拍照，AI将自动识别食材</p>
        </div>
        
        <div class="recognize-result" v-if="recognizeResult">
          <h4>识别结果：</h4>
          <el-tag v-for="item in recognizeResult" :key="item.name" class="recognize-tag">
            {{ item.name }} - {{ item.confidence }}%
          </el-tag>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showRecognizeModal = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Camera } from '@element-plus/icons-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'

// 响应式数据
const loading = ref(false)
const showAddModal = ref(false)
const showRecognizeModal = ref(false)
const recognizeResult = ref(null)

const newIngredient = reactive({
  name: '',
  category: '',
  quantity: 1,
  unit: '个',
  freshness: '新鲜',
  expiryDate: null
})

// 模拟食材数据
const ingredients = ref([
  {
    id: 1,
    name: '番茄',
    category: '蔬菜',
    quantity: 5,
    unit: '个',
    freshness: '新鲜',
    expiryDate: '2024-01-15',
    image: '/tomato.jpg'
  },
  {
    id: 2,
    name: '鸡蛋',
    category: '蛋类',
    quantity: 12,
    unit: '个',
    freshness: '新鲜',
    expiryDate: '2024-01-20',
    image: '/egg.jpg'
  },
  {
    id: 3,
    name: '鸡肉',
    category: '肉类',
    quantity: 500,
    unit: '克',
    freshness: '一般',
    expiryDate: '2024-01-12',
    image: '/chicken.jpg'
  }
])

// 方法
const handleAddIngredient = () => {
  ElMessage.success('食材添加成功')
  showAddModal.value = false
}

const editIngredient = (ingredient: any) => {
  ElMessage.info(`编辑食材：${ingredient.name}`)
}

const deleteIngredient = (ingredient: any) => {
  ElMessage.info(`删除食材：${ingredient.name}`)
}

const getFreshnessType = (freshness: string) => {
  switch (freshness) {
    case '新鲜':
      return 'success'
    case '一般':
      return 'warning'
    case '需要处理':
      return 'danger'
    default:
      return 'info'
  }
}

// 生命周期
onMounted(() => {
  // 加载食材数据
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style lang="less" scoped>
.ingredients-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  margin-left: 240px;
  margin-top: 64px;
  padding: 24px;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
  }
}

.page-header {
  margin-bottom: 24px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
  }
  
  p {
    color: #666;
    margin: 0;
  }
}

.actions-bar {
  margin-bottom: 24px;
}

.ingredients-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ingredient-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.recognize-content {
  text-align: center;
  padding: 20px;
}

.camera-area {
  margin-bottom: 24px;
  
  .camera-tip {
    color: #666;
    margin-top: 12px;
  }
}

.recognize-result {
  text-align: left;
  
  h4 {
    margin-bottom: 12px;
    color: #333;
  }
  
  .recognize-tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }
  
  .actions-bar {
    .el-space {
      flex-direction: column;
      width: 100%;
      
      .el-button {
        width: 100%;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
