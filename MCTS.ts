// point of this file is to implement a Monte Carlo Tree Search
import { GameState } from "./GameState";
import { Policy } from "./Policy";
import { Move } from "./Move";
import * as tf from '@tensorflow/tfjs-node-gpu';

let numMCTSSims: number = 1800;

class MCNode {
	gameState: GameState;
	numVisits: number;
	edges: MCEdge[];
        constructor(gameState: GameState, edges: MCEdge[]) {
		this.gameState = gameState;
		this.numVisits = 0;
		this.edges = edges;
        }
}

class MCEdge {
	move: Move;
	prob: number;
	// node is undefinied iff numVists == 0
	node: MCNode | undefined;
	qScore: number;
	numVisits: number;
	constructor(move: Move, prob: number) {
		this.move = move;
		this.prob = prob;
		this.node = undefined;
		this.qScore = 0;
		this.numVisits = 0;
        }
}

function search(node: MCNode, model: tf.LayersModel) {

}


/*
// create MCNode, use the model neural net on the gameState to get the policy and use that policy to create the edges
// return MCNode AND ALSO RETURN THE VALUECONTRIBUTION
function createNode(gameState: GameState, model: tf.LayersModel): [MCNode, number] {

}

// takes in the gameState and returns an MCTS-IMPROVED policy
// creates the
function doMCTS(gameState: GameState, model: tf.LayersModel): Policy {
	root: MCNode = createNode(gameState, model)[0];
	for(let i=0; i<numMCTSSims; i++) {
		search(root, model);
	}
	// use the root and the edge weights to create an improved policy (so look at the edge's numvisits and normalize over them)
	// then return this policy
}







*/
