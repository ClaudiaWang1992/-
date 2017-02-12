var Stage = function(context,l){
	this.ctx = context;
	this.ctx.fillStyle = "#7f7f7f";
	this.drawHeight = 15;
	this.level = l;
	this.temp = 0;
	this.dir = 1;//1:合上，-1：展开
	this.isReady = false;
	this.levelNum = new Num(context);
	
	this.init = function(level){
		this.dir = 1;
		this.isReady = false;
		this.level = level;
		this.temp = 0;
	};

	this.draw = function(){
		if(this.dir == 1){
			if(this.temp == 225){
				this.ctx.drawImage(RESOURCE_IMAGE,POS["stageLevel"][0],POS["stageLevel"][1],78,14,194,208,78,14);
				this.levelNum.draw(this.level,308,208);
				initMap();
			}else if(this.temp == 225+600){
				this.temp = 225;
				this.dir = -1;
			}else{
				this.ctx.fillRect(0,this.temp,512,this.drawHeight);
				this.ctx.fillRect(0,SCREEN_HEIGHT-this.temp-this.drawHeight,512,this.drawHeight);
			}
		}else{
			if(this.temp>=0){
				this.ctx.clearRect(0,this.temp,512,this.drawHeight);
				this.ctx.clearRect(0,SCREEN_HEIGHT-this.temp-this.drawHeight,512,this.drawHeight);
			}else{
				this.isReady = true;
			}
		
		}
		this.temp += this.drawHeight * this.dir;
	};
};