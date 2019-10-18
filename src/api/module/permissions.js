import request from '@/utils/request'

export function grant(data) {
	return request({
		url: '/authority/permission/station/menu/grant',
		method: 'post',
		data,
	})
}

export function search(id) {
	return request({
		url: '/authority/permission/station/resources/' + id,
		method: 'get',
	})
}
