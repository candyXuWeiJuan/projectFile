<template>
	<Dialog
		:dialogSetting="dialogSetting"
		class="project-dialog"
		@btnCancel="formReset"
		@btnSave="btnSave"
		@btnEdit="btnEdit"
		@close="formReset"
	>
		<Form
			class="form-class"
			:formSetting="formSetting"
			:formData="formData"
			:formValue="formValue"
			@inputChange="inputChange"
			@selectChange="selectChange"
			@dateFocus="dateFocus"
			@dateChange="dateChange"
			ref="refForm"
		></Form>
	</Dialog>
</template>

<script lang="ts">
import {
	defineComponent,
	ref,
	reactive,
	toRefs,
	watch,
	getCurrentInstance,
	inject,
	provide,
	Ref,
} from 'vue'
import { formSetting, formData, formValue } from '../form/ruleFormData'
import { getTimeFormate } from '@/utils/common'
import { ElMessage } from 'element-plus'
import type { FormExtendType } from '@/components/form/type'
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
	name: 'dialogAddRule',
	props: {},
	emits: ['addRuleAjaxFn'],
	setup(props, { emit }) {
		const instance = getCurrentInstance()
		const cloneDeep = (<any>instance!.proxy!).$lodash.cloneDeep
		const data = reactive({
			formSetting: cloneDeep(formSetting),
			formData: cloneDeep(formData),
			formValue: cloneDeep(formValue),
			dialogSetting: {
				show: false,
				top: '15vh',
				width: '500px',
				title: '新增报警规则',
				saveBtn: true,
				cancelBtn: true,
				editBtn: false,
			},
		})
		const detailInfo: Ref<DetailInfo> | undefined = inject('detailInfo')
		const eventList: Ref<any[]> | undefined = inject('eventList')
		const warnLevel: Ref<warnLevelType[]> | undefined = inject('warnLevel')
		provide('parentInstance', instance)
		//表单展示时,表单配置值重新赋值
		watch(
			() => data.dialogSetting.show,
			(newValue: Boolean, old: Boolean) => {
				if (newValue) {
					data.formValue = cloneDeep(formValue)
				}
				//表单展示时事件描述和报警级别选项赋值
				const target = data.formData.find(
					(val: FormExtendType) => val.value == 'alarmTypeId',
				)
				target!.option = eventList!.value
				const targetType = data.formData.find(
					(val: FormExtendType) => val.value == 'warnLevel',
				)
				targetType!.option = warnLevel!.value
			},
		)
		//监测事件描述修改时联动报警级别和事件编号选项
		watch(
			() => data.formValue.alarmTypeId,
			(newValue: Boolean, old: Boolean) => {
				if (newValue) {
					const target = eventList!.value.find(val => val.value == newValue)
					//报警级别
					data.formValue.warnLevel = target.alarmLevel
					//事件编号
					data.formValue.eventNum = target.alarmType
					//自动创建工单
					if (!data.dialogSetting.editBtn)
						data.formValue.isAutoInitWorkOrder = target.isAutoInitWorkOrder
				}
			},
		)
		//form组件获取和校验方法
		const refForm: any = ref(null)
		const valideFn = () => {
			refForm.value.$refs['ElForm'].validate(async (valid: boolean) => {
				const result = await refForm.value.$refs['areaType'].valideFn()
				//上下限值自定义表单
				const customForm = refForm.value.$refs['areaType'].customForm
				if (
					customForm.upperValue &&
					customForm.lowerValue &&
					customForm.lowerValue > customForm.upperValue
				) {
					ElMessage({
						type: 'error',
						message: '下限值必须小于上限值',
					})
					return
				}
				if (valid && result) {
					//日期处理
					const dateArr = data.formValue.attriDate
					//时间处理
					const timeArr = data.formValue.attriTime
					const parmas = {
						alarmSchemaId: detailInfo!.value.alarmSchemaId, //方案id
						alarmTypeId: data.formValue.alarmTypeId, //事件描述id
						isAutoInitWorkOrder: data.formValue.isAutoInitWorkOrder, //是否工单
						upperValue: customForm.upperValue, //报警规则下限值
						lowerValue: customForm.lowerValue, //报警规则上限值
						startDate: getTimeFormate(dateArr[0], 'MM-DD'), //生效开始日期
						endDate: getTimeFormate(dateArr[1], 'MM-DD'), //生效结束日期
						startTime: getTimeFormate(timeArr[0], 'HH:mm'), //生效起始时间
						endTime: getTimeFormate(timeArr[1], 'HH:mm'), //生效截止时间
					}
					emit('addRuleAjaxFn', parmas)
				}
			})
		}
		//form回调方法
		const methods = {
			inputChange() {},
			selectChange() {},
			selectFocus() {},
			btnSave() {
				valideFn()
			},
			dateFocus() {
				data.dialogSetting.top = '49vh'
			},
			dateChange() {
				data.dialogSetting.top = '15vh'
			},
			btnEdit() {
				refForm.value.$refs['areaType'].disabled = false
				data.formData.map((val: FormExtendType) => {
					if (val.value != 'eventNum' && val.value != 'warnLevel') val.disabled = false
				})
			},
			formReset() {
				refForm.value.resetForm()
				//自定义表单项重新校验
				refForm.value.$refs['areaType'].resetValide()
				//表单值置空
				for (let key in data.formValue) {
					data.formValue[key] = ''
				}
				data.dialogSetting.show = false
			},
		}
		return {
			...toRefs(data),
			...methods,
			refForm,
			instance,
		}
		// const selfFnChange = e => {
		// 	if (e.type == 'input') {
		// 		console.log(form.ruleFormValue)
		// 		form.ruleFormValue.eventDescribe = 'eventDescribe'
		// 		Form.value.$refs['ElForm'].validateField('eventDescribe')
		// 	}
		// }
		// //监测form表单值修改
		// watch(
		// 	() => form.ruleFormValue['attriDate'],
		// 	(newValue: string, old: string) => {
		// 		console.log(Form.value)
		// 		if (Form.value) Form.value.$refs['areaType'].sizeForm.name = '监测form表单值修改'
		// 		// form.ruleFormValue['watchType'] = ''
		// 		// ruleFormData[4].option = watchTypeArr.get(newValue)
		// 	},
		// 	{ immediate: true },
		// )
	},
})
</script>

<style lang="scss" scoped></style>
