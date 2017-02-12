/**
  游戏开始菜单
**/

var Menu = function(context){
	this.ctx = context;
	this.x = 0;
	this.y = SCREEN_HEIGHT;
	this.selectTank = new SelectTank();
	this.playNum = 1;
	this.times = 0;

	this.draw = function(){
		this.times++;
		var temp = 0;
		//每隔6次刷新将选择坦克的状态变化，造成坦克移动的动画
		if(parseInt(this.times/6)%2 == 0){
			temp = 0;
		}else{
			temp = this.selectTank.size;
		}
		if(this.y <= 0){
			this.y = 0;
		}else{
			this.y -= 5;//在画布没升到最顶处时，每次刷新让画布上移5px;
		}
		this.ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);//每次在stage画布上更新时都清空画布重新画
		this.ctx.save();
		this.ctx.drawImage(MENU_IMAGE,this.x,this.y);
		this.ctx.drawImage(RESOURCE_IMAGE,POS["selectTank"][0],POS["selectTank"][1]+temp,this.selectTank.size,this.selectTank.size,this.selectTank.x,this.selectTank.ys[this.playNum-1]+this.y,this.selectTank.size,this.selectTank.size);
		this.ctx.restore();
	};
	this.next = function(n){
		this.playNum+=n;
		if(this.playNum>2){
			this.playNum = 1;
		}else if(this.playNum<1){
			this.playNum =2;
		}
	}
}