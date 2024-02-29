// train our model via self play

import { GameState } from "./GameState";
import { GameStatus } from "./GameState";
import { Move } from "./Move";
import { Policy } from "./Policy";
import * as tf from '@tensorflow/tfjs-node-gpu';
import { doMCTS } from "./MCTS";
import { Example } from "./Net";
import { trainModel } from "./Net";
import { symmetries } from "./Symmetry";


let numIterations: number = 5;
let numGamesPerIteration: number = 10;

// executes AlphaZero algorithm, the entry point
async function train() {
	let model: tf.LayersModel = await tf.loadLayersModel('file://./model/model.json');
	for(let i=0; i<numIterations; i++) {
		let examples: Example[] = [];
		for(let j=0; j<numGamesPerIteration; j++) {
			let examplesFromGame: Example[] = selfPlayGame(model);
			for(let example of examplesFromGame) {
				for(let symmetry of symmetries) {
					let exampleSymmetry: Example = [
						symmetry.transformGameState(example[0]),
						symmetry.transformPolicy(example[1]),
						example[2]
					];
					examples.push(exampleSymmetry);
				}
			}
		}

		model.compile({
			optimizer: 'sgd',
			loss: ['categoricalCrossentropy', 'meanSquaredError'],
			metrics: ['accuracy']
		});

		await trainModel(model, examples);
		await model.save('file://./model');
		console.log(i);
	}
}
train();

// heart of file, this function plays out a single game via self play
// and returns training examples generated by playing this game
function selfPlayGame(model: tf.LayersModel): Example[] {
	let examples: Example[] = [];
	let gameState: GameState = new GameState();
	while(gameState.getGameStatus() == GameStatus.ONGOING) {
		let policy: Policy = doMCTS(gameState, model);
		examples.push([gameState.clone(), policy.clone(), 0]);
		let moveToPlay: Move = policy.sampleMove();
		gameState.applyMove(moveToPlay);
	}
	if (gameState.getGameStatus() == GameStatus.DRAWN) {
		return examples;
	}
	let p1Won: boolean = gameState.getGameStatus() == GameStatus.P1WON;
	for(let example of examples) {
		let reward: number = example[0].isP1Turn == p1Won? 1 : -1;
		example[2] = reward;
	}
	return examples;
}
