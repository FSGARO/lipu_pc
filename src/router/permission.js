/*
 * @Description: 
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2021-08-20 10:56:10
 * @FilePath: \fang_lipt\src\router\permission.js
 * El Psy Congroo
 */
import router from './index.js'
import api from '../api'
// 路由守卫
router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requireAuth)) {
		// 判断该路由是否需要登录权限

		const getToken = localStorage.getItem('token')
		const outTime = parseInt(localStorage.getItem('reformTime')) + 2592000000 //30天后过期
		const getTime = parseInt(localStorage.getItem('reformTime')) + 10000 // 1天 86400000
		const getLink = parseInt(localStorage.getItem('link'))
		const nowTime = new Date().getTime()
		if (nowTime > outTime) {
			//过时清除token
			localStorage.removeItem(getToken)
			localStorage.clear()
		}
		if (!getLink||nowTime > getTime) {
			api.login
				.getInformation()
				.then((res) => {
					if (res.data.config_info.link) {
						localStorage.setItem('link', JSON.stringify(res.data.config_info.link))
					}
					if (res.data.config_info.login) {
						localStorage.setItem('login', JSON.stringify(res.data.config_info.login))
					}
					if (res.data.config_info) {
						localStorage.setItem('reformTime', JSON.stringify(nowTime))
					}
					if (res.data.config_info.panel) {
						localStorage.setItem(
							'schoolname',
							res.data.config_info.school.name
						)
					}
					if (res.data.config_info.panel) {
						// console.log(res.data.config_info);
						localStorage.setItem('panel', JSON.stringify(res.data.config_info.panel))
					}
					if(res.data.config_info.user){
						localStorage.setItem('role', res.data.config_info.user.role)
						localStorage.setItem('name', res.data.config_info.user.name)
						localStorage.setItem('user', res.data.config_info.user.user)
						localStorage.setItem('id', res.data.config_info.user.id)
						localStorage.setItem('role_level', res.data.config_info.user.role_level)
						localStorage.setItem('user', res.data.config_info.user.user)
						localStorage.setItem("tips", res.data.config_info.user.unread_number);
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}

		if (to.meta.title) {
			//标题
			document.title = to.meta.title
		} else {
			document.title = to.matched[0].meta.title
		}

		if (getToken) {
			// 判断当前的token是否存在
			if (to.path === '/Login') {
				// removeToken()
				// window.location.reload()  //页面实现跳转和刷新
				return
			}
			if (to.path === '/internet/Control') {
				if (JSON.parse(localStorage.getItem('link'))) {
					if (JSON.parse(localStorage.getItem('link')).enabled) {
						next()
						return
					} else {
						next({ path: '/menu' })
						return
					}
				}
			}
			if (to.path === '/main') {
				console.log("to.path === '/Control'", to.path)
				if (JSON.parse(localStorage.getItem('panel'))) {
					if (JSON.parse(localStorage.getItem('panel')).enabled) {
						next()
						return
					} else {
						next({ path: '/index' })
						return
					}
				}
			}
			next()
		} else {
			next({
				path: '/Login',
				query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	} else {
		next()
	}
})

export default router
