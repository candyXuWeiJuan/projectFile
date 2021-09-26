<template>
	<Dialog
		:dialogSetting="dialogSetting"
		class="project-dialog"
		@btnCancel="reset"
		@btnSave="btnSave"
		@close="reset"
	>
		<el-checkbox-group v-model="checkList" class="checkgroup">
			<el-checkbox :label="item.userId" v-for="(item, index) in nameList" :key="index">
				{{ item.name }}
			</el-checkbox>
		</el-checkbox-group>
	</Dialog>
</template>

<script lang="ts">
import { defineComponent, Ref, watch, reactive, toRefs, inject } from 'vue'
import { ajaxNoticeList, ajaxNoticeSave } from '@/api/warnSetting'
import { ElMessage } from 'element-plus'
import type { resultFinalType } from '@/types/global.d'
export default defineComponent({
	name: 'DialogMessageNotice',
	props: {},
	setup() {
		const editId: Ref<String | null> | undefined = inject('editId')
		const data = reactive({
			dialogSetting: {
				show: false,
				width: '630px',
				title: '警报消息通知配置',
				saveBtn: true,
				cancelBtn: true,
				editBtn: false,
				modelShow: false,
			},
			checkList: [] as string[],
			nameList: [],
		})
		watch(
			() => data.dialogSetting.modelShow,
			(newValue: Boolean, old: Boolean) => {
				if (newValue) {
					methods.getList()
				}
			},
		)
		const methods = {
			getList() {
				const parmas = { alarmSchemaRuleId: editId?.value }
				ajaxNoticeList(parmas).then(res => {
					const { result } = <resultFinalType>res
					result.map((val: any) => {
						if (val.selectedETBC) data.checkList.push(val.userId)
					})
					data.nameList = result
					data.dialogSetting.show = true
				})
			},
			btnSave() {
				let saveArr: any[] = []
				data.checkList.map(val => {
					saveArr.push({
						alarmSchemaRuleId: editId?.value,
						processType: '0',
						noticeUserIds: val,
					})
				})
				ajaxNoticeSave({
					alarmNoticeConfigJsonArray: saveArr,
					alarmSchemaRuleId: editId?.value,
				}).then(res => {
					if ((<resultFinalType>res).responseCode == '100000') {
						ElMessage({
							type: 'success',
							message: '消息配置修改成功',
						})
						data.dialogSetting.show = false
					}
				})
			},
			reset() {
				data.dialogSetting.show = false
				data.dialogSetting.modelShow = false
				data.nameList = []
				data.checkList = [] as string[]
			},
		}
		return {
			...toRefs(data),
			...methods,
		}
	},
})
</script>

<style lang="scss" scoped>
.checkgroup {
	padding: 0 0 10px 10px;
	max-height: 400px;
	overflow: hidden;
	overflow-y: auto;
	label {
		flex: 1;
	}
	:deep .el-checkbox__label {
		width: 100px;
	}
}
</style>
