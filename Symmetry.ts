import { GameState } from "./GameState";
import { Cell } from "./GameState";
import { Policy } from "./Policy";
import { Move } from "./Move";

export class Symmetry {
	transformGameStateFn: (s: GameState) => GameState;
	transformPolicyFn: (p: Policy) => Policy;
	transformInversePolicyFn: (p: Policy) => Policy;

        constructor(transformGameStateFn: (s: GameState) => GameState, transformPolicyFn: (policy: Policy) => Policy, transformInversePolicyFn: (policy: Policy) => Policy) {
                this.transformGameStateFn = transformGameStateFn;
                this.transformPolicyFn = transformPolicyFn;
                this.transformInversePolicyFn = transformInversePolicyFn;
        }

	// goes from S to S'
	transformGameState(gameState: GameState): GameState {
		return this.transformGameStateFn(gameState);
	}

	// goes from P to P'
	transformPolicy(policy: Policy): Policy {
		return this.transformPolicyFn(policy);
	}

	// goes from P' to P
	transformInversePolicy(policy: Policy): Policy {
		return this.transformInversePolicyFn(policy);
	}

}

const identity: Symmetry = new Symmetry((gs: GameState) => gs.clone(), (p: Policy) => p.clone(), (p: Policy) => p.clone());


const flipGameStateHorizontally: (s: GameState) => GameState = function(gs: GameState): GameState {
	let flippedGameState: GameState = new GameState();
	flippedGameState.isP1Turn = flippedGameState.isP1Turn;
	for(let r=0; r<GameState.numRows; r++) {
		let row: Cell[] = [];
		for(let c=0; c<GameState.numCols; c++) {
			row.push(gs.cells[r][GameState.numCols - 1 - c]);
		}
		flippedGameState.cells.push(row);
	}
	return flippedGameState;
}

const flipPolicyHorizontally: (p: Policy) => Policy = function(p: Policy): Policy {
	//movesAndProbabilities: [Move, number][];
	let copyP: Policy = p.clone();
	let size: number = copyP.movesAndProbabilities.length;
	let start: number = 0;
	let end: number = size - 1;
	while(start < end) {
		let tmp: [Move, number] = copyP.movesAndProbabilities[start];
		copyP.movesAndProbabilities[start] = copyP.movesAndProbabilities[end];
		copyP.movesAndProbabilities[end] = tmp;
		start++;
		end--;
	}
	return copyP;
}

const flipHorizontally: Symmetry = new Symmetry(flipGameStateHorizontally, flipPolicyHorizontally, flipPolicyHorizontally);




export const symmetries: Symmetry[] = [identity, flipHorizontally];
