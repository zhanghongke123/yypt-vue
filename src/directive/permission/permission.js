import { validatenull } from  '@/utils/validate'
 
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
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
     
    }else{
        el.parentNode && el.parentNode.removeChild(el)
    }

  }
}
