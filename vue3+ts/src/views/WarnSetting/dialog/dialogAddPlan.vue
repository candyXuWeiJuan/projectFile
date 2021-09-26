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
} from 'vue'
import { formSetting, formData, formValue } from '../form/planFormData'
import { ElMessage } from 'element-plus'
import type { FormExtendType } from '@/components/form/type'
export default defineComponent({
	name: 'dialogAddPlan',
	emits: ['addPlanAjaxFn'],
	setup(props, { emit }) {
		const instance = getCurrentInstance()
		const cloneDeep = (<any>instance!.proxy!).$lodash.cloneDeep
		const data = reactive({
			formSetting,
			formData,
			formValue,
			dialogSetting: {
				show: false,
				width: '450px',
				title: '新增报警方案',
				saveBtn: true,
				cancelBtn: true,
				editBtn: false,
			},
		})
		const applyProduction: any = inject('applyProduction')
		const planType: any = inject('planType')
		const editId: any = inject('editId')
		const ifWarnUsed: Boolean | undefined = inject('ifWarnUsed')
		provide('parentInstance', instance)
		//监测form表单应用范围值修改时关联监测类型的修改
		watch(
			() => data.formValue.alarmSchemaScopeId,
			(newValue: string) => {
				const target = data.formData.find(val => val.value == 'monitorTypeId')
				if (!editId.value) {
					target!.disabled = false
				}
				if (!data.dialogSetting.editBtn) {
					target!.option = []
					data.formValue.monitorTypeId = ''
				}
			},
		)
		//监测form表单展示
		watch(
			() => data.dialogSetting.show,
			(newValue: Boolean, old: Boolean) => {
				if (newValue) {
					//表单展示时应用范围和方案类型选项赋值
					const target = data.formData.find(val => val.value == 'alarmSchemaTypeId')
					target!.option = planType.value
					const targetType = data.formData.find(val => val.value == 'alarmSchemaScopeId')
					targetType!.option = applyProduction.value
				}
			},
		)

		//form组件获取和校验方法
		const refForm: any = ref(null)
		const watchType = ref('')
		const valideFn = () => {
			refForm.value.$refs['ElForm'].validate((valid: boolean) => {
				if (data.formValue.remark.length > 100) {
					ElMessage({
						type: 'error',
						message: '方案备注文案长度不能超过100',
					})
					return
				}
				if (valid) {
					const formValueCopy = cloneDeep(data.formValue)
					const target = data.formData.find(val => val.value == 'monitorTypeId')
					const monitorTypeObj = target?.option?.find(
						(val: any) => val.value == data.formValue['monitorTypeId'],
					)
					//监测数据的text也要传给后台
					formValueCopy.monitorTypeName = (monitorTypeObj && monitorTypeObj.label) || ''
					emit('addPlanAjaxFn', formValueCopy)
				}
			})
		}
		const methods = {
			inputChange() {},
			selectChange(data: any) {
				//监测类型
				if (data.item.value == 'monitorTypeId') {
					watchType.value = data.item
				}
			},
			selectFocus() {},
			btnSave() {
				valideFn()
			},
			btnEdit() {
				data.formData.map((val: FormExtendType) => {
					const unInclude: String[] = [
						'alarmSchemaScopeId',
						'alarmSchemaTypeId',
						'monitorTypeId',
					]
					if (ifWarnUsed!.value && unInclude.includes(val.value)) {
					} else val.disabled = false
				})
			},
			formReset() {
				refForm.value.resetForm()
				for (let key in data.formValue) {
					;(<any>data.formValue)[key] = ''
				}
				data.dialogSetting.show = false
				watchType.value = ''
			},
		}

		return {
			...toRefs(data),
			...methods,
			valideFn,
			refForm,
			applyProduction,
			planType,
			instance,
		}
	},
})
</script>

<style lang="scss" scoped></style>
