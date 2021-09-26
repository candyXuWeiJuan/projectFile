<template>
	<Page
		title="报警方案配置管理"
		v-show="!showDetail"
		:searchObj="searchObj"
		:tableObj="tableObj"
		@getList="ajaxList"
		ref="refPage"
	>
		<template v-slot:searchRight>
			<el-button type="primary" @click="AddBtnClick">新增</el-button>
		</template>
	</Page>
	<Detail v-if="showDetail" ref="detail"></Detail>
	<DialogAddPlan ref="refAddDialog" @addPlanAjaxFn="addPlanAjaxFn"></DialogAddPlan>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, reactive, toRefs, getCurrentInstance, provide } from 'vue'
import { searchObj, tableObj } from './index/pageData'
import { ajaxPlanList, ajaxAddPlan, ajaxDict, ajaxDeletePlan } from '@/api/warnSetting'
import { getObjAttriValue } from '@/utils/common'
import Detail from './detail.vue'
import DialogAddPlan from './dialog/dialogAddPlan.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormExtendType } from '@/components/form/type'
import Page from '@/components/Page.vue'
import { resultFinalType } from '@/types/global'
interface DictType {
	id: Number
	text: String
	value: String
}
interface DetailInfo {
	alarmSchemaScopeId: string
	monitorTypeId: string
	[key: string]: any
}
export default defineComponent({
	name: 'WarnSetting',
	components: {
		Detail,
		DialogAddPlan,
	},
	setup() {
		const instance = getCurrentInstance()
		const data = reactive({
			searchObj: searchObj.bind(instance)(),
			tableObj: tableObj.bind(instance)(),
			showDetail: ref(false),
		})
		const refAddDialog: Ref<typeof DialogAddPlan | null> = ref(null)
		const refPage: Ref<typeof Page | null> = ref(null)
		//提供数据字典获取应用范围和监测类型
		let applyProduction = ref([])
		let planType = ref([])
		//提供详情Id
		let editId = ref('')
		//提供方案id和监测类型id
		let detailInfo: Ref<DetailInfo | undefined> = ref({
			alarmSchemaScopeId: '',
			monitorTypeId: '',
		})
		//提供报警方案是否已经被应用，已被应用的话,编辑只能修改部分信息
		let ifWarnUsed = ref(false)
		//提供详情数据
		let detailRow: any = ref('')
		ajaxDict({ type: 'ALARM_SOURCE' }).then(res => {
			let { result } = <resultFinalType>res
			applyProduction.value = result.map((val: DictType) => {
				return {
					label: val.text,
					value: val.value,
				}
			})
			data.searchObj.model[0].options = [
				...(<any>data.searchObj.model[0].options),
				...applyProduction.value,
			]
		})
		//数据字典获取方案类型
		ajaxDict({ type: 'ALARM_SCHEMA_TYPE' }).then(res => {
			let { result } = <resultFinalType>res
			planType.value = result.map((val: DictType) => {
				return {
					label: val.text,
					value: val.value,
				}
			})
			data.searchObj.model[1].options = [
				...(<any>data.searchObj.model[1].options),
				...planType.value,
			]
		})
		//列表请求
		const ajaxList = (e?: Number) => {
			const parmas = {
				pageNum: e || data.tableObj.page.pageNum,
				pageSize: data.tableObj.page.pageSize,
			}
			ajaxPlanList({ ...parmas, ...data.searchObj.data }).then(res => {
				const {
					result: { list, pageNum, pageSize, total },
				} = <resultFinalType>res
				list.map((child: any) => {
					const target = applyProduction.value.find(
						val => val.value == child.alarmSchemaScopeId,
					)
					child.alarmSchemaScopeIdText = target ? target.label : '--'
					const target1 = planType.value.find(val => val.value == child.alarmSchemaTypeId)
					child.alarmSchemaTypeIdText = target1 ? target1.label : '--'
				})
				data.tableObj.data = list
				data.tableObj.page.pageNum = pageNum
				data.tableObj.page.total = total
				data.tableObj.page.pageSize = pageSize
			})
		}
		ajaxList(1)
		provide('applyProduction', applyProduction)
		provide('planType', planType)
		provide('editId', editId)
		provide('detailInfo', detailInfo)
		provide('ifWarnUsed', ifWarnUsed)
		provide('detailRow', detailRow)
		const methods = {
			//page页查看详情
			detailCheck(parmas: { row: Object }) {
				const row = parmas.row
				detailRow.value = row
				detailInfo.value = {
					monitorTypeId: row.monitorTypeId,
					alarmSchemaScopeId: row.alarmSchemaScopeId,
					alarmSchemaId: row.id,
				}
				data.showDetail = true
			},
			//page页新增点击
			AddBtnClick() {
				refAddDialog.value!.dialogSetting.title = '新增报警方案'
				//新增的话编辑id置空
				refAddDialog.value!.formData.map((val: FormExtendType) => {
					if (val.value != 'monitorTypeId') val.disabled = false
				})
				refAddDialog.value!.dialogSetting.editBtn = false
				refAddDialog.value!.dialogSetting.saveBtn = true
				refAddDialog.value!.dialogSetting.cancelBtn = true
				editId.value = ''
				//监测类型新增disabled掉,应用范围选了再放开
				const target = refAddDialog.value!.formData.find(
					(val: FormExtendType) => val.value == 'monitorTypeId',
				)
				target.option = []
				target!.disabled = true
				refAddDialog.value!.dialogSetting.show = true
			},
			//page页编辑点击
			editBtnClick(parmas: any) {
				//	existsAlarmRecord
				let { row } = parmas

				refAddDialog.value!.dialogSetting.title = '编辑报警方案'
				//详情基本赋值
				getObjAttriValue(refAddDialog.value!.formValue, row)
				const watchTypeSeting = refAddDialog.value!.formData.find(
					(val: FormExtendType) => val.value == 'monitorTypeId',
				)
				watchTypeSeting.option = []
				//表单中监测数据远程搜索请求一次
				watchTypeSeting.remoteMethod.bind(refAddDialog.value!.instance)(row.monitorTypeName)
				//编辑弹窗表单disable所有
				refAddDialog.value!.formData.map((val: FormExtendType) => (val.disabled = true))
				//编辑弹窗表单详情id赋值
				editId.value = row.id
				//该报警详情方案是否已被应用
				ifWarnUsed.value = row.existsAlarmRecord
				//弹窗保存编辑按钮调整
				refAddDialog.value!.dialogSetting.editBtn = true
				refAddDialog.value!.dialogSetting.saveBtn = false
				refAddDialog.value!.dialogSetting.cancelBtn = false
				//弹窗展示
				refAddDialog.value!.dialogSetting.show = true
			},
			//page页删除点击
			deleteBtnClick(parmas: any) {
				ElMessageBox.confirm('将删除该项, 是否继续?', '操作', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						ajaxDeletePlan({ id: parmas.row.id }).then(result => {
							if ((<resultFinalType>result).responseCode == '100000') {
								ElMessage({
									type: 'success',
									message: '删除成功!',
								})
								ajaxList()
							}
						})
					})
					.catch(() => {})
			},
			//dialog表单保存按钮点击
			addPlanAjaxFn(formValueCopy: { id?: string }) {
				if (editId.value) formValueCopy.id = editId.value
				else delete formValueCopy.id
				ajaxAddPlan(formValueCopy).then(result => {
					if ((<resultFinalType>result).responseCode == '100000') {
						refAddDialog.value!.formReset()
						ElMessage.success({
							message: editId.value ? '编辑成功' : '保存成功',
							type: 'success',
						})
						if (!editId.value) refPage.value!.onReset()
						else ajaxList()
					}
				})
			},
		}
		return {
			...methods,
			...toRefs(data),
			refAddDialog,
			ajaxList,
			refPage,
		}
	},
})
</script>

<style lang="scss" scoped></style>
