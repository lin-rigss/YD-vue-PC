import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
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
			const hasGetUserInfo = store.getters.info.id
			if (!hasGetUserInfo) {
				try {
					// get user info
					await store.dispatch('user/getInfo')
				} catch (error) {
					// remove token and go to login page to re-login
					await store.dispatch('user/resetToken')
					Message.error(error || 'Has Error')
					next(`/login?redirect=${to.path}`)
					NProgress.done()
					return ;
				}
			}
			if(store.getters.menus.length && to.name && !to.meta.skip){
				let r = store.getters.menus.some(m => m === to.name);
				if(!r){
					if(to.path === '/' || to.path === '/dashboard'){
						next(`/login`)
					}else{
						next({ path: '/' })
					}
					return ;
				}
			}
			next()
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

router.afterEach((to, from, next) => {
	// finish progress bar
	NProgress.done()
})
