/**
 * 把数字转换为用逗号分隔的字符串
 */
export const formatNumber = (number, point = 0) => {
	if (number != null) {
		return number.toFixed(point).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	} else {
		return;
	}
}


/**
 * 删除嵌套结构下的空数组
 */
export const delEmptyChildren = (arr, children = 'children') => {
	arr.forEach(item => {
		arr = item[children];
		if (arr) {
			if (arr.length === 0) {
				delete item[children];
			} else {
				delEmptyChildren(arr);
			}
		}
	})
}

/**
 * 判断是否为空
 */
export const isEmpty = (v) => {
	switch (typeof v) {
		case 'undefined':
			return true;
		case 'string':
			if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			break;
		case 'boolean':
			if (!v) return true;
			break;
		case 'number':
			if (0 === v || isNaN(v)) return true;
			break;
		case 'object':
			if (null === v || v.length === 0) return true;
			for (let i in v) {
				return false;
			}
			return true;
	}
	return false;
}


