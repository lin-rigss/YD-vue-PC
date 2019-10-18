import request from '@/utils/request'

export function login(data) {
	return request({
		url: '/authority/user/login/account',
		method: 'post',
		data: {
			...data,
			clientType: "employee"
		}
	})
}

export function mobileLogin(data) {
	return request({
		url: '/authority/user/login/mobile',
		method: 'post',
		data: {
			...data,
			clientType: "employee",
			validType:"sim"
		}
	})
}


// 获取验证码的接接口
export function code(data) {
	return request({
		url: '/authority/code/sim',
		method: 'post',
		data
	})
}

export function getInfo() {
	return request({
		url: '/authority/user/me',
		method: 'get',
	})
}

export function getPermissionMenu() {
	return request({
		url: '/authority/resource/grant/info/menu',
		method: 'get',
	})
}

export function logout() {
	return request({
		url: '/user/logout',
		method: 'post'
	})
}