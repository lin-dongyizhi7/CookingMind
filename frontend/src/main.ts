/*
 * @Author: 凛冬已至 2985956026@qq.com
 * @Date: 2025-08-29 23:56:53
 * @LastEditors: 凛冬已至 2985956026@qq.com
 * @LastEditTime: 2025-08-30 09:33:57
 * @FilePath: \CookingMind\frontend\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import App from './App.vue'
import routes from './router'

// 配置dayjs中文
dayjs.locale('zh-cn')

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 创建应用
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(Antd)

// 全局配置
app.config.globalProperties.$locale = zhCN

// 挂载应用
app.mount('#app')
