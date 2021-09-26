<template>
	<div id="Container" class="map"></div>
	<!-- <div class="mapstyle">
		<el-radio-group
			v-model="currentMapStyle"
			@change="map.setMapStyle('amap://styles/' + currentMapStyle)"
		>
			<el-radio v-for="(item, index) in mapStyle" :key="index" :label="item.value" border>
				{{ item.label }}
			</el-radio>
		</el-radio-group>
	</div> -->
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { mapApi } from '@/assets/js/mapFlow'
import { data } from './data'
export default defineComponent({
	name: 'WarnModel',
	setup() {
		const refData = reactive({
			AMap: '' as any,
			map: '' as any,
			mapClass: '' as any,
			// currentMapStyle: 'fc6491ecfa687b17c510ef443229e034',
			// mapStyle: [
			// 	{ label: '默认', value: 'fc6491ecfa687b17c510ef443229e034' },
			// 	{ label: '标准', value: 'normal' },
			// 	{ label: '幻影黑', value: 'dark' },
			// 	{ label: '月光银', value: 'light' },
			// 	{ label: '远山黛', value: 'whitesmoke' },
			// 	{ label: '草色青', value: 'fresh' },
			// 	{ label: '雅士灰', value: 'grey' },
			// 	{ label: '涂鸦', value: 'graffiti' },
			// 	{ label: '马卡龙', value: 'macaron' },
			// 	{ label: '靛青蓝', value: 'blue' },
			// 	{ label: '极夜蓝', value: 'darkblue' },
			// 	{ label: '酱籽', value: 'wine' },
			// ],
		})

		const mapSetting = {
			key: '3534486095a2bb5dbc50238553f76888',
			mapStyle: 'darkblue',
			id: 'Container',
		}
		//地图初始化
		const initMap = async () => {
			const { AMap, map } = await mapApi.getAsyncMap(mapSetting)
			const mapClass = new mapApi({ map })
			refData.AMap = AMap
			refData.map = map
			refData.mapClass = mapClass
			console.log(refData.AMap)
			// //加载地图管线数据
			let positions: any = [
				// [
				// 	{
				// 		pos: new refData.AMap.LngLat('113.765226', '43.818233'),
				// 	},
				// ],
			]
			data.map(val => {
				let arr = []
				val.path.map(pos => {
					arr.push({ pos: new AMap.LngLat(...pos) })
				})
				positions.push(arr)
			})
			//创建地图管线图层
			let canvasFlowSet = {
				positions,
				setLineDash: [15, 5],
				timer: null,
				lineWidth: 4,
			}
			refData.mapClass.addCanvasLayer(canvasFlowSet)
			refData.map.on('movestart', function () {
				refData.mapClass.clear()
			})
			refData.map.on('moveend', function () {
				refData.mapClass.begain(canvasFlowSet)
			})
			refData.map.setCenter([119.45887776692709, 30.91069146050347])
			refData.map.setZoom(14)
		}
		initMap()
		return {
			...toRefs(refData),
		}
	},
})
</script>

<style lang="scss" scoped>
.map {
	width: 100%;
	height: 100vh;
}
.mapstyle {
	background: white;
	width: 110px;
	position: fixed;
	right: 10px;
	top: 10px;
	padding: 10px 10px 0 0;
}
:deep {
	.el-radio--mini {
		width: 90px;
		margin-bottom: 10px;
		margin-left: 10px;
	}
}
</style>
