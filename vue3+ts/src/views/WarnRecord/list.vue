<template>
	<Page
		title="报警记录管理"
		:searchObj="searchObj"
		:tableObj="tableObj"
		@getList="getList"
		@onSelectionChange="onSelectionChange"
	>
		<template v-slot:searchRight>
			<el-button :disabled="!selectedId.length" type="primary" @click="onBitchFix">
				批量消缺
			</el-button>
		</template>
	</Page>

	<!-- 记录详情 -->
	<Detail :visible="detailVisible" :id="detailId"></Detail>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'

import Page from '@/components/Page.vue'
import Detail from './detail.vue'
import { getRecordList, bitchEliminate, alarmTypeList } from '@/api/record'
import { dictionaryList } from '@/api/common'
import { getRecentMonth } from '@/utils/common'

export default {
	components: { Page, Detail },
	setup(prop, context) {
		const route = useRouter()
		// 搜索
		const searchObj = reactive({
			expandNum: 2, // 搜索项默认展开个数
			model: [
				{
					type: 2,
					key: 'alarmSource',
					label: '事件来源:',
					placeholder: '请选择',
					filterable: true,
					options: [],
				},
				{
					type: 2,
					key: 'alarmTypeId',
					label: '事件分类:',
					placeholder: '请选择',
					filterable: true,
					options: [],
				},
				{ type: 1, key: 'equipmentName', label: '设备名称:', placeholder: '请输入名称' },
				{ type: 1, key: 'monitorTypeName', label: '数据类型:', placeholder: '请输入名称' },
				{
					type: 3,
					key: 'date',
					label: '报警日期:',
					placeholder: '请选择日期',
					disabledDate: date => {
						return date.getTime() > Date.now()
					},
				},
			],
			data: {
				alarmSource: '',
				alarmTypeId: '',
				equipmentName: '',
				monitorTypeName: '',
				// date: [],
				date: getRecentMonth(),
			},
		})

		// 表格
		const detailVisible = ref(false)
		const detailId = ref(null)
		const tableObj = reactive({
			column: [
				{ type: 'selection' },
				{ title: '事件来源', prop: 'alarmSourceText' },
				{ title: '设备名称', prop: 'equipmentName' },
				{ title: '事件分类', prop: 'alarmTypeName' },
				{ title: '报警级别', prop: 'alarmLevelText' },
				{ title: '报警详情', prop: 'alarmInfo', showToolTip: true },
				{
					title: '处理状态',
					prop: 'processStateText',
					render: (h: Function, params: object) => {
						const { processStateText, processState } = params.row
						return [
							h('span', {
								type: 'primary',
								innerText: processStateText,
								class: processState !== 'ALARM_RECORD_SOLVE' && 'f-color--red',
							}),
						]
					},
				},
				{
					title: '操作',
					render: (h: Function, params: object) => {
						return [
							h(ElButton, {
								type: 'primary',
								innerText: '查看详情',
								class: 'table-btn',
								onClick: () => {
									const { id } = params.row
									detailId.value = id
									detailVisible.value = true
								},
							}),
						]
					},
				},
			],
			data: [],
			page: {
				pageNum: 1,
				pageSize: 20,
				total: 0,
			},

			selectable(row) {
				return row.processState !== 'ALARM_RECORD_SOLVE'
			},
		})

		// 列表
		function getList(e?: Number, hideLoading?: Boolean) {
			if (e === 1) {
				tableObj.page.pageNum = 1
			}
			const params = {
				...searchObj.data,
				pageNum: tableObj.page.pageNum,
				pageSize: tableObj.page.pageSize,
			}
			params.selectorStarAlarmDate = searchObj.data.date && searchObj.data.date[0]
			params.selectorEndAlarmDate = searchObj.data.date && searchObj.data.date[1]
			getRecordList(params, hideLoading).then(({ result }) => {
				const { list, total } = result
				tableObj.data = list
				tableObj.page.total = total
			})
		}
		getList()

		// 表格选中
		let selectedId = ref([])
		function onSelectionChange(val: Array<Object>) {
			selectedId.value = val.map(item => item.id)
		}
		// 批量消缺
		function onBitchFix() {
			ElMessageBox({
				title: '提示',
				message: '是否批量消缺选中的数据？',
				type: 'warning',
				showCancelButton: true,
			})
				.then(() => {
					const params = {
						ids: selectedId.value,
					}
					bitchEliminate(params).then(() => {
						selectedId.value = []
						getList()
						ElMessage({ type: 'success', message: '操作成功!' })
					})
				})
				.catch(() => {})
		}

		// 事件来源
		function getDictionary() {
			const params = {
				type: 'ALARM_SOURCE',
			}
			dictionaryList(params).then(({ result }) => {
				result.map(item => {
					item.value = item.value
					item.label = item.text
				})
				const eventSourceSelect = searchObj.model.find(({ key }) => key === 'alarmSource')
				eventSourceSelect.options = result
			})
		}
		// 事件分类
		function getAlarmTypeList() {
			const params = {
				needPage: false,
			}
			alarmTypeList(params).then(({ result }) => {
				const { list = [] } = result
				const selectList = list.map(({ id, alarmTypeName }) => {
					return {
						value: id,
						label: alarmTypeName,
					}
				})
				const eventSourceSelect = searchObj.model.find(({ key }) => key === 'alarmTypeId')
				eventSourceSelect.options = selectList
			})
		}
		getDictionary()
		getAlarmTypeList()

		return {
			searchObj,
			tableObj,
			getList,
			onSelectionChange,
			selectedId,
			onBitchFix,
			detailId,
			detailVisible,
		}
	},
}
</script>

<style scoped lang="scss"></style>
