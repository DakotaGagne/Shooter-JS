///////////////////////////////////
////////////ENEMIES OBJECTS/////////
////////////////////////////////////

/*

This file contains the Object for the Enemy
Contains all the variables for the Enemy, as well as the 


*/



var Enemy = function(x,y,index,score = 0, name=botNames[Math.floor(Math.random()*botNames.length)]){
	var name = name; // name of enemy (randomized from over 1000 names). kept the same on respawn
	var width = 32; // width of the enemy
	var height = 32; // height of the enemy
	var x = x; // x pos
	var y = y; // y pos
	var vX = 0; // x spd
	var vY = 0; // y spd
	var spd = 75; // max speed of enemy
	var img = new Image(); // image of enemy
	var angle = 0; // angle of enemy
	var desiredAngle = 0; // the ideal angle of the enemy. Allows for slowed rotation
	var angleChgPS = Math.PI; // max angle, in radians, that the enemy can rotate in one second
	var angleTimer = new Date().getTime(); // used to calculate amount needed to move
	this.index = index; // index within enemy array
	var range = viewPort.width/2; // the range that a enemy is able to "see" another enemy
	var minRange = 150; // the min Range to stay from and enemy
	var shoot = false; // whether or not to fire
	this.bullets = new Array(); // array that contains any bullets fired by enemy
	

	var moveTime = new Date().getTime(); // used with move function to calculate how far to move
	var level = 1; // level of enemy
	var upgradePoints = 0; // # of points that can be used on upgrades
	var score = score; // score of enemy
	var pointWorth = 100; // min value of enemy if killed
	var goal = 500; // score needed to level up

	var healthMax = 100; // max health
	var health = 100; // current health
	var healthRegen = 1; // rate of health regeneration
	var healthTime = new Date().getTime(); // used to accurately regenerate health
	var bulletDamage = 10; // damage that can be dealt by 1 bullet
	var reload = 500; // reload speed
	var reloadTime = new Date().getTime(); // used to accurately reload
	var bulletSize = 14; // size of bullet
	var bulletSpd = 200; // spd of bullet
	var bulletLife = 4000; // lifespan of bullet
	//Getting vars enemy
	this.getX = function() {return x};
	this.getY = function() {return y};
	this.getWidth = function() {return width};
	this.getHeight = function() {return height};
	this.getHealth = function() {return health};
	this.getPoints = function() {return pointWorth+Math.sqrt(score)*10}; // returns point worth plus a portion of the score the enemy had
	this.getTrueScore = function() {return Math.round(score)}; // used for leaderboard
	this.getLevel = function(){return level}; // used for leaderboard
	this.getName = function(){return name}; // used for leaderboard
	//Changing vars enemy
		//this.setVX = function(val) {vX = val}; 
		//this.setVY = function(val) {vY = val};
	this.chgPoints = function(val) {score+=val}; // used to add points after kill
		//this.chgSPD = function(val) {spd += val};
		//this.chgHealthMax = function(val) {healthMax+=val};
		//this.chgHealth = function(val) {health+=val};
		//this.chgRegen = function(val) {healthRegen+=val};
		//this.chgReload = function(val) {reload+=val};
		//changing vars bullet
		//this.chgDamage = function(val) {bulletDamage+=val};
		//this.chgBulletSize = function(val) {bulletSize+=val};
		//this.chgBulletSpd = function(val) {bulletSpd+=val};
		//this.chgBulletLife = function(val) {bulletLife+=val};
	
	this.checkLevel = function(){
		/*
			INPUTS- none
			OUTPUTS- none

			Simply checks if the enemy has gathered enough points to level up
			Increases level, upgrade points, and goal if so
		*/
		if(score>goal){
			level++;
			upgradePoints+=3;
			prevGoal = goal;
			goal += 500+goal*.4;
		}//end of if
	}//end of checkLevel



	this.move = function() {
		/*
			INPUTS- none
			OUTPUTS- none

			Moves enemy
			First away from enemies if too close
			Then towards nearest enemy (if in range)
			Then towards nearest shape
		*/
		//Check for Player
		var moveTimeLength = new Date().getTime() - moveTime; // time since last move
		var xDist = x-player.getX();
		var yDist = y-player.getY();
		var closestEnemy = Math.sqrt(xDist*xDist+yDist*yDist); // sets player as closest enemy
		var enemyIndex = -1, enemyX, enemyY, enemyNet;
		//loops through list of enemies and checks if any enemies are closer than player
		for(var i=0;i<enemies.length;i++){
			if(enemies[i]!=-1&&i!=this.index){ // ensures there is an enemy in the array slot and that it doesn't check distance from itself
				enemyX = x-enemies[i].getX(); 
				enemyY = y-enemies[i].getY();
				enemyNet = Math.sqrt(enemyX*enemyX+enemyY*enemyY);
				if(enemyNet<closestEnemy){
					closestEnemy=enemyNet;
					enemyIndex = i;
				}//end of if
			}//end of if
		}//end of for
		//Checks if player is closest or if another enemy is
		if(enemyIndex == -1){
			enemyX = x-player.getX();
			enemyY = y-player.getY();
		} else {
			enemyX = x-enemies[enemyIndex].getX();
			enemyY = y-enemies[enemyIndex].getY();
		}//end of if else
		enemyNet = Math.sqrt(enemyX*enemyX+enemyY*enemyY);
		if(enemyNet<range){ // ensures enemy is within range
			var enemyAngle = -Math.atan2(enemyY,-enemyX); // calculates angle of enemy in reference to self
			var xSpd = Math.cos(enemyAngle)*(spd/1000)*moveTimeLength; // this and ySpd calculates the number of pixels needed to move to the nearest enemy based on speed of enemy and time since last frame. See move() in bullets.js for full explanation
			var ySpd = Math.sin(enemyAngle)*(spd/1000)*moveTimeLength;
			var netSpd = Math.sqrt(xSpd*xSpd+ySpd*ySpd);
			//Checks distance to enemy based on minRange to determine to move towards or away from enemy
			if(enemyNet<minRange-netSpd*2){ // Too close
				x-=xSpd;
				y-=ySpd;
			} else if(enemyNet>minRange+netSpd*2){ // Too far
				x+=xSpd;
				y+=ySpd;
			}//end of if else
		} else {
		//check for shape
		/*Similar to enemy check but ignores range restrictions. Enemy will always head to nearest shape if no enemies are in range*/
			var smallestLength = 100000; // ensures at lease one shape will be found
			var shapeIndex = -1;
			for(var i=0;i<shapes.length;i++){
				if(shapes[i]!=0){
					var xLength = x-shapes[i].x;
					var yLength = y-shapes[i].y;
					var netLength = Math.sqrt(xLength*xLength+yLength*yLength);
					if(netLength<smallestLength){
						smallestLength=netLength;
						shapeIndex = i;
					}//end of if
				}//end of if
			}//end of for
			var xLength = x-shapes[shapeIndex].x;
			var yLength = y-shapes[shapeIndex].y;
			var netLength = Math.sqrt(xLength*xLength+yLength*yLength);
			netAngle = -Math.atan2(yLength,-xLength);
			xSpd = Math.cos(netAngle)*(spd/1000)*moveTimeLength;
			ySpd = Math.sin(netAngle)*(spd/1000)*moveTimeLength;
			netSpd = Math.sqrt(xSpd*xSpd+ySpd*ySpd);
			if(netLength>minRange+netSpd*3){
				x+=xSpd;
				y+=ySpd;
			} else if(netLength<minRange-netSpd*3) {
				x-=xSpd;
				y-=ySpd;
			}//end of if else
		}//end of if else
		moveTime = new Date().getTime();

	};//end of move
	
	
	this.setAngle = function(){
		/*
			INPUTS- none
			OUTPUTS- none

			Rotates bot at an adequate speed to face enemy or shape if in range
			Does not snap to angle, but rather rotates at a constant speed
			This ensures that the player has time to react to the enemy
		*/
		//below the same concept as move function, until range check
		//player
		var rangeX = player.getX()-x;
		var rangeY = player.getY()-y;
		var closestEnemy = Math.sqrt(rangeX*rangeX+rangeY*rangeY);
		//enemies
		var enemyIndex = -1, enemyX, enemyY, enemyNet;
		for(var i=0;i<enemies.length;i++){
			if(enemies[i]!=-1&&i!=this.index){
				enemyX = x-enemies[i].getX();
				enemyY = y-enemies[i].getY();
				enemyNet = Math.sqrt(enemyX*enemyX+enemyY*enemyY);
				if(enemyNet<closestEnemy){
					closestEnemy=enemyNet;
					enemyIndex = i;
				}//end of if
			}//end of if
		}//end of for
		if(enemyIndex==-1){
			enemyX = player.getX()-x;
			enemyY = player.getY()-y;
		} else {
			enemyX = enemies[enemyIndex].getX()-x;
			enemyY = enemies[enemyIndex].getY()-y;
		}//end of if else
		enemyNet = Math.sqrt(enemyX*enemyX+enemyY*enemyY);

		if(enemyNet<range){
			desiredAngle=-Math.atan2(-enemyY,enemyX)+1.5708; // calculates desired angle plus offset to make cannon point at enemy, not side of tank
			if(desiredAngle<0)desiredAngle=Math.PI*1.5+(Math.PI/2+desiredAngle);// corrects angle to positive equivalent if negative
			shoot = true; // allows bot to start shooting
		} else {
			//shapes
			//similar to above, checks shapes instead 
			var smallestLength = 100000;
			var shapeIndex = -1;
			for(var i=0;i<shapes.length;i++){
				var xLength = x-shapes[i].x;
				var yLength = y-shapes[i].y;
				var netLength = Math.sqrt(xLength*xLength+yLength*yLength);
				if(netLength<smallestLength){
					smallestLength=netLength;
					shapeIndex = i;
				}//end of if
			}//end of for
			var xChg = shapes[shapeIndex].x+shapes[shapeIndex].size-x;
			var yChg = shapes[shapeIndex].y+shapes[shapeIndex].size-y;
			var netDist = Math.sqrt(xChg*xChg+yChg*yChg);
			desiredAngle = -Math.atan2(-yChg,xChg)+1.5708;
			if(desiredAngle<0)desiredAngle=Math.PI*1.5+(Math.PI/2+desiredAngle);
			if(netDist<range){
				shoot = true;
			} else {
				//disables shooting if nothing is in range
				shoot = false;
			}//end of if else
		} // end of if else 
		var time = (new Date().getTime()-angleTimer)/1000; // time, in seconds, since last function call
		
		//Determines shortest direction of rotation and rotates that way based on time since last call
		var cwDist, ccwDist;
		if(desiredAngle>angle)cwDist=desiredAngle-angle,ccwDist=angle+(Math.PI*2-desiredAngle);
		else cwDist=(Math.PI*2-angle)+desiredAngle,ccwDist=angle-desiredAngle;
		if(cwDist>ccwDist)angle-=angleChgPS*time;
		else angle+=angleChgPS*time;
		var distance = desiredAngle-angle;
		if(distance<angleChgPS*time*1.5&&distance>-angleChgPS*time*1.5)angle=desiredAngle; // if tank is close enough to angle that, if moved by time based amount, it will go past, it snaps tank to dedsired angle
		//corrects angle to be positive
		if(angle<0)angle=Math.PI*2+angle;
		if(angle>Math.PI*2)angle-=Math.PI*2;
		if(shoot)this.shoot(); // calls shoot function if enemy is in range
		angleTimer = new Date().getTime();
	};//end of setAngle
		
	this.draw = function(){
		/*
			INPUTS-none
			OUTPUTS-none
			Draws enemy on screen
		*/
		var offsetX = (x+map.x)-width/2; // adjusts x pos to be center of image
		var offsetY = (y+map.y)-height/2;
		img.src = imgSrc.enemy;
		ctx.save();
		ctx.translate(offsetX,offsetY); // temporarily sets center of canvas to be offset point
		ctx.rotate(angle); // rotates image around center point
		ctx.drawImage(img,-width,-height); //draws image at the angle
		ctx.restore(); // sets origin back to normal
		ctx.beginPath();
		ctx.fillStyle = "White";
		ctx.font = "15px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Level: " + level,x+map.x-width/2,y+map.y-50); // draws level above enemy
		ctx.fillText(name,x+map.x-width/2,y+map.y-75); // draws name above enemy
		drawHealth(x+2,y+width/2,healthMax,health,width,5); // draws health below enemy
		ctx.closePath();
	};//end of draw
	
	this.manageBullets = function(){
		/*
			INPUTS-none
			OUTPUTS-none
			Calls necessary functions to make bullets act
		*/
		for(i=0;i<this.bullets.length;i++){
			if(this.bullets[i]!=-1){
				this.bullets[i].MOVE();
				this.bullets[i].DRAW();
				this.bullets[i].checkLife();
				if(this.bullets[i]!=-1)this.bullets[i].checkCol();
			}//end of if
		}//end of for
	};//end of manageBullets

	this.shoot = function(){
		/*
			INPUTS-none
			OUTPUTS-none
			Spawns bullet at speed based on angle of tank if shoot is true and the appropriate delay has passed
		*/
		var time = new Date().getTime();
		if(time-reloadTime>=reload){
			var bulletSpdX = (Math.cos(angle-Math.PI/2)*(bulletSpd))+spd*vX;
			var bulletSpdY = (Math.sin(angle-Math.PI/2)*(bulletSpd))+spd*vY;
			this.bullets[this.bullets.length] = new bullet("Red",bulletSpdX,bulletSpdY,bulletSize,x-width/2,y-height/2,this.bullets.length,bulletLife,bulletDamage,this.index);
			reloadTime = new Date().getTime();
		}//end of if
	};//end of shoot

	this.hurt = function(val){
		/*
			INPUTS-
				val - amount to decrease health by
			OUTPUTS-
				-1 if health is less than 0
				index if health is above 0

			Sets upgrade images
		*/
		health-=val;
		if(health<=0){
			return index;
		} else {
			return -1;
		}//end of if else
	}//end of hurt
	this.checkLife = function(){
		/*
			INPUTS-none
			OUTPUTS-none
			Checks if run out of health. If so, respawns with between 30 and 60 percent of points at a new location
		*/
		if(health<=0){
			var xPos = Math.floor(Math.random()*map.width);
			var yPos = Math.floor(Math.random()*map.height);
			var mult = (Math.floor(Math.random()*6)+3)/10;
			enemies[this.index] = new Enemy(xPos,yPos,this.index,score*mult,name);
		} else { 
			health+=(new Date().getTime()-healthTime)*(healthRegen/1000),healthTime = new Date().getTime();
		}//end of if else
		if(health>healthMax)health=healthMax;
	}//end of check life

	this.checkUpgrade = function(){
		/*
			INPUTS-none
			OUTPUTS-none
			Checks if upgrade points are available
			Calls function to upgrade randomlt if so
		*/
		if(upgradePoints>0){
			this.upgrade(Math.floor(Math.random()*6));
		}//end of if 
	}//end of checkUpgrade

	var upgradeLevels = [0,0,0,0,0,0,0]; // level of each upgrade
	this.upgrade = function(x){
		if(upgradeLevels[x]<10){ // checks that level is not maxed
			upgradeLevels[x]++;
			// upgrades value based on upgrade chosen
			switch(x) {
				case 0: // health
					var healthLevel = health/healthMax; // holds how much health enemy has / 1 (this allows health to stay at the same percentage, goes up with max)
					healthMax+=75+healthMax*.25;
					health = healthLevel*healthMax;
					break;
				case 1: // regen
					healthRegen*=1.33;
					break;
				case 2: // speed
					spd*=1.1;
					break;
				case 3: // Bullet Life
					bulletLife*=1.08;
					break;
				case 4: // Bullet Damage
					bulletDamage*=1.25
					break;
				case 5: // Reload
					reload*=0.86;
					break;
				case 6: // Bullet Speed
					bulletSpd*=1.08;
					break;
			}//end of switch
			upgradePoints--;
		}//end of if
	}//end of upgrade
}//end of enemy











