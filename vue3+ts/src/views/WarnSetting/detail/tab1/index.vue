<template>
	<Table :column="column" :tableData="tableData"></Table>
	<DialogAddRule ref="refAddDialog" @addRuleAjaxFn="addRuleAjaxFn"></DialogAddRule>
	<DialogMeaasgeNotice ref="refMessageNotice"></DialogMeaasgeNotice>
</template>
<script lang="ts">
import {
	defineComponent,
	reactive,
	toRefs,
	ref,
	nextTick,
	getCurrentInstance,
	inject,
	provide,
	Ref,
} from 'vue'
import DialogAddRule from '../../dialog/dialogAddRule.vue'
import DialogMeaasgeNotice from '../../dialog/dialogMeaasgeNotice.vue'
import { tableObj } from './pageData'
import { ajaxRuleList, ajaxRuleEdit, ajaxRuledelete } from '@/api/warnSetting'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getObjAttriValue } from '@/utils/common'
import { ajaxEventList, ajaxDict } from '@/api/warnSetting'
import type { FormExtendType } from '@/components/form/type'
import type { resultFinalType } from '@/types/global.d'
import { getTimeFormate } from '@/utils/common'
const year = getTimeFormate(new Date(), 'yy')
interface warnLevelType {
	text: string
	value: string
	label?: string
}
interface DetailInfo {
	alarmSchemaScopeId: string
	monitorTypeId: string
	[key: string]: any
}
export default defineComponent({
	name: 'WarnDetailTab1',
	components: {
		DialogAddRule,
		DialogMeaasgeNotice,
	},
	setup() {
		const instance = getCurrentInstance()
		const data = reactive({
			column: tableObj.bind(instance)(),
			tableData: [],
		})
		const refAddDialog: Ref<typeof DialogAddRule | null> = ref(null)
		const refMessageNotice: Ref<typeof DialogMeaasgeNotice | null> = ref(null)
		const editId = ref('')
		const detailInfo: Ref<DetailInfo> | undefined = inject('detailInfo')
		const eventList: Ref<any[]> = ref([])
		const warnLevel: Ref<warnLevelType[]> = ref([])
		provide('eventList', eventList)
		provide('warnLevel', warnLevel)
		provide('editId', editId)
		//列表请求
		const ajaxList = () => {
			ajaxRuleList({ alarmSchemaId: detailInfo!.value.alarmSchemaId }).then(res => {
				let { result } = <resultFinalType>res
				result.map((child: any) => {
					//事件类型
					const target = eventList.value.find(val => val.value == child.alarmTypeId)
					child.alarmTypeIdText = target ? target.label : '--'
					//告警级别
					const target1 = warnLevel.value.find(val => val.value == child.alarmLevel)
					child.warnLevelText = target1 ? target1.label : '--'
					//生效日期
					child.attriDate =
						child.startDate.replace('-', '/') + '-' + child.endDate.replace('-', '/')
					//生效时间
					child.attriTime = child.startTime + '-' + child.endTime
					//事件范围
					child.areaType = `[${child.lowerValue}~${child.upperValue})`
					//是否自动创建工单
					child.isAutoInitWorkOrderText = child.isAutoInitWorkOrder == true ? '是' : '否'
				})
				data.tableData = result
			})
		}
		//获取事件类型
		const a = () => {
			return new Promise(resolve => {
				ajaxEventList(detailInfo!.value).then(res => {
					let { result } = <resultFinalType>res
					result.list = result.list.map((val: any) => {
						return {
							label: val.alarmTypeName,
							value: val.id,
							alarmLevel: val.alarmLevel,
							isAutoInitWorkOrder: val.isAutoInitWorkOrder, //true是工单 false不是工单
							alarmType: val.alarmType,
						}
					})
					eventList.value = result.list || []
					resolve(result)
				})
			})
		}
		//获取告警select
		const b = () => {
			return new Promise(resolve => {
				ajaxDict({ type: 'ALARM_LEVEL' }).then(res => {
					let { result } = <resultFinalType>res
					result = result.map((val: any) => {
						return {
							label: val.text,
							value: val.value,
						}
					})
					warnLevel.value = result
					resolve(result)
				})
			})
		}

		Promise.all([a(), b()]).then(() => {
			ajaxList()
		})

		const methods = {
			//page消息通知配置
			detailCheck(row: any) {
				editId.value = row.id
				refMessageNotice.value!.dialogSetting.modelShow = true
			},
			//table上的（+）新增
			addRuleBtnClick(row: any) {
				refAddDialog.value!.formData.map((val: FormExtendType) => {
					if (val.value != 'eventNum' && val.value != 'warnLevel') val.disabled = false
				})
				refAddDialog.value!.dialogSetting.editBtn = false
				refAddDialog.value!.dialogSetting.saveBtn = true
				refAddDialog.value!.dialogSetting.cancelBtn = true
				editId.value = ''
				refAddDialog.value!.dialogSetting.title = '新增报警规则'
				refAddDialog.value!.dialogSetting.show = true
				nextTick(() => {
					//自定义表单项禁用
					const customRef = refAddDialog.value!.refForm.$refs['areaType']
					customRef.disabled = false
				})
			},
			//table页编辑点击
			editBtnClick(row: any) {
				//弹窗展示
				refAddDialog.value!.dialogSetting.title = '编辑报警规则'
				refAddDialog.value!.dialogSetting.show = true
				nextTick(() => {
					//详情基本赋值
					getObjAttriValue(refAddDialog.value!.formValue, row)
					//报警级别
					refAddDialog.value!.formValue.alarmTypeId = Number(row.alarmTypeId)
					//日期赋值
					refAddDialog.value!.formValue.attriDate = [
						`${year}-${row.startDate}`,
						`${year}-${row.endDate}`,
					]
					//时间赋值
					refAddDialog.value!.formValue.attriTime = [
						new Date(`2021-02-02 ${row.startTime}:00`),
						new Date(`2021-02-02 ${row.endTime}:00`),
					]
					//上下限赋值
					const customRef = refAddDialog.value!.refForm.$refs['areaType']
					customRef.customForm.upperValue = row.upperValue
					customRef.customForm.lowerValue = row.lowerValue
					//自定义表单项禁用
					customRef.disabled = true
					//编辑弹窗表单disable所有
					refAddDialog.value!.formData.map((val: FormExtendType) => (val.disabled = true))
					//编辑弹窗表单详情id赋值
					editId.value = row.id
					//弹窗保存编辑按钮调整
					refAddDialog.value!.dialogSetting.editBtn = true
					refAddDialog.value!.dialogSetting.saveBtn = false
					refAddDialog.value!.dialogSetting.cancelBtn = false
				})
			},
			//page页删除点击
			deleteBtnClick(row: any) {
				ElMessageBox.confirm('将删除该项, 是否继续?', '操作', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						ajaxRuledelete({ id: row.id }).then(result => {
							if ((<resultFinalType>result).responseCode == '100000') {
								ElMessage({
									type: 'success',
									message: '删除成功',
								})
								ajaxList()
							}
						})
					})
					.catch(() => {})
			},
			//表单保存按钮点击
			addRuleAjaxFn(formValueCopy: any) {
				if (editId.value) formValueCopy.id = editId.value
				else delete formValueCopy.id
				ajaxRuleEdit(formValueCopy).then(result => {
					if ((<resultFinalType>result).responseCode == '100000') {
						refAddDialog.value!.formReset()
						ElMessage.success({
							message: editId.value ? '编辑成功' : '保存成功',
							type: 'success',
						})
						//列表刷新
						ajaxList()
					}
				})
			},
		}
		return {
			...methods,
			...toRefs(data),
			refAddDialog,
			refMessageNotice,
		}
	},
})
</script>

<style lang="scss" scoped></style>
