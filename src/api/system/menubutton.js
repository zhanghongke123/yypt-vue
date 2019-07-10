import request from '@/utils/request'

export function list(){
    return  request({
        url:'/sysmenubutton/list',
        method: 'post'
    })
}


export function save(data){
    return  request({
        url:'/sysmenu/save',
        method: 'post',
        data
    })
}

export function del(data){
    return  request({
        url:'/sysmenu/delete',
        method: 'post',
        data
    })
}

export function getMenuButtons(data){
    return  request({
        url:'/sysmenu/getMenuButtons',
        method: 'post',
        data
    })
}

