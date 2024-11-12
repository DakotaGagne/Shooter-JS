/*

Shooter Game JS Settings Page

This is the main file for handing the settings initialization and
directing to the game page.

Functions:
	- init() - initializes the game
	- selection(val) - handles the selection of the settings 
	- goToGame() - saves the settings to local storage and goes to the game page
*/




var useDefault, enemyCnt, shapeCnt, mapSize, enemyDiff;


window.setInterval(()=>colors.forEach((col,i)=>document.getElementById(ids[i]).style.backgroundColor=colors[i]),1);

var selCol = '#4A7750'

var ids = [
"lowEnemies",
"medEnemies",
"highEnemies",

"lowShapes",
"medShapes",
"highShapes",

"smallMap",
"medMap",
"largeMap",

"easyEnemy",
"normEnemy",
"hardEnemy",

"confirm",
"default"
];
var colors = new Array(14)
colors.forEach(elem=>elem='')
var settingDiv = ["enemyCnt","shapeCnt","mapSize","enemyDiff"];

function init(){
	selection(0)
	selection(3)
	selection(6)
	selection(9)
}

function selection(val){
	switch(val){
		case 0:
			colors[0]=selCol;
			colors[1]='';
			colors[2]='';
			enemyCnt = "low";
			break;
		case 1:
			colors[0]='';
			colors[1]=selCol;
			colors[2]='';
			enemyCnt = "med";
			break;
		case 2:
			colors[0]='';
			colors[1]='';
			colors[2]=selCol;
			enemyCnt = "high";
			break;
		case 3:
			colors[3]=selCol;
			colors[4]='';
			colors[5]='';
			shapeCnt = "low";
			break;
		case 4:
			colors[3]='';
			colors[4]=selCol;
			colors[5]='';
			shapeCnt = "med";
			break;
		case 5:
			colors[3]='';
			colors[4]='';
			colors[5]=selCol;
			shapeCnt = "high";
			break;
		case 6:
			colors[6]=selCol;
			colors[7]='';
			colors[8]='';
			mapSize = "small";
			break;
		case 7:
			colors[6]='';
			colors[7]=selCol;
			colors[8]='';
			mapSize = "med";
			break;
		case 8:
			colors[6]='';
			colors[7]='';
			colors[8]=selCol;
			mapSize = "large";
			break;
		case 9:
			colors[9]=selCol;
			colors[10]='';
			colors[11]='';
			enemyDiff = "easy";
			break;
		case 10:
			colors[9]='';
			colors[10]=selCol;
			colors[11]='';
			enemyDiff = "norm";
			break;
		case 11:
			colors[9]='';
			colors[10]='';
			colors[11]=selCol;
			enemyDiff = "hard";
			break;
		case 12:
			useDefault = false;
			goToGame();
			break;
		case 13:
			useDefault = true;
			goToGame();
			break;
	} // end of switch
} // end of function

function goToGame(){
	localStorage.setItem("useDefault",useDefault);
	localStorage.setItem("shapeCnt",shapeCnt);
	localStorage.setItem("mapSize",mapSize);
	localStorage.setItem("enemyCnt",enemyCnt);
	localStorage.setItem("enemyDiff",enemyDiff);
	location.href = "./game.html";
} // end of goToGame