
window.setInterval(function(){
	//timer to check if upgrade points can be spent
	//Drops upgrade bar down if so
	//Brings it back up if not
	if(player.getUpPoints()>0){
		scrollUpgradeBar(2.5);
	} else {
		scrollUpgradeBar(-2.5);
	} // end of if else
},75);


window.setInterval(function(){
	//timer that updates fps and gui information about players health, level, etc
	document.getElementById("fps").innerHTML = "FPS: "+FPSCnt;
	var prevGoal = player.getPrevGoal();
	document.getElementById("playerHealth").value = player.getHealth();
	document.getElementById("playerHealth").max = player.getHealthMax();
	document.getElementById("levelLbl").innerHTML = "Level "+player.getLevel() + " (" +player.getTrueScore()+"/"+Math.round(player.getGoal())+")";
	document.getElementById("playerScore").value = ((player.getTrueScore()-prevGoal)/(player.getGoal()-prevGoal))*100;
	document.getElementById("upgradeText").innerHTML = "X "+player.getUpPoints();
	// document.getElementById("enemiesCnt").innerHTML = "Enemies: "+enemiesCnt;
},300);

window.setInterval(function(){
	//timer that calls function to update leaderboard every second
	updateLeaderboard();
},1000);
