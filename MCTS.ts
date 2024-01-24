// point of this file is to implement a Monte Carlo Tree Search
import { GameState } from "./GameState";
import { GameStatus } from "./GameState";
import { Policy } from "./Policy";
import { Move } from "./Move";
import * as tf from '@tensorflow/tfjs-node-gpu';
import { getPolicyAndValue } from "./Net";

let numMCTSSims: number = 100;
let cPuct: number = 1;

class MCNode {
	gameState: GameState;
	numVisits: number;
	edges: MCEdge[];
	isTerminal: boolean;
	terminalValue: number;

        constructor(gameState: GameState, edges: MCEdge[], isTerminal: boolean = false, terminalValue: number = 0) {
		this.gameState = gameState;
		this.numVisits = 0;
		this.edges = edges;
		this.isTerminal = isTerminal;
		this.terminalValue = terminalValue;
        }
}

class MCEdge {
	move: Move;
	prob: number;
	// node is undefinied iff numVists == 0
	node: MCNode | undefined;
	qScoreSum: number;
	numVisits: number;
	constructor(move: Move, prob: number) {
		this.move = move;
		this.prob = prob;
		this.node = undefined;
		this.qScoreSum = 0;
		this.numVisits = 0;
        }

	getQScore(): number {
		return this.numVisits == 0? 0 : this.qScoreSum/this.numVisits;
	}


}

// recursively performs 1 full iteration of MCTS and returns the VALUECONTRIBUTION
// Return VALUECONTRIBUTION from the perspective of the player whose turn it is not (so !node.gameState.isP1Turn)
// Precondition: node EXISTS, this is, we have invoked createNode to create it, so it has been visited
function search(node: MCNode, model: tf.LayersModel): number {
	if (node.isTerminal) {
		return -1 * node.terminalValue;
	}
	let bestEdges: MCEdge[] = [node.edges[0]];
	let bestEdgeScore: number = Number.MIN_VALUE;
	for(let edge of node.edges) {
		let score: number = edge.getQScore() + cPuct*edge.prob*Math.sqrt(node.numVisits)/(1 + edge.numVisits);
		if (score >= bestEdgeScore) {
			if (score == bestEdgeScore) {
				bestEdges.push(edge);
			} else {
				bestEdges = [edge]
				bestEdgeScore = score;
			}
		}
	}
	let edgeToTake: MCEdge = bestEdges[Math.floor(Math.random() * bestEdges.length)];
	let valueContribution: number = 0;
	if (edgeToTake.node) {
		valueContribution = search(edgeToTake.node, model);
	} else {
		let nextGameState: GameState = node.gameState.clone();
		nextGameState.applyMove(edgeToTake.move);
		let createNodeRes: [MCNode, number] = createNode(nextGameState, model);
		edgeToTake.node = createNodeRes[0];
		valueContribution = createNodeRes[1];
	}
	edgeToTake.qScoreSum += valueContribution;
	edgeToTake.numVisits++;
	node.numVisits++;
	return -1 * valueContribution;
}

// create MCNode, use the model neural net on the gameState to get the policy and use that policy to create the edges
// return MCNode AND ALSO RETURN THE VALUECONTRIBUTION
function createNode(gameState: GameState, model: tf.LayersModel): [MCNode, number] {
	let gameStatus: GameStatus = gameState.getGameStatus();
	if (gameStatus != GameStatus.ONGOING) {
		// so gameState is terminal, game is over
		let terminalValue: number;
		switch (gameStatus) {
			case GameStatus.P1WON:
				terminalValue = gameState.isP1Turn? 1 : -1;
				break;
			case GameStatus.P2WON:
				terminalValue = gameState.isP1Turn? -1 : 1;
				break;
			case GameStatus.DRAWN:
				terminalValue = 0;
				break;
		}
		let terminalNode: MCNode = new MCNode(gameState, [], true, terminalValue);
		return [terminalNode, terminalValue]
	}
	let policyAndValue: [Policy, number] = getPolicyAndValue(gameState, this.model);
	let policy: Policy = policyAndValue[0];
	let value: number = policyAndValue[1];
	let edges: MCEdge[] = [];
	for(let moveAndProb of policy.movesAndProbabilities) {
		let move: Move = moveAndProb[0];
		let prob: number = moveAndProb[1];
		edges.push(new MCEdge(move, prob));
	}
	return [new MCNode(gameState, edges), -1 * value];
}

/*

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
