export function searchObjLeft() {
	return {
		model: [
			{ type: 1, key: 'equipmentName', placeholder: '设备名称' },
			{ type: 1, key: 'supplierInfo', placeholder: '供应商' },
		],
		data: {
			equipmentName: '',
			supplierInfo: '',
		},
	}
}
export function tableObjLeft() {
	return {
		column: [
			{ type: 'selection', width: 55 },
			{ title: '设备名称', prop: 'equipmentName' },
			{ title: '采集数据', prop: 'monitorData' },
			{ title: '最新数据时间', prop: 'acquisitionTime' },
		],
		data: [],
		page: {
			pageNum: 1,
			pageSize: 10,
			total: 0,
			simple: true,
		},
	}
}
export function searchObjRight() {
	return {
		model: [
			{ type: 1, key: 'equipmentName', placeholder: '设备名称' },
			{ type: 1, key: 'supplierInfo', placeholder: '供应商' },
		],
		data: {
			equipmentName: '',
			supplierInfo: '',
		},
	}
}
export function tableObjRight() {
	return {
		column: [
			{ type: 'selection', width: 55 },
			{ title: '设备名称', prop: 'equipmentName' },
			{ title: '采集数据', prop: 'monitorData' },
			{ title: '最新数据时间', prop: 'acquisitionTime' },
		],
		data: [],
		page: {
			pageNum: 1,
			pageSize: 10,
			total: 0,
			simple: true,
		},
	}
}
