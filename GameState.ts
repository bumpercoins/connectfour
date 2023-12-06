class GameState {
	static numRows = 6;
	static numCols = 7;

	isP1Turn: boolean; 
	cells: Cell[][];

	constructor() {
		this.cells = [];
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
		scoreToDiagForward.forEach((cellList: Cell[], score: number) => {
			let res: GameStatus = fourInARowChecker(cellList);
			if (res != GameStatus.ONGOING) {
				return res;
			}
		});
		scoreToDiagBackward.forEach((cellList: Cell[], score: number) => {
			let res: GameStatus = fourInARowChecker(cellList);
			if (res != GameStatus.ONGOING) {
				return res;
			}
		});
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
}

enum Cell {
	VACANT,
	P1OWNED,
	P2OWNED
}

enum GameStatus {
	ONGOING,
	P1WON,
	P2WON,
	DRAWN
}
