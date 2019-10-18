import request from '@/utils/request'
//线索表
export function getList(data) {
	return request({
		url: '/disassemele-order/clue/operate/list',
		method: 'get',
		params: data,
	})
}
//详情
export function operateDetail(data) {
	return request({
		url: '/disassemele-order/clue/operate/detail',
		method: 'get',
		params: data,
	})
}

//审核
export function operateCheck(data) {
	return request({
		url: '/disassemele-order/clue/operate/check',
		method: 'post',
		data,
	})
}
//订单表
export function orderList(data) {
	return request({
		url: '/disassemele-order/clue/order/list',
		method: 'get',
		params: data,
	})
}
//订单详情
export function orderDetail(data) {
	return request({
		url: '/disassemele-order/clue/order/detail',
		method: 'get',
		params: data,
	})
}
//物流表
export function logisticsList(data) {
	return request({
		url: '/disassemele-order/clue/logistics/operate/list',
		method: 'get',
		params: data,
	})
}
//添加派车
export function sendCar(data) {
	return request({
		url: '/disassemele-order/clueCar/send/car',
		method: 'post',
		data,
	})
}
//添加派车的详情
export function sendDetail(data) {
	return request({
		url: '/disassemele-order/clueCar/send/detail',
		method: 'get',
		params: data,
	})
}
//司机列表
export function paramList(data) {
	return request({
		url: '/disassemele-order/driver/paramList',
		method: 'get',
		params: data,
	})
}
//库存详情统货订单详情
export function confirmShipmentDetail(data) {
	return request({
		url: '/disassemele-order/clue/order/confirmShipmentDetail',
		method: 'get',
		params: data,
	})
}