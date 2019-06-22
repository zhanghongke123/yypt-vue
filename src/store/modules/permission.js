import { constantRoutes } from '@/router'
import { GetMenu } from '@/api/system/user'

const permission = {
  state: {
    routers: constantRoutes,
    addRouters: [],
    getMenuFlag:0
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = state.routers.concat(state.addRouters)
    },
    SET_GETMENUFLAG: (state, getMenuFlag) => {
      state.getMenuFlag = getMenuFlag
    }
  },
  actions: {
    // 获取系统菜单
    getMenu({
      commit
    }, roleId) {
      return new Promise(resolve => {
        GetMenu(roleId).then((res) => {
          commit('SET_GETMENUFLAG',1)
          let router = {
            path:'*',
            redirect:'/404',
            hidden:true,
            component:'404'
          }
          res.push(router)
          resolve(res)
        })
      })
    }
  }
}

export default permission

