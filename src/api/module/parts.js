import request from '@/utils/request'
//严选
export function getList(data, loading = true) {
	return request({
		// url: '/product/goodstype/tree',
		url: '/product/goodstype/org/list',
		method: 'get',
		params: data,
		loading
	})
}

export function getpartsList(data, loading = true) {
	return request({
		url: '/product/goodstype/tree',
		method: 'get',
		params: data,
		loading
	})
}

//查二级
export function getSecondList(id) {
	return request({
		url: '/product/goodstype/org/list/' + id,
		method: 'get',
	})
}

//统货
export function generalCargoList(data) {
	return request({
		// url: '/product/goods/tree',
		url: '/product/goods/list',
		method: 'get',
		params: data,
	})
}

//查二级
export function getSecondpieceList(id) {
	return request({
		url: '/product/goods/org/list/' + id,
		method: 'get',
	})
}


export function detail(id) {
	return request({
		url: '/product/goodstype/detail/' + id,
		method: 'get',
	})
}

export function save(data) {
	return request({
		url: '/product/goodstype/save',
		method: 'post',
		data,
	})
}

export function enable(id) {
	return request({
		url: '/product/goodstype/enable/' + id,
		method: 'put',
	})
}

export function disable(id) {
	return request({
		url: '/product/goodstype/disable/' + id,
		method: 'put',
	})
}

export function del(id) {
	return request({
		url: '/product/goodstype/delete/' + id,
		method: 'delete',
	})
}
//统货
export function generalCargoDel(id) {
	return request({
		url: '/product/goods/delete/' + id,
		method: 'delete',
	})
}

export function generalCargoSave(data) {
	return request({
		url: '/product/goods/save',
		method: 'post',
		data,
	})
}
//发动机厂商管理列表
export function engineFactoryList(data) {
	return request({
		url: '/product/engine/factory/list',
		method: 'get',
		params: data,
	})
}

export function engineFactoryDetail(id) {
	return request({
		url: '/product/engine/factory/detail/' + id,
		method: 'get',
	})
}

export function engineFactorySave(data) {
	return request({
		url: '/product/engine/factory/saveOrUpdate',
		method: 'post',
		data,
	})
}

export function engineFactoryDel(id) {
	return request({
		url: '/product/engine/factory/delete/' + id,
		method: 'get',
	})
}