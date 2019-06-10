import request from '@/utils/request'
export function GetMenu(roleId) {
  return request({
    url: '/login/getMenu/' + roleId,
    method: 'get'
  })
}
