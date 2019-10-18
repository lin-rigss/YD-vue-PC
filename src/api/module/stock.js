import request from '@/utils/request'
import { isEmpty } from '@/allocation/module/util'

export function save(data, loading = true) {
	return request({
		url: '/inventory/stock/bill/in/save',
		method: 'post',
		data,
		loading
	})
}

export function partsList(code, loading = true) {
	return request({
		url: '/inventory/stock/summary/goods',
		method: 'get',
		params: { code },
		loading
	})
}

export function brandList(code, loading = true) {
	return request({
		url: '/inventory/stock/summary/brand',
		method: 'get',
		params: { code },
		loading
	})
}

export function detailList(data, loading = true) {
	return request({
		url: '/inventory/stock/detail/list',
		method: 'get',
		params: data,
		loading
	})
}

export function putList(data, loading = true) {
	return request({
		url: '/inventory/stock/bill/in/list',
		method: 'get',
		params: data,
		loading
	})
}

export function putDetail(id, loading = true) {
	return request({
		url: '/inventory/stock/in/goods/list/' + id,
		method: 'get',
		loading
	})
}


export function listDetail(id, loading = true) {
	return request({
		url: '/inventory/stock/detail/list/item/' + id,
		method: 'get',
		loading
	})
}

export function outSearch(key, loading = true) {
	if(isEmpty(key)){
		return Promise.reject('内容不能为空');
	}
	return request({
		url: '/inventory/stock/list/remainder',
		method: 'get',
		params: { key },
		loading
	})
}

export function outHeapSearch(key, loading = true) {
	if(isEmpty(key)){
		return Promise.reject('内容不能为空');
	}
	return request({
		url: '/inventory/unify/stock/list/remainder',
		method: 'get',
		params: { key },
		loading
	})
}

export function outSave(data, loading = true) {
	return request({
		url: '/inventory/stock/bill/out/save',
		method: 'post',
		data,
		loading
	})
}

export function outHeapSave(data, loading = true) {
	return request({
		url: '/inventory/unify/out/stock/save',
		method: 'post',
		data,
		loading
	})
}

export function outList(data, loading = true) {
	return request({
		url: '/inventory/stock/bill/out/list',
		method: 'get',
		params: data,
		loading
	})
}

export function outHeapList(data, loading = true) {
	return request({
		url: '/inventory//unify/out/stock/list',
		method: 'get',
		params: data,
		loading
	})
}

export function outDetail(id, loading = true) {
	return request({
		url: '/inventory/stock/out/goods/list/' + id,
		method: 'get',
		loading
	})
}

export function outHeapDetail(id, loading = true) {
	return request({
		url: '/inventory/unify/out/stock/goods/list/' + id,
		method: 'get',
		loading
	})
}

export function inReport(type, level = 1, loading = true) {
	return request({
		url: '/inventory/stock/in/goods/report/' + type,
		method: 'get',
		params: { level },
		loading
	})
}

export function outReport(type, level = 1, loading = true) {
	return request({
		url: '/inventory/stock/out/goods/report/' + type,
		method: 'get',
		params: { level },
		loading
	})
}
//库存详情统货零件列表
export function goodsList(data, loading = true) {
	return request({
		url: '/inventory/unify/goods/list',
		method: 'get',
		params: data,
		loading
	})
}
//库存详情统货入库单列表
export function stockList(data, loading = true) {
	return request({
		url: '/inventory/unify/in/stock/list',
		method: 'get',
		params: data,
		loading
	})
}
//库存详情统货入库单详情
export function stockDetail(id, loading = true) {
	return request({
		url: '/inventory/unify/in/stock/detail/'+id,
		method: 'get',
		loading
	})
}
//库存详情统货拆解详情
export function pullDetail(id, loading = true) {
	return request({
		url: '/inventory/pull/in/stock/detail/'+id,
		method: 'get',
		loading
	})
}
