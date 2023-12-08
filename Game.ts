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

let moveButtonsNode: HTMLElement = document.getElementById("MoveButtons");
let createHumanInputButtons = function() {
	// Dynamically create the 7 buttons for (human) player to drop chips
	// These buttons should be disabled when its the bot's turn
	// Maybe also disable if column is full?
	// And bind each button to add the chip to that column
	for(let i=0; i<GameState.numCols; i++) {
		let buttonNode: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
		buttonNode.textContent = "Column: " + (i + 1);
		// initially set the disabled state
		if (!iAmP1) {
			buttonNode.disabled = true;
		}
		buttonNode.onclick = function() {
			if (gameState.isP1Turn != iAmP1) {
				console.log("Should not see this message. Button should be disabled and not clickable");
				throw new Error('Should not see this message. Button should be disabled and not clickable');
				return;
			}
			gameState.applyMove(new Move(iAmP1, i));
			drawer.draw();
			transitionToBotTurn();
		}
		moveButtonsNode.appendChild(buttonNode);
	}
}

let startGame = function() {
	createHumanInputButtons();
	document.getElementById("PlayerSelectionWrap").style.display = "none";
	document.getElementById("GameWrap").style.display = "block";
	drawer.draw();
}

let transitionToBotTurn = async function() {
	// first lets disable all our buttons
	let childButtons = moveButtonsNode.children;
	for (let i = 0; i < childButtons.length; i++) {
		let button: HTMLButtonElement = childButtons[i] as HTMLButtonElement;
		button.disabled = true;
	}

	// lets query our Bot's neural network for a move


	// TODO have Bot provide a move
	let dummyBotMove: Move = new Move(!iAmP1, Math.floor(Math.random() * GameState.numCols));

	gameState.applyMove(dummyBotMove);


	drawer.draw();

	// go back to human turn
	transitionToHumanTurn();
}

let transitionToHumanTurn = async function() {
	let childButtons = moveButtonsNode.children;
	for (let i = 0; i < childButtons.length; i++) {
		let button: HTMLButtonElement = childButtons[i] as HTMLButtonElement;
		button.disabled = false;
	}
}

