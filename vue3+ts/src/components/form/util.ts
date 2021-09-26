import type { FormExtendType } from './type'
export const mergeTmp = {
	formType: 100,
	disabled: false,
	label: '',
	value: 'tmp',
	show: false,
}
export const getLabelWidth = (str: string) => {
	let width = 0
	let html = document.createElement('span')
	html.innerText = str
	html.className = 'getLabelWidth'
	;(<HTMLBodyElement>document.querySelector('body')).appendChild(html)
	const targetDom = <HTMLElement>document.querySelector('.getLabelWidth')
	width = targetDom.offsetWidth
	targetDom.remove()
	return width
}
export const rowColumn = ({ formSetting, formData, instance, parentInstance }) => {
	let sliceArr: FormExtendType[] = []
	let addIndex = 0
	let rowArr: any = []
	let rowWidth: any = []
	let rowMax: any = []
	const rowLength = formSetting.value.row
	formData.value.forEach((val: FormExtendType, index: number) => {
		//需要合并的列编排出来
		const needMergeTmp = val.mergeRow
			? (<FormExtendType[]>new Array(val.mergeRow)).fill(mergeTmp)
			: []
		needMergeTmp.unshift(val)
		sliceArr = (sliceArr.length ? sliceArr : formData.value).slice(0, index + addIndex)
		sliceArr = sliceArr.concat(needMergeTmp)
		addIndex = val.mergeRow ? addIndex + needMergeTmp.length : addIndex
		//自定义表单
		if (val.templateFn) {
			val.templateFn(val.value)
		}
	})
	sliceArr.forEach((val: FormExtendType, index: number) => {
		formData.value[index] = val
	})
	for (let i = 0; i < rowLength; i++) {
		rowArr[i] = []
		rowWidth[i] = []
		formData.value.forEach((val: FormExtendType, index: number) => {
			if (i == 0) {
				//调整校验函数调用对象
				if (val.rules) {
					if (val.rules instanceof Array) {
						val.rules.forEach((vadItem: any) => {
							vadItem.validator &&
								(vadItem.validator = vadItem.validator.bind(instance))
						})
					}
				}
				if (val.remoteMethod) {
					val.remoteMethod = val.remoteMethod.bind(parentInstance)
				}
			}
			//分行分列
			if (index % Number(rowLength) == i && val.show) {
				val.width = getLabelWidth(val.label as string) + 20
				val.rowIndex = i
				rowArr[i].push(val)
				rowWidth[i].push(val.width)
			}
		})
		rowMax.push(Math.max(...rowWidth[i]))
	}
	rowMax.map((val: Number, index: number) => {
		rowArr[index].forEach((eachForm: { width: Number }) => {
			eachForm.width = val
		})
	})

	return {
		rowLength,
	}
}
export const widthCalcute = ({ item, formSetting }) => {
	let width: number = 0
	const mergeRowArr = item.mergeRow && [...new Array(item.mergeRow).keys()]
	if (formSetting.rowWidth) {
		width = Number(formSetting.rowWidth[Number(item.rowIndex)])
		if (mergeRowArr) {
			mergeRowArr.forEach((val, index) => {
				width =
					width +
					Number(
						formSetting.rowWidth &&
							formSetting.rowWidth[(item.rowIndex as number) + index + 1],
					)
			})
		}
	} else {
		width = 100 / Number(formSetting.row)
	}
	return width + '%'
}
export const getMethods = ({ emit, instance, ElForm }) => {
	return {
		inputChange(value: String, item: any) {
			emit('inputChange', { value, item, instance })
		},
		inputNativeChange(value: String, item: any) {
			instance.setupState.formValue[item.value] = value.trim()
			emit('inputNativeChange', { value, item, instance })
		},
		selectChange(value: String, item: any) {
			emit('selectChange', { value, item, instance })
		},
		selfFnChange(e: any) {
			emit('selfFnChange', e)
		},
		selectFocus(e: any) {
			emit('selectFocus', e)
		},
		resetForm() {
			ElForm.value.resetFields()
		},
		dateFocus() {
			emit('dateFocus')
		},
		dateChange() {
			emit('dateChange')
		},
	}
}
