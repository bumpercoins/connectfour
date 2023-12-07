import { GameState } from "./GameState";
import { Move } from "./Move";
import { Drawer } from "./Drawer";

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
let gameState: GameState = new GameState();
let drawer: Drawer = new Drawer(document.getElementById("canvas") as HTMLCanvasElement, gameState);

let startGame = function() {
	document.getElementById("PlayerSelectionWrap").style.display = "none";
	document.getElementById("GameWrap").style.display = "block";
	drawer.draw();
}
