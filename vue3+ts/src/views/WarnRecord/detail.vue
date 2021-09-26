<template>
	<!-- 页面标题 -->
	<el-dialog v-model="visible" fullscreen destroy-on-close :show-close="false">
		<template #title>
			<Header title="报警记录详情" back hideBlock @onBack="onClose"></Header>
		</template>
		<div class="detail-wrap">
			<div class="detail-top">
				<div class="detail-top__left">
					<!-- 信息 -->
					<el-descriptions :column="2" border class="info-base">
						<el-descriptions-item
							v-for="(item, index) in baseColumn"
							:key="index"
							:label="item.label"
							:span="item.span"
							:className="item.className"
						>
							{{ baseInfo[item.key] || '-' }}
						</el-descriptions-item>
					</el-descriptions>

					<!-- 处理按钮 -->
					<div class="btn-wrap">
						<el-button
							v-if="
								['ALARM_RECORD_UNPROCESSED', 'ALARM_RECORD_PROCESSING'].includes(
									baseInfo.processState,
								)
							"
							type="danger"
							@click="onFix"
						>
							告警消缺
						</el-button>
						<el-button
							v-if="baseInfo.processState === 'ALARM_RECORD_SOLVE'"
							type="success"
							icon="el-icon-check"
							class="btn-static"
						>
							已消缺
						</el-button>

						<el-button
							v-if="baseInfo.workOrderId"
							type="success"
							icon="el-icon-check"
							class="btn-static"
						>
							已建工单
						</el-button>
						<el-button
							v-if="
								baseInfo.processState !== 'ALARM_RECORD_SOLVE' &&
								!baseInfo.workOrderId
							"
							type="primary"
							@click="onCreateOrder"
						>
							创建工单
						</el-button>
					</div>
				</div>

				<!-- 当日监测数据 -->
				<div class="detail-top__right">
					<p class="chart-title">当天数据监测</p>

					<!-- 此处不能用v-show,因为echart设置了display:none，则宽度不能自适应 -->
					<div id="myChart" class="chart"></div>

					<el-empty v-show="!isChartData">
						<el-button type="text" @click="getMonitorData">刷新</el-button>
					</el-empty>
				</div>
			</div>

			<div class="detail-bottom">
				<!-- 方案规则 -->
				<Table
					:column="ruleTable.column"
					:data="ruleTable.data"
					:rowClassName="ruleTable.rowClassName"
					:cellClassName="ruleTable.cellClassName"
					class="detail-bottom__left"
				></Table>

				<!-- 工单详情 -->
				<el-descriptions
					v-if="baseInfo.workOrderId"
					title="工单详情"
					:column="2"
					border
					class="detail-bottom__right"
				>
					<el-descriptions-item
						v-for="(item, index) in orderColumn"
						:key="index"
						:label="item.label"
						:span="item.span"
					>
						{{ orderInfo[item.key] }}
					</el-descriptions-item>
				</el-descriptions>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

import {
	alarmSchemaRule,
	workOrder,
	createOrder,
	monitorData,
	bitchEliminate,
	getRecordDetail,
} from '@/api/record'
import { getCurrentDate } from '@/utils/common'

export default {
	name: 'RecordDetail',
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		id: {
			type: Number,
			default: null,
		},
	},
	setup(props, { emit }) {
		// 基础信息
		const baseInfo = ref({})
		const baseColumn = reactive([
			{ label: '事件来源', key: 'alarmSourceText' },
			{ label: '设备名称', key: 'equipmentName' },
			{ label: '设备位置', key: 'position' },
			{ label: '事件分类', key: 'alarmTypeName', className: 'warning-row' },
			{ label: '警报级别', key: 'alarmLevelText' },
			{ label: '采集数据类型', key: 'monitorTypeName' },
			{ label: '报警次数', key: 'alarmTimes' },
			{ label: '报警值', key: 'monitorData' },
			{ label: '报警开始时间', key: 'alarmBeginTime' },
			{ label: '报警结束时间', key: 'alarmEndTime' },
			{ label: '报警详情', key: 'alarmInfo', span: 2 },
			{ label: '处理状态', key: 'processStateText' },
			{ label: '处理人', key: 'processUserName' },
			{ label: '处理时间', key: 'processTime' },
			{ label: '处理结果', key: 'processResult' },
		])
		function getDetail() {
			const params = {
				id: props.id,
			}
			getRecordDetail(params).then(({ result }) => {
				baseInfo.value = result
				getRule()
				getMonitorData()
				if (baseInfo.value.workOrderId) {
					getWorkOrder()
				}
			})
		}
		watch(
			() => props.visible,
			val => {
				if (val) getDetail()
			},
		)

		// 方案规则
		const ruleTable = reactive({
			column: [
				{
					title: '生效日期',
					prop: 'date',
					render: (h, params) => {
						return [
							h('span', {
								innerText: `${params.row.startDate}~${params.row.endDate}`,
							}),
						]
					},
				},
				{
					title: '生效时间',
					prop: 'time',
					render: (h, params) => {
						return [
							h('span', {
								innerText: `${params.row.startTime}~${params.row.endTime}`,
							}),
						]
					},
				},
				{ title: '报警级别', prop: 'alarmLevelText' },
				{
					title: '数据范围',
					prop: 'lowerValue',
					render: (h, params) => {
						return [
							h('span', {
								innerText: `[${params.row.lowerValue}~${params.row.upperValue})`,
							}),
						]
					},
				},
				{ title: '事件类型', prop: 'alarmTypeName' },
				{
					title: '是否发起工单',
					prop: 'isAutoInitWorkOrder',
					render: (h, params) => {
						return [
							h('span', {
								innerText: params.row.isAutoInitWorkOrder ? '是' : '否',
							}),
						]
					},
				},
			],
			data: [],
			rowClassName: ({ row }) => {
				if (row.id === baseInfo.value.alarmSchemaRuleId) return 'warning-row'
			},
			cellClassName: ({ row, column }) => {
				if (row.isAutoInitWorkOrder && column.property === 'isAutoInitWorkOrder')
					return 'cell-red'
			},
		})
		function getRule() {
			const params = {
				alarmSchemaId: baseInfo.value.alarmSchemaId,
			}
			alarmSchemaRule(params).then(({ result }) => {
				ruleTable.data = result
			})
		}

		// 工单信息
		let orderInfo = ref({})
		const orderColumn = reactive([
			{ label: '工单说明', key: 'typeName', span: 2 },
			{ label: '工单状态', key: 'statusStr' },
			{ label: '处理人', key: 'userName' },
			{ label: '处理说明', key: 'content', span: 2 },
			{ label: '处理时间', key: 'createTime' },
		])
		function getWorkOrder() {
			const params = { woId: baseInfo.value.workOrderId }
			workOrder(params).then(({ result }) => {
				orderInfo.value = result.result
			})
		}

		// 创建工单
		function onCreateOrder() {
			ElMessageBox.prompt('请输入描述内容', '创建工单', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputType: 'textarea',
				inputValidator: value => {
					if (!value || value.length > 150) return false
				},
				inputErrorMessage: '内容必填，最多输入150个字符',
			})
				.then(({ value }) => {
					const params = new FormData()
					params.append('id', props.id)
					params.append('msg', value)
					createOrder(params).then(() => {
						getDetail()
						ElMessage({ type: 'success', message: '创建成功!' })
					})
				})
				.catch(() => {})
		}

		// 告警消缺
		function onFix() {
			ElMessageBox.prompt('请输入备注', '告警消缺', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputType: 'textarea',
				inputValidator: value => {
					if (!value || value.length > 150) return false
				},
				inputErrorMessage: '内容必填，最多输入150个字符',
			})
				.then(({ value }) => {
					const params = {
						ids: [props.id],
						processResult: value,
					}
					bitchEliminate(params).then(() => {
						getDetail()
						ElMessage({ type: 'success', message: '操作成功!' })
					})
				})
				.catch(() => {})
		}

		// 当天数据监测
		const isChartData = ref(false)
		let chartLine = ''
		function onChartInit(data) {
			if (chartLine) {
				chartLine = echarts.init(document.getElementById('myChart')).dispose()
			}
			chartLine = echarts.init(document.getElementById('myChart'))
			chartLine.setOption({
				title: {
					textStyle: {
						color: '#1890ff',
						fontWeight: 'normal',
						fontSize: 16,
					},
				},
				grid: {
					left: 0,
					right: 15,
					bottom: 0,
					top: 50,
					containLabel: true,
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
					},
					padding: [5, 10],
				},
				xAxis: {
					data: data.xAxis,
					axisLabel: {
						showMaxLabel: true,
						interval: parseInt(data.xAxis.length / 8),
					},
					axisTick: {
						show: false,
					},
				},
				yAxis: {
					axisTick: {
						show: false,
					},
				},
				series: [
					{
						name: '',
						type: 'line',
						data: data.yAxis,
						itemStyle: {
							color: '#1890ff',
							lineStyle: {
								color: '#1890ff',
								width: 2,
							},
						},
					},
				],
			})
		}
		function getMonitorData() {
			const { alarmSource, monitorTypeId, monitorObjectId } = baseInfo.value
			const params = {
				projectName: alarmSource,
				monitorTypeId,
				monitorObjectId,
				beginTime: getCurrentDate() + ' 00:00:00',
				endTime: getCurrentDate() + ' 23:59:59',
			}
			monitorData(params).then(({ result }) => {
				const { acquisitionTime = [], monitorData = [] } = result
				const xAxis = acquisitionTime.map(item => item.substring(11, 16))
				const data = {
					xAxis,
					yAxis: monitorData,
				}
				isChartData.value = xAxis.length
				onChartInit(data)
			})
		}

		return {
			baseColumn,
			baseInfo,
			ruleTable,
			orderColumn,
			orderInfo,
			isChartData,
			onCreateOrder,
			onFix,
			getMonitorData,
		}
	},

	methods: {
		onClose() {
			this.$parent.detailVisible = false
			this.$parent.getList('', true)
		},
	},
}
</script>

<style lang="scss" scoped>
:deep {
	.el-descriptions__label {
		width: 120px;
	}
	.el-descriptions__header {
		margin-bottom: 0;
		border: 1px solid #ebeef5;
		border-bottom: none;
		height: 36px;
		text-align: center;
		background: #fafafa;
		.el-descriptions__title {
			font-size: 14px;
			width: 100%;
		}
	}
	.el-empty__description {
		margin: 10px 0;
	}
	.el-empty__bottom {
		margin-top: 0;
	}
	.el-empty__image {
		width: 120px;
	}
	.warning-row {
		color: red;
	}
	.cell-red {
		color: #f56c6c;
		background: #fef0f0 !important;
	}
}
.m-page-header {
	padding: 10px 0;
	margin-left: 20px;
}
.detail-wrap {
	display: flex;
	flex-direction: column;
	padding: 0 20px;
	height: calc(100vh - 80px);
	overflow-y: auto;
}
.detail-top {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	.detail-top__left {
		width: 60%;
		margin-right: 20px;
		text-align: center;
		.btn-wrap {
			height: 28px;
			margin: 10px 0;
		}
	}
	.detail-top__right {
		flex: 1;
		position: relative;
		.chart {
			height: 249px;
			width: 100%;
		}
		.chart-title {
			color: #409eff;
			font-size: 14px;
		}
		.el-empty {
			position: absolute;
			width: 100%;
			top: 18px;
			left: 0;
			background: #fff;
			z-index: 2;
		}
	}
}
.detail-bottom {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	.detail-bottom__left {
		width: 60%;
		margin-right: 20px;
	}
	.detail-bottom__right {
		flex: 1;
	}
}
.btn-static {
	cursor: auto;
}
</style>
