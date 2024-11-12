////////////////////////////////////
////////////BULLETS OBJECTS/////////
////////////////////////////////////



/*
	The following object is used for every bullet fired by player or ai
	The variables are not made private because risk of hacking is low. 
	Finding exact bullet is nearly impossible and definitely unreasonable
*/

var bullet = function(col,xSpd,ySpd,size,x,y,index,life,damage,masterIndex){
	this.COL = col; // color, used as a defining element to distinguish between good and bad bullets in this constructor
	this.bulletBad = imgSrc.enemyBullet; // image for the enemies bullets
	this.bulletGood = imgSrc.playerBullet; // image for the players bullets
	this.XSPD = xSpd; // horizontal speed (pixels per second)
	this.YSPD = ySpd; // veritcal speed (pixels per second)
	this.SIZE = size; // size of bullet
	this.contact = false; // whether or not the bullet is in contact with anything (not including other bullets)
	this.x = x; // x pos
	this.y = y; // y pos
	this.index = index; // index within the containing array
	this.LIFE = life; // length of lifespan
	this.BIRTH = new Date().getTime(); // time of birth
	this.moveTime = new Date().getTime(); // time spent alive (not sure it is used)
	this.DAMAGE = damage; // amount of damage bullet can give out
	this.DecelX = this.XSPD/(this.LIFE/1000); // rate of deceleration of horizontal (based on initial speed and time span of life. Ball will decelerate slowly until it comes to a stop. Blinks out of existence at stop)
	this.DecelY = this.YSPD/(this.LIFE/1000); // same as above but vertical
	this.DecelTime = new Date().getTime(); // used in MOVE function (refer there for details)
	this.masterIndex = masterIndex; // the index of the enemy in its containing array(-1 for player)
	this.DRAW = function(){
		/*
			This function simply draws the bullet to the canvas
			INPUTS- none
			OUTPUTS- none
		*/
		var img = new Image();
		//Below defines image to use based on enemy or player that shot the bullet
		if(this.COL == "Red")img.src = this.bulletBad;
		else img.src = this.bulletGood;
		ctx.drawImage(img,this.x-this.SIZE/2+map.x,this.y-this.SIZE/2+map.y,this.SIZE,this.SIZE);
	};//end of draw

	this.MOVE = function(){
		/*
			INPUTS- none
			OUTPUTS- none
			This function moves the bullet.
			However; due to the fact that I am using animation frame for my update function, calls/sec differ.
			To maintain proper speed, as well as better movement for playability, this function determines the time that has elapsed since last move and adjusts position appropriately
			It then decreases the speed of the ball by the appropriate amount to have it stop at the end of its life
		*/
		//Time since last call
		var timeChg = new Date().getTime()-this.DecelTime;
		//distance to move based on spd/sec of ball and time since last call
		this.x+=(this.XSPD/1000)*timeChg;
		this.y+=(this.YSPD/1000)*timeChg;
		//amount to decrease speed based on rate of decel/sec and time since last call
		this.XSPD-=(this.DecelX/1000)*timeChg;
		this.YSPD-=(this.DecelY/1000)*timeChg;
		//Sets time since last call (ignoring time taken to run function)
		this.DecelTime= new Date().getTime();
	};//end of move

	this.checkLife = function(){
		/*
			INPUTS- none
			OUTPUTS- none

			This function checks if the bullets life timer has elapsed,
			and removes from appropriate array if so
		*/
		var time = new Date().getTime();
		if(time-this.BIRTH>this.LIFE){
			if(this.COL == "Red"){
				//removes from the enemies bullet array
				enemies[this.masterIndex].bullets[this.index] = -1;
			} else {
				//removes from the player array
				player.bullets[this.index] = -1;
			}//end of if else
		}//end of if
	}//end of checkLife

	this.checkCol = function(){
		/*
			INPUTS-none
			OUTPUTS-none

			This function checks for collision with another player, enemy, or shape.
			Players and enemies take priority over shapes
			The bullet cannot come into contact with the containing enemy/player or another bullet
			Upon collision with appropriate body, it sends a hurt command which returns whether or not the player was killed
			If killed, containing player / enemy of bullet is awarded points - points are determined by level of killed player / enemy (value recieved by getPoints() call)
			Bullet destroys self after above is complete
		*/
		// horizonal, veritcal, and diagonal distance, respectively, from player
		var xDist = this.x+this.SIZE/2-player.getX()+16;
		var yDist = this.y+this.SIZE/2-player.getY()+16;
		var netDist = Math.sqrt(xDist*xDist+yDist*yDist);
		if(netDist<=player.getWidth()/2+this.SIZE/2&&this.COL=="Red"){
			//distance from player was less than or equal to the combined radii of the bullet and player and bullet is not players
			var hurt = player.hurt(this.DAMAGE); // hurts player and recieves return value (-1 means dead, everything else means alive)
			if(hurt!=-1)enemies[this.masterIndex].chgPoints(player.getPoints()); // gets value of player and adds it to points
			enemies[this.masterIndex].bullets[this.index] = -1; // removes bullet from array
		} else {
			//distance from player was more than the combined radii of the bullet and player or bullet is players
			var nearestEnemy = -1; // holds value of index of nearest enemy
			var nearDist = 10000; // holds the distance of the nearest enemy (10000 ensures that the -1 changes)
			for(var i=0;i<enemies.length;i++){
				//loops through array of enemies and finds the closest one (doing this allows for collision check to only occur to 1 enemy. This makes the game run significantly faster)
				if(i!=this.masterIndex && enemies[i]!=-1){//ignores self and ensures that the enemy in the index of the array
					xDist = this.x+this.SIZE/2-enemies[i].getX()+16;
					yDist = this.y+this.SIZE/2-enemies[i].getY()+16;
					netDist = Math.sqrt(xDist*xDist+yDist*yDist);
					if(netDist<nearDist)nearDist=netDist,nearestEnemy=i;//sets nearest enemy and val to current if it is closer than the previous
				}//end of if
			}//end of for

			/*Below checks for collision with closest enemy (same basic concept as player check, just slightly modifiedf)*/
			xDist = this.x+this.SIZE/2-enemies[nearestEnemy].getX()+16;
			yDist = this.y+this.SIZE/2-enemies[nearestEnemy].getY()+16;
			netDist = Math.sqrt(xDist*xDist+yDist*yDist);
			if(netDist<=enemies[nearestEnemy].getWidth()/2+this.SIZE/2){
				var hurt = enemies[nearestEnemy].hurt(this.DAMAGE); 
				if(hurt!=-1){
					// checks if the containing entity is the player
					if(this.masterIndex==-1){ 
						player.chgPoints(enemies[nearestEnemy].getPoints()); // gives points to player
					} else {
						enemies[this.masterIndex].chgPoints(enemies[nearestEnemy].getPoints()); // gives points to enemy
					}//end of if else
				}//end of if
				//removes self from proper entity
				if(this.masterIndex==-1){
					player.bullets[this.index] = -1;
				} else {
					enemies[this.masterIndex].bullets[this.index] = -1;
				}//end of if else
				
			} else {
				/*Checks for collision with shape*/
				//The concept is identical to the enemy concept above
				var nearestShape = -1;
				var shapeDist = 100000;
				for(var i=0;i<shapes.length;i++){
					if(shapes[i]!=-1){
						xDist = (this.x+this.SIZE)-(shapes[i].x+shapes[i].size);
						yDist = (this.y+this.SIZE)-(shapes[i].y+shapes[i].size);
						netDist = Math.sqrt(xDist*xDist+yDist*yDist);
						if(netDist<shapeDist)shapeDist=netDist,nearestShape=i;
					}//end of if
				}//end of for
				xDist = (shapes[nearestShape].x+shapes[nearestShape].size)-(this.x+this.SIZE/2);
				yDist = (shapes[nearestShape].y+shapes[nearestShape].size)-(this.y+this.SIZE/2);
				netDist = Math.sqrt(xDist*xDist+yDist*yDist);
				if(netDist<=shapes[nearestShape].size/2+this.SIZE/2){
					var hurt = shapes[nearestShape].hurt(this.DAMAGE);
					if(hurt!=-1){
						if(this.masterIndex==-1){
							player.chgPoints(shapes[nearestShape].getPoints())
						} else {
							enemies[this.masterIndex].chgPoints(shapes[nearestShape].getPoints());
						}//end of if else
					}//end of if
					if(this.masterIndex==-1){
						player.bullets[this.index] = -1;
					} else {
						enemies[this.masterIndex].bullets[this.index] = -1;
					}//end of if else
				}//end of if
			}//end of if else
		}//end of if else
	}//end of checkCol
}//end of bullet constructor













