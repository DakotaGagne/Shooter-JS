/*
	List of global variables
*/




//Array of upgradebar images
var barImg = [ 
	"./images/upgrades/upgradebar/barone.png",
	"./images/upgrades/upgradebar/bartwo.png",
	"./images/upgrades/upgradebar/barthree.png",
	"./images/upgrades/upgradebar/barfour.png",
	"./images/upgrades/upgradebar/barfive.png",
	"./images/upgrades/upgradebar/barsix.png",
	"./images/upgrades/upgradebar/barseven.png",
	"./images/upgrades/upgradebar/bareight.png",
	"./images/upgrades/upgradebar/barnine.png",
	"./images/upgrades/upgradebar/barten.png"
];
var barClass = document.getElementsByClassName("barImg"); // array of all upgrade bars
var healthImg = "./images/upgrades/health.png"; //Health upgrade image
var regenImg = "./images/upgrades/regen.png"; //Health Renen upgrade image
var reloadImg = "./images/upgrades/reload.png"; //Reload upgrade image
var speedImg = "./images/upgrades/speed.png"; //Speed upgrade image
var bulletlifeImg = "./images/upgrades/bulletdmg.png"; //Bullet Life upgrade image
var bulletdmgImg = "./images/upgrades/bulletlife.png"; //Bullet Damage upgrade image
var bulletspeedImg = "./images/upgrades/bulletspeed.png"; //Bullet speed upgrade image
var lastShot = 0 // -1 - mouse  - 1 - space bar  - 0 - none



//Containing array for shapes
var shapes = new Array();
//Maximum shapes allowed to spawn
var shapesMax = 350;

//Scale of canvas
var viewPortScale = [1,1];

//Containing array for enemies
var enemies = new Array();
//Max enemies allowed
var enemiesMax = 100;
//Max score achievable
var maxScore = 65000;

//Canvas element
var viewPort = document.getElementById("viewPort");
var ctx = viewPort.getContext("2d");
//Counts frames per second
var FPSCnt = 0;
//Resets every second. Used to determine fps
var updateTime = new Date().getTime();
