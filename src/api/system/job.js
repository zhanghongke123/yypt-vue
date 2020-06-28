import request from '@/utils/request'
export function GetList() {
  return request({
    url: '/job/list',
    method: 'get'
  })
}

export function resume(data) {
    return request({
      url: '/job/resume',
      method: 'post',
      data
    })
  }


 export function remove(data) {
    return request({
      url: '/job/remove',
      method: 'post',
      data
    })
  }


  export function add(data) {
    return request({
      url: '/job/add',
      method: 'post',
      data
    })
  }

  export function edit(data) {
    return request({
      url: '/job/edit',
      method: 'post',
      data
    })
  }

  export function pause(data) {
    return request({
      url: '/job/pause',
      method: 'post',
      data
    })
  }