import request from '@/utils/request'

export function tree(data, loading = true) {
	return request({
		url: '/inventory/repository/tree',
		method: 'get',
		params: data,
		loading,
	})
}

export function save(data) {
	return request({
		url: '/inventory/repository/save',
		method: 'post',
		data
	})
}

export function del(id) {
	return request({
		url: '/inventory/repository/delete/' + id,
		method: 'delete',
	})
}
