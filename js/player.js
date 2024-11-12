////////////////////////////////////
////////////PLAYER OBJECT///////////
////////////////////////////////////

var person = function(name,x,y,score = 0){
	var name = name; // player's name
	var width = 32; // width of tank
	var height = 32; // height of tank
	var x = x; // x pos
	var y = y; // y pos
	var vX = 0; // x speed
	var vY = 0; // y speed
	
	var moveTime = new Date().getTime(); // used to determine time since last move call
	var moveTimeLength = 0; // "       "
	var img = new Image();
	var angle = 0; // angle of tank
	this.bullets = new Array(); // containing array for bullets
	
	//Upgradable
	var healthMax = 100; // max health
	var healthRegen = 1; // health regen rate
	var spd = 100; // tank speed
	var bulletDamage = 10; // damage dealt to enemy or shape by bullet
	var bulletLife = 4000; // length of time bullet can exist
	var reload = 500; // reload rate
	var bulletSpd = 200; // speed of bullet
	

	var level = 1; // player level
	var upgradePoints = 0; // points used to upgrade above vars
	var score = score; // player score
	var pointWorth = 100; // minimum amount of points an enemy gets when killing player
	var goal = 500; // points required to level up
	var prevGoal = 0; // goal of last level
	var health = 100; // player health
	var healthTime = new Date().getTime(); // used to determine time since last health regen call
	
	
	var reloadTime = new Date().getTime(); // used to determine time since last bullet was shot
	var bulletSize = 14; // size of bullet
	
	//DOM
	this.scoreBar = document.getElementById("playerScore"); // DOM element of score bar

	//Getting vars player 
	this.getName = function() {return name};
	this.getX = function() {return x};
	this.getY = function() {return y};
	this.getWidth = function() {return width};
	this.getHeight = function() {return height};
	this.getHealth = function() {return health};
	this.getHealthMax = function() {return healthMax};
	this.getPoints = function() {return pointWorth+Math.sqrt(score)*10}; // returns the minimum value plus a portion of points that player had
	this.getLevel = function() {return level};
	this.getUpPoints = function() {return upgradePoints};
	this.getHealthPercent = function() { return health / healthMax };
	this.getTrueScore = function() {return Math.round(score)};
	this.getGoal = function() {return goal};
	this.getPrevGoal = function() {return prevGoal};
	this.getBulletLife = function() {return bulletLife};
	this.getBulletSpeed = function() {return bulletSpd};

	//Changing vars player
	this.setVX = function(val) {vX = val};
	this.setVY = function(val) {vY = val};
	this.chgPoints = function(val) {score+=val};
	this.chgSPD = function(val){spd += val};
	this.chgHealthMax = function(val) {healthMax+=val};
	this.chgHealth = function(val) {health+=val};
	this.chgRegen = function(val) {healthRegen+=val};
	this.chgReload = function(val) {reload+=val};
	//Changing vars bullet
	this.chgPoints = function(val) {score+=val};
	this.chgDamage = function(val) {bulletDamage+=val};
	this.chgBulletSize = function(val) {bulletSize+=val};
	this.chgBulletSpd = function(val) {bulletSpd+=val};
	this.chgBulletLife = function(val) {bulletLife+=val};
	

	this.checkLevel = function(){
		/*
			INPUTS
				none
			OUTPUTS
				none

			Checks to see if player has enough points to level up
			Increases goal and level if so, awards 3 upgrade points per level up
		*/
		if(score>goal){
			level++;
			upgradePoints+=3;
			prevGoal = goal;
			goal += 500+goal*.4;
		}//end of if
	}//end of checkLevel

	this.move = function(){
		/*
			INPUTS
				none
			OUTPUTS
				none

			Moves player and makes sure player doesn't leave play area
			Amount to move is determined by time since last move
			vX and vY determine direction of travel
			0 - no travel
			-1 - left / down
			1 - right / up
			player is also kept centered by moving map to put player in middle of canvas
		*/
		moveTimeLength = (new Date().getTime()) - moveTime;
		x+=(spd/1000)*moveTimeLength*vX;
		y+=(spd/1000)*moveTimeLength*vY;
		map.x=-(x-viewPort.width/2);
		map.y=-(y-viewPort.height/2);
		if(x<width)x=width;
		else if(x>map.width)x=map.width;
		if(y<height)y=height;
		else if(y>map.width)y=map.width;
		moveTime = new Date().getTime();
	};//end of move
	this.setAngle = function(){
		/*
			INPUTS
				none
			OUTPUTS
				none
			
			Points cannon towards mouse
		*/
		var xChg = (x+map.x)-width/2-mouse.x;
		var yChg = (y+map.y)-height/2-mouse.y;
		angle = -Math.atan2(yChg,-xChg)+1.5708;
	};//end of setAngle
	this.draw = function(){
		/*
			INPUTS
				none
			OUTPUTS
				none

			Draws player on canvas 
		*/
		var offsetX = (x+map.x)-width/2;
		var offsetY = (y+map.y)-height/2;
		img.src = imgSrc.player;
		ctx.save();
		ctx.translate(offsetX,offsetY);
		ctx.rotate(angle);
		ctx.drawImage(img,-width,-height);
		ctx.restore();
	};//end of draw
	
	this.manageBullets = function(){
		/*
			INPUTS
				none
			OUTPUTS
				none

			calls functions required for bullet operation (see bullet object for function purposes)
		*/
		for(i=0;i<this.bullets.length;i++){
			if(this.bullets[i]!=-1){
				this.bullets[i].MOVE();
				this.bullets[i].DRAW();
				this.bullets[i].checkCol();
				if(this.bullets[i]!=-1)this.bullets[i].checkLife();
			}//end of if
		}//end of for
	};//end of manageBullets


	this.shoot = function(){
		/*
			INPUTS
				none
			OUTPUTS
				none

			Shoots bullet based on angle of cannon if player is pressing space / left mouse button and if the appropriate delay has occured
		*/
		var time = new Date().getTime();
		if(time-reloadTime>=reload){
			var bulletSpdX = (Math.cos(angle-Math.PI/2)*(bulletSpd))+spd/4000*moveTimeLength*vX;
			var bulletSpdY = (Math.sin(angle-Math.PI/2)*(bulletSpd))+spd/4000*moveTimeLength*vY;
			this.bullets[this.bullets.length] = new bullet("Blue",bulletSpdX,bulletSpdY,bulletSize,x-width/2,y-height/2,this.bullets.length,bulletLife,bulletDamage,-1);
			reloadTime = new Date().getTime();
		}//end of if
	};//end of shoot


	this.hurt = function(val){
		/*
			INPUTS
				val - amount to decrease health by
			OUTPUTS
				-1 if health is below 0
				0 otherwise

			Decreases health of player (occurs if player is hit by bullet)
		*/
		health-=val;
		if(health<=0){
			return 0;
		} else {
			return -1;
		}//end of if else
	}//end of hurt

	this.checkLife = function(){
		/*
			INPUTS
				none
			OUTPUTS
				none

			Checks to see if player's health is below zero
			Respawns player at new location, resets level, and drops score by 30 - 60 percent if so
			Increases health based on rate of regen and time since last function call
		*/
		if(health<=0){
			var xPos = Math.floor(Math.random()*map.width);
			var yPos = Math.floor(Math.random()*map.height);
			var mult = (Math.floor(Math.random()*6)+3)/10;
			for(var i=0;i<barClass.length;i++){
				barClass[i].src = barImg[0];
			} // end of for
			player = new person(name,xPos,yPos,score*mult);
		} else { 
			health+=(new Date().getTime()-healthTime)*(healthRegen/1000),healthTime = new Date().getTime();
		}//end of if else
		if(health>healthMax)health=healthMax;
	}//end of check life

	var upgradeLevels = [0,0,0,0,0,0,0]; // level of each upgrade
	this.upgrade = function(x){
		/*
			INPUTS
				x - upgrade to level up
			OUTPUTS
				none

			Checks to see if player has enough points to level up
			Increases goal and level if so, awards 3 upgrade points per level up
		*/
		if(upgradeLevels[x]<9){ // checks upgrade is not maxed
			upgradeLevels[x]++;
			switch(x) { // increases proper upgrade
				case 0: // health
					var healthLevel = health/healthMax; // gets health value / 1
					healthMax+=75+healthMax*.25;
					health = healthLevel*healthMax; // sets health value to same percentage as before
					document.getElementById("HealthBar").src = barImg[upgradeLevels[x]];
					break;
				case 1: // regen
					healthRegen*=1.33;
					document.getElementById("RegenBar").src = barImg[upgradeLevels[x]];
					break;
				case 2: // speed
					spd*=1.1;
					document.getElementById("SpeedBar").src = barImg[upgradeLevels[x]];
					break;
				case 3: // Bullet Life
					bulletLife*=1.08;
					document.getElementById("BulletLifeBar").src = barImg[upgradeLevels[x]];
					break;
				case 4: // Bullet Damage
					bulletDamage*=1.25;
					document.getElementById("BulletDmgBar").src = barImg[upgradeLevels[x]];
					break;
				case 5: // Reload
					reload*=0.86;
					document.getElementById("ReloadBar").src = barImg[upgradeLevels[x]];
					break;
				case 6: // Bullet Speed
					bulletSpd*=1.08;
					document.getElementById("BulletSpdBar").src = barImg[upgradeLevels[x]];
					break;
			}//end of switch
			upgradePoints--;
		}//end of if
	}//end of upgrade

}//end of player

var player = new person("Player 1",Math.floor(Math.random()*map.width),Math.floor(Math.random()*map.height)); // player var that hold player object