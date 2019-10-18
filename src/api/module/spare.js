import request from '@/utils/request'

export function getList(data, loading = true) {
	return request({
		url: '/product/goods/list',
		method: 'get',
		params: data,
		loading
	})
}

export function save(data) {
	return request({
		url: '/product/goods/save',
		method: 'post',
		data,
	})
}

export function enable(id) {
	return request({
		url: '/product/goods/enable/' + id,
		method: 'put',
	})
}

export function disable(id) {
	return request({
		url: '/product/goods/disable/' + id,
		method: 'put',
	})
}

export function del(id) {
	return request({
		url: '/product/goods/delete/' + id,
		method: 'delete',
	})
}
