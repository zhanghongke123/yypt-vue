import Vue from 'vue'
import 'xe-utils'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '@/styles/index.scss' // global css

import YyptButton from '@/components/YyptButton/index.js'

import '@/components/TableEdit/index.js'


import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import permission from '@/directive/permission/index.js' // 权限判断指令

import eldragdialog from '@/directive/el-drag-dialog/index.js' // 拖拽dialog

import * as alldict from '@/utils/dict'

import * as filters from './filters' // global filters
import '@/utils/ext.js'


Vue.use(permission)

Vue.use(eldragdialog)

Vue.prototype.$dict = alldict

import api from '@/api/common/commonapi.js'
Vue.prototype.$api = api

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(YyptButton)


// set ElementUI lang to EN
Vue.use(ElementUI, { locale })


Vue.use(VXETable)


VXETable.setup({
  zIndex:999
})


// 注册全局的filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
