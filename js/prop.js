//地图中的图标，坦克挪动碰到图标改变地图中的场景
var Prop = function(context){
	this.x = 0;
	this.y = 0;
	this.duration = 600;
	this.type = 0;
	this.hit = false;
	this.width = 30;
	this.height = 28;
	this.ctx = context;
	this.isDestroyed = false;
	this.size = 28;

	this.init = function(){
		//将原来地图上的相应部分擦除（地图是不变的，改变的是显示效果）
		this.ctx.clearRect(this.x,this.y,this.width,this.height);
		this.duration = 600;
		this.type = parseInt(Math.random()*6);//从六种类型的图标中随机生成一种图标
		this.x = parseInt(Math.random()*(map.mapWidth-this.width))+map.offsetX;
		this.y = parseInt(Math.random()*(map.mapHeight-this.height))+map.offsetY;
		this.isDestroyed = false;
	};

	this.draw = function(){
		console.log("draw"+this.isDestroyed);
		if(this.duration>0 && !this.isDestroyed){
			this.ctx.drawImage(RESOURCE_IMAGE,POS["prop"][0]+this.type*this.width,POS["prop"][1],this.width,this.height,this.x,this.y,this.width,this.height);
			this.duration --;
			this.isHit();
		}else{
			this.ctx.clearRect(this.x,this.y,this.width,this.height);
			this.isDestroyed = true;
			console.log("销毁");
		}
	};

	this.isHit = function(){
		var player = null;
		if(player1.lives>0 && CheckIntersect(this,player1,0)){
			this.hit = true;
			player = player1;
			console.log(this.hit);
		}else if(player2.lives>0 && CheckInterset(this,player2,0)){
			this.hit = true;
			player = player2;
		}
		if(this.hit){
			this.isDestroyed = true;
			//必须在一撞上就清理这里的图片，因为下步会直接在主函数中销毁了当前对象。
			this.ctx.clearRect(this.x,this.y,this.width,this.height);
			switch(this.type){
				case 0:
					//增加碰到图标玩家的生命值
					player.lives++;
					break;
				case 1:
					enemyStopTime = 500;
					break;
				case 2:
					//将房子用铁墙围住一段时间
					var mapChangeIndex = [[23,11],[23,12],[23,13],[23,14],[24,11],[24,14],[25,11],[25,14]];
					map.updateMap(mapChangeIndex,GRID);
					homeProtectedTime = 500;
					break;
				case 3:
					//将当前页面上出现的所有坦克销毁
					if(enemyArray != null || enemyArray.length >0){
						for(var i=0;i<enemyArray.length;i++){
							var enemyObj = enemyArray[i];
							enemyObj.distroy();
						}
				
				    }
					break;
				case 4:
					break;
				case 5:
					player.isProtected = true;
				    player.protectedTime = 500;
					break;
			}
		}
	};
};