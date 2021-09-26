<template>
	<div
		class="each"
		v-for="(page, index) in routeList"
		:key="index"
		@click="$router.push(page.path)"
	>
		{{ page.meta && page.meta.title }}
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
	name: 'Nav',
	setup() {
		const {
			options: { routes },
		} = useRouter()
		const routeList = ref(routes)
		return { routeList }
	},
})
</script>

<style lang="scss">
.each {
	color: #409eff;
	cursor: pointer;
	padding: 10px 10px 10px 20px;
}
</style>
