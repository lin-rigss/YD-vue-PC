import request from '@/utils/request'

export function employees(data = {}) {
	return request({
		url: '/authority/user/employees',
		method: 'get',
		params: {
			...data,
			clientType: 'employee'
		},
	})
}

export function getList(data) {
	return request({
		url: '/authority/user/list',
		method: 'get',
		params: {
			...data,
			clientType: 'employee'
		},
	})
}

export function detail(id) {
	return request({
		url: '/authority/user/detail/' + id,
		method: 'get',
	})
}

export function save(data) {
	return request({
		url: '/authority/user/save',
		method: 'post',
		data: {
			...data,
			clientType: 'employee'
		},
	})
}

export function del(id) {
	return request({
		url: '/authority/user/delete/' + id,
		method: 'delete',
	})
}
