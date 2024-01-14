import { GameState } from "./GameState";
import { Policy } from "./Policy";
import { Move } from "./Move";
import * as tf from '@tensorflow/tfjs';
import { getPolicyAndValue } from "./Net";

export class Bot {
	isP1Bot: boolean;
	model: tf.LayersModel;
	
        constructor(isP1Bot: boolean, model: tf.LayersModel) {
                this.isP1Bot = isP1Bot;
		this.model = model;
        }
	
	getMove(gameState: GameState): Move {
		let policy: Policy =  getPolicyAndValue(gameState, this.model)[0];

		//let dummyBotMove: Move = new Move(this.isP1Bot, Math.floor(Math.random() * GameState.numCols));
		//return dummyBotMove;
		return policy.movesAndProbabilities[0][0];
	}



}