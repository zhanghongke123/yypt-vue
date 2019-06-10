import Cookies from 'js-cookie'

const TokenKey = 'Authentication_TOKEN'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

//缓存用户信息
export function setUserInfo(userinfo){
  localStorage.setItem('userinfo',JSON.stringify(userinfo))
}


//获取用户信息
export function getUserInfo(){
  var userinfostr = localStorage.getItem('userinfo')
  return JSON.parse(userinfostr)
}

//缓存当前角色
export function setCurrentRole(currentrole){
  localStorage.setItem('currentrole',JSON.stringify(currentrole))
}

//获取当前角色
export function getCurrentRole(){
  var currentrolestr = localStorage.getItem('currentrole')
  return JSON.parse(currentrolestr)
}
