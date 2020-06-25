/*
 * Lieu        : ETML, Lausanne
 * Auteur      : Hugo Ducommun
 * Date        : 23.06.2020
 * Description : Chrono pour le temps de résolution / génération
 * Inspiration : https://www.proglogic.com/code/javascript/time/chronometer.php
*/

var startTime = 0
var end = 0
var diff = 0
var timerID = 0

function chrono() {
	end = new Date()
	diff = end - startTime
	diff = new Date(diff)
	var msec = diff.getMilliseconds()
	var sec = diff.getSeconds()
	var min = diff.getMinutes()

	if (min < 10){
		min = "0" + min
	}
	if (sec < 10){
		sec = "0" + sec
	}
	if(msec < 10){
		msec = "00" +msec
	}
	else if(msec < 100){
		msec = "0" +msec
	}
	
	if (generation) {
		document.getElementById("generationTime").innerHTML = min + ":" + sec + ":" + msec;
	} else if (solveLoop) {
		document.getElementById("solvingTime").innerHTML = min + ":" + sec + ":" + msec;
	}
	timerID = setTimeout("chrono()", 10)
}
function chronoStart() {
	startTime = new Date()
	chrono()
}
function chronoContinue() {
	startTime = new Date()-diff
	startTime = new Date(startTime)
	chrono()
}
function chronoReset() {
	if (generation) {
		document.getElementById("generationTime").innerHTML = "00:00:000";
	} else if (solveLoop) {
		document.getElementById("solvingTime").innerHTML = "00:00:000";
	}
	startTime = new Date()
}
function chronoStopReset() {
	chronoStop();
	chronoReset();
}
function chronoStop() {
	clearTimeout(timerID)
}