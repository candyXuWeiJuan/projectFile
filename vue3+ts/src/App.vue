<template>
	<el-config-provider :locale="locale">
		<router-view></router-view>
	</el-config-provider>
	<i v-loading.fullscreen.lock="needLoading"></i>
</template>
<script lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { computed, defineComponent } from 'vue'
import store from '@/vuex/store'
export default defineComponent({
	components: { ElConfigProvider },
	setup() {
		const needLoading = computed(() => {
			return store.getters.needLoading
		})
		console.log(2)
		return {
			locale: zhCn,
			needLoading,
		}
	},
})
</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	box-sizing: border-box;
	position: relative;
	width: 100%;
	height: 100%;
}
</style>
