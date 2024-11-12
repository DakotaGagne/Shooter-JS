


window.addEventListener('mousedown', function(e) { // used to start shooting
	lastShot = -1;
});
window.addEventListener('mouseup', function(e) { // used to finish shooting
	if(lastShot==-1){
		lastShot=0;
	}//end of if
});
window.addEventListener('mousemove', function(e) { // sets mouse pos in reference to canvas and canvas scale
	mouse.x=e.clientX*viewPortScale[0];
	mouse.y=e.clientY*viewPortScale[1];
});



function helpMenu(){
	var divs = document.getElementsByClassName('help')
	var i=0
	while(i<3){
		if(paused)divs[i].style.visibility='hidden',viewPort.style.cursor='none'
		else divs[i].style.visibility='visible',viewPort.style.cursor='default'
		i++
	}
	paused=!paused
}


//http://rainbow.arch.scriptmania.com/scripts/no_right_click.html
function clickIE() {if (document.all) {("");return false;}} 
function clickNS(e) {if 
(document.layers||(document.getElementById&&!document.all)) { 
if (e.which==2||e.which==3) {("");return false;}}} 
if (document.layers) 
{document.captureEvents(Event.MOUSEDOWN);document.onmousedown=clickNS;} 
else{document.onmouseup=clickNS;document.oncontextmenu=clickIE;} 
document.oncontextmenu=new Function("return false");