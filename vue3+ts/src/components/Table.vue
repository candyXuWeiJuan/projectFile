<template>
	<el-table
		:data="tableData"
		@selection-change="onSelectionChange"
		border
		class="page-table"
		header-row-class-name="table-header"
	>
		<el-table-column
			v-for="(item, index) in column"
			:key="index"
			:prop="item.prop"
			:label="item.title"
			:width="item.width"
		>
			<template #header="scope">
				<ex-slot
					v-if="item.columnRender"
					:render="item.columnRender"
					:column="item"
				></ex-slot>
				<span v-else>{{ scope.column.label }}</span>
			</template>
			<template #default="scope">
				<ex-slot
					v-if="item.render"
					:render="item.render"
					:row="scope.row"
					:index="scope.$index"
					:column="item"
				></ex-slot>
				<span v-else>{{ scope.row[item.prop] || '-' }}</span>
			</template>
		</el-table-column>
	</el-table>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
type renderScope = {
	row?: Object
	index?: Number
	column?: Object
	render?: Function
	columnRender?: Function
}
const exSlot = {
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
export default defineComponent({
	name: 'Table',
	props: {
		column: Array,
		tableData: Array
	},
	components: {
		exSlot,
	},
	emit: ['onSelectionChange'],
	setup(props, { emit }) {
		const onSelectionChange = item => {
			emit('onSelectionChange', item)
		}
		return {
			onSelectionChange,
		}
	},
})
</script>

<style lang="scss" scoped>
.page-table {
	height: 100%;
}
</style>
