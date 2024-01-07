import { GameState } from "./GameState";
import { Move } from "./Move";
import * as tf from '@tensorflow/tfjs';
import { convertGameStateToModelInput } from "./Net";

export class Bot {
	isP1Bot: boolean;
	model: tf.LayersModel;
	
        constructor(isP1Bot: boolean, model: tf.LayersModel) {
                this.isP1Bot = isP1Bot;
		this.model = model;
        }
	
	getMove(gameState: GameState): Move {
		// TODO lets query our model for a move, using Model.predict
		// so we'll need to convert the GameState into a tensor

		// First convert game state into representation model can digest, convert it to input tensor
		let input: tf.Tensor = convertGameStateToModelInput(gameState);
		//console.log(input);



		let prediction = this.model.predict(input);
		//prediction[0].print();
		//prediction[1].print();

		// TODO filter out illegal moves and renormalize (illegal when the column specified by the move is already full)
		let policyData = prediction[0].dataSync();
		console.log(policyData);
		
		// a list of pairs, where pair[0] is the column index and pair[1] is it's prob
		// then sort this list of pairs desc (highest probs first)
		// then iterate greedily left to right, highest probs first and everytime that column is full, skip it
		// until we reach a column index thats not full, and use it as a move index and build the move and return it
		// note that this process has to stop, because if it doesn't the game must have already been over (drawn)









		let dummyBotMove: Move = new Move(this.isP1Bot, Math.floor(Math.random() * GameState.numCols));
		return dummyBotMove;
	}



}
