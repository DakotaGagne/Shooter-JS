////////////////////////////////////
////////////OTHER OBJECTS///////////
////////////////////////////////////

/*

File containing all objects that are not large enough to have their own file

*/


var map = {
	//map object
	width : 6000,
	height : 6000,
	x : -2700,
	y : -2700,
}//end of map

var mouse = {
	//mouse object
	radius : 15,
	x : 3000,
	y : 3000,
	draw : function() {
		/*
			INPUTS-none
			OUTPUTS-none
			Draws crosshair at mouse position
		*/
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
		ctx.moveTo(this.x,this.y-this.radius);
		ctx.lineTo(this.x,this.y+this.radius);
		ctx.moveTo(this.x-this.radius,this.y);
		ctx.lineTo(this.x+this.radius,this.y);
		ctx.lineWidth = this.radius/5;
		ctx.strokeStyle = "Blue";
		ctx.stroke();
		ctx.closePath();
	}//end of draw
}//end of mouse

var grid = {
	//grid object
	color : "#212a33",
	spaceX : map.width/75,
	spaceY : map.height/75,
	thickness : 2,

	draw : function(){
		/*
			INPUTS-none
			OUTPUTS-none
			Draws the grid across the map
		*/
		ctx.beginPath();
		ctx.rect(map.x-viewPort.width/2,map.y-viewPort.height/2,map.width+viewPort.width,map.height+viewPort.height);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.rect(map.x,map.y,map.width,map.height);
		ctx.fillStyle = "#858789";
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.thickness;
		for(i=map.x;i<=map.x+map.width;i+=this.spaceX){//vertical line
			ctx.moveTo(i,map.y);
			ctx.lineTo(i,map.y+map.height);
		}//end of for
		for(i=map.y;i<=map.y+map.height;i+=this.spaceY){//horizontal line
			ctx.moveTo(map.x,i);
			ctx.lineTo(map.x+map.width,i);
		}//end of for
		ctx.stroke();
		ctx.closePath();
	}//end of draw
}//end of grid


var imgSrc = {
	//object of image sources for all entities
	player : "./images/player.png",
	enemy : "./images/enemy.png",
	playerBullet : "./images/playerBullet.png",
	enemyBullet : "./images/enemyBullet.png",
	square : "./images/square.png",
	triangle : "./images/triangle.png",
	pentagon : "./images/pentagon.png",
	hexagon : "./images/hexagon.png",
	octagon : "./images/octagon.png"
} // end of imgSrc