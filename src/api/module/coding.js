import request from '@/utils/request'

//列表
export function list(data, loading = true) {
	return request({
		url: '/service-coding/codingorder/list',
		method: 'get',
		params: data,
		loading
	})
}

//制作编码下单
export function purchase(data, loading = true) {
	return request({
		url: '/service-coding/codingorder/purchase',
		method: 'post',
		data,
		loading
	})
}

//制作编码下单
export function detail(id, loading = true) {
	return request({
		url: '/service-coding/codingorder/detail/' + id,
		method: 'get',
		loading
	})
}

//取消
export function cancel(data, loading = true) {
	return request({
		url: '/service-coding/coding/cancel',
		method: 'post',
		data,
		loading
	})
}

//制作
export function make(id, loading = true) {
	return request({
		url: '/service-coding/coding/make/' + id,
		method: 'get',
		loading
	})
}

//制作完成
export function complate(id, loading = true) {
	return request({
		url: '/service-coding/coding/complate/' + id,
		method: 'get',
		loading
	})
}

//制作完成
export function download(id, loading = true) {
	return request({
		url: '/service-coding/coding/download/' + id,
		method: 'get',
		responseType: 'blob',
		loading
	})
}
