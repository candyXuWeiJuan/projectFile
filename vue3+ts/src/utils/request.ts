import { ElMessage } from 'element-plus'
import store from '@/vuex/store'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
type extendType = { hideLoading?: Boolean }
type AxiosRequestConfigNew = AxiosRequestConfig & extendType
type baseUrl = string | undefined
const service = axios.create({
	baseURL: <baseUrl>import.meta.env.VITE_APP_BASE_API, // api 的 base_url
	timeout: 15000, // request timeout
})

// 请求拦截
service.interceptors.request.use(
	(config: AxiosRequestConfigNew): AxiosRequestConfig => {
		if (!config.hideLoading) {
			store.commit('loadingStart')
		}
		return config
	},
	error => {
		return Promise.reject(error)
	},
)

// 响应拦截
service.interceptors.response.use(
	(res: AxiosResponse) => {
		if (!(res.config as AxiosRequestConfigNew).hideLoading) {
			store.commit('loadingEnd')
		}
		const { responseCode, message } = res.data
		if (responseCode !== '100000') {
			ElMessage.error(message)
			return Promise.reject(res.data)
		} else {
			return Promise.resolve(res.data)
		}
	},
	error => {
		ElMessage.error(`服务器异常：${error}`)
		store.commit('loadingEnd')
		return Promise.reject(error)
	},
)
export default service
