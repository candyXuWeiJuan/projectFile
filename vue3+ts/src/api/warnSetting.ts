import request from '@/utils/request'
//数据字典
export function ajaxDict(data: any) {
	return request({
		url: '/dictionary/list/type',
		method: 'get',
		params: data,
	})
}
//配置新增
export function ajaxAddPlan(data: any) {
	console.log(data)
	return request({
		url: '/alarmSchema/saveOrUpdate',
		method: 'post',
		data,
	})
}
//监测类型
export function ajaxWatchType(data: any) {
	return request({
		url: '/alarm/monitorType/list',
		method: 'get',
		params: data,
		hideLoading: true,
	})
}
//配置列表
export function ajaxPlanList(data: any) {
	return request({
		url: '/alarmSchema/query',
		method: 'get',
		params: data,
	})
}
//方案删除
export function ajaxDeletePlan(data: any) {
	return request({
		url: '/alarmSchema/delete',
		method: 'post',
		params: data,
	})
}
//规则事件分类
export function ajaxEventList(data: any) {
	console.log(data)
	return request({
		url: '/alarmType/query',
		method: 'get',
		params: data,
	})
}
//规则列表
export function ajaxRuleList(data: any) {
	return request({
		url: '/alarmSchemaRule/query',
		method: 'get',
		params: data,
	})
}
//规则新增编辑
export function ajaxRuleEdit(data: any) {
	return request({
		url: '/alarmSchemaRule/saveOrUpdate',
		method: 'post',
		data: data,
	})
}
//规则删除
export function ajaxRuledelete(data: any) {
	return request({
		url: '/alarmSchemaRule/delete',
		method: 'post',
		params: data,
	})
}
//已关联设备列表
export function ajaxRelectEquip(data: any) {
	return request({
		url: '/alarmSchema/config/associated',
		method: 'get',
		params: data,
	})
}
//未关联设备列表
export function ajaxUnrelectEquip(data: any) {
	return request({
		url: '/alarmSchema/config/notAssociated',
		method: 'get',
		params: data,
	})
}
//到关联设备
export function ajaxToRelated(data: any) {
	return request({
		url: '/alarmSchema/config/insert',
		method: 'post',
		data,
	})
}
//到未关联设备
export function ajaxToUnrelated(data: any) {
	return request({
		url: '/alarmSchema/config/delete',
		method: 'post',
		data,
	})
}
//警报消息通知列表
export function ajaxNoticeList(data: any) {
	return request({
		url: '/alarmNoticeConfig/noticeUserIdList',
		method: 'get',
		params: data,
	})
}
//警报消息通知配置保存
export function ajaxNoticeSave(data: any) {
	return request({
		url: '/alarmNoticeConfig/saveOrUpdate',
		method: 'post',
		data,
	})
}
