/*

Shooter Game JS
This is the main file for the game. It initializes the game and handles the core game loop.

Functions:
	- init() - initializes the game
	- getCustoms() - gets the custom settings from local storage
	- customizeSettings() - sets the game settings based on the custom settings
	- update() - the core game loop
	- keys - key handler
	- spawnShapes() - spawns the shapes
	- spawnEnemies() - spawns the enemies
	- drawHealth(x, y, max, curr, width, thickness) - draws the health bar for all entities with health
*/


//Customizable Globals
var useDefault="true"
var enemyCnt='low'
var shapeCnt='low'
var mapSize='small'
var enemyDiff='normal';

var paused = false;

function init(){
	/*
		Initializes the game
		
		INPUTS - none
		OUTPUTS- none
	*/
	getCustoms(); // Gets custom settings from local storage

	if(useDefault=="false")customizeSettings(); // Changes settings if player selected custom settings on the previous menu
	for(var i=0;i<barClass.length;i++){ // sets images for upgrade bars

		barClass[i].src = barImg[0];

	} // end of for
	resizeWindow();
	styleSetup();
	spawnShapes();
	spawnEnemies();
	updateLeaderboard();
	update(); // calls the core game loop
}//end of init

function getCustoms(){
	/*
		Gathers custom settings from local variables
		
		INPUTS - none
		OUTPUTS - none
	*/
	useDefault = localStorage.useDefault || true;
	enemyCnt=localStorage.enemyCnt;
	shapeCnt=localStorage.shapeCnt;
	mapSize=localStorage.mapSize;
	enemyDiff=localStorage.enemyDiff;
}//end of getCookies

function customizeSettings(){
	/*
		Sets options based on the users customizaton
		
		INPUTS-none
		OUTPUTS-none
	*/
	if(enemyCnt=="low")enemiesMax = 50;
	else if(enemyCnt=="med")enemiesMax = 80;
	else enemiesMax = 110;

	if(shapeCnt=="low")shapesMax = 50;
	else if(shapeCnt=="med")shapesMax = 80;
	else shapesMax = 110;

	if(mapSize=="small")map.width = 4000, map.height = 4000;
	else if(enemyCnt=="med")map.width = 6000, map.height = 6000;
	else map.width = 8000, map.height = 8000; 

	if(enemyDiff=="easy")maxScore = 30000;
	else if(enemyDiff=="norm")maxScore = 65000;
	else maxScore = 110000;
}//end of customizeSettings

function update(){
	/*
		This function is the core of the game. Calls all other functions needed to run the game
		
		
		INPUTS- none
		OUTPUTS- none
	*/

	if(!paused){
		if(lastShot!=0)player.shoot(); // Calls command to make player shoot if input recieved
		ctx.clearRect(0,0,viewPort.width,viewPort.height); // resets canvas
		grid.draw(); // draws canvas grid
		shapes.forEach(shape=>{
			if(shape!=-1){ // shape object exists at array index
				var xDist = shape.x+map.x; // gets x pos in reference to players viewport
				var yDist = shape.y+map.y; 
				shape.checkLife(); // checks if shape has run out of health
				if(xDist>=-50&&xDist<=viewPort.width+50&&yDist>=-50&&yDist<=viewPort.height+50)shape.draw(); // draws shape only if within players viewport
			}//end of if
		})

		enemies.forEach(enemy=>{
			if(enemy!=-1){ // enemy object exists at array index
				var xDist = enemy.getX()+map.x; // gets x pos in reference to players viewport
				var yDist = enemy.getY()+map.y;
				if(xDist>=-50&&xDist<=viewPort.width+50&&yDist>=-50&&yDist<=viewPort.height+50){
					enemy.draw(); // draws only if in players viewport
				}//end of if
				enemy.move();
				enemy.checkUpgrade();
				enemy.setAngle();
				enemy.manageBullets();
				enemy.checkLevel();
				enemy.checkLife();
			}//end of if
		})

		player.setAngle();
		player.move();
		player.manageBullets();
		player.draw();
		player.checkLevel();
		player.checkLife();
		//Below is FPS tracker
		var TIME = new Date().getTime()-updateTime;
		updateTime = new Date().getTime();
		FPSCnt = Math.round(1000/TIME);
		mouse.draw(); // draws crosshair
	}
	requestAnimationFrame(update); // animation frame used for best performance
}//end of update



//key handler
var keys = {};
var numbersPressed = [0,0,0,0,0,0,0]//1,2,3,4,5,6,7
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keys[e.keyCode] = e.type == "keydown";
    //Space bar  (shoot)
	if(keys[32]){
		lastShot=1;
	} else {
		if(lastShot==1)lastShot=0;
	}//end of if else
	//W and S  (up and down)
	if(keys[87])player.setVY(-1); // w pressed
	else if(keys[83])player.setVY(1); // s pressed
	else player.setVY(0); // neither pressed
	// A and D (left and right)
	if(keys[68])player.setVX(1); // a pressed
	else if(keys[65])player.setVX(-1); // d pressed
	else player.setVX(0); // neither pressed

	//upgrade keys (1-7)
	if(player.getUpPoints()>0){
		for(var i=0;i<7;i++){
			if(keys[i+49])numbersPressed[i]=1;
			else if(numbersPressed[i]==1)numbersPressed[i]=0,player.upgrade(i);
		}//end of for
	}//end of for
}//end of check key

function spawnShapes(){
	/*
		Spawns the shapes with random positions, sizes, and types
		
		INPUTS-none
		OUTPUTS-none
	*/
	for(var i = 0; i<shapesMax; i++){
		var randSize = Math.floor(Math.random()*100);
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
		var shape = Math.floor(Math.random()*2)+1;
		shapes.push(new Shape(xPos,yPos,i,size,shape));
	}//end of for
} // end of spawnShapes

function spawnEnemies(){
	/*
		Spawns the enemies with random positions and initial scores. (Bots having a head start makes game more difficult)
		
		INPUTS-none
		OUTPUTS-none
	*/
		for(var i=0;i<enemiesMax;i++){
		var xPos = Math.floor(Math.random()*map.width);
		var yPos = Math.floor(Math.random()*map.height);
		var score = 0;
		if(i<enemiesMax*.25){
			score = Math.floor(Math.random()*maxScore);
		} else if(i<enemiesMax*.40){
			score = Math.floor(Math.random()*maxScore*.75);
		} else if(i<enemiesMax*.70){
			score = Math.floor(Math.random()*(maxScore*.5));
		} // end of if else
		enemies.push(new Enemy(xPos,yPos,i,score));
	}//end of for
}//end of spawnShapes

function drawHealth(x, y, max, curr, width, thickness){
	/*
		Draws a health bar for entities with health
		Called each time a health bar needs to be drawn

		INPUTS
			x - x pos of healthbar
			y - y pos
			max - max health
			curr - current health
			width - width of health bar
			thickness - thickness of health bar

		OUTPUTS-none
		
	*/
	var percent = (curr/max)*100;
	ctx.beginPath();
	ctx.rect(x+map.x-width, y+map.y, width, thickness);
	ctx.strokeStyle="Black";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.rect(x+map.x-width, y+map.y, width*percent/100, thickness);
	if(percent > 60){
	  ctx.fillStyle="Green"
	}else if(percent > 30){
	  ctx.fillStyle="Yellow"
	} else {
	ctx.fillStyle="Red";
	}//end of if else
	ctx.fill();
	ctx.closePath();
}//end of drawHealth