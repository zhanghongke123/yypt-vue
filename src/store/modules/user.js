import { login, logout } from '@/api/system/user'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, getCurrentRole, setCurrentRole } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userinfo: getUserInfo(),
  currentrole: getCurrentRole()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_CURRENTROLE: (state, role) => {
    state.currentrole = role
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response
        commit('SET_TOKEN', data.token)
        // 缓存用户Token
        setToken(data.token)
        // 缓存用户信息
        commit('SET_USERINFO', data.userinfo)
        setUserInfo(data.userinfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  
  //选择当前用户登录的角色
  chooseRole({ commit }, role){
     setCurrentRole(role)
     commit('SET_CURRENTROLE',role)
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        localStorage.clear()
        //页面刷新 重置vux
        window.location.reload()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      localStorage.clear()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

