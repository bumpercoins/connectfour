import * as tf from '@tensorflow/tfjs';
import { GameState } from "./GameState";
import { Cell } from "./GameState";
import { Policy } from "./Policy";
import { Move } from "./Move";

// This type is a named tuple that represents a training sample in the form [state, policy, reward]
export type Example = [GameState, Policy, number]

export async function createModel() {
	// TODO check if model exists already. Only if it doesn't exist create a new one

	const input = tf.input({shape: [GameState.numRows, GameState.numCols, 2]})
	const conv1 = tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}).apply(input);
	const conv2 = tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}).apply(conv1);
	const flat = tf.layers.flatten({}).apply(conv2);
	const dense1 = tf.layers.dense({units: 16, activation: 'tanh'}).apply(flat);
	const policyOutput = tf.layers.dense({units: GameState.numCols, activation: 'softmax'}).apply(dense1);
	const valueOutput = tf.layers.dense({units: 1, activation: 'tanh'}).apply(dense1);
	const model = tf.model({inputs: input, outputs: [policyOutput as tf.SymbolicTensor, valueOutput as tf.SymbolicTensor]});
	//model.summary();

	model.compile({
		optimizer: 'sgd',
		loss: ['categoricalCrossentropy', 'meanSquaredError'],
		metrics: ['accuracy']
	});


	await model.save('file://./model');
}

//createModel();

// this function uses gameState.isP1Turn and returns input from perspective of player whose turn it is
function convertGameStateToModelInput(gameState: GameState): tf.Tensor {
	let currentPlayerCells: number[][] = [];
	let otherPlayerCells: number[][] = [];
	for(let r=0; r<GameState.numRows; r++) {
		let emptyRow1: number[] = [];
		let emptyRow2: number[] = [];
		for(let c=0; c<GameState.numCols; c++) {
			emptyRow1.push(0);
			emptyRow2.push(0);
		}
		currentPlayerCells.push(emptyRow1);
		otherPlayerCells.push(emptyRow2);
	}

	for(let r=0; r<GameState.numRows; r++) {
		for(let c=0; c<GameState.numCols; c++) {
			let cell: Cell = gameState.cells[r][c];
			if (cell == Cell.VACANT) {
				continue;
			}
			let cellIsP1Owned: boolean = cell == Cell.P1OWNED;
			let toMark: number[][] = cellIsP1Owned == gameState.isP1Turn? currentPlayerCells : otherPlayerCells;
			toMark[r][c] = 1;
		}
	}
	let inputNumberArrayNCHW: number[][][][] = [[currentPlayerCells, otherPlayerCells]];
	let inputNCHWTensor = tf.tensor(inputNumberArrayNCHW);
	let inputNHWCTensor = tf.transpose(inputNCHWTensor, [0, 2, 3, 1]);
	return inputNHWCTensor;
}

function convertPolicyToTensor(policy: Policy): tf.Tensor {
	let policyData: number[] = [];
	for(let i=0; i<GameState.numCols; i++) {
		policyData.push(0);
	}
	for(let moveAndProb of policy.movesAndProbabilities) {
		policyData[moveAndProb[0].columnIdx] = moveAndProb[1];
	}
	return tf.tensor(policyData, [GameState.numCols]);
}

export function getPolicyAndValue(gameState: GameState, model: tf.LayersModel): [Policy, number] {
	let input: tf.Tensor = convertGameStateToModelInput(gameState);
	let prediction = model.predict(input);
	let policyData: number[] = prediction[0].dataSync();
	let valueData: number[] = prediction[1].dataSync();
	
	// filter out illegal moves and renomalize
	let legalMoves: Move[] = gameState.getLegalMoves();
	let legalMovesWithProbs: [Move, number][] = [];
	let sumProb: number = 0;
	for(let move of legalMoves) {
		let moveProb: number = policyData[move.columnIdx];
		legalMovesWithProbs.push([move, moveProb]);
		sumProb += moveProb;
	}
	if (sumProb != 0) {
		for(let moveAndProb of legalMovesWithProbs) {
			// finish the renomalization
			moveAndProb[1] = moveAndProb[1] / sumProb;
		}
	} else {
		let prob: number = 1/legalMoves.length;
		for(let moveAndProb of legalMovesWithProbs) {
			moveAndProb[1] = prob;
		}
	}

	return [new Policy(legalMovesWithProbs), valueData[0]];
}

// Given training examples, train the model
// export type Example = [GameState, Policy, number]
export async function trainModel(model: tf.LayersModel, examples: Example[]) {
	//let input: tf.Tensor = convertGameStateToModelInput(gameState);
	let numExamples: number = examples.length;
	let xsArray: tf.Tensor[] = [];
	let ys1Array: tf.Tensor[] = [];
	let ys2Array: tf.Tensor[] = [];

	for(let example of examples) {
		xsArray.push(convertGameStateToModelInput(example[0]));
		ys1Array.push(convertPolicyToTensor(example[1]));
		ys2Array.push(tf.tensor([example[2]]));
	}
	let xs: tf.Tensor = tf.concat(xsArray);
	let ys1: tf.Tensor = tf.stack(ys1Array);
	let ys2: tf.Tensor = tf.stack(ys2Array);

	let history = await model.fit(xs, [ys1, ys2]);
	console.log(history.history)
}
