import { validatenull } from './validate'
import store from '../store'
  
  export const initMenu = (router, menu) => {
    if (menu.length === 0) {
      return
    }
    let menus = []
    menus = formatRoutes(menu)
    router.addRoutes(menus)
    store.commit('SET_ROUTERS', menus)
  }
  
  export const formatRoutes = (aMenu) => {
    const aRouter = []
    aMenu.forEach(oMenu => {
      const {
        path,
        component,
        name,
        icon,
        meta,
        children,
        hidden,
        redirect
      } = oMenu
      if (!validatenull(component)) {
        const oRouter = {
          path: path,
          component: component === 'Layout' ? () => import('@/layout/index') : () => import(`@/views/${component}`),//'@/views/form/index'`@/views/${component}`
          name: name,
          meta: meta,
          icon: icon,
          hidden:hidden,
          redirect:redirect,
          ismenu: component === 'Layout' ? true : false,
          children: validatenull(children) ? [] : formatRoutes(children)
        }
        aRouter.push(oRouter)
      }
    })
    return aRouter
  }
  
  
  /**
   * 动态插入css
   */
  
  export const loadStyle = url => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
  }
  
  