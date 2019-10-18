const getters = {
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	info: state => state.user.info,
	menus: state => state.user.menus,
	routes: state => state.user.routes,
	name: state => state.user.name,
	config: state => state.settings.config,
	count: state => state.app.sidebar.unquotedCount,
	check: state => state.app.sidebar.unchecked,
	
}
export default getters
