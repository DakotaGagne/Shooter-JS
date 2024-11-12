////////////////////////////////////
////////////////SHAPES//////////////
////////////////////////////////////

var Shape = function(x,y,index,size,shape){
	this.x = x; // x pos
	this.y = y; // y pos
	this.index = index; // index within containing array
	this.size = size; // size of shape
	this.points = size*1.5; // value of shape (based on size)
	this.health = size*4; // health of shape (based on size)
	this.healthMax = size*4; // max health of shape (based on size)
	this.v1 = [this.x,this.y+this.size];//vertice 1 (bottom left)
	this.v2 = [this.x+this.size/2,this.y];//vertice 2 (top)
	this.v3 = [this.x+this.size,this.y+this.size];//vertice 3 (bottom right)
	this.getPoints = function() {return this.points}; // returns shape's points value
	this.draw = function(){
		/*
			INPUTS-none
			OUTPUTS-none
			Draws shape on canvas
		*/
		var img = new Image(); // image of shape
		switch(shape){ // sets proper image based on shape
			case 0: img.src = imgSrc.triangle;break;
			case 1: img.src = imgSrc.square;break;
			case 2: img.src = imgSrc.pentagon;break;
			case 3: img.src = imgSrc.hexagon;break;
			case 4: img.src = imgSrc.octagon;break;
		}//end of switch
		
		ctx.drawImage(img,this.x+map.x,this.y+map.y,this.size*1.25,this.size*1.25);
		drawHealth(this.x+this.size+this.size/10,this.y+this.size+12,this.healthMax,this.health,this.size,5);
	}//end of draw

	this.checkLife = function(){
		/*
			INPUTS-none
			OUTPUTS-none

			Checks if health has run out
		*/
		if(this.health<=0){ // Respawns with different size/value and shape and location
			var randSize = Math.floor(Math.random()*101);
			//bigger sizes are less common
			if(randSize<30)var size = 15;
			else if(randSize<50)var size = 20;
			else if(randSize<70)var size = 25;
			else if(randSize<82)var size = 27;
			else if(randSize<89)var size = 32;
			else if(randSize<94)var size = 36;
			else if(randSize<97)var size = 40;
			else var size = 45;
			var xPos = Math.floor(Math.random()*(map.width-size));
			var yPos = Math.floor(Math.random()*(map.height-size));
			var shape = Math.floor(Math.random()*5);
			shapes[this.index] = new Shape(xPos,yPos,this.index,size,shape);
		}//end of if
	}//end of checkLife

	this.hurt = function(val){
		/*
			INPUTS
				val - amount to decrease health by
			OUTPUTS
				-1 if health goes below 0
				index otherwise

			Decreases health
		*/
		this.health-=val;
		if(this.health<=0){
			return index;
		} else {
			return -1;
		}//end of if else
	}//end of hurt
}//end of Triangle