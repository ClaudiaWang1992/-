//表示当前等级的stage画布
var Num = function(context){
	this.ctx = context;
	this.size = 14;
	//画数字使用的函数
	this.draw = function(num,x,y){
		var tempX = x;
		var tempY = y;
		var tempNumArray = [];
		if(num == 0){
			tempNumArray.push(0);
		}else{
			while(num>0){
				tempNumArray.push(num%10);
				num = parseInt(num/10);
			}
		}
		for(var i=tempNumArray.length-1;i>=0;i--){
			temp = tempNumArray[i]*this.size;
			this.ctx.drawImage(RESOURCE_IMAGE,POS["num"][0]+temp,POS["num"][1],this.size,this.size,x+this.size*(tempNumArray.length-i-1),tempY,this.size,this.size);
		}
	};
};