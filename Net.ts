import * as tf from '@tensorflow/tfjs';
import { GameState } from "./GameState";
import { Cell } from "./GameState";
import { Policy } from "./Policy";
import { Move } from "./Move";

export async function createModel() {
	// TODO check if model exists already. Only if it doesn't exist create a new one

	const input = tf.input({shape: [GameState.numRows, GameState.numCols, 2]})
	const conv1 = tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}).apply(input);
	const conv2 = tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}).apply(conv1);
	const flat = tf.layers.flatten({}).apply(conv2);
	const dense1 = tf.layers.dense({units: 16, activation: 'tanh'}).apply(flat);
	const policyOutput = tf.layers.dense({units: GameState.numCols, activation: 'softmax'}).apply(dense1);
	const valueOutput = tf.layers.dense({units: 1, activation: 'relu'}).apply(dense1);
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
export function convertGameStateToModelInput(gameState: GameState): tf.Tensor {
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

export function getPolicyAndValue(gameState: GameState, model: tf.LayersModel): [Policy, number] {
	let input: tf.Tensor = convertGameStateToModelInput(gameState);
	let prediction = model.predict(input);
	let policyData: number[] = prediction[0].dataSync();
	let valueData: number[] = prediction[1].dataSync();
	
	// filter out illegal moves
	let legalMoves: Move[] = gameState.getLegalMoves();
	let legalMovesWithProbs: [Move, number][] = [];
	for(let move of legalMoves) {
		let moveProb: number = policyData[move.columnIdx];
		legalMovesWithProbs.push([move, moveProb]);
	}
	return [new Policy(legalMovesWithProbs), valueData[0]];
}

