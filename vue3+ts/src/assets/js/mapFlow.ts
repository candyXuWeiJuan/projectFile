import {mapLoad} from "./mapApi";
export class mapApi extends mapLoad{
	loaded=false;
	width=0;
	height=0;
	color=["#10decf","#e80e14","#4cee1d"];
	layerMap=new Map();
	offSet=0;
	timer=null as any;
	constructor({ map }:Record<any,any>){
		super()
		this.map=map
	}
	addCanvasLayer(canvasFlowSet:any){
		const self=this
		const canvas = document.createElement("canvas");
		const canvasLayer = new AMap.CustomLayer(canvas, {});
		const ctx = canvas.getContext("2d");
		this.ctx=ctx
		var size =this.map.getSize(); //resize
		this.width = size.width;
		this.height = size.height;
		canvas.style.width =this.width + "px";
		canvas.style.height = this.height + "px";
		canvas.width = this.width;
		canvas.height = this.height; //清除画布
		ctx.lineWidth = canvasFlowSet.lineWidth;
		const onRender = function () {
			if(self.loaded)return
			self.drawDashLine(canvasFlowSet);
			self.loaded=true
		};
		canvasLayer.render = onRender;
		canvasLayer.setMap(this.map);
		this.layerMap.set("canvasLayer",{canvasLayer,ctx,canvas})
	}
	drawDashLine(canvasFlowSet:any){
		let self=this
		const {setLineDash,lineWidth,positions}=canvasFlowSet
		const {ctx}=this.layerMap.get("canvasLayer")
        ctx.clearRect(0, 0, this.width, this.height);
		//线数组遍历
		positions.map((val,index)=>{
			let color
			if(!val.color){color=Math.floor(Math.random()*this.color.length)
			val.color=this.color[color]}
			ctx.strokeStyle = val.color||this.color[color];
			ctx.beginPath();
			//第一个点
			ctx.setLineDash(setLineDash);
			ctx.lineDashOffset=this.offSet;
			//其他的点
			for (var i = 0; i < val.length; i += 1) {
				var center = val[i].pos;
				var pos = this.map.lngLatToContainer(center);
				if(i==0)ctx.moveTo(pos.x, pos.y);
				else ctx.lineTo(pos.x, pos.y);
			}
			ctx.stroke();
			ctx.closePath();
		})
		//蚂蚁线动画偏移处理
		if (this.offSet > 20) {
		    this.offSet = 0;
		}
		this.offSet++;
		//通过setTimeout递归调用绘制;
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
		    self.drawDashLine({setLineDash,lineWidth,positions});
		}, 50);
	}
	clear(){
        if (this.timer) clearTimeout(this.timer);
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
	begain(canvasFlowSet){
		this.drawDashLine(canvasFlowSet);
	}
}
