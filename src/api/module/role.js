import request from '@/utils/request'

export function getTree(data) {
	return request({
		url: '/authority/organization/tree',
		method: 'get',
		params: data,
	})
}

export function detail(id) {
	return request({
		url: '/authority/organization/detail/' + id,
		method: 'get',
	})
}

export function save(data) {
	return request({
		url: '/authority/organization/save',
		method: 'post',
		data,
	})
}

export function del(id) {
	return request({
		url: '/authority/organization/delete/' + id,
		method: 'delete',
	})
}

export async function getOrgStation(id, loading = true) {
	return request({
		url: '/authority/station/org/list/' + id,
		method: 'get',
		loading
	})
}

export function saveOrgStation(data) {
	return request({
		url: '/authority/station/save',
		method: 'post',
		data,
	})
}

export function delOrgStation(id) {
	return request({
		url: '/authority/station/delete/' + id,
		method: 'delete',
	})
}

export function stationTree() {
	return request({
		url: '/authority/organization/tree/station',
		method: 'get',
	})
}