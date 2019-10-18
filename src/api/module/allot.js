import request from '@/utils/request'

//列表
export function list(data, loading = true) {
	return request({
		url: '/service-coding/assign/list',
		method: 'get',
		params: data,
		loading
	})
}

//详情
export function detail(id, loading = true) {
	return request({
		url: '/service-coding/assign/detail/' + id,
		method: 'get',
		loading
	})
}

//分配编码
export function distribute(data, loading = true) {
	return request({
		url: '/service-coding/assign/distribute',
		method: 'post',
		data,
		loading
	})
}

//获取编码组
export function group(data, loading = true) {
	return request({
		url: '/service-coding/assign/coding/group',
		method: 'post',
		data,
		loading
	})
}
