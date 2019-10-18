import request from '@/utils/request'

export function list(parentId, loading = true) {
	return request({
		url: '/dictionary/brand/list',
		method: 'get',
		params: { parentId },
		loading
	})
}