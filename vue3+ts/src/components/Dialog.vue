<template>
	<el-dialog
		v-model="dialogSetting.show"
		:width="dialogSetting.width"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:top="dialogSetting.top"
		@close="closeFn"
	>
		<template #title>
			<Header :title="dialogSetting.title">
				<template #other>
					<slot name="headOther"></slot>
				</template>
			</Header>
		</template>
		<slot></slot>
		<template #footer>
			<span class="dialog-footer" v-if="dialogSetting.btnShow != false">
				<el-button @click="btnCancel" v-if="dialogSetting.cancelBtn">取 消</el-button>
				<el-button type="primary" @click="btnSave" v-if="dialogSetting.saveBtn">
					保 存
				</el-button>
				<el-button type="primary" @click="btnEdit" v-if="dialogSetting.editBtn">
					编 辑
				</el-button>
				<slot name="btnSlot"></slot>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { defineComponent, toRefs } from 'vue'
export default defineComponent({
	name: 'Dialog',
	props: {
		dialogSetting: {
			type: Object,
			default: {},
		},
	},
	emits: ['btnCancel', 'btnSave', 'btnEdit'],
	setup(props, { emit }) {
		const methods = {
			btnCancel() {
				emit('btnCancel')
			},
			btnSave() {
				emit('btnSave')
			},
			btnEdit() {
				props.dialogSetting.editBtn = false
				props.dialogSetting.cancelBtn = true
				props.dialogSetting.saveBtn = true
				emit('btnEdit')
			},
			closeFn() {
				emit('closeFn')
			},
		}
		return {
			...methods,
		}
	},
})
</script>
