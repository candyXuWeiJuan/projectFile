import request from '@/utils/request'

// 数据字典
export function dictionaryList(data: any) {
	return request({
		url: '/dictionary/list/type',
		method: 'get',
		params: data,
	})
}
