import { GameState } from "./GameState";
import { Policy } from "./Policy";
import { Move } from "./Move";
import * as tf from '@tensorflow/tfjs';
import { doMCTS } from "./MCTS";

export class Bot {
	isP1Bot: boolean;
	model: tf.LayersModel;
	// TODO import this 1000 constant from MCTS.ts
	numMCTSSims: number = 1000;
	
        constructor(isP1Bot: boolean, model: tf.LayersModel) {
                this.isP1Bot = isP1Bot;
		this.model = model;
        }
	
	getMove(gameState: GameState): Move {
		let policy: Policy = doMCTS(gameState, this.model, this.numMCTSSims);

		//let dummyBotMove: Move = new Move(this.isP1Bot, Math.floor(Math.random() * GameState.numCols));
		//return dummyBotMove;
		//return policy.movesAndProbabilities[0][0];
		return policy.getHighestProbMove();
	}



}
