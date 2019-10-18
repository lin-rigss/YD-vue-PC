import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/api'	//api
import '@/allocation'	//allocation

import BasePage from '@/components/BasePage'
Vue.component('BasePage', BasePage)
import StatusLabel from '@/components/StatusLabel'
Vue.component('StatusLabel', StatusLabel)


import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'development') {
	mockXHR()
}

Vue.use(ElementUI, { locale })
Vue.use(preview, {
	fullscreenEl:false, //关闭全屏按钮
})

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
