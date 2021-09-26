import { createStore } from 'vuex'
import lodash from 'lodash'

export default createStore({
	state: {
		loadingCount: 0,
	},
	mutations: {
		loadingStart(state) {
			state.loadingCount++
		},
		loadingEnd(state) {
			lodash.debounce(() => {
				state.loadingCount--
			}, 50)()
		},
	},
	getters: {
		needLoading(state) {
			return state.loadingCount > 0
		},
	},
})
