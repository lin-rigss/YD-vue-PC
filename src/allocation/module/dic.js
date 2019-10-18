//状态
export const status = [
	{name: '启用', value: '1', color: 'green'},
	{name: '禁用', value: '0', color: 'red'},
]

//订单状态
export const orderStatus = [
	{name: '全部', value: '', color: 'green'},
	{name: '待报价', value: '0', color: 'red'},
	{name: '已报价', value: '1', color: 'red'},
	{name: '待验货', value: '2', color: 'red'},
	{name: '已验货', value: '3', color: 'red'},
	{name: '已发货', value: '5', color: 'red'},
	// {name: '待付款', value: '5', color: 'red'},
	{name: '已完成', value: '6', color: 'red'},
	{name: '已拒绝', value: '7', color: 'red'},
	{name: '已审核', value: '8', color: 'red'},
	
]

//统货分类
export const piece = [
	{name: '精拆', value: '0', color: 'green'},
	{name: '拆废', value: '1', color: 'red'},
]

//配件单位
export const unit = [
	{cname: '套', ename: 'SET', value: '1'},
	{cname: '个', ename: 'PCS', value: '2'},
	{cname: '公斤', ename: 'Kilo', value: '3'},
]

//入库类型
export const storage = [
	{name: '采购入库', value: '1', color: 'green'},
	{name: '退货入库', value: '2', color: 'red'},
]

//品质
export const quality = [
	{name: '优质', value: '1'},
	{name: '中等', value: '2'},
	{name: '差', value: '3'},
]

//线索状态
export const clueStatus = [
	{name: '未审核', value: '0'},
	{name: '已审核', value: '1'},
	{name: '已驳回', value: '2'},
]

//物流状态
export const logisStatus = [
	{name: '已提交订单', value: '1'},
	{name: '已申请物流', value: '2'},
	{name: '已指派司机', value: '3'},
	{name: '已发货', value: '4'},
	{name: '已收货', value: '5'},
	{name: '已完成', value: '6'},
]

//出库类型
export const outbound = [
	{name: '货品出库', value: '1', color: 'green'},
	{name: '退货出库', value: '2', color: 'red'},
]

//支付类型
export const payType = [
	{name: '现金支付', value: '1', color: 'green'},
	{name: '微信支付', value: '2', color: 'red'},
	{name: '支付宝支付', value: '3', color: 'red'},
	{name: '银行转账', value: '4', color: 'red'},
	{name: '月付', value: '5', color: 'red'},
]

//支付状态
export const payStatus = [
	{name: '待支付', value: '1', color: 'green'},
	{name: '已支付', value: '2', color: 'red'},
	{name: '已取消', value: '3', color: 'red'},
	{name: '已退款', value: '4', color: 'red'},
	{name: '未支付', value: '5', color: 'red'},
]

//编码制作状态
export const codingBuyStatus = [
	{name: '已订购', value: 1, color: '#409EFF'},
	{name: '制作中', value: 2, color: '#E6A23C'},
	{name: '制作完成', value: 3, color: '#67C23A'},
	{name: '已取消', value: 4, color: '#909399'},
]

//申请编码状态
export const codingAllotStatus = [
	{name: '待分配', value: 0, color: '#E6A23C'},
	{name: '已分配', value: 1, color: '#67C23A'},
]

//是否开发票, invoice
export const invoice = [
	{name: '开发票', value: 1, color: '#67C23A'},
	{name: '不开票', value: 0, color: '#F56C6C'},
]

//开票类型, invoiceType
export const invoiceType = [
	{name: '纸质发票', value: 1, color: '#67C23A'},
	{name: '电子发票', value: 2, color: '#F56C6C'},
]

//是否, yesno
export const yesno = [
	{name: '是', value: 1, color: '#67C23A'},
	{name: '否', value: 0, color: '#F56C6C'},
]

export const colors = [
	{name: '蓝色', value: 'B', type: 'primary'},
	{name: '红色', value: 'R', type: 'danger'},
	{name: '白色', value: 'W', type: 'info'},
	{name: '绿色', value: 'G', type: 'success'},
	{name: '黄色', value: 'Y', type: 'warning'},
]



export const exp = (name, val) => {
	return eval(name).find(item => item.value === val) || {};
}

export const expval = (val, name) => {
	return eval(val).find(item => item.name === name) || {};
}

export const html = (name, val) => {
	let dt = exp(name, val);
	return `<span style="color: ${dt.color}">${dt.name}</span>`
}