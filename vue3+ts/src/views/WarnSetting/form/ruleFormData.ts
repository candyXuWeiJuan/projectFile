import RenderFrom from '@/views/WarnSetting/form/renderForm.vue'
import { getTimeFormate } from '@/utils/common'
const year = getTimeFormate(new Date(), 'yy')
export let formSetting = {
	formline: false,
	needValidate: true,
	size: 'small',
	row: 2,
	rowWidth: ['47', '53'],
}
export let formData = [
	{
		formType: 2,
		disabled: false,
		label: '事件描述:',
		value: 'alarmTypeId',
		show: true,
		option: [],
		rules: [{ required: true, message: '事件描述不能为空', trigger: 'change' }],
	},
	{
		formType: 1,
		disabled: true,
		label: '事件编码:',
		value: 'eventNum',
		show: true,
	},
	{
		formType: 2,
		disabled: true,
		label: '报警级别:',
		value: 'warnLevel',
		option: [],
		show: true,
		rules: {
			required: true,
			message: '报警级别不能为空',
			trigger: 'change',
		},
	},
	{
		formType: 3,
		disabled: false,
		placeholder: '请选择',
		label: '自动创建工单:',
		value: 'isAutoInitWorkOrder',
		option: [
			{ label: '是', value: true },
			{ label: '否', value: false },
		],
		show: true,
		rules: {
			required: true,
			message: '是否自动创建工单必选',
			trigger: 'change',
		},
	},
	{
		disabled: false,
		placeholder: '请输入',
		label: '数据区间:',
		value: 'areaType',
		filterable: true,
		option: [],
		show: true,
		mergeRow: 1,
		custom: true,
		templateFn: function (componentName: string) {
			window.app.component(componentName, RenderFrom)
		},
		rules: {
			required: true,
			message: '',
			trigger: 'change',
		},
	},
	{
		formType: 5,
		disabled: false,
		label: '生效日期:',
		value: 'attriDate',
		mergeRow: 1,
		editable: false,
		clearable: false,
		dateType: 'daterange',
		format: 'MM-DD',
		show: true,
		rules: {
			required: true,
			message: '生效日期不能为空',
			trigger: 'change',
		},
	},
	{
		formType: 4,
		disabled: false,
		label: '生效时间:',
		format: 'HH:mm',
		value: 'attriTime',
		editable: false,
		clearable: false,
		mergeRow: 1,
		show: true,
		rules: {
			required: true,
			message: '生效时间不能为空',
			trigger: 'change',
		},
	},
]
export let formValue = {
	alarmTypeId: '',
	eventNum: '',
	warnLevel: '',
	isAutoInitWorkOrder: false,
	areaType: 'test',
	attriDate: [year + '-01-01', year + '-12-31'],
	attriTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
}
