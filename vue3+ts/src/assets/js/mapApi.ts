import AMapLoader from "@amap/amap-jsapi-loader";
export class mapLoad {
	static async getAsyncMap(mapSetting:Record<any,any>) {
		const {AMap,map} = await this.load(mapSetting)
		window.AMap = AMap
		return {AMap,map}
	}
	static load(mapSetting:Record<any,any>){
		return new Promise((resolve,reject)=>{
			AMapLoader.load({
				//注册开发者/创建应用，选择web端JS API（必须）
				key:mapSetting.key,//首次load必填
				version:mapSetting.version||"1.4.6",
				AMapUI: {
					version: mapSetting.AMapUIVersion,
					plugins:mapSetting.AMapUIPlugin
				},
			}).then(() => {
				var map = new AMap.Map(mapSetting.id, {
					zoom: 10,
					mapStyle:`amap://styles/${mapSetting.mapStyle}`
				});
				resolve({AMap,map})
			})
		})
	}
	marker(){}
}