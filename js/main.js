var ctx;
var wallCtx;
var grassCtx;
var tankCtx;
var overCtx;
var menu = null;
var stage = null;
var map = null;
var player1 = null;
var player2 = null;
var prop = null;
var enemyArray = [];
var bulletArray = [];
var keys = [];
var crackArray = [];//爆炸数组
var gameState = GAME_STATE_MENU;//默认菜单状态
var level = 1;
var maxEnemy = 20;//敌方坦克总数
var maxAppearEnemy = 5;//游戏页面中出现坦克总数
var appearEnemy = 0;//已经出现的敌方坦克（包括已经销毁的）
var mainframe = 0;//定时器，记录时间保证每刷新100次检验敌方坦克是否没有完全出现的时候且屏幕中坦克数量不足maxAppearEnemy个，并添加坦克。
var isGameOver = false;
var overX = 176;
var overY = 384;
var enemyStopTime = 0;
var homeProtectedTime = -1;
var propTime = 300;
$(document).ready(function(){
	initScreen();//初始化屏幕
	initObject();//初始化所有对象
	setInterval(gameLoop,20);//每隔20ms刷新画布
});

function initScreen(){
	var canvas = $("#stageCanvas");
	ctx = canvas[0].getContext("2d");
	wallCtx = $("#wallCanvas")[0].getContext("2d");
	grassCtx = $("#grassCanvas")[0].getContext("2d");
	tankCtx = $("#tankCanvas")[0].getContext("2d");
	overCtx = $("#overCanvas")[0].getContext("2d");
	canvas.attr({"width":SCREEN_WIDTH,"height":SCREEN_HEIGHT});
	$("#wallCanvas").attr({"width":SCREEN_WIDTH,"height":SCREEN_HEIGHT});
	$("#grassCanvas").attr({"width":SCREEN_WIDTH,"height":SCREEN_HEIGHT});
	$("#tankCanvas").attr({"width":SCREEN_WIDTH,"height":SCREEN_HEIGHT});
	$("#overCanvas").attr({"width":SCREEN_WIDTH,"height":SCREEN_HEIGHT});
	//画布后的背景色
	$("#canvasDiv").css({"width":SCREEN_WIDTH,"height":SCREEN_HEIGHT,"background-color":"#000000"});
}
function initObject(){
	menu = new Menu(ctx);
	stage = new Stage(ctx,level);
	map = new Map(wallCtx,grassCtx);
	player1 = new PlayTank(tankCtx);
	player1.x = 129+map.offsetX;
	player1.y = 385+map.offsetY;
	player2 = new PlayTank(tankCtx);
	player2.x = 256+map.offsetX;
	player2.y = 385+map.offsetY;
	appearEnemy = 0;
	enemyArray = [];
	bulletArray = [];
	keys = [];
	crackArray = [];
	isGameOver = false;
	overX = 176;
	overY = 384;
	overCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
	enemyStopTime = 0;
	homeProtectedTime = -1;
	propTime = 1000;
}

function gameLoop(){
	switch(gameState){
		case GAME_STATE_MENU:
			menu.draw();
			break;
		case GAME_STATE_INIT:
			stage.draw();
			if(stage.isReady == true){
				gameState = GAME_STATE_START;
			}
			break;
		case GAME_STATE_START:
			 drawAll();
		     //家被打中，或者玩家坦克生命变成0时游戏结束
			 if(isGameOver || (player1.lives<=0 && player2.lives<=0)){
				 gameState = GAME_STATE_OVER;
				 map.homeHit();
			 }
			 //当所有坦克都出现并被打死这时游戏胜利
		     if(appearEnemy == maxEnemy && enemyArray.length == 0){
				 gameState = GAME_STATE_WIN;
			 }
			 break;
		case GAME_STATE_WIN:
			 nextLevel();
		     break;
		case GAME_STATE_OVER:
			 gameOver();
			 break;
	}
}
$(document).keydown(function(e){
	switch(gameState){
		case GAME_STATE_MENU:
			if(e.keyCode == keyboard.ENTER){
				gameState = GAME_STATE_INIT;
				if(menu.playNum == 1){
					player2.lives =0;
				}
		    }else{
				var n=0;
				if(e.keyCode == keyboard.DOWN){
					n = 1;
				}else if(e.keyCode == keyboard.UP){
					n = -1;
				}
				menu.next(n);
			}
			break;
		case GAME_STATE_START:
			//将所有按下的键值都放到keys数组中包括w,a,s,d,上下左右space和enter等但keys数组中的键值不重复
			//另外这里在key中可以同时放入这些键，但由于操作限制，同时出现w,a,s,d键那么则选择W键对应操作操作，而space和enter键也是选择space的操作，但是可以同时按下space和w,a,s,d中的任意一个
			if(!keys.contain(e.keyCode)){
			    keys.push(e.keyCode);
			}
			//一般操作坦克上下左右都会连续按键，但发射子弹不会连续按键，并且只发射一次
			if(e.keyCode == keyboard.SPACE && player1.lives>0){
				player1.shoot(BULLET_TYPE_PLAYER);
			}else if(e.keyCode == keyboard.ENTER && player2.lives>0){
				player2.shoot(BULLET_TYPE_ENEMY);
			}else if(e.keyCode == keyboard.N){
				nextLevel();
			}else if(e.keyCode == keyboard.P){
				preLevel();
			}
			break;
	}
});
function keyEvent(){
	if(keys.contain(keyboard.W)){
		player1.dir = UP;
		player1.hit = false;
		player1.move();
	}else if(keys.contain(keyboard.S)){
		player1.dir = DOWN;
		player1.hit = false;
		player1.move();
	}else if(keys.contain(keyboard.A)){
		player1.dir = LEFT;
		player1.hit = false;
		player1.move();
	}else if(keys.contain(keyboard.D)){
		player1.dir = RIGHT;
		player1.hit = false;
		player1.move();
	}
	if(keys.contain(keyboard.UP)){
		player2.dir = UP;
		player2.hit = false;
		player2.move();
	}else if(keys.contain(keyboard.DOWN)){
		player2.dir = DOWN;
		player2.hit = false;
		player2.move();
	}else if(keys.contain(keyboard.LEFT)){
		player2.dir = LEFT;
		player2.hit = false;
		player2.move();
	}else if(keys.contain(keyboard.RIGHT)){
		player2.dir = RIGHT;
		player2.hit = false;
		player2.move();
	}
}
$(document).keyup(function(e){
	keys.remove(e.keyCode);
});
//在stage.draw中被调用，在画完stage画布之后随即初始化地图画布并画出来
function initMap(){
	map.setMapLevel(level);
	map.draw();
	//drawLives();刷新游戏页面时也要画出玩家坦克，每次刷新都要更新玩家坦克的生命值，在初始时画出生命值就可以省略掉。
	
}

function drawBullet(){
	if(bulletArray != null && bulletArray.length > 0){
		for(var i = 0;i < bulletArray.length;i++){
			var bulletObj = bulletArray[i];
			if(bulletObj.isDestroyed){
				bulletObj.owner.isShooting = false;
				bulletArray.removeByIndex(i);
				i--
			}else{
				bulletObj.draw();
			}
		}
	}
}

function addEnemyTank(){
	if(enemyArray == null || enemyArray.length >= maxAppearEnemy || maxEnemy == 0){
		return ;
	}
	appearEnemy++;
	var rand = parseInt(Math.random()*3);
	var obj = null;
	switch(rand){
		case 0:
			obj = new EnemyOne(tankCtx);
			break;
		case 1:
			obj = new EnemyTwo(tankCtx);
			break;
		case 2:
			obj = new EnemyThree(tankCtx);
			break;

	}
	obj.dir =DOWN;
	obj.x = ENEMY_START[parseInt(Math.random()*3)] + map.offsetX;
	obj.y = map.offsetY;
	enemyArray.push(obj);
	map.clearEnemyNum(maxEnemy,appearEnemy);
}

function drawEnemyTanks(){
	if(enemyArray != null || enemyArray.length >0){
		for(var i=0;i<enemyArray.length;i++){
			var enemyObj = enemyArray[i];
			if(enemyObj.isDestroyed){
				enemyArray.removeByIndex(i);
				i--;
			}else{
				enemyObj.draw();
			}
		}
	}
	if(enemyStopTime>0){
		enemyStopTime --;
	}
}

function drawAll(){
	//刷新游戏场景，清空整个坦克画布
	tankCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
	//画自己的坦克
	if(player1.lives>0){
		player1.draw();
		map.drawLives(player1.lives,1);
	}
	if(player2.lives>0){
		player2.draw();
		map.drawLives(player2.lives,2);
	}
	if(appearEnemy<maxEnemy){
		//每刷新100（100*20ms）次检查场景中是否需要加入新坦克，并加入。
		if(mainframe % 100 == 0){
			addEnemyTank();
			mainframe = 0;
		}
		mainframe++;
	}
	drawEnemyTanks();
	drawBullet();
	drawCrack();
	keyEvent();
	if(propTime<=0){
		//每隔propTime事件以0.4的概率生成prop图标，每个图标持续一定时间（用刷新次数表示，在prop对象中定义）在产生图标到销毁前都会执行这个函数刷新
		drawProp();
	}else{
		propTime--;
	}
	if(homeProtectedTime>0){
		homeProtectedTime --;
	}else if(homeProtectedTime == 0){
		homeProtectedTime = -1;
		homeNoProtected();
	}
}

function drawCrack(){
	if(crackArray !=null && crackArray.length>0){
		for(var i=0;i<crackArray.length;i++){
			var crackObj = crackArray[i];
			if(crackObj.isOver){
				crackArray.removeByIndex(i);
				i--;
				if(crackObj.owner == player1){
					player1.renascenc(1);
				}else if(crackObj.owner == player2){
					player2.renascenc(2);
				}
			}else{
				crackObj.draw();
			}
		}
	}
}

function gameOver(){
	overCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
	overCtx.drawImage(RESOURCE_IMAGE,POS["over"][0],POS["over"][1],64,32,overX+map.offsetX,overY+map.offsetY,64,32);
	overY -= 2;
	if(overY <= parseInt(map.mapHeight/2)){
		initObject();
		if(menu.playNum == 1){
			player2.lives = 0;
		}
		gameState = GAME_STATE_MENU;
	}
}

function nextLevel(){
	level++;
	if(level == 22){
		level = 1;
	}
	initObject();
	if(menu.playNum == 1){
		player2.lives = 0;
	}
	stage.init(level);
	gameState = GAME_STATE_INIT;
}

function preLevel(){
	level--;
	if(level == 0){
		level=21;
	}
	initObject();
	if(menu.playNum == 1){
		player2.lives = 0;
	}
	stage.init(level);
	gameState = GAME_STATE_INIT;
	
}

function drawProp(){
	var rand = Math.random();
	//只有在rand<0.4且当前没有图标存在的时候产生新的图标
	if(rand<0.4 && prop == null){
		prop = new Prop(overCtx);
		prop.init();
	}
	if(prop!=null){
		prop.draw();
		//这里进行完draw操作直接就判断是否prop图标已经被销毁，如果被销毁就把变量prop变成null等待下次赋值
		if(prop.isDestroyed){
			prop=null;
			//alert("prop等于null了");
			propTime = 1000;
		}
	}
}

function homeNoProtected(){
	var mapChangeIndex = [[23,11],[23,12],[23,13],[23,14],[24,11],[24,14],[25,11],[25,14]];
	map.updateMap(mapChangeIndex,WALL);
}