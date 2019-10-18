import defaultSettings from '@/settings'

const {
	showSettings,
	fixedHeader,
	sidebarLogo,
	
	loginTitle,
	loginTips,
	logoTitle,
	logoSrc,
	
	footer,
	root,
	
} = defaultSettings

const state = {
	showSettings: showSettings,
	fixedHeader: fixedHeader,
	sidebarLogo: sidebarLogo,
	
	loginTitle,
	loginTips,
	logoTitle,
	logoSrc,
	
	footer,
	root,
	
	config: {
		size: 'medium',
		align: 'center',
		hidden: true,//表格内容过长是是否隐藏
		sizes: [10, 20, 30, 40],
	}
}

const mutations = {
	CHANGE_SETTING: (state, { key, value }) => {
		if (state.hasOwnProperty(key)) {
			state[key] = value
		}
	}
}

const actions = {
	changeSetting({ commit }, data) {
		commit('CHANGE_SETTING', data)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
