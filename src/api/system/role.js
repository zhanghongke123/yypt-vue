import request from '@/utils/request'


export function list(data){
    return request({
        url:'/sysrole/list',
        method:'post',
        data
    })

}


export function saveRole(data){
    return request({
        url:'/sysrole/save',
        method:'post',
        data
    })

}


export function delRole(data){
    return request({
        url:'/sysrole/del',
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



export function getRoleUsers(data){
    return request({
        url:'/sysrole/getRoleUsers',
        method: 'post',
        data
    })
}



export function delRoleUser(data){
    return request({
        url:'/sysrole/delRoleUser',
        method: 'post',
        data
    })
}

export function userRep(data){
    return request({
        url:'/sysrole/userRep',
        method: 'post',
        data
    })
}


export function saverRoleUser(data){
    return request({
        url:'/sysrole/saverRoleUser',
        method: 'post',
        data
    })
}