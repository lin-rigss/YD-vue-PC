import { login, mobileLogin, logout, getInfo, getPermissionMenu } from '@/api/module/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
	token: getToken(),
	name: '',
	avatar: 'https://oss.99cherry.com/image/head-portrait.png',
	info: {extendProperty: {}},
	menus: [],
	routes: [],
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_INFO: (state, info) => {
		state.info = info
	},
	MENUS: (state, menus) => {
		state.menus = menus
	},
	ROUTERS: (state, routes) => {
		state.routes = routes
	},
	
}

const actions = {
	// 登录
	login({ commit }, userInfo) {
		const { 
			type,
			username, password,
			phone, validate
		 } = userInfo
		return new Promise((resolve, reject) => {
			
			let res;
			if(type == 1){
				res = login({ account: username.trim(), password: password })
			}else if(type == 2){
				res = mobileLogin({ mobile: phone, sms: validate })
			}else{
				return ;
			}
			
			res.then(response => {
				const { data, token } = response
				commit('SET_TOKEN', token)
				commit('SET_INFO', data)
				setToken(token)
				resolve()
			}).catch(error => {
				resolve(error)
			})
		})
	},

	// get user info
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			Promise.all([getInfo(), getPermissionMenu()]).then(([infoRes, menuRes]) => {
				const { data } = infoRes
				if (!data) {
					reject('Verification failed, please Login again.')
				}
				commit('SET_INFO', data)
				commit('MENUS', menuRes.data)
				
				if(menuRes.data.length){
					resolve(data)
				}else{
					reject('暂无权限')
				}
			}).catch(error => {
				reject(error)
			});
		})
	},
	
	setRoutes({ commit, state }, routes) {
		commit('ROUTERS', routes)
	},
	
	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			// logout(state.token).then(() => {
			// 	commit('SET_TOKEN', '')
			// 	localStorage.removeItem('AUTO_LOGIN')
			// 	removeToken()
			// 	resetRouter()
			// 	resolve()
			// }).catch(error => {
			// 	reject(error)
			// })
			
			commit('SET_TOKEN', '')
			commit('SET_INFO', {extendProperty: {}})
			localStorage.removeItem('AUTO_LOGIN')
			removeToken()
			resetRouter()
			resolve()
			
		})
	},

	// remove token
	resetToken({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '')
			commit('SET_INFO', {extendProperty: {}})
			removeToken()
			resolve()
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
