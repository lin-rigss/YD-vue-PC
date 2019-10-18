// 引入注册路由方法
import loadingRoutes from './loadingRoutes'

export default (routers, data) => {
	//转换服务端菜单数据，拿到自己想要的字段，比如这里的路由路径component (或者其他的key)
	generaMenu(routers, data)
}

function generaMenu(routers, data) {
	if (data) {
		data.forEach((item) => {
			//这里在和后台规定如果是按钮权限component字段为'/' ，权限按钮为弹出框,没有路由
			if (item.path == "/") {
				return false;
			}
			let menu = Object.assign({}, item);
			if (menu.component == "home") {
				menu.component = require("@/views/dashboard");
				menu = Object.assign({
					redirect: item.children ? item.children[0].path : "/main"
				}, menu);
			} else {
				// 注册加载相应路由
				menu.component = loadingRoutes(menu.component)
			}
			//有子菜单
			if (item.leaf == "true") {
				menu.children = [];
				generaMenu(menu.children, item.children)
			}
			// 将菜单push进路由
			routers.push(menu)
		})
	}
}
