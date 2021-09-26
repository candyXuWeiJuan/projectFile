<template>
	<div class="wrap">
		<el-form ref="Form" :model="customForm" size="small" :rules="rules" class="form">
			<el-form-item label="" prop="lowerValue" class="form-item">
				<el-input
					v-model="customForm.lowerValue"
					placeholder="下限值"
					@change="inputChange($event, 'lowerValue')"
					:disabled="disabled"
					:clearable="true"
					@input="
						customForm.lowerValue = customForm.lowerValue.replace(
							customForm.lowerValue,
							valideNumber(customForm.lowerValue),
						)
					"
				></el-input>
			</el-form-item>
			&nbsp;&nbsp; 至 &nbsp;&nbsp;
			<el-form-item label="" prop="upperValue" class="form-item">
				<el-input
					v-model="customForm.upperValue"
					placeholder="上限值"
					@change="inputChange($event, 'upperValue')"
					:disabled="disabled"
					:clearable="true"
					@input="
						customForm.upperValue = customForm.upperValue.replace(
							customForm.upperValue,
							valideNumber(customForm.upperValue),
						)
					"
				></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'WarnCustomForm',
	data() {
		return {
			customForm: {
				lowerValue: '',
				upperValue: '',
			},
			rules: {
				lowerValue: [{ required: true, message: '下限值不能为空', trigger: 'blur' }],
				upperValue: [{ required: true, message: '上限值不能为空', trigger: 'blur' }],
			},
			disabled: false,
		}
	},
	props: {
		value: String,
		aaaa: String,
	},
	methods: {
		valideFn() {
			return new Promise(resolve => {
				this.$refs['Form'].validate((valid: boolean) => {
					if (valid) {
						resolve(true)
					} else {
						resolve(false)
					}
				})
			})
		},
		resetValide() {
			this.$refs['Form'].resetFields()
		},
		plusOrMinus(values: any) {
			let newValue
			if (!/[^0-9.-]/g.test(values)) {
				newValue = values
					.replace(/[^\-\d.]/g, '')
					.replace(/\-{2,}/g, '-')
					.replace(/\-{2,}/g, '-')
					.replace(/^\./g, '')
					.replace(/\.{2,}/g, '.')
					.replace('.', '$#$')
					.replace(/\./g, '')
					.replace('$#$', '.')
				if (
					newValue.toString().indexOf('.') > 0 &&
					Number(newValue.toString().split('.')[1].length) > 2
				) {
					newValue = parseInt(parseFloat(newValue) * 100) / 100
				}
				if (newValue.toString().split('-').length - 1 > 1) {
					newValue = parseFloat(newValue) || ''
				}
				if (
					newValue.toString().split('-').length > 1 &&
					newValue.toString().split('-')[0].length > 0
				) {
					newValue = parseFloat(newValue) || ''
				}
				if (
					newValue.toString().length > 1 &&
					(newValue.toString().charAt(0) === '0' ||
						(newValue.toString().length > 2 &&
							newValue.toString().charAt(0) === '-' &&
							newValue.toString().charAt(1) === '0' &&
							newValue.toString().charAt(2) !== '.')) &&
					newValue.toString().indexOf('.') < 1
				) {
					newValue = parseFloat(newValue) || ''
				}
				// 判断整数位最多为9位
				if (
					newValue.toString().indexOf('.') > 0 &&
					Number(newValue.toString().split('.')[0].length) > 9
				) {
					newValue = `${newValue.toString().substring(0, 9)}.${
						newValue.toString().split('.')[1]
					}`
				} else if (
					newValue.toString().indexOf('.') < 0 &&
					Number(newValue.toString().split('.')[0].length) > 9
				) {
					newValue = newValue.toString().substring(0, 9)
				}
			} else {
				newValue = values.replace(/[^0-9.-]/g, '')
			}
			return newValue
		},
		valideNumber(values: any) {
			return this.plusOrMinus(values.toString())
		},
		// 结合change事件对失去焦点进行判断，防止输入一些无效值
		inputChange(item: any, attri: any) {
			// 防止删除为空
			if (!item) {
				item = '0'
			}
			// 一些输入的判断
			if (
				item.toString().indexOf('.') > 0 &&
				Number(item.toString().split('.')[1].length) < 1
			) {
				item = item.toString().split('.')[0]
			}
			// 一些输入的判断
			if (!item || item === '-' || item === '-0') {
				item = '0'
			}
			item = parseFloat(item)
			this.customForm[attri] = item
		},
	},
	setup() {},
})
</script>

<style lang="scss">
.wrap {
	display: flex;
	width: 100%;
	.form {
		display: flex;
		flex-direction: row;
		width: 100%;
		.form-item {
			width: 172px !important;
			margin-bottom: 0;
		}
	}
}
</style>
