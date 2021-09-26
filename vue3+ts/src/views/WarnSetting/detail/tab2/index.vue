<template>
	<div class="equip">
		<div class="equip-left">
			<Page
				:searchObj="searchObjLeft"
				:tableObj="tableObjLeft"
				:pageSetting="pageSetting"
				@getList="searchLeftClick"
				@onSelectionChange="leftTableCheckbox"
				ref="LeftPage"
			>
				<template #searchBefore><span class="equip-left__text">已关联设备</span></template>
			</Page>
		</div>
		<div class="equip-middle">
			<i class="el-icon-d-arrow-left" @click="toLeft"></i>
			<i class="el-icon-d-arrow-right" @click="toRight"></i>
		</div>
		<div class="equip-right">
			<Page
				:searchObj="searchObjRight"
				:tableObj="tableObjRight"
				:pageSetting="pageSetting"
				@getList="searchRightClick"
				@onSelectionChange="rightTableCheckbox"
				ref="RightPage"
			>
				<template #searchBefore><span class="equip-right__text">未关联设备</span></template>
			</Page>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, getCurrentInstance, inject, Ref } from 'vue'
import { searchObjLeft, tableObjLeft, searchObjRight, tableObjRight } from './pageData'
import {
	ajaxRelectEquip,
	ajaxUnrelectEquip,
	ajaxToRelated,
	ajaxToUnrelated,
} from '@/api/warnSetting'
import { ElMessage } from 'element-plus'
import Page from '@/components/Page.vue'
import type { resultFinalType } from '@/types/global.d'
interface DetailInfo {
	alarmSchemaScopeId: string
	monitorTypeId: string
	[key: string]: any
}
export default defineComponent({
	name: 'WarnDetailTab1',
	setup() {
		const instance = getCurrentInstance()
		const data = reactive({
			searchObjLeft: searchObjLeft.bind(instance)(),
			tableObjLeft: tableObjLeft.bind(instance)(),
			searchObjRight: searchObjRight.bind(instance)(),
			tableObjRight: tableObjRight.bind(instance)(),
			pageSetting: ref({
				innerPage: true,
			}),
		})
		const detailInfo: Ref<DetailInfo> | undefined = inject('detailInfo')
		const leftChoseArr = ref([])
		const rightChoseArr = ref([])
		const LeftPage: Ref<typeof Page | null> = ref(null)
		const RightPage: Ref<typeof Page | null> = ref(null)
		const methods = {
			leftTableCheckbox(equidpId: Array<unknown>) {
				;(leftChoseArr.value as Array<unknown>) = equidpId
			},
			rightTableCheckbox(equidpId: Array<unknown>) {
				;(rightChoseArr.value as Array<unknown>) = equidpId
			},
			searchLeftClick(e?: number) {
				const parmas = {
					pageNum: e || data.tableObjLeft.page.pageNum,
					pageSize: data.tableObjLeft.page.pageSize,
				}
				ajaxRelectEquip({
					...parmas,
					...detailInfo!.value,
					...data.searchObjLeft.data,
				}).then(res => {
					let { result } = <resultFinalType>res
					let { list, pageNum, total } = result
					data.tableObjLeft.data = list
					data.tableObjLeft.page.pageNum = pageNum
					data.tableObjLeft.page.total = total
				})
			},
			searchRightClick(e?: number) {
				const parmas = {
					pageNum: e || data.tableObjRight.page.pageNum,
					pageSize: data.tableObjRight.page.pageSize,
				}
				ajaxUnrelectEquip({
					...parmas,
					...detailInfo!.value,
					...data.searchObjRight.data,
				}).then(res => {
					let { result } = <resultFinalType>res
					let { list, pageNum, total } = result
					data.tableObjRight.data = list
					data.tableObjRight.page.pageNum = pageNum
					data.tableObjRight.page.total = total
				})
			},
			toLeft() {
				if (rightChoseArr.value.length) {
					const parmas = {
						alarmSchemaId: detailInfo!.value!.alarmSchemaId,
						equipmentIds: rightChoseArr.value.map(
							(val: { equipmentId?: string }) => val.equipmentId,
						),
					}
					ajaxToRelated(parmas).then(res => {
						if ((<resultFinalType>res).responseCode == '100000') {
							LeftPage.value!.onReset()
							methods.searchRightClick()
							setTimeout(() => {
								ElMessage({
									type: 'success',
									message: '关联成功',
								})
							}, 500)
						}
					})
				} else {
					ElMessage({
						type: 'error',
						message: '请先勾选要处理的已关联设备',
					})
				}
			},
			toRight() {
				ajaxToUnrelated
				if (leftChoseArr.value.length) {
					const parmas = {
						alarmSchemaId: detailInfo!.value!.alarmSchemaId,
						equipmentIds: leftChoseArr.value.map((val: any) => val.equipmentId),
					}
					ajaxToUnrelated(parmas).then(res => {
						if ((<resultFinalType>res).responseCode == '100000') {
							RightPage.value!.onReset()
							methods.searchLeftClick()
							setTimeout(() => {
								ElMessage({
									type: 'success',
									message: '关联成功',
								})
							}, 500)
						}
					})
				} else {
					ElMessage({
						type: 'error',
						message: '请先勾选要处理的未关联设备',
					})
				}
			},
		}

		methods.searchLeftClick(1)
		methods.searchRightClick(1)
		return {
			...methods,
			...toRefs(data),
			leftChoseArr,
			rightChoseArr,
			LeftPage,
			RightPage,
		}
	},
})
</script>

<style lang="scss" scoped>
.equip {
	display: flex;
	height: calc(100%);
	.equip-left,
	.equip-right {
		width: 47%;
		margin-top: -5px;
		.main {
			padding: 0;
		}
	}
	.equip-middle {
		width: 6%;
		padding: 100px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		color: #409eff;
		font-size: 28px;
		i {
			cursor: pointer;
		}
	}
	.equip-left__text,
	.equip-right__text {
		font-size: 12px;
		color: #515a6e;
		padding-right: 10px;
	}
}
</style>
