import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
// console.log(store);
router.beforeEach(async(to, from, next) => {
	//store.commit('SET_TOKEN', 'zh');
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
    	//next()
			const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) { // 判断当前用户是否已拉取完user_info信息
				next()
			}else{
				try{
					const { roles } = await store.dispatch('user/getUserInfo')
					const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
					router.addRoutes(accessRoutes)
					next({...to,replace:true})
				}catch(error){
					await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
				}

        // 可删 ↑
      }
		}
	}	else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
