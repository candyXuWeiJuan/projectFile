import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
export const routes: Array<RouteRecordRaw> = [
	{ path: '/', name: 'page', component: () => import('@/views/Nav.vue') },
	{
		path: '/WarnSetting',
		name: 'WarnSetting',
		component: () => import('@/views/WarnSetting/index.vue'),
		meta: {
			title: '报警方案配置',
		},
	},
	{
		path: '/WarnRecord',
		name: 'WarnRecord',
		component: () => import('@/views/WarnRecord/list.vue'),
		meta: {
			title: '报警记录管理',
		},
	},
	{
		path: '/WaterModel',
		name: 'WaterModel',
		component: () => import('@/views/WaterModel/index.vue'),
		meta: {
			title: '调度水力模型',
		},
	},
]
const router: Router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL), // history模式
	routes,
})
export default router
