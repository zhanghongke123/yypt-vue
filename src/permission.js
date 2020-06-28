import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getCurrentRole } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { initMenu } from '@/utils/util'
import { validatenull } from '@/utils/validate'

 


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      try {
        const currentrole = getCurrentRole()
        const getmenuflag = store.getters.getmenuflag
        // 判断是否有角色信息
        if (!validatenull(currentrole) && getmenuflag == 0) {
         let routerdata =  await store.dispatch('getMenu', currentrole.roleId)
         console.error(routerdata)
         initMenu(router, routerdata)
         next({ ...to, replace: true })
         
        }else{
          if(to.matched.length !== 0 ){
              next()
              //如果匹配到跳转下一页
            }else{
              //没有匹配到的话，跳转404
                next({path:'/404'})
            }
        }

      } catch (error) {
        console.error(error)
        await store.dispatch('user/resetToken')
        Message({
          showClose: true,
          message: error || 'Has Error',
          type: 'error'
        })
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }

  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
