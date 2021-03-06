import request from '@/utils/request'

export function getMenuTree(){
    return  request({
        url:'/sysmenu',
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


export function delButton(data){
    return request({
        url:'/sysmenubutton/del',
        method: 'post',
        data
    })
}


export function saveButton(data){
    return request({
        url:'/sysmenubutton/save',
        method: 'post',
        data
    })
}