import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}


export function GetMenu(roleId) {
  return request({
    url: '/login/getMenu/' + roleId,
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}


export function list(data) {
  return request({
    url: '/sysuser',
    method: 'post',
    data
  })
}

export function deptTree( data ){
  return request({
    url: '/sysuser/depttree',
    method: 'post',
    data
  })
}
