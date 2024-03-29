import { GameState } from "./GameState";
import { GameStatus } from "./GameState";
import { Move } from "./Move";
import { Drawer } from "./Drawer";
import { Bot } from "./Bot";
import * as tf from '@tensorflow/tfjs';

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
let bot: Bot;
let gameState: GameState = new GameState();
let drawer: Drawer = new Drawer(document.getElementById("canvas") as HTMLCanvasElement, gameState);
let prompt: HTMLElement = document.getElementById("Prompt");
let defaultNumMCTSSims: number = 10;

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
			let gameOver: boolean = applyMove(new Move(iAmP1, i));
			if (gameOver) {
				return;
			}
			transitionToBotTurn();
		}
		moveButtonsNode.appendChild(buttonNode);
	}
}

// returns True iff Game is Over
let applyMove = function(move: Move): boolean {
	gameState.applyMove(move);
	drawer.draw();
	let gameOutcomeMessage: string = '';
	let gameOver: boolean = true;
	switch (gameState.getGameStatus()) {
		case GameStatus.ONGOING:
			gameOver = false;
			break;
		case GameStatus.P1WON:
			gameOutcomeMessage = iAmP1? "You won!" : "The Bot won!";
			break;
		case GameStatus.P2WON:
			gameOutcomeMessage = !iAmP1? "You won!" : "The Bot won!";
			break;
		case GameStatus.DRAWN:
			gameOutcomeMessage = "The game ended in a draw.";
			break;
	}
	if (gameOver) {
		prompt.innerText = "Game Over. " + gameOutcomeMessage;
		let childButtons = moveButtonsNode.children;
		for (let i = 0; i < childButtons.length; i++) {
			let button: HTMLButtonElement = childButtons[i] as HTMLButtonElement;
			button.disabled = true;
		}
	}
	return gameOver;
}


let startGame = async function() {
	createHumanInputButtons();
	document.getElementById("PlayerSelectionWrap").style.display = "none";
	document.getElementById("GameWrap").style.display = "block";
	bot = new Bot(!iAmP1, await tf.loadLayersModel('./model/model.json'));
	let numMCTSSimsInput: HTMLInputElement = document.getElementById("numMCTSSims") as HTMLInputElement;
	bot.numMCTSSims = numMCTSSimsInput.value? parseInt(numMCTSSimsInput.value): defaultNumMCTSSims;
	numMCTSSimsInput.addEventListener('change', function() {
		bot.numMCTSSims = parseInt(this.value);
	});
	if (!iAmP1) {
		transitionToBotTurn();
	}
	drawer.draw();
}

let transitionToBotTurn = async function() {
	// first lets disable all our buttons
	let childButtons = moveButtonsNode.children;
	for (let i = 0; i < childButtons.length; i++) {
		let button: HTMLButtonElement = childButtons[i] as HTMLButtonElement;
		button.disabled = true;
	}

	let botMove: Move = bot.getMove(gameState);
	let gameOver: boolean = applyMove(botMove);
	if (gameOver) {
		return;
	}
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

