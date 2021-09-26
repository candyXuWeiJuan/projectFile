<template>
	<div class="detail">
		<header @click="$parent.showDetail = false">
			<i class="el-icon-arrow-left header-arrow"></i>
			报警方案详情
		</header>
		<el-row class="row-bg">
			<el-col :span="4">方案名称</el-col>
			<el-tooltip
				class="item"
				effect="dark"
				:content="alarmSchemaName"
				placement="right-start"
			>
				<el-col :span="4" style="width: 100px">
					{{ alarmSchemaName }}
				</el-col>
			</el-tooltip>
			<el-col :span="4">方案类型</el-col>
			<el-col :span="4">{{ alarmSchemaTypeIdText }}</el-col>
			<el-col :span="4">监测类型</el-col>
			<el-col :span="4">{{ monitorTypeName }}</el-col>
		</el-row>
		<el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
			<el-tab-pane label="警报规则" name="first">
				<tab-rule v-if="activeName == 'first'"></tab-rule>
			</el-tab-pane>
			<el-tab-pane label="关联设备" name="second">
				<tab-equip v-if="activeName == 'second'"></tab-equip>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import TabRule from './detail/tab1/index.vue'
import TabEquip from './detail/tab2/index.vue'
import { defineComponent, ref, inject, reactive, toRefs } from 'vue'
import FormCompt from '@/components/form/index.vue'
export default defineComponent({
	name: 'Nav',
	components: {
		TabRule,
		TabEquip,
		FormCompt,
	},
	setup() {
		let activeName = ref('first')
		const handleClick = (name: { paneName: unknown }) => {
			;(activeName as unknown) = name.paneName
		}
		const data = reactive({
			alarmSchemaName: '',
			alarmSchemaTypeIdText: '',
			monitorTypeName: '',
		})
		const detailRow: any = inject('detailRow')
		data.alarmSchemaName = detailRow.value.alarmSchemaName
		data.alarmSchemaTypeIdText = detailRow.value.alarmSchemaTypeIdText
		data.monitorTypeName = detailRow.value.monitorTypeName
		return { activeName, handleClick, ...toRefs(data) }
	},
})
</script>

<style lang="scss" scoped>
.detail {
	position: absolute;
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	background: white;
	padding: 10px 14px;
	z-index: 1;
	header {
		cursor: pointer;
		width: 130px;
		font-size: 14px;
	}
	.header-arrow {
		color: #459dee;
		font-size: 18;
		font-weight: bold;
	}
	.tab {
		height: calc(100% - 58px);
		overflow: hidden;
	}
}
:deep {
	.el-tabs__content {
		height: calc(100% - 55px);
	}
	.el-col-4 {
		border: 1px solid #e4e6e9;
		border-right: none;
		line-height: 25px;
		text-align: center;
		color: #515a6e;
		margin-top: 10px;
		font-weight: bold;
		height: 27px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		&:last-child {
			border-right: 1px solid #e4e6e9;
		}
		&:nth-child(2n) {
			font-weight: normal;
		}
	}
}
.row-bg {
	font-size: 12px;
}
</style>
