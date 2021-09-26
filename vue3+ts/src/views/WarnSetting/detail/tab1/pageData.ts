import { ElButton } from 'element-plus'
export function tableObj() {
	let column = [
		{ title: '生效日期', prop: 'attriDate' },
		{ title: '生效时间', prop: 'attriTime' },
		{ title: '报警级别', prop: 'warnLevelText' },
		{ title: '数据范围', prop: 'areaType' },
		{ title: '事件类型', prop: 'alarmTypeIdText' },
		{ title: '是否发起工单', width: 120, prop: 'isAutoInitWorkOrderText' },
		{
			title: '操作',
			width: 240,
			columnRender: h => {
				return [
					h(
						'div',
						{
							style: { cursor: 'pointer' },
							onClick: () => {
								this.setupState.addRuleBtnClick()
							},
						},
						[
							h('span', {}, '操作('),
							h('span', { style: { color: 'blue' } }, '+'),
							h('span', {}, ')'),
						],
					),
				]
			},
			render: (h: Function, params: { row: any }) => {
				return [
					h(ElButton, {
						type: 'primary',
						innerText: '消息通知配置',
						class: 'table-btn',
						onClick: () => {
							this.setupState.detailCheck(params.row)
						},
					}),
					h(ElButton, {
						type: 'primary',
						innerText: '规则详情',
						class: 'table-btn',
						onClick: () => {
							this.setupState.editBtnClick(params.row)
						},
					}),
					h(ElButton, {
						type: 'primary',
						innerText: '删除',
						class: 'table-btn',
						onClick: () => {
							this.setupState.deleteBtnClick(params.row)
						},
					}),
				]
			},
		},
	]
	return column
}
