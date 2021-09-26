export interface FormSetting {
	formline: Boolean
	needValidate: true
	size: String
	row: Number
	rowWidth?: Array<String>
}
export interface FormData {
	formType: Number
	disabled: Boolean
	value: String
	show: Boolean
	placeholder?: String
	label?: string
	filterable?: Boolean
	rules?: Object
	option?: unknown[]
	mergeRow?: Number | Object
	remoteMethod?: (...args: unknown[]) => unknown
	templateFn?: (...args: unknown[]) => unknown
}
export interface FormDataExtend {
	width?: Number
	rowIndex?: Number
}
export interface FormExtendType extends FormDataExtend, FormData {}
