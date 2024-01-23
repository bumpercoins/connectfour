import { Move } from "./Move";

export class GameState {
	static numRows = 6;
	static numCols = 7;

	isP1Turn: boolean; 
	cells: Cell[][];

	constructor() {
		this.cells = [];
		this.isP1Turn = true;
		for(let r=0; r<GameState.numRows; r++) {
			let row: Cell[] = [];
			for(let c=0; c<GameState.numCols; c++) {
				row.push(Cell.VACANT);
			}
			this.cells.push(row);
		}
	}

	getGameStatus(): GameStatus {
		// helper function, precondition is cellList is not empty
		let fourInARowChecker:(cellList: Cell[]) => GameStatus = function(cellList: Cell[]) {
			let cell: Cell = cellList[0];
			let count: number = 1;
			for(let i=1; i<cellList.length; i++) {
				let currCell = cellList[i];
				if (currCell != cell) {
					cell = currCell;
					count = 1;
				} else {
					// extend
					count++;
					if (count == 4 && cell != Cell.VACANT) {
						return cell == Cell.P1OWNED? GameStatus.P1WON : GameStatus.P2WON;
					}
				}
			}
			return GameStatus.ONGOING;
		};
		// do rows
		for(let row of this.cells) {
			let rowRes: GameStatus = fourInARowChecker(row);
			if (rowRes != GameStatus.ONGOING) {
				return rowRes;
			}
		}
		// do cols
		for(let c=0; c<GameState.numCols; c++) {
			let cellList: Cell[] = [];
			for(let r=0; r<GameState.numRows; r++) {
				cellList.push(this.cells[r][c]);
			}
			let colRes: GameStatus = fourInARowChecker(cellList);
			if (colRes != GameStatus.ONGOING) {
				return colRes;
			}
		}
		// do forward and backward diags
		let scoreToDiagForward: Map<number, Cell[]> = new Map();
		let scoreToDiagBackward: Map<number, Cell[]> = new Map();
		for(let r=0; r<GameState.numRows; r++) {
			for(let c=0; c<GameState.numCols; c++) {
				let cell: Cell = this.cells[r][c];
				let scoreForward: number = r + c;
				let scoreBackward: number = r - c;
				if (!scoreToDiagForward.has(scoreForward)) {
					scoreToDiagForward.set(scoreForward, []);
				}
				if (!scoreToDiagBackward.has(scoreBackward)) {
					scoreToDiagBackward.set(scoreBackward, []);
				}
				scoreToDiagForward.get(scoreForward).push(cell);
				scoreToDiagBackward.get(scoreBackward).push(cell);
			}
		}
		let res: GameStatus = GameStatus.ONGOING;
		scoreToDiagForward.forEach((cellList: Cell[], score: number) => {
			if (res != GameStatus.ONGOING) {
				return;
			}
			res = fourInARowChecker(cellList);
			if (res != GameStatus.ONGOING) {
				return res;
			}
		});
		if (res != GameStatus.ONGOING) {
			return res;
		}
		scoreToDiagBackward.forEach((cellList: Cell[], score: number) => {
			if (res != GameStatus.ONGOING) {
				return;
			}
			res = fourInARowChecker(cellList);
			if (res != GameStatus.ONGOING) {
				return res;
			}
		});
		if (res != GameStatus.ONGOING) {
			return res;
		}
		// we know its not GameStatus.P[1,2]WON...need to check for DRAWN
		// to check for draw, suffices to check the TOP row bc of "gravity" (assumes game state is legal)
		// that is a coin in top row implies all cells below are populated by coins
		for(let cell of this.cells[0]) {
			if (cell == Cell.VACANT) {
				return GameStatus.ONGOING;
			}
		}
		return GameStatus.DRAWN;
	}

	applyMove(move: Move) {
		if (move.isForP1 != this.isP1Turn) {
			let errMsg: string = "Should not see this message. It is not this player's turn yet."
			console.log(errMsg);
			throw new Error(errMsg);
			return;

		}
		let r = 0;
		while(r<GameState.numRows && this.cells[r][move.columnIdx] == Cell.VACANT) {
			r++;
		}
		// outside while 2 things could be true: r could point to 1 past bottom row (meaning empty col) or found first non-vacant cell
		r--;
		if (r < 0) {
			console.log("Should not see this message. Illegal move");
			throw new Error('Should not see this message. Illegal move');
			return;
		}
		this.cells[r][move.columnIdx] = move.isForP1? Cell.P1OWNED : Cell.P2OWNED;
		this.isP1Turn = !this.isP1Turn;
	}

	getLegalMoves(): Move[] {
		let moves: Move[] = []
		for(let c=0; c<GameState.numCols; c++) {
			let cell = this.cells[0][c];
			if (cell == Cell.VACANT) {
				let move: Move = new Move(this.isP1Turn, c);
				moves.push(move);
			}
		}
		return moves;
	}

	clone(): GameState {
		let copy: GameState = new GameState();
		for(let r=0; r<GameState.numRows; r++) {
			let row: Cell[] = [];
			for(let c=0; c<GameState.numCols; c++) {
				row.push(this.cells[r][c]);
			}
			copy.cells.push(row);
		}
		return copy;
	}
}

export enum Cell {
	VACANT,
	P1OWNED,
	P2OWNED
}

export enum GameStatus {
	ONGOING,
	P1WON,
	P2WON,
	DRAWN
}
