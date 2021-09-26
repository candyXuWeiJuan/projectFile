declare var AMap: any
declare var AMapUI: any
declare module 'lodash'
declare interface Window {
	app: any
}
declare module '*.vue' {
	import { App, defineComponent } from 'vue'
	const component: ReturnType<typeof defineComponent> & {
		install(app: App): void
	}
	export default component
}
