import { Move } from "./Move";

export class Policy {
	// a Policy consists of a list of all the legal moves and their associated probabilities
	// we'll adopt convention that moves will be sorted in highest probability moves appearing first
	movesAndProbabilities: [Move, number][];
        constructor(movesAndProbabilities: [Move, number][]) {
		//movesAndProbabilities.sort(function(a, b){return b[1] - a[1]});
		this.movesAndProbabilities = movesAndProbabilities;
        }

	clone(): Policy {
		let copyMovesAndProbabilities: [Move, number][] = [];
		for(let moveAndProb of this.movesAndProbabilities) {
			copyMovesAndProbabilities.push([moveAndProb[0].clone(), moveAndProb[1]]);
		}
		return new Policy(copyMovesAndProbabilities);
	}

	// samples a move respecting the moves' probs
	getHighestProbMove(): Move {
		let maxProb: number = -1;
		let moves: Move[] = [];
		for(let moveAndProb of this.movesAndProbabilities) {
			let prob: number = moveAndProb[1];
			if (prob < maxProb) {
				continue;
			}
			let move: Move = moveAndProb[0];
			if (prob == maxProb) {
				moves.push(move);
			} else {
				moves = [move];
				maxProb = prob;
			}
		}
		return moves[Math.floor(Math.random() * moves.length)];
	}

	// samples a move respecting the moves' probs
	sampleMove(): Move {
		let rand: number = Math.random();
		let sum: number = 0;
		let i: number = 0;
		while(i < this.movesAndProbabilities.length && rand >= sum + this.movesAndProbabilities[i][1]) {
			sum = sum + this.movesAndProbabilities[i][1];
			i++;
		}
		i = Math.min(i, this.movesAndProbabilities.length - 1);
		return this.movesAndProbabilities[i][0];
	}

}
