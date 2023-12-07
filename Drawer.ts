import { GameState } from "./GameState";

export class Drawer {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
	gameState: GameState;
	width: number = 700;
	height: number = 600;

	constructor(canvas: HTMLCanvasElement, gameState: GameState){
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.gameState = gameState;
	}

	draw() {
		// draws the gamestate on the canvas

		// fill background
		this.context.fillStyle = "aliceblue";
		this.context.fillRect(0, 0, this.width, this.height);

		// draw gridlines


		// draw the non-vacant cells from gameState


	}

}
