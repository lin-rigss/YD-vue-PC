import request from '@/utils/request'

export function getList(data) {
	return request({
		url: '/disassemele-order/operation/order/list',
		method: 'get',
		params: data,
	})
}

export function detail(id) {
	return request({
		url: '/disassemele-order/user/detail/' + id,
		method: 'get',
	})
}

export function save(data) {
	return request({
		url: '/disassemele-order/user/save',
		method: 'post',
		data: {
			...data,
			clientType: 'sale'
		},
	})
}

export function del(id) {
	return request({
		url: '/disassemele-order/user/delete/' + id,
		method: 'delete',
	})
}

//列表获取已有报价单
export function getBindOrder() {
	return request({
		url: '/disassemele-order/operation/order/getBindOrder',
		method: 'get',
	})
}

//继续报价随机获取新的报价单
export function randomGain(data) {
	return request({
		url: '/disassemele-order/operation/order/randomGain',
		method: 'get',
		params: data,
	})
}

//去报价获取订单详情
export function offerDetail(data) {
	return request({
		url: '/disassemele-order/operation/order/offerDetail',
		method: 'get',
		params: data,
	})
}

//开始接单结束接单跳过
export function quoterOperationalRecord(data) {
	return request({
		url: '/disassemele-order/operation/order/quoterOperationalRecord',
		method: 'post',
		data,
	})
}

//提交订单
export function submitOffer(data) {
	return request({
		url: '/disassemele-order/operation/order/submitOffer',
		method: 'post',
		data,
	})
}

//去报价
export function validateOrder(data) {
	return request({
		url: '/disassemele-order/operation/order/validateOrder',
		method: 'get',
		params: data,
	})
}


//已发货订单详情
export function warehousingDetail(data) {
	return request({
		url: '/disassemele-order/operation/order/warehousingDetail',
		method: 'get',
		params: data,
	})
}
// 索要照片
export async function askPictures(data) {
	return request({
		url: '/disassemele-order/operation/order/askPictures',
		method: 'get',
		params: data,
	})
}
//查看图片
export function checkAskPictures(data) {
	return request({
		url: '/disassemele-order/operation/order/checkAskPictures',
		method: 'get',
		params: data,
	})
}
//待报价总数
export function getOperationsNumber(data) {
	return request({
		url: '/disassemele-order/operation/order/getOperationsNumber',
		method: 'get',
		params: data,
	})
}
// 审核
export async function auditOrders(data) {
	return request({
		url: '/disassemele-order/operation/order/auditOrders',
		method: 'post',
		data,
	})
}
// 审核
export async function partsShare(data) {
	return request({
		url: '/disassemele-order/share/partsShare',
		method: 'post',
		data,
	})
}