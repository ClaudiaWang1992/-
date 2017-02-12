var Map = function(wCtx,gCtx){
	this.level = 1;
	this.mapLevel = null;
	this.wallCtx = wCtx;
	this.grassCtx = gCtx;

	this.offsetX = 32;
	this.offsetY = 16;
	this.wTileCount = 26;
	this.hTileCount = 26;
	this.tileSize = 16;
	this.homeSize = 32;
	this.num = new Num(this.wallCtx);
	this.mapWidth = 416;
	this.mapHeight = 416;

	this.setMapLevel = function(level){
		this.level = level;
		var tempMap =eval("map"+this.level);
		this.mapLevel = new Array();
		for(var i=0;i<tempMap.length;i++){
			this.mapLevel[i] = new Array();
			for(var j=0;j<tempMap[i].length;j++){
				this.mapLevel[i][j] = tempMap[i][j];
			}
		}
	};
	/*
		绘制地图
	*/
	this.draw = function(){
		this.wallCtx.fillStyle = "#7f7f7f";
		this.wallCtx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		this.wallCtx.fillStyle = "#000";
		this.wallCtx.fillRect(this.offsetX,this.offsetY,this.mapWidth,this.mapHeight);
		this.grassCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

		for(var i=0;i<this.hTileCount; i++){
			for(var j=0;j<this.wTileCount;j++){
				var mapLevelObject = this.mapLevel[i][j];
				if(mapLevelObject == WALL || mapLevelObject == GRID || mapLevelObject == WATER || mapLevelObject == ICE){
					this.wallCtx.drawImage(RESOURCE_IMAGE,POS["map"][0]+(mapLevelObject-1)*this.tileSize,POS["map"][1],this.tileSize,this.tileSize,j*this.tileSize+this.offsetX,i*this.tileSize+this.offsetY,this.tileSize,this.tileSize);
				}else if(mapLevelObject == GRASS){
					this.grassCtx.drawImage(RESOURCE_IMAGE,POS["map"][0]+(mapLevelObject-1)*this.tileSize,POS["map"][1],this.tileSize,this.tileSize,j*this.tileSize+this.offsetX,i*this.tileSize+this.offsetY,this.tileSize,this.tileSize);
					console.log("画在grasss画布上");
				}else if(mapLevelObject==HOME){
					this.wallCtx.drawImage(RESOURCE_IMAGE,POS["home"][0],POS["home"][1],this.homeSize,this.homeSize,j*this.tileSize+this.offsetX,i*this.tileSize+this.offsetY,this.homeSize,this.homeSize);
				}
			}
		}
		this.drawNoChange();
		this.drawEnemyNum(maxEnemy);
		this.drawLevel();
		this.drawLives(0,1);
		this.drawLives(0,2);
	};

/*
	固定不变的部分
*/

	this.drawNoChange = function(){
		this.wallCtx.drawImage(RESOURCE_IMAGE,POS["score"][0],POS["score"][1],30,32,this.offsetX+this.mapWidth+16,SCREEN_HEIGHT/2+32,30,32);
		this.wallCtx.drawImage(RESOURCE_IMAGE,POS["score"][0]+30,POS["score"][1],30,32,this.offsetX+this.mapWidth+16,SCREEN_HEIGHT/2+32+48,30,32);
		this.wallCtx.drawImage(RESOURCE_IMAGE,POS["score"][0]+60,POS["score"][1],30,32,this.offsetX+this.mapWidth+16,SCREEN_HEIGHT/2+32+96,30,32);
	};

	this.drawLevel = function(){
		this.num.draw(this.level,468,384);
	};

	this.drawEnemyNum = function(enemyNum){
		var x =466;
		var y = 32+this.offsetY;
		var enemySize = 14;
		for(var i=1;i<=enemyNum;i++){
			var tempX = x;
			var tempY = y+parseInt((i-1)/2)*(enemySize+2);
			if(i%2==0){
				tempX = x + enemySize+2;
			}
			this.wallCtx.drawImage(RESOURCE_IMAGE,POS["enemyNum"][0],POS["enemyNum"][1],enemySize,enemySize,tempX,tempY,enemySize,enemySize)
		}
	};

	/*
		随着已经出现坦克增多，从最下面开始清除
	*/

	this.clearEnemyNum = function(totalEnemyNum,enemyNum){
		var x = 466;
		var y = 32+this.offsetY;
		if(enemyNum<=0){
			return ;
		}
		var enemySize = 14;
		this.wallCtx.fillStyle = "#7f7f7f";
		//这里应该把总数定成偶数则按这种方法，否则就相反
		var tempX = x + (enemyNum%2)*(enemySize+2);
		var tempY = y + ((Math.ceil(totalEnemyNum/2)-1)*(enemySize+2)-(parseInt((enemyNum-1)/2))*(enemySize+2));
		this.wallCtx.fillRect(tempX,tempY,enemySize,enemySize);
	 };

	 this.drawLives = function(lives,which){
		 var x = 482;
		 var y = 272;
		 if(which == 2){
			 y = 320;
		 }
		 this.wallCtx.fillStyle = "#7f7f7f";
		 this.wallCtx.fillRect(x,y,this.num.size,this.num.size);
		 this.num.draw(lives,x,y);
	 };
	/*
		在子弹射击打中作战区中的墙和prop图标时，地图的内容改变，这里传入一个二维数组来改变地图的值
		其中indexArr 是需要更新的地图索引数组，如[[1,1],[2,2]]
		value是更新后的值
	*/
	 this.updateMap = function(indexArr,value){
		if(indexArr !=null && indexArr.length>0){
			for(var i=0;i<indexArr.length;i++){
				var index = indexArr[i];
				this.mapLevel[index[0]][index[1]]=value;
				if(value>0){
					this.wallCtx.drawImage(RESOURCE_IMAGE,POS["map"][0]+this.tileSize*(value-1),POS["map"][1],this.tileSize,this.tileSize,index[1]*this.tileSize+this.offsetX,index[0]*this.tileSize+this.offsetY,this.tileSize,this.tileSize);
				}else{
					//也可以用clearRect来清除
					this.wallCtx.fillStyle = "#000";
					this.wallCtx.fillRect(index[1]*this.tileSize+this.offsetX,index[0]*this.tileSize+this.offsetY,this.tileSize,this.tileSize);
				}
			}
		}
	 };
	//家的位置固定
	 this.homeHit = function(){
		this.wallCtx.drawImage(RESOURCE_IMAGE,POS["home"][0]+this.homeSize,POS["home"][1],this.homeSize,this.homeSize,12*this.tileSize + this.offsetX, 24*this.tileSize +this.offsetY,this.homeSize,this.homeSize);
	 };
 };
