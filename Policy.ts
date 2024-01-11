import { Move } from "./Move";

export class Policy {
	// a Policy consists of a list of all the legal moves and their associated probabilities
	// we'll adopt convention that moves will be sorted in highest probability moves appearing first
	movesAndProbabilities: [Move, number][];
        constructor(movesAndProbabilities: [Move, number][]) {
		movesAndProbabilities.sort(function(a, b){return b[1] - a[1]});
		this.movesAndProbabilities = movesAndProbabilities;
        }
}
