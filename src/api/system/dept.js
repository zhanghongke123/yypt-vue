import request from '@/utils/request'

export function getDeptTree(data){
    return  request({
        url:'/sysdept',
        method: 'post',
        data
    })
}


export function save(data){
    return  request({
        url:'/sysdept/save',
        method: 'post',
        data
    })
}

export function del(data){
    return  request({
        url:'/sysdept/del',
        method: 'post',
        data
    })
}

