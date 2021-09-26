<template>
	<div
		class="m-page-header"
		:style="{
			height: styleSet.h ? styleSet.h + 'px' : 'auto',
		}"
	>
		<i v-if="back" class="el-icon-arrow-left header-back" @click="onBack"></i>
		<div class="m-page-header__inner" :class="hideBlock?'hideBlock':''">
			{{ title }}
			<slot name="other"></slot>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'Header',
	props: {
		title: String,
		back: Boolean,
		hideBlock: Boolean,
		styleSet: {
			type: Object,
			default() {
				return {}
			},
		},
	},
	setup(props, { emit }) {
		function onBack() {
			emit('onBack')
		}

		return {
			onBack,
		}
	},
})
</script>

<style lang="scss"></style>
