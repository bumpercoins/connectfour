import { GameState } from "./GameState";
import { Move } from "./Move";

console.log("Hello from Game.ts!");

let iAmP1: boolean = true;
document.getElementById("GoFirstButton").onclick = function() {
	iAmP1 = true;
	startGame();
};
document.getElementById("GoSecondButton").onclick = function() {
	iAmP1 = false;
	startGame();
};

let startGame = function() {
	document.getElementById("PlayerSelectionWrap").style.display = "none";




}
