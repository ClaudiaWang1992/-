function CheckIntersect(object1,object2,overlap){
	//    x-轴                      x-轴
	//  A1------>B1 C1              A2------>B2 C2
	//  +--------+   ^              +--------+   ^
	//  | object1|   | y-轴         | object2|   | y-轴
	//  |        |   |              |        |   |
	//  +--------+  D1              +--------+  D2
	//
	//overlap是重叠的区域值
	A1 = object1.x+overlap;
	B1 = object1.x+object1.size-overlap;
	C1 = object1.y+overlap;
	D1 = object1.y+object1.size-overlap;

	A2 = object2.x+overlap;
	B2 = object2.x+object2.size-overlap;
	C2= object2.y+overlap;
	D2 = object2.y+object2.size-overlap;

	if(A1>B2||B1<A2||C1>D2||D1<C2){
		return false;
	}
	return true;
}

/*坦克与地图碰撞*/

function tankMapCollision(tank,mapobj){
	var tileNum = 0;//需要检测的tile数
	var rowIndex = 0;//map中的行索引
	var colIndex = 0;//map中的列索引
	var overlap = 3;//允许重叠的大小

	//根据目前坦克所在位置x/y计算出map中的row和col,找到坦克左上角目前位于的地图块
	if(tank.dir == UP){
		rowIndex = parseInt((tank.tempY+overlap-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((tank.tempX+overlap-mapobj.offsetX)/mapobj.tileSize);
	}else if(tank.dir == DOWN){
		//找到坦克左下角位于的地图块
		rowIndex = parseInt((tank.tempY+tank.size-overlap-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((tank.tempX+overlap-mapobj.offsetX)/mapobj.tileSize);
	}else if(tank.dir == LEFT){
		//找到坦克左上角位于的地图块
		rowIndex = parseInt((tank.tempY+overlap-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((tank.tempX+overlap-mapobj.offsetX)/mapobj.tileSize);
	}else if(tank.dir == RIGHT){
		//找到坦克右上角位于的地图块
		rowIndex = parseInt((tank.tempY+overlap-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((tank.tempX+tank.size-overlap-mapobj.offsetX)/mapobj.tileSize);
	}
	if(rowIndex>=mapobj.hTileCount||rowIndex<0||colIndex>=mapobj.wTileCount||colIndex<0){
		return true;
	}
	if(tank.dir == UP ||tank.dir == DOWN){
		var tempWidth = parseInt(tank.tempX - map.offsetX-(colIndex)*mapobj.tileSize+tank.size-overlap);//坦克右边到其左上角所在地图块左边的位置，用来计算坦克向上与几个地图块相撞
		if(tempWidth % mapobj.tileSize == 0){
			tileNum = parseInt(tempWidth/mapobj.tileSize);
		}else{
			tileNum = parseInt(tempWidth/mapobj.tileSize)+1;
		}
		for(var i=0;i<tileNum && colIndex+i<mapobj.wTileCount;i++){
			var mapContent = mapobj.mapLevel[rowIndex][colIndex+i];
			if(mapContent == WALL || mapContent == GRID || mapContent == WATER || mapContent == HOME || mapContent == CONTAIN){
				if(tank.dir == UP){
					tank.y = mapobj.offsetY + rowIndex*mapobj.tileSize + mapobj.tileSize - overlap;
				}else{
					tank.y = mapobj.offsetY + rowIndex*mapobj.tileSize + overlap-tank.size;
				}
				return true;
			}
		}

	}else{
		var tempHeight = parseInt(tank.tempY - map.offsetY - (rowIndex)*mapobj.tileSize+tank.size-overlap);
		//如果tempHeight出错，例如比实际大，就会出现将一块不在坦克覆盖范围的地图块认为是坦克覆盖范围，这时若这个地图块刚好是障碍就会认为坦克碰到障碍了，调用相应处理会导致位移偏移。
		if(tempHeight%mapobj.tileSize==0){
			tileNum = parseInt(tempHeight/mapobj.tileSize);
		}else{
			tileNum = parseInt(tempHeight/mapobj.tileSize)+1;
		}
		for(var i=0; i<tileNum && rowIndex+i<mapobj.hTileCount;i++){
			var mapContent = mapobj.mapLevel[rowIndex+i][colIndex];
			if(mapContent == WALL || mapContent == WATER || mapContent ==GRID ||mapContent == HOME || mapContent == CONTAIN){
				if(tank.dir == LEFT){
					tank.x = colIndex*mapobj.tileSize + mapobj.tileSize + mapobj.offsetX-overlap;
				}else{
					tank.x = colIndex*mapobj.tileSize +overlap+mapobj.offsetX-tank.size;
				}
				//console.log("相撞");
				console.log((rowIndex+i)+" "+colIndex);
				return true;
			}
		}
	}
	return false;
}

/*子弹与地图块的碰撞*/
function bulletMapCollision(bullet,mapobj){
	var tileNum = 0;
	var rowIndex = 0;
	var colIndex = 0;
	var mapChangeIndex = [];
	var result = false;

	if(bullet.dir == UP){
		//子弹左上角在哪个地图块中
		rowIndex = parseInt((bullet.y-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((bullet.x-mapobj.offsetX)/mapobj.tileSize);
	}else if(bullet.dir == DOWN){
		//子弹左下角在哪个地图块中
		rowIndex = parseInt((bullet.y+bullet.size-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((bullet.x-mapobj.offsetX)/mapobj.tileSize);
	}else if(bullet.dir == LEFT){
		//子弹的左上角在哪个地图块中
		rowIndex = parseInt((bullet.y-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((bullet.x-mapobj.offsetX)/mapobj.tileSize);
	}else if(bullet.dir == RIGHT){
		//子弹的右上角在哪个地图块中
		rowIndex = parseInt((bullet.y-mapobj.offsetY)/mapobj.tileSize);
		colIndex = parseInt((bullet.x-mapobj.offsetX+bullet.size)/mapobj.tileSize);
	}
	if(rowIndex >= mapobj.hTileCount || rowIndex<0 ||colIndex >=mapobj.wTileCount ||colIndex<0){
		return true;
	}
	//计算子弹当前位置与几个地图块发生了碰撞
	if(bullet.dir == UP || bullet.dir == DOWN){
		var tempWidth = parseInt(bullet.x-colIndex*mapobj.tileSize-mapobj.offsetX+bullet.size);
		if(tempWidth % mapobj.tileSize==0){
			tileNum = parseInt(tempWidth/mapobj.tileSize);
		}else{
			tileNum = parseInt(tempWidth/mapobj.tileSize)+1;
		}
		for(var i=0;i<tileNum && colIndex+i<mapobj.wTileCount;i++){
			var mapContent = mapobj.mapLevel[rowIndex][colIndex+i];
			if(mapContent == WALL ||mapContent == GRID || mapContent == HOME || mapContent == CONTAIN){
				result = true;
				if(mapContent == WALL){
					mapChangeIndex.push([rowIndex,colIndex+i]);
				}else if(mapContent == GRID){
				}else{
					isGameOver = true;
					break; 
				}
			}
		}
	}else{
		var tempHeight = parseInt(bullet.y-rowIndex*mapobj.tileSize-map.offsetY+bullet.size);
		if(tempHeight%mapobj.tileSize == 0){
			tileNum = parseInt(tempHeight/mapobj.tileSize);
		}else{
			tileNum = parseInt(tempHeight/mapobj.tileSize)+1;
		}
		for(var i=0;i<tileNum && rowIndex+i<mapobj.hTileCount;i++){
			var mapContent = mapobj.mapLevel[rowIndex+i][colIndex];
			if(mapContent == WALL || mapContent == GRID || mapContent == HOME || mapContent==CONTAIN){
				result = true;
				if(mapContent == WALL){
					mapChangeIndex.push([rowIndex+i,colIndex]);
				}else if(mapContent == GRID){
				}else{
					isGameOver = true;
					break;
				}
			}
		}
	}
	map.updateMap(mapChangeIndex,0);
	return result;
}