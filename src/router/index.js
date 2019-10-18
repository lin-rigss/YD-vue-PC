import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true
	},

	{
		path: '/404',
		component: () => import('@/views/404'),
		hidden: true
	},

	// 首页
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		meta: {},
		children: [{
			path: 'dashboard',
			name: 'Dashboard',
			component: () => import('@/views/dashboard/index'),
			meta: {
				title: '首页',
				icon: 'dashboard'
			}
		}]
	},
	
	// 订单管理
	{
		path: '/order',
		component: Layout,
		redirect: '/order/list',
		name: 'order',
		meta: {
			title: '订单管理',
			icon: 'order'
		},
		alwaysShow: true,
		children: [{
			path: 'quote',
			name: 'order-quote',
			component: () => import('@/views/order/quote'),
			meta: {
				title: '待报价',
				icon: 'order'
			}
		},{
			path: 'list',
			name: 'order-list',
			component: () => import('@/views/order/list'),
			meta: {
				title: '我的报价',
				icon: 'order'
			}
		},{
			path: 'quotedetail/:id',
			name: 'order-quotedetail',
			component: () => import('@/views/order/detail'),
			hidden: true,
			meta: {
				title: '待报价详情',
				icon: 'order',
				skip: true
			}
		},{
			path: 'toauditdetail/:id',
			name: 'order-toauditdetail',
			component: () => import('@/views/order/toauditdetail'),
			hidden: true,
			meta: {
				title: '待审核详情',
				icon: 'order',
				skip: true
			}
		},{
			path: 'orderInfo/:id',
			name: 'order-orderInfo',
			component: () => import('@/views/order/orderInfo'),
			hidden: true,
			meta: {
				title: '订单详情',
				icon: 'order',
				skip: true
			}
		},
		// {
		// 	path: 'toquotedList',
		// 	name: 'toquoted-list',
		// 	component: () => import('@/views/order/toquotedList'),
		// 	meta: {
		// 		title: '待报价列表',
		// 		icon: 'order'
		// 	}
		// },
		{
			path: 'quotedList',
			name: 'quoted-list',
			component: () => import('@/views/order/quotedList'),
			meta: {
				title: '已报价列表',
				icon: 'order'
			}
		},{
			path: 'toaudited',
			name: 'toaudited-list',
			component: () => import('@/views/order/toauditedList'),
			meta: {
				title: '待审核列表',
				icon: 'order'
			}
		},{
			path: 'toinspectedList',
			name: 'toinspected-list',
			component: () => import('@/views/order/toinspectedList'),
			meta: {
				title: '待验货列表',
				icon: 'order'
			}
		},{
			path: 'inspectedList',
			name: 'inspected-list',
			component: () => import('@/views/order/inspectedList'),
			meta: {
				title: '已验货列表',
				icon: 'order'
			}
		},{
			path: 'shippedList',
			name: 'shipped-list',
			component: () => import('@/views/order/shippedList'),
			meta: {
				title: '已发货列表',
				icon: 'order'
			}
		},{
			path: 'goodsReceivedList',
			name: 'goodsReceived-list',
			component: () => import('@/views/order/goodsReceived'),
			meta: {
				title: '已收货列表',
				icon: 'order'
			}
		},{
			path: 'completedList',
			name: 'completed-list',
			component: () => import('@/views/order/completedList'),
			meta: {
				title: '已完成列表',
				icon: 'order'
			}
		},{
			path: 'rejectedList',
			name: 'rejected-list',
			component: () => import('@/views/order/rejectedList'),
			meta: {
				title: '已拒绝列表',
				icon: 'order'
			}
		},]
	},
	
	// 拆解厂管理
	{
		path: '/factory',
		component: Layout,
		redirect: '/factory/list',
		name: 'factory',
		meta: {
			title: '拆解厂管理',
			icon: 'factory'
		},
		alwaysShow: true,
		children: [{
			path: 'list',
			name: 'factory-list',
			component: () => import('@/views/factory/list'),
			meta: {
				title: '拆解厂列表',
				icon: 'factory'
			}
		},{
			path: 'create',
			name: 'factory-create',
			component: () => import('@/views/factory/create'),
			hidden: true,
			meta: {
				title: '新建拆解厂',
				icon: 'factory',
				skip: true,
			}
		},{
			path: 'detail/:id',
			name: 'factory-detail',
			component: () => import('@/views/factory/detail'),
			hidden: true,
			meta: {
				title: '拆解厂详情',
				icon: 'factory',
				skip: true,
			}
		}]
	},
	// // 物流管理
	{
		path: '/logistics',
		component: Layout,
		redirect: '/logistics/list',
		name: 'logistics',
		meta: {
			title: '物流管理',
			icon: 'logistics'
		},
		alwaysShow: true,
		children: [{
			path: 'auditList',
			name: 'generalcargoAudit-list',
			component: () => import('@/views/logistics/generalcargoAudit'),
			meta: {
				title: '线索审核列表',
				icon: 'logistics'
			}
		},{
			path: 'auditdetail/:id',
			name: 'audit-detail',
			component: () => import('@/views/logistics/auditdetail'),
			hidden: true,
			meta: {
				title: '线索审核详情',
				icon: 'logistics',
				skip: true,
			}
		},{
			path: 'auditedList',
			name: 'audited-list',
			component: () => import('@/views/logistics/audited'),
			meta: {
				title: '统货订单列表',
				icon: 'logistics'
			}
		},{
			path: 'auditedDetail/:id',
			name: 'audited-detail',
			component: () => import('@/views/logistics/auditedDetail'),
			hidden: true,
			meta: {
				title: '统货订单详情',
				icon: 'logistics',
				skip: true,
			}
		},{
			path: 'ordersList',
			name: 'generalcargoOrders-list',
			component: () => import('@/views/logistics/generalcargoOrders'),
			meta: {
				title: '统货物流列表',
				icon: 'logistics'
			}
		},{
			path: 'logisticsDetail/:id',
			name: 'logistics-detail',
			component: () => import('@/views/logistics/logisticsDetail'),
			hidden: true,
			meta: {
				title: '统货物流详情',
				icon: 'logistics',
				skip: true,
			}
		},{
			path: 'logisticsReview/:id',
			name: 'logistics-review',
			component: () => import('@/views/logistics/logisticsReview'),
			hidden: true,
			meta: {
				title: '统货物流审核',
				icon: 'logistics',
				skip: true,
			}
		},{
			path: 'create',
			name: 'logistics-create',
			component: () => import('@/views/logistics/create'),
			hidden: true,
			meta: {
				title: '新建拆解厂',
				icon: 'logistics',
				skip: true,
			}
		}]
	},
	// 买家管理
	{
		path: '/purchase',
		component: Layout,
		redirect: '/purchase/list',
		name: 'purchase',
		meta: {
			title: '买家管理',
			icon: 'purchase'
		},
		alwaysShow: true,
		children: [{
			path: 'list',
			name: 'purchase-list',
			component: () => import('@/views/purchase/list'),
			meta: {
				title: '买家列表',
				icon: 'purchase'
			}
		},{
			path: 'create',
			name: 'purchase-create',
			component: () => import('@/views/purchase/create'),
			hidden: true,
			meta: {
				title: '新建买家',
				icon: 'purchase',
				skip: true,
			}
		},{
			path: 'detail/:id',
			name: 'purchase-detail',
			component: () => import('@/views/purchase/detail'),
			hidden: true,
			meta: {
				title: '买家详情',
				icon: 'purchase',
				skip: true,
			}
		}]
	},
	
	// 员工管理
	{
		path: '/employee',
		component: Layout,
		redirect: '/employee/list',
		name: 'employee',
		meta: {
			title: '员工管理',
			icon: 'user'
		},
		alwaysShow: true,
		children: [{
			path: 'list',
			name: 'employee-list',
			component: () => import('@/views/employee/list'),
			meta: {
				title: '员工列表',
				icon: 'user-list'
			}
		},{
			path: 'create',
			name: 'employee-create',
			component: () => import('@/views/employee/create'),
			hidden: true,
			meta: {
				title: '创建新用户',
				icon: 'user',
				skip: true,
			}
		},{
			path: 'detail/:id',
			name: 'employee-detail',
			component: () => import('@/views/employee/detail'),
			hidden: true,
			meta: {
				title: '用户详情',
				icon: 'user',
				skip: true,
			}
		}]
	},
	
	// 编码管理
	{
		path: '/coding',
		component: Layout,
		redirect: '/coding/list',
		name: 'coding',
		meta: {
			title: '编码管理',
			icon: 'user'
		},
		alwaysShow: true,
		children: [{
			path: 'buy',
			name: 'coding-buy',
			component: () => import('@/views/coding/buy'),
			meta: {
				title: '订购编码',
				icon: 'user-list'
			}
		}, {
			path: 'allot',
			name: 'coding-allot',
			component: () => import('@/views/coding/allot'),
			meta: {
				title: '申请编码列表',
				icon: 'user-list'
			}
		}]
	},
	
	// 零配件管理
	{
		path: '/spare-parts',
		component: Layout,
		redirect: '/spare-parts/parts',
		name: 'parts',
		meta: {
			title: '零配件管理',
			icon: 'parts'
		},
		alwaysShow: true,
		children: [{
			path: 'parts',
			name: 'parts-list',
			component: () => import('@/views/spare-parts/parts'),
			meta: {
				title: '严选列表',
				icon: 'parts'
			}
		},{
			path: 'generalCargo',
			name: 'generalCargo-list',
			component: () => import('@/views/spare-parts/generalCargo'),
			meta: {
				title: '统货列表',
				icon: 'parts'
			}
		},{
			path: 'unifiedParts/:id',
			name: 'unifiedParts-list',
			component: () => import('@/views/spare-parts/unifiedParts'),
			hidden: true,
			meta: {
				title: '统货零件',
				icon: 'parts',
				skip: true,
			}
		},{
			path: 'engine',
			name: 'engine-list',
			component: () => import('@/views/spare-parts/engine'),
			meta: {
				title: '发动机厂商管理',
				icon: 'parts'
			}
		},{
			path: 'detail/:id',
			name: 'engine-detail',
			component: () => import('@/views/spare-parts/detail'),
			hidden: true,
			meta: {
				title: '发动机详情',
				icon: 'parts',
				skip: true,
			}
		},{
			path: 'create',
			name: 'engine-create',
			component: () => import('@/views/spare-parts/create'),
			hidden: true,
			meta: {
				title: '发动机详情',
				icon: 'parts',
				skip: true,
			}
		},{
			path: 'spare/:id',
			name: 'spare-list',
			component: () => import('@/views/spare-parts/spare'),
			hidden: true,
			meta: {
				title: '零件列表',
				icon: 'parts',
				skip: true,
			}
		},{
			path: 'sparePiece/:id',
			name: 'sparePiece-list',
			component: () => import('@/views/spare-parts/sparePiece'),
			hidden: true,
			meta: {
				title: '零件列表',
				icon: 'parts',
				skip: true,
			}
		}]
	},
	
	// 权限管理
	{
		path: '/user',
		component: Layout,
		redirect: '/user/list',
		name: 'user',
		meta: {
			title: '权限管理',
			icon: 'user-permissions'
		},
		alwaysShow: true,
		children: [{
			path: 'role',
			name: 'user-role',
			component: () => import('@/views/role/list'),
			meta: {
				title: '部门角色管理',
				icon: 'role'
			}
		},{
			path: 'permissions',
			name: 'user-permissions',
			component: () => import('@/views/permissions/list'),
			meta: {
				title: '权限列表',
				icon: 'permissions'
			}
		}]
	},
	
	// 仓库管理
	{
		path: '/warehouse',
		component: Layout,
		redirect: '/warehouse/index',
		name: 'warehouse',
		meta: {
			title: '仓库',
			icon: 'warehouse'
		},
		alwaysShow: true,
		children: [{
			path: 'index',
			name: 'warehouse-index',
			component: () => import('@/views/warehouse/index'),
			meta: {
				title: '仓库管理',
				icon: 'warehouse-list'
			}
		},
		// {
		// 	path: 'block',
		// 	name: 'warehouse-block',
		// 	component: () => import('@/views/warehouse/block'),
		// 	meta: {
		// 		title: '大仓管理',
		// 		icon: 'role'
		// 	}
		// },
		{
			path: 'partition/:id',
			name: 'warehouse-partition',
			component: () => import('@/views/warehouse/partition'),
			hidden: true,
			meta: {
				title: '区域管理',
				icon: 'role'
			}
		},{
			path: 'shelves/:pid/:id',
			name: 'warehouse-shelves',
			component: () => import('@/views/warehouse/shelves'),
			hidden: true,
			meta: {
				title: '货架管理',
				icon: 'role'
			}
		}]
	},
	
	
	// 库存
	{
		path: '/inventory',
		component: Layout,
		redirect: '/inventory/list',
		name: 'inventory',
		meta: {
			title: '库存',
			icon: 'inventory'
		},
		alwaysShow: true,
		children: [{
			path: 'spare-parts',
			name: 'inventory-spare-parts',
			component: () => import('@/views/inventory/spare-parts'),
			meta: {
				title: '库存列表(零配件)',
				icon: 'inventory-parts'
			}
		},{
			path: 'brand',
			name: 'inventory-brand',
			component: () => import('@/views/inventory/brand'),
			meta: {
				title: '库存列表(品牌)',
				icon: 'inventory-brand'
			}
		},{
			path: 'list-goods',
			name: 'inventory-list-goods',
			component: () => import('@/views/inventory/list-goods'),
			meta: {
				title: '库存详情(严选)',
				icon: 'inventory-detail'
			}
		},{
			path: 'list-heap',
			name: 'inventory-list-heap',
			component: () => import('@/views/inventory/list-heap'),
			meta: {
				title: '库存详情(统货)',
				icon: 'inventory-detail'
			}
		},{
			path: 'listInfoDetail',
			name: 'inventory-listInfoDetail',
			component: () => import('@/views/inventory/heap-info-detail'),
			hidden: true,
			meta: {
				title: '统货库存零件详情',
				icon: 'inventory-detail',
				skip: true
			}
		},{
			path: 'listInfo/:id',
			name: 'inventory-listInfo',
			component: () => import('@/views/inventory/listInfo'),
			hidden: true,
			meta: {
				title: '库存零件详情',
				icon: 'inventory-detail',
				skip: true
			}
		},{
			path: 'create',
			name: 'inventory-create',
			component: () => import('@/views/inventory/create'),
			hidden: true,
			meta: {
				title: '新增入库单',
				icon: 'inventory-create',
				skip: true,
			}
		},{
			path: 'put',
			name: 'inventory-put',
			component: () => import('@/views/inventory/put'),
			meta: {
				title: '入库明细',
				icon: 'inventory-put'
			}
		},{
			path: 'put-info/:id',
			name: 'inventory-put-info',
			component: () => import('@/views/inventory/put-info'),
			hidden: true,
			meta: {
				title: '入库明细详情',
				icon: 'inventory-put',
				skip: true,
			}
		},{
			path: 'outbound',
			name: 'inventory-outbound',
			component: () => import('@/views/inventory/outbound'),
			meta: {
				title: '新增出库单(严选)',
				icon: 'inventory-outbound'
			}
		},{
			path: 'outbound-heap',
			name: 'inventory-outboundHeap',
			component: () => import('@/views/inventory/outbound-heap'),
			meta: {
				title: '新增出库单(统货)',
				icon: 'inventory-outbound'
			}
		},{
			path: 'out',
			name: 'inventory-out',
			component: () => import('@/views/inventory/out'),
			meta: {
				title: '出库明细(严选)',
				icon: 'inventory-out'
			}
		},{
			path: 'out-heap',
			name: 'inventory-outHeap',
			component: () => import('@/views/inventory/out-heap'),
			meta: {
				title: '出库明细(统货)',
				icon: 'inventory-out'
			}
		},{
			path: 'out-info/:id',
			name: 'inventory-out-info',
			component: () => import('@/views/inventory/out-info'),
			hidden: true,
			meta: {
				title: '出库明细详情',
				icon: 'inventory-out',
				skip: true,
			}
		},{
			path: 'report',
			name: 'inventory-report',
			component: () => import('@/views/inventory/report'),
			meta: {
				title: '报表',
				icon: 'report'
			}
		}]
	},

// 	{
// 		path: '/nested',
// 		component: Layout,
// 		redirect: '/nested/menu1',
// 		name: 'Nested',
// 		meta: {
// 			title: 'Nested',
// 			icon: 'nested'
// 		},
// 		children: [{
// 				path: 'menu1',
// 				component: () => import('@/views/nested/menu1/index'), // Parent router-view
// 				name: 'Menu1',
// 				meta: {
// 					title: 'Menu1'
// 				},
// 				children: [{
// 						path: 'menu1-1',
// 						component: () => import('@/views/nested/menu1/menu1-1'),
// 						name: 'Menu1-1',
// 						meta: {
// 							title: 'Menu1-1'
// 						}
// 					},
// 					{
// 						path: 'menu1-2',
// 						component: () => import('@/views/nested/menu1/menu1-2'),
// 						name: 'Menu1-2',
// 						meta: {
// 							title: 'Menu1-2'
// 						},
// 						children: [{
// 								path: 'menu1-2-1',
// 								component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
// 								name: 'Menu1-2-1',
// 								meta: {
// 									title: 'Menu1-2-1'
// 								}
// 							},
// 							{
// 								path: 'menu1-2-2',
// 								component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
// 								name: 'Menu1-2-2',
// 								meta: {
// 									title: 'Menu1-2-2'
// 								}
// 							}
// 						]
// 					},
// 					{
// 						path: 'menu1-3',
// 						component: () => import('@/views/nested/menu1/menu1-3'),
// 						name: 'Menu1-3',
// 						meta: {
// 							title: 'Menu1-3'
// 						}
// 					}
// 				]
// 			},
// 			{
// 				path: 'menu2',
// 				component: () => import('@/views/nested/menu2/index'),
// 				meta: {
// 					title: 'menu2'
// 				}
// 			}
// 		]
// 	},
// 
// 	{
// 		path: 'external-link',
// 		component: Layout,
// 		children: [{
// 			path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
// 			meta: {
// 				title: 'External Link',
// 				icon: 'link'
// 			}
// 		}]
// 	},

	// 404 page must be placed at the end !!!
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

const createRouter = () => new Router({
	mode: 'hash',
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}



// import MenuUtils from './menuUtils'
// let data = JSON.parse(window.sessionStorage.getItem('menuInfo'))
// if (data) {
// 	//这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以需要重新add一次
// 	// 或者通过vuex保存菜单，重新赋值  这里不做说明
// 	let routes = [];
// 	MenuUtils(routes, data);
// 	router.addRoutes(routes);
// 	window.sessionStorage.removeItem('isLoadNodes');
// }


export default router
