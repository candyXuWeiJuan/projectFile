import request from '@/utils/request'

// 记录列表
export function getRecordList(data: any, hideLoading: Boolean) {
	return request({
		url: '/alarm/record/list',
		method: 'get',
		params: data,
		hideLoading,
	})
}

// 记录详情
export function getRecordDetail(data: any) {
	return request({
		url: '/alarm/record/id',
		method: 'get',
		params: data,
	})
}

// 批量消缺
export function bitchEliminate(data: any) {
	return request({
		url: '/alarm/record/eliminate',
		method: 'post',
		data,
	})
}

// 规则列表
export function alarmSchemaRule(data: any) {
	return request({
		url: '/alarmSchemaRule/query',
		method: 'get',
		params: data,
	})
}

// 工单详情
export function workOrder(data: any) {
	return request({
		url: '/trigger/workOrder/queryWoDetailById',
		method: 'get',
		params: data,
	})
}

// 创建工单
export function createOrder(data: any) {
	return request({
		url: '/trigger/workOrder/create/alarmRecordId',
		method: 'post',
		data,
	})
}

// 当日检测数据
export function monitorData(data: any) {
	return request({
		url: '/equipment/monitorData/his',
		method: 'get',
		params: data,
	})
}

// 事件分类
export function alarmTypeList(data: any) {
	return request({
		url: '/alarmType/query',
		method: 'get',
		params: data,
	})
}
