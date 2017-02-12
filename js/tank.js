/**
	坦克基类
**/
var Tank = function(){
	this.x = 0;//坦克目前实际位置
	this.y = 0;
	this.size = 32;
	this.dir = UP;
	this.speed = 1;
	this.frame = 0;//敌方坦克方向自动切换，frame用来记录刷新次数来切换坦克方向
	this.hit = false;//坦克是否与地图，边界，或坦克相撞。
	this.isAI = false;//是否自动，敌方坦克都是自动的，也相当于是否是地方坦克
	this.isShooting = false;//子弹是否运行中，子弹运行中则不能打下一发子弹
	this.isDestroyed = false;
	this.bullet = null;//该坦克对应的子弹，每个坦克在当前图中只对应一颗子弹，因为只有一颗子弹消亡才能发射第二颗
	this.shootRate = 0.6;//敌军子弹设置的，在刷新固定次数后以0.6的概率进行射击。
	this.tempX = 0;//坦克目前运行到的位置，可能会超出实际位置
	this.tempY =0;//坦克目前运行到的位置，可能会超出实际位置

	this.move = function(){
		//enemyStopTime是用来冻结move操作的，只要是敌人且enemyStopTime不为0则冻结move操作。

		if(this.isAI && enemyStopTime>0){
			return ;
		}

		this.tempX = this.x;
		this.tempY = this.y;
		
		if(this.isAI){
			this.frame++;
			//刷新100次或者发现当前已经与地图内容或者坦克相撞时换方向
			if(this.frame % 100==0||this.hit){
				/*if(this.x<32||this.x>416){
					console.log(this.hit);
					console.log(this.x+' '+this.y);
				}*/
				this.dir = parseInt(Math.random()*4);
				this.hit = false;
				this.frame = 0;
			}
		}
		if(this.dir == UP){
			this.tempY -= this.speed;
		}else if(this.dir == DOWN){
			this.tempY += this.speed;
		}else if(this.dir == LEFT){
			this.tempX -= this.speed;
		}else if(this.dir == RIGHT){
			this.tempX += this.speed;
		}
		this.isHit();
		if(!this.hit){
			this.x = this.tempX;
			this.y = this.tempY;
		}
	};

	this.isHit = function(){
		//首先计算跟边界是否会碰撞
		if(this.dir == LEFT){
			if(this.x<=map.offsetX){
				this.x = map.offsetX;
				this.hit = true;
			}
		}else if(this.dir == RIGHT){
			if(this.x>=map.offsetX+map.mapWidth-this.size){
				this.x = map.offsetX+map.mapWidth-this.size;
				this.hit = true;
			}
		}else if(this.dir == UP){
			if(this.y<=map.offsetY){
				this.y = map.offsetY;
				this.hit = true;
			}
		}else if(this.dir == DOWN){
			if(this.y>=map.offsetY+map.mapHeight-this.size){
				this.y = map.offsetY+map.mapHeight-this.size;
				this.hit = true;
			}
		}
		if(this.x<map.offsetX || this.x>map.offsetX+map.mapWidth-this.size){
			console.log(this.x+' '+this.y);
		}
		//再计算是否和地图元素碰撞
		if(!this.hit){
			if(tankMapCollision(this,map)){
				this.hit = true;
			}
		}
		//最后计算是否和其他坦克碰撞
		/*if(enemyArray != null && enemyArray.length>0){
			for(var i=0;i<enemyArray.length;i++){
				if(enemyArray[i] != this && CheckIntersect(enemyArray[i],this,0)){
					this.hit = true;
					break;
				}
			}
		}*/
	};
	this.shoot = function(type){
		if(this.isAI && enemyStopTime > 0){
			return ;
		}
		if(this.isShooting){
			return ;
		}else{
			var tempX = this.x;
			var tempY = this.y;
			this.bullet = new Bullet(this.ctx,this,type,this.dir);
			if(this.dir == UP){
				//向上或向左方向发射的子弹因为是子弹的下端和右端紧挨坦克，要保证子弹与坦克自身不相交那么字段坐标必须加上子弹的宽度
				tempX = this.x+parseInt(this.size/2)-parseInt(this.bullet.size/2);
				tempY = this.y-this.bullet.size;
			}else if(this.dir == DOWN){
				//向右或向下的坦克是子弹的左端和上端紧挨坦克，这个时候就不需要加子弹自身高度
				tempX = this.x+parseInt(this.size/2)-parseInt(this.bullet.size/2); 
				tempY = this.y+this.size;
			}else if(this.dir == LEFT){
				tempX = this.x-this.bullet.size;
				tempY = this.y+parseInt(this.size/2)-parseInt(this.bullet.size/2);
			}else if(this.dir ==RIGHT){
				tempX = this.x+this.size;
				tempY = this.y+parseInt(this.size/2)-parseInt(this.bullet.size/2);
			}
			this.bullet.x = tempX;
			this.bullet.y = tempY;
			this.bullet.draw();
			bulletArray.push(this.bullet);
			this.isShooting = true;
		}

	};

	this.distroy = function(){
		this.isDestroyed = true;
		crackArray.push(new CrackAnimation(CRACK_TYPE_TANK,this.ctx,this));
	};
};

var SelectTank = function(){
	this.ys = [250,281];
	this.x = 140;
	this.size = 27;
};
SelectTank.prototype = new Tank();

/*玩家坦克*/
/*在玩家坦克这个继承Tank的类中主要是完成画坦克，销毁坦克和重置坦克的*/
var PlayTank = function(context){
	this.ctx = context;
	this.lives = 3;
	this.isProtected = true;
	this.protectedTime = 500;
	this.offsetX = 0;//在雪碧图中两个坦克图片间的距离
	this.speed = 2;

	this.draw = function(){
		this.hit = false;
		this.ctx.drawImage(RESOURCE_IMAGE,POS["player"][0]+this.offsetX+this.size*this.dir,POS["player"][1],this.size,this.size,this.x,this.y,this.size,this.size);
		if(this.isProtected){
			//每刷新5次更换显示的保护图片（图片宽高为32）
			var temp = parseInt((500-this.protectedTime)/5)%2;
			this.ctx.drawImage(RESOURCE_IMAGE,POS["protected"][0],POS["protected"][1]+32*temp,32,32,this.x,this.y,32,32);
			this.protectedTime--;
			if(this.protectedTime == 0){
				this.isProtected = false;
			}
		}
	};
	
	this.distroy = function(){
		this.isDestroyed = true;
		crackArray.push(new CrackAnimation(CRACK_TYPE_TANK,this.ctx,this));
	};
	//每次当子弹击中玩家坦克后会调用.distroy方法，将当前的crack对象放到crackArray爆炸对象数组中，在后面遍历这个数组产生爆炸效果的时候在坦克还有生命值的情况下，重置玩家坦克位置
	this.renascenc = function(player){
		this.lives--;
		this.dir = UP;
		this.isProtected = true;
		this.protectedTime = 500;
		this.isDestroyed = false;
		var temp = 0;
		if(player == 1){
			temp = 129;
		}else{
			temp = 256;
		}
		this.x = temp + map.offsetX;
		this.y = 385 + map.offsetY;
	};
};
PlayTank.prototype = new Tank();

/*敌手坦克1*/

var EnemyOne = function(context){
	this.ctx = context;
	//敌手坦克有一个从无到有的过程，直到完全出现才使得.isAppear为true
	this.isAppear = false;
	this.times = 0;
	this.lives = 1;
	this.isAI = true;
	this.speed = 1.5;

	this.draw = function(){
		this.times++;
		if(!this.isAppear){
			//生成一个坦克过程中，每刷新5次画面后 更新显示图片,图片size为32
			var temp = parseInt(this.times/5)%7;
			this.ctx.drawImage(RESOURCE_IMAGE,POS["enemyBefore"][0]+temp*32,POS["enemyBefore"][1],32,32,this.x,this.y,32,32);
			if(this.times == 35){
				this.isAppear = true;
				this.times = 0;
				this.shoot(2);
			}
				
			}else{
				this.ctx.drawImage(RESOURCE_IMAGE,POS["enemy1"][0]+this.dir*this.size,POS["enemy1"][1],32,32,this.x,this.y,this.size,this.size);
				//每刷新50次后以0.6的概率发射子弹
				if(this.times%50 ==0){
					var ran = Math.random();
					if(ran<0.6){
						this.shoot(2);
					}
					this.times = 0;
				}
				this.move();//move操作在冻结的时候不起作用。
			}
	};
};
EnemyOne.prototype = new Tank();

/*敌方坦克2*/

var EnemyTwo = function(context){
	this.ctx = context;
	this.isAppear = false;
	this.times = 0;
	this.lives = 2;
	this.isAI = true;
	this.speed = 1;

	this.draw = function(){
		this.times++;
		if(!this.isAppear){
			var temp = parseInt((this.times/5)%7);
			this.ctx.drawImage(RESOURCE_IMAGE,POS["enemyBefore"][0]+temp*32,POS["enemyBefore"][1],32,32,this.x,this.y,32,32);
			if(this.times == 35){
				this.isAppear = true;
				this.times = 0;
				this.shoot(2);
			}
		}else{
			this.ctx.drawImage(RESOURCE_IMAGE,POS["enemy2"][0]+this.dir*this.size+(2-this.lives)*this.size*4,POS["enemy2"][1],this.size,this.size,this.x,this.y,this.size,this.size);
			if(this.times%50==0){
				var ran = Math.random();
				if(ran<0.6){
					this.shoot(2);
				}
				this.times = 0;
			}
			this.move();
		}
	};
};
EnemyTwo.prototype = new Tank();

/*敌方坦克3*/

var EnemyThree = function(context){
	this.ctx = context;
	this.isAppear = false;
	this.times = 0;
	this.lives = 3;
	this.isAI = true;
	this.speed = 0.5;

	this.draw = function(){
		this.times++;
		if(!this.isAppear){
			var temp = parseInt((this.times/5)%7);
			this.ctx.drawImage(RESOURCE_IMAGE,POS["enemyBefore"][0]+32*temp,POS["enemyBefore"][1],32,32,this.x,this.y,32,32);
			if(this.times == 35){
				this.isAppear = true;
				this.times = 0;
				this.shoot(2);
			}
		}else{
			this.ctx.drawImage(RESOURCE_IMAGE,POS["enemy3"][0]+this.dir*this.size+(3-this.lives)*this.size*4,POS["enemy3"][1],this.size,this.size,this.x,this.y,this.size,this.size);
			if(this.times%50==0){
				var ran = Math.random();
				if(ran<0.6){
					this.shoot(2);
				}
				this.times = 0;
			}
			this.move();
		}
	};
};
EnemyThree.prototype = new Tank();
	