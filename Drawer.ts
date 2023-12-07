import { GameState } from "./GameState";

export class Drawer {
        canvasContainer: HTMLElement;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
	gameState: GameState;

	constructor(canvasContainer: HTMLElement, canvas: HTMLCanvasElement, gameState: GameState){
		this.canvasContainer = canvasContainer;
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.gameState = gameState;
	}

	draw() {
	// draws the gamestate on the canvas




	}

}
