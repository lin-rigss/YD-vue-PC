import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// const HOST = 'http://192.168.0.199:8081'
// const HOST = 'http://47.92.102.124:8081'
const HOST = 'https://server.youdi.net/router'

// create an axios instance
const service = axios.create({
	// baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	baseURL: HOST,
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000 ,// request timeout
	headers: {
		'Content-Type': 'application/json'
	},
	responseType: 'json',
	loading: true,
})

let loading;

// request interceptor
service.interceptors.request.use(
	config => {
		if(config.loading){
			loading = Loading.service({
				lock: true,
				text: '加载中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.6)'
			})
		}
		
		if (store.getters.token) {
			config.headers['token'] = getToken()
		}
		
		return config
	},
	error => {
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	
	response => {
		loading && loading.close();
		
		let res = response.data
		
		//如果返回的是文件下载流
		if(res.toString() === "[object Blob]"){
			
			let iframe = document.createElement('iframe')
			iframe.style.display = 'none'
			iframe.src = response.request.responseURL
			iframe.onload = function () {
				document.body.removeChild(iframe)
			}
			document.body.appendChild(iframe)
// 			let url = window.URL.createObjectURL(new Blob([res]))
// 			let link = document.createElement('a')
// 			link.style.display = 'none'
// 			link.href = url
// 			link.setAttribute('download', 'download.xlsx')
// 
// 			document.body.appendChild(link)
// 			link.click();
// 			link.remove();

			return Promise.resolve({
				code: 0,
				message: 'success',
			});
		}
		

		if (res.code !== 0) {
			//token失效, 需要重新登录
			if (res.code === 403) {
				MessageBox.confirm('您已经注销，您可以取消以停留在此页面，或再次登录',
					'确认注销', {
						confirmButtonText: '重新登录',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
					store.dispatch('user/resetToken').then(() => {
						location.reload()
					})
				})
				return
			}
			if(res.code === 1102) {
				return res;
			}
			if(res.code === 500 || res.code === 1101 || res.code === 1102) {
				Message({
					message: res.message,
					duration: 3 * 1000
				})
				return res;
			}
			Message({
				message: res.message || 'Error',
				type: 'error',
				duration: 5 * 1000
			})
			return Promise.reject(new Error(res.message || 'Error'))
		} else {
			return res
		}
	},
	error => {
		loading && loading.close();
		
		Message({
			message: error.message,
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error)
	}
)

export default service
