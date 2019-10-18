
var TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;

let validateTel = (rule, value, callback) => {

	if (!TEL_REGEXP.test(value)) {

	callback(new Error('请输入正确的手机号'))

	} else {

	callback()

	}

}
export const parts = {
	nameZn: [
		{ required: true, message: '请输入', trigger: 'blur' },
		// { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
	],
	// nameEn: [
	// 	{ required: true, message: '请输入英文名称', trigger: 'blur' },
	// 	// { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }÷
	// ],
	unit: [
		{ required: true, message: '请选择单位', trigger: 'change' },
	],
	status: [
		{ required: true, message: '请选是否启用', trigger: 'blur' },
	]
}

export const engine = {
	oilyType: [
		{ required: true, message: '请选择油质种类', trigger: 'change' },
	],
	textureType: [
		{ required: true, message: '请选择材质种类', trigger: 'change' },
	],
	brand: [
		{ required: true, message: '请输入品牌', trigger: 'blur' },
		// { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
	],
	model: [
		{ required: true, message: '请输入型号', trigger: 'blur' },
		// { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }÷
	],
	atOrMt: [
		{ required: true, message: '请选择AT/MT', trigger: 'change' },
	],
}

export const factory = {
	account: [
		{ required: true, validator: validateTel, trigger: 'blur' },
	],
	'extendProperty.comName': [
		{ required: true, message: '请输入企业名称', trigger: 'blur' },
		// { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }ß
	],
	'extendProperty.comDesc': [
		{ required: true, message: '请输入企业描述', trigger: 'blur' },
		{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
	],
	'extendProperty.comAddress': [
		{ required: true, message: '请输入企业地址', trigger: 'blur' },
		{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
	],
	'extendProperty.comConcat': [
		{ required: true, message: '请输入企业联系人', trigger: 'blur' },
		{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
	],
	'extendProperty.comPhone': [
		{ required: true, message: '请输入企业联系方式', trigger: 'blur' },
		{ min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
	],
	'extendProperty.agent': [
		{ required: true, message: '请选择开发负责人', trigger: 'change' },
	],
	'extendProperty.salesman': [
		{ required: true, message: '请选择业务负责人', trigger: 'change' },
	]
}




export const purchase = {
	'extendProperty.comName': [
		{ required: true, message: '请输入买家姓名', trigger: 'blur' },
		// { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }ß
	],
	'extendProperty.comDesc': [
		{ required: true, message: '请输入买家描述', trigger: 'blur' },
		{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
	],
	'extendProperty.comAddress': [
		{ required: true, message: '请输入买家地址', trigger: 'blur' },
		{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
	],
	'extendProperty.comConcat': [
		{ required: true,  message: '请输入买家联系人', trigger: 'blur' },
	],
	'extendProperty.comPhone': [
		{ required: true, validator: validateTel, trigger: 'blur' },
	],
}

export const user = {
	account: [
		// { required: true, validator: validateTel, trigger: 'blur' },
	],
	'extendProperty.name': [
		{ required: true, message: '请输入员工姓名', trigger: 'blur' },
		{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
	],
	mobile: [
		{ required: true, validator: validateTel, trigger: 'blur' },
	],
	'extendProperty.email': [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
	],
	'extendProperty.department': [
		{ required: true, message: '请选择部门', trigger: 'blur' },
	],
	'extendProperty.role': [
		{ required: true, message: '请选择角色', trigger: 'blur' },
	]
}

export const role = {
	name: [
		{ required: true, message: '名称不能为空', trigger: 'blur' },
		{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
	],
	status: [
		{ required: true, message: '请选择状态', trigger: 'change' },
	]
}

export const warehouse = {
	name: [
		{ required: true, message: '名称不能为空', trigger: 'blur' },
		{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
	],
	remarks: [
		{ required: true, message: '备注不能为空', trigger: 'blur' },
		{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
	],
	status: [
		{ required: true, message: '请选择状态', trigger: 'change' },
	]
}

export const inventory = {
	
}

export const coding = {
	address: [
		{ required: true, message: '请输入收货地址', trigger: 'blur' },
	],
	applyUserName: [
		{ required: true, message: '请输入联系人姓名', trigger: 'blur' },
	],
	applyCell: [
		{ required: true, message: '请输入联系人手机号码', trigger: 'blur' },
	],
	price: [
		{ required: true, message: '请输入单价', trigger: 'blur' },
		{ validator: (rule, value, callback) => {
			let v = value - 0;
			if(isNaN(v) || v <= 0){
				callback(new Error('单价必须大于0'));
			}else{
				callback();
			}
		}, trigger: 'blur', required: true },
	],
	totalAmount: [
		{ required: true, message: '请输入总价', trigger: 'blur' },
		{ validator: (rule, value, callback) => {
			let v = value - 0;
			if(isNaN(v) || v <= 0){
				callback(new Error('总价必须大于0'));
			}else{
				callback();
			}
		}, trigger: 'blur', required: true },
	],
	
}