/*
	对数组操作内容的补充
*/
Array.prototype.remove = function(obj){
	var i=0,n=0;
	for(i=0;i<this.length;i++){
		if(this[i] != obj){
			this[n++] = this[i];
		}
	}
	if(n<i){
		this.length = n;
	}
};

Array.prototype.removeByIndex = function(index){
	var i=0,n=0;
	for(i=0;i<this.length;i++){
		if(this[i]!=this[index]){
			this[n++]=this[i];
		}
	}
	if(n<i){
		this.length = n;
	}
};

Array.prototype.contain = function(obj){
	for(var i=0;i<this.length;i++){
		if(this[i]==obj){
			return true;
		}
	}
	return false;
};