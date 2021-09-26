import { ajaxWatchType } from '@/api/warnSetting'
import type { resultFinalType } from '@/types/global.d'
import type { FormExtendType } from '@/components/form/type'
export let formSetting = {
	formline: false,
	needValidate: true,
	size: 'small',
	row: 1,
}
export let formData = [
	{
		formType: 1,
		disabled: false,
		placeholder: '请输入方案名称',
		label: '方案名称:',
		value: 'alarmSchemaName',
		clearable: true,
		show: true,
		rules: [
			{ required: true, message: '方案名称不能为空', trigger: 'blur' },
			{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
		],
	},
	{
		formType: 1,
		disabled: false,
		placeholder: '请输入方案编号',
		clearable: true,
		label: '方案编号:',
		value: 'alarmSchemaNum',
		show: true,
		rules: [
			{
				required: true,
				message: '方案编号不能为空',
				trigger: 'change',
			},
			{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
		],
	},
	{
		formType: 2,
		disabled: false,
		placeholder: '请选择',
		label: '应用范围:',
		value: 'alarmSchemaScopeId',
		option: [],
		show: true,
		rules: {
			required: true,
			message: '应用范围不能为空',
			trigger: 'change',
		},
	},
	{
		formType: 2,
		disabled: false,
		placeholder: '请选择',
		label: '方案类型:',
		value: 'alarmSchemaTypeId',
		option: [],
		show: true,
		rules: {
			required: true,
			message: '方案类型不能为空',
			trigger: 'change',
		},
	},
	{
		formType: 2,
		disabled: true,
		placeholder: '请输入监测类型',
		label: '监测类型:',
		value: 'monitorTypeId',
		filterable: true,
		remote: true,
		show: true,
		rules: [
			{
				required: true,
				message: '监测类型不能为空',
				trigger: 'change',
			},
		],
		option: [],
		remoteMethod: function (query: any) {
			console.log(query, this.setupState.formValue.monitorTypeName)
			if (query !== '') {
				ajaxWatchType({
					projectName: this.setupState.formValue.alarmSchemaScopeId,
					monitorTypeName: query,
				}).then(res => {
					let { result } = <resultFinalType>res
					const dataTarget = this.setupState.formData.find(
						(val: FormExtendType) => val.value == 'monitorTypeId',
					)
					result = result.map((val: any) => {
						return {
							label: val.monitorTypeName,
							value: val.monitorTypeId,
						}
					})
					dataTarget.option = result
				})
			} else {
			}
		},
	},
	{
		formType: 1,
		disabled: false,
		placeholder: '',
		label: '方案备注:',
		value: 'remark',
		show: true,
		inputType: 'textarea',
	},
]
export let formValue = {
	alarmSchemaName: '',
	alarmSchemaNum: '',
	remark: '',
	monitorTypeId: '',
	alarmSchemaTypeId: '',
	alarmSchemaScopeId: '',
}
