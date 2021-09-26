<template>
	<div class="main" :style="{ height: mainPageH }">
		<!-- 页面标题 -->
		<Header :title="title" v-if="title"></Header>
		<div class="page-content" :style="{ height: pageH }">
			<!-- 搜索 -->
			<div class="page-search">
				<slot name="searchBefore"></slot>
				<el-form class="page-search__left" ref="searchRef" :model="searchObj.data">
					<el-form-item
						v-for="(item, index) in searchObj.model"
						v-show="
							!searchObj.expandNum ||
							(index >= searchObj.expandNum ? (searchExpand ? true : false) : true)
						"
						:key="index"
						:label="item.label"
						:prop="item.key"
					>
						<!-- 1输入框 -->
						<el-input
							v-if="item.type === 1"
							v-model="searchObj.data[item.key]"
							:placeholder="item.placeholder"
							clearable
							:style="{ width: item.width ? item.width + 'px' : '140px' }"
						></el-input>

						<!-- 2下拉框 -->
						<el-select
							v-if="item.type === 2"
							v-model="searchObj.data[item.key]"
							:placeholder="item.placeholder"
							:filterable="item.filterable || false"
							clearable
							:style="{ width: item.width ? item.width + 'px' : '140px' }"
						>
							<el-option
								v-for="opItem in item.options"
								:key="opItem.value"
								:value="opItem.value"
								:label="opItem.label"
							>
								{{ opItem.label }}
							</el-option>
						</el-select>

						<!-- 3日期选择器 -->
						<el-date-picker
							v-if="item.type === 3"
							v-model="searchObj.data[item.key]"
							:default-value="searchObj.data[item.key]"
							:type="item.dateType || 'daterange'"
							value-format="YYYY-MM-DD"
							placeholder="请选择日期"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:disabledDate="item.disabledDate" 
						></el-date-picker>
					</el-form-item>

					<div class="search-btn">
						<el-button type="primary" @click="getList(1)">查询</el-button>
						<el-button plain @click="onReset(1)">重置</el-button>
						<el-button
							v-if="
								searchObj.expandNum && searchObj.model.length > searchObj.expandNum
							"
							type="text"
							@click="searchExpand = !searchExpand"
						>
							{{ searchExpand ? '收起' : '展开' }}
							<i :class="searchExpand ? 'el-icon-top' : 'el-icon-bottom'"></i>
						</el-button>
					</div>
				</el-form>

				<div class="page-search__right">
					<slot name="searchRight"></slot>
				</div>
			</div>

			<!-- 表格 -->
			<el-table
				:data="tableObj.data"
				border
				class="page-table"
				@selection-change="onSelectionChange"
			>
				<el-table-column
					v-for="(item, index) in tableObj.column"
					:key="index"
					:prop="item.prop"
					:label="item.title"
					:width="item.width"
					:type="item.type"
					:selectable="tableObj.selectable"
					:show-overflow-tooltip="item.showToolTip"
				>
					<template #default="scope" v-if="item.render">
						<ex-slot
							v-if="item.render"
							:render="item.render"
							:row="scope.row"
							:index="scope.$index"
							:column="item"
						></ex-slot>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-bind="paginationProp"
				@current-change="getList"
				@size-change="onSizeChange"
				v-model:current-page.sync="tableObj.page.pageNum"
				:page-size="tableObj.page.pageSize || 20"
				:page-sizes="[10, 20, 50, 100, 200, 500]"
				:total="tableObj.page.total"
				class="page-pagination"
			></el-pagination>
		</div>
	</div>
</template>

<script>
import { ref, computed } from 'vue'
import exSlot from '@/utils/exSlot'

export default {
	name: 'Page',
	components: { exSlot },
	props: {
		title: String,

		/*
		 *searchObj.expandNum：默认展开的搜索项数量，不传则全部展示
		 *searchObj.model: 表单模板
		 *searchObj.data: 表单数据
		 */
		searchObj: Object,

		/*
		 *tableObj.column: 表格列
		 *tableObj.data: 表格数据
		 *tableObj.page: 表格分页
		 */
		tableObj: Object,
		pageSetting: Object,
	},

	emits: ['getList', 'onSelectionChange'],

	setup(prop, context) {
		const searchExpand = ref(false)

		function getList(val) {
			context.emit('getList', val)
		}

		function onSizeChange(e) {
			prop.tableObj.page.pageSize = e
			context.emit('getList')
		}

		// 重置
		const searchRef = ref(null)
		function onReset() {
			searchRef.value.resetFields()
			getList(1)
		}

		// 表格选中
		function onSelectionChange(val) {
			context.emit('onSelectionChange', val)
		}

		let union = ref('%')
		const pageH = computed(() => {
			union.value = prop.pageSetting && prop.pageSetting.innerPage ? '%' : 'vh'
			return prop.title ? `calc(100${union.value} - 40px)` : `calc(100${union.value})`
		})
		const mainPageH = computed(() => {
			return '100' + union.value
		})

		// 动态配置分页组件属性
		const paginationProp = computed(() => {
			if (prop.tableObj.page.simple) {
				return {
					background: false,
					layout: 'total, prev, pager, next',
				}
			} else {
				return {
					background: true,
					layout: 'total, sizes, prev, pager, next, jumper',
				}
			}
		})
		return {
			getList,
			onSelectionChange,
			onSizeChange,
			onReset,
			searchRef,
			searchExpand,
			pageH,
			mainPageH,
			paginationProp,
		}
	},
}
</script>

<style lang="scss" scoped>
:deep {
	.el-icon-arrow-left,
	.el-icon-arrow-right {
		margin: auto;
	}
	.el-date-editor--daterange.el-input__inner {
		width: 300px;
	}
}
.page-content {
	display: flex;
	flex-direction: column;
}
.page-search {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.el-form-item {
		margin: 6px 6px 6px 0;
	}
	.page-search__left {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		&.expand {
			height: auto;
		}
	}
	.page-search__right {
		height: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		margin-bottom: 10px;
	}
}
.page-table {
	flex: 1;
	margin: 8px 0 10px 0;
}
.page-pagination {
	display: flex;
	justify-content: flex-end;
}
</style>
