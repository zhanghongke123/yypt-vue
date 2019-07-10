import { validatenull } from  '@/utils/validate'
 
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    console.log(el)
    console.log(vnode)

    let buttons = vnode.context.$route.meta.buttons
    let currnrt = {}
    if(validatenull(value)){
      throw new Error('绑定值不能为空')
    }

    if(validatenull(buttons)){
       buttons = []
    }

    const hasPermission = buttons.some(button =>{
        if(button.permission == value){
            currnrt = button
            return true
        } 
    })


    if(hasPermission){
        if(!validatenull(currnrt.name)){
            vnode.push('<svg-icon icon-class="role"/>')
            el.innerHTML = `<><span>${currnrt.name}</span>`
        }
    }else{
        el.parentNode && el.parentNode.removeChild(el)
    }


    // const { value } = binding
    // const roles = store.getters && store.getters.roles

    // if (value && value instanceof Array && value.length > 0) {
    //   const permissionRoles = value

    //   const hasPermission = roles.some(role => {
    //     return permissionRoles.includes(role)
    //   })

    //   if (!hasPermission) {
    //     el.parentNode && el.parentNode.removeChild(el)
    //   }
    // } else {
    //   throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    // }
  }
}
