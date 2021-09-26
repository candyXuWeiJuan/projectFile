<template>
	<el-form :model="formValue" ref="ElForm" :size="formSetting.size" class="demo-ruleForm">
		<el-form-item
			v-show="item.show"
			v-for="(item, index) in formData"
			:key="index"
			:label="item.label"
			:rules="item.rules"
			:label-width="item.width + 'px'"
			:prop="item.rules && item.value"
			:style="{ width: widthCalcute({ item, formSetting }) }"
		>
			<!-- 1为input输入框 -->
			<template v-if="item.formType == 1">
				<el-input
					:clearable="item.clearable"
					v-model="formValue[item.value]"
					:placeholder="item.placeholder"
					:type="item.inputType || 'text'"
					@change="inputChange($event, item)"
					:disabled="item.disabled"
					@input.native="inputNativeChange($event, item)"
				></el-input>
			</template>
			<!-- 2为下拉框 -->
			<template v-if="item.formType == 2">
				<el-select
					:disabled="item.disabled"
					v-model="formValue[item.value]"
					:placeholder="item.placeholder"
					:filterable="item.filterable || false"
					:rules="item.rules"
					:remote="item.remote || false"
					:prop="item.rules && item.value"
					:remote-method="item.remoteMethod"
					@focus="selectFocus(item)"
					@change="selectChange($event, item)"
					no-data-text="暂无数据"
					no-match-text="没匹配到数据"
				>
					<el-option
						v-for="opItem in item.option"
						:key="opItem.value"
						:value="opItem.value"
						:label="opItem.label"
					>
						{{ opItem.label }}
					</el-option>
				</el-select>
			</template>
			<!-- 3为单选框 -->
			<template v-if="item.formType == 3">
				<el-radio-group v-model="formValue[item.value]">
					<el-radio
						v-for="opItem in item.option"
						:label="opItem.value"
						:key="opItem.value"
						:disabled="item.disabled"
					>
						{{ opItem.label }}
					</el-radio>
				</el-radio-group>
			</template>
			<!-- 4为时间选择器 -->
			<template v-if="item.formType == 4">
				<el-time-picker
					:disabled="item.disabled"
					is-range
					v-model="formValue[item.value]"
					:format="item.format"
					range-separator="-"
					:editable="item.editable"
					:clearable="item.clearable"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
				></el-time-picker>
			</template>
			<template v-if="item.formType == 5">
				<!-- 5为日期选择器 -->
				<el-date-picker
					:disabled="item.disabled"
					v-model="formValue[item.value]"
					:type="item.dateType"
					:format="item.format"
					:editable="item.editable"
					:clearable="item.clearable"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					@focus="dateFocus"
					@blur="dateChange"
				></el-date-picker>
			</template>
			<template v-if="item.custom && item.templateFn">
				<!--自定义模板-->
				<component
					:is="item.value"
					:ref="item.value"
					@selfFnChange="selfFnChange"
				></component>
			</template>
		</el-form-item>
	</el-form>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, getCurrentInstance, ref, inject } from 'vue'
import { rowColumn, widthCalcute, getMethods } from './util'
import type { FormSetting, FormExtendType } from './type'
export default defineComponent({
	name: 'Form',
	props: {
		formSetting: {
			type: Object as PropType<FormSetting>,
			required: true,
			default: {},
		},
		formValue: {
			type: Object,
			required: true,
			default: {},
		},
		formData: {
			type: Array as PropType<FormExtendType[]>,
			required: true,
			default: [],
		},
	},
	emit: [
		'inputChange',
		'selectChange',
		'selfFnChange',
		'selectFocus',
		'dateFocus',
		'dateChange',
		'inputNativeChange',
	],
	setup(props, { emit }) {
		const { formSetting, formData, formValue } = toRefs(props)
		const instance = getCurrentInstance()
		const ElForm = ref(null)
		const parentInstance = inject('parentInstance')
		//分行分列
		const { rowLength } = rowColumn({
			formSetting,
			formData,
			instance,
			parentInstance,
		})
		//事件处理
		const methods = getMethods({ emit, instance, ElForm })
		return {
			widthCalcute,
			...methods,
			ElForm,
			rowLength,
			formSetting,
			formData,
			formValue,
		}
	},
})
</script>
