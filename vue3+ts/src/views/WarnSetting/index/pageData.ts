import { ElButton } from 'element-plus'
export function searchObj() {
	return {
		model: [
			{
				type: 2,
				key: 'alarmSchemaScopeId',
				label: '应用范围:',
				placeholder: '请选择',
				options: [] as any[] & Iterable<any>,
			},
			{
				type: 2,
				key: 'alarmSchemaTypeId',
				width: 160,
				label: '方案类型:',
				placeholder: '请选择',
				filterable: true,
				options: [] as any[] & Iterable<any>,
			},
			{ type: 1, key: 'alarmSchemaName', label: '方案名称:', placeholder: '请输入方案名称' },
			{ type: 1, key: 'monitorTypeName', label: '监测类型:', placeholder: '请输入监测类型' },
		],
		data: {
			alarmSchemaScopeId: '',
			alarmSchemaTypeId: '',
			alarmSchemaName: '',
			monitorTypeName: '',
		},
	}
}
export function tableObj() {
	return {
		column: [
			{ title: '应用范围', prop: 'alarmSchemaScopeIdText' },
			{ title: '方案名称', prop: 'alarmSchemaName' },
			{ title: '方案编号', prop: 'alarmSchemaNum' },
			{ title: '方案类型', prop: 'alarmSchemaTypeIdText' },
			{ title: '监测类型', prop: 'monitorTypeName' },
			{
				title: '操作',
				width: 210,
				render: (h: Function, params: object) => {
					return [
						h(ElButton, {
							type: 'primary',
							innerText: '规则详情',
							class: 'table-btn',
							onClick: () => {
								this.setupState.detailCheck(params)
							},
						}),
						h(ElButton, {
							type: 'primary',
							innerText: '方案详情',
							class: 'table-btn',
							onClick: () => {
								this.setupState.editBtnClick(params)
							},
						}),
						h(ElButton, {
							type: 'primary',
							innerText: '删除',
							class: 'table-btn',
							onClick: () => {
								this.setupState.deleteBtnClick(params)
							},
						}),
					]
				},
			},
		],
		data: [],
		page: {
			pageNum: 1,
			pageSize: 10,
			total: 0,
		},
	}
}
