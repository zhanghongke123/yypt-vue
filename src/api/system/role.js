import request from '@/utils/request'


export function list(data){
    return request({
        url:'/sysrole/list',
        method:'post',
        data
    })

}

export function getMenuTree(){
    return  request({
        url:'/sysrole/menutree',
        method: 'post',
        
    })
}


export function saveRoleMenu(data){
    return  request({
        url:'/sysrole/saveRoleMenu',
        method: 'post',
        data
    })
}


export function getRoleButtons(data){
    return  request({
        url:'/sysrole/getRoleButtons',
        method: 'post',
        data
    })
}


export function saveRoleButtons(data){
    return request({
        url:'/sysrole/saveRoleButtons',
        method: 'post',
        data
    })
}