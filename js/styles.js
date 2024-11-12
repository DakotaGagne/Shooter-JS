
//JS used in hand with css and styling

var upgradeRect = [256,128]; // size of upgrade rectangles


function styleSetup(){
	/*
		INPUTS-none
		OUTPUTS-none
		Sets upgrade images
	*/
	document.getElementById("healthImg").src = healthImg;
	document.getElementById("regenImg").src = regenImg;
	document.getElementById("speedImg").src = speedImg;
	document.getElementById("reloadImg").src = reloadImg;
	document.getElementById("bulletdmgImg").src = bulletdmgImg;
	document.getElementById("bulletlifeImg").src = bulletlifeImg;
	document.getElementById("bulletspeedImg").src = bulletspeedImg;


}// end of styleSetup
var upgradeId = [
	//Style id of all upgrade elements
	document.getElementById("Health").style,
	document.getElementById("Regen").style,
	document.getElementById("Speed").style,
	document.getElementById("BulletLife").style,
	document.getElementById("BulletDmg").style,
	document.getElementById("Reload").style,
	document.getElementById("BulletSpd").style
];


function resizeWindow(){
	/*
		INPUTS-none
		OUTPUTS-none
		Sets canvas size to be the same on all screens, adjusts spacings to match
	*/
	//viewPort
	
	viewPort.style.width=window.innerWidth+"px";
	viewPort.style.height=window.innerHeight+"px";
	var rect = viewPort.getBoundingClientRect();
	viewPortScale[0] = viewPort.width / rect.width;
	viewPortScale[1] = viewPort.height / rect.height;
	var upgradePos = window.innerWidth*0.25;
	var upgradeSpacing = (window.innerWidth*0.5) / 8;
	var upgradePadding = upgradeSpacing / 6;
	

	for(var i=0; i<upgradeId.length;i++){
		upgradeId[i].left = upgradePos+"px";
		upgradeId[i].width = upgradeSpacing+"px";
		upgradeId[i].height = upgradeSpacing/2+"px";

		upgradePos+=upgradeSpacing+upgradePadding;
	}//end of for
	document.getElementById("upgradeText").left = (upgradePos-(upgradeSpacing+upgradePadding))+"px";
	document.getElementById("upgradeText").width = (upgradeSpacing*0.9)+"px";
	document.getElementById("upgradeText").height = (upgradeSpacing*0.45)+"px";
} // end of resizeWindow


var upgradeBarPos = 1;

function scrollUpgradeBar(dir){
	/*
		INPUTS-
			dir - direction to scroll
		OUTPUTS-none
		Function that drops and raises the upgrade menu
	*/
	var offsetTop = document.getElementById("Reload").offsetTop;
	var offsetHeight = document.getElementById("Reload").offsetHeight;
	upgradeBarPos += dir;
	if(upgradeBarPos<(offsetHeight+3)*-1){
		upgradeBarPos=(offsetHeight+3)*-1;
	} else if(upgradeBarPos>1){
		upgradeBarPos=1;
	}//end of else if

	for(var i=0; i<upgradeId.length;i++){

		upgradeId[i].top = upgradeBarPos+"vh";

	}//end of for
} // end of scrollUpgradeBar




function updateLeaderboard(){
	/*
		INPUTS-none
		OUTPUTS-none
		Updates the leaderboard and shows the top 10 tanks, as well as the current position of the player, even if not in top 10
	*/
	var arr = new Array(); // array that holds all tanks
	var playerName = player.getName(); // name of player
	arr.push(player);
	for(var i=0;i<enemies.length;i++){
		if(enemies[i]!=-1){
			arr.push(enemies[i]);
		}//end of if
	} // end of for
	arr.sort((a,b) => (a.getTrueScore()-b.getTrueScore())*-1); // sorts the array by the tanks score

	for(var i=1;i<10;i++){ // populates the leaderboard with the top 9 tanks
		document.getElementById("leaderboard").rows[i].children[1].innerHTML = arr[i-1].getName();
		document.getElementById("leaderboard").rows[i].children[2].innerHTML = arr[i-1].getLevel();
		document.getElementById("leaderboard").rows[i].children[3].innerHTML = arr[i-1].getTrueScore();
	}//end of for
	for(var i=0;i<arr.length;i++){ // loops through array to find position of 
		if(arr[i].getName()==playerName){
			if(i>9){
				document.getElementById("leaderboard").rows[10].children[0].style.background = "#132bb2"; // sets color to blue to set the position apart from the others
				document.getElementById("leaderboard").rows[10].children[0].innerHTML = i;
				document.getElementById("leaderboard").rows[10].children[1].innerHTML = arr[i].getName();
				document.getElementById("leaderboard").rows[10].children[2].innerHTML = arr[i].getLevel();
				document.getElementById("leaderboard").rows[10].children[3].innerHTML = arr[i].getTrueScore();

			} else {
				document.getElementById("leaderboard").rows[10].children[0].innerHTML = 10;
				document.getElementById("leaderboard").rows[10].children[0].style.background = "black"; // sets color back to black
				document.getElementById("leaderboard").rows[10].children[1].innerHTML = arr[9].getName();
				document.getElementById("leaderboard").rows[10].children[2].innerHTML = arr[9].getLevel();
				document.getElementById("leaderboard").rows[10].children[3].innerHTML = arr[9].getTrueScore();
				
			} // end of if else
			
			
		} // end of if
	}//end of for
} // end of updateLeaderboard