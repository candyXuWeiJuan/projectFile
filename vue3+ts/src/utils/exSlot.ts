// 表格列使用render函数输出
type renderScope = {
	row?: Object
	index?: Number
	column?: Object
	render?: Function
	columnRender?: Function
}
import { h } from 'vue'
export default {
	props: {
		row: Object,
		render: Function,
		columnRender: Function,
		index: Number,
		column: {
			type: Object,
			default: null,
		},
	},
	render: (data: renderScope) => {
		const params: renderScope = {}
		if (data.row) params.row = data.row
		if (data.index) params.index = data.index
		if (data.column) params.column = data.column
		if (data.render) return data.render(h, params)
		if (data.columnRender) return data.columnRender(h, params)
	},
}
