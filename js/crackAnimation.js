var CrackAnimation = function(type,context,crackObj){
	this.times = 0;
	this.ctx = context;
	this.frame = 0;
	this.x = 0;
	this.y = 0;
	this.posName = "";
	this.size = 0;
	this.isOver = false;
	this.tempDir = 1;
	this.owner = crackObj;

	if(type == CRACK_TYPE_TANK){
		//坦克被撞击后的爆炸效果
		this.posName = "tankBomb";
		this.size = 16;
		//坦克被撞击的图像一共有4帧
		this.frame = 4;
	}else{
		this.posName = "bulletBomb";
		this.size = 32;
		this.frame = 3;
	}
	this.x = crackObj.x + (parseInt(crackObj.size-this.size)/2);
	this.y = crackObj.y + (parseInt(crackObj.size-this.size)/2);

	this.draw = function(){
		var gaptime = 3;
		//每刷新3次变换爆炸图片，更新爆炸效果
		var temp = parseInt(this.times/gaptime);
		this.ctx.drawImage(RESOURCE_IMAGE,POS[this.posName][0]+temp*this.size,POS[this.posName][1],this.size,this.size,this.x,this.y,this.size,this.size);
		this.time += this.tempDir;
		if(this.times>this.frame*gaptime-parseInt(gaptime/2)){
			//当所有爆破效果图片都在画布上呈现后，有按照出现的相反顺序再次在画布上面画出，实现爆炸效果由小变大再由大变小。
			this.tempDir = -1;
		}
		if(this.times <=0){
			this.isOver = true;
		}
	};
}