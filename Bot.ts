import { GameState } from "./GameState";
import { Move } from "./Move";

export class Bot {
	isP1Bot: boolean;
	
        constructor(isP1Bot: boolean) {
                this.isP1Bot = isP1Bot;
        }
	
	getMove(gameState: GameState): Move {
		// TODO lets query our Bot's neural network for a move
		let dummyBotMove: Move = new Move(this.isP1Bot, Math.floor(Math.random() * GameState.numCols));
		return dummyBotMove;
	}



}
