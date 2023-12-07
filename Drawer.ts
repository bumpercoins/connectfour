import { GameState } from "./GameState";

export class Drawer {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
	gameState: GameState;
	scaleFactor: number = 100;
	width: number = GameState.numCols * this.scaleFactor;
	height: number = GameState.numRows * this.scaleFactor;

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
		for(let i=0; i<=GameState.numCols; i++) {
			this.context.lineWidth = 5;
			this.context.beginPath();
			this.context.moveTo(this.scaleFactor * i, 0);
			this.context.lineTo(this.scaleFactor * i, this.height);
			this.context.strokeStyle = "brown";
			this.context.stroke();
		}
		for(let i=0; i<=GameState.numRows; i++) {
			this.context.lineWidth = 5;
			this.context.beginPath();
			this.context.moveTo(0, this.scaleFactor * i);
			this.context.lineTo(this.width, this.scaleFactor * i);
			this.context.strokeStyle = "brown";
			this.context.stroke();
		}


		// draw the non-vacant cells from gameState


	}

}
