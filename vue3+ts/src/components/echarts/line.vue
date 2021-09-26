<template>
	<div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
</template>
<script lang="ts">
import { onMounted, ref, watch, toRefs, reactive } from 'vue'
import * as echarts from 'echarts'
export default {
	props: {
		show: Boolean,
		echartsData: Object,
	},
	setup(props) {
		let myChart = ref('')
		const { show, echartsData } = toRefs(props)

		onMounted(() => {
			// 需要获取到element,所以是onMounted的Hook
			myChart = echarts.init(document.getElementById('myChart'))

			// window.onresize = function () { // 自适应大小
			//   myChart.resize();
			// };
		})
		watch(
			echartsData.value,
			(newValue, oldValue) => {
				if (echartsData.value && echartsData.value.xAxisData.length) {
					// 绘制图表

					myChart.setOption({
						xAxis: {
							data: echartsData.value.xAxisData,
						},
						yAxis: {},
						series: [
							{
								name: '用户量',
								type: 'line',
								data: echartsData.value.yAxisData,
							},
						],
					})
				}
			},
			{ immediate: true },
		)
		return {
			myChart,
		}
	},
}
</script>
