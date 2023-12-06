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




}

enum Cell {
	VACANT,
	P1OWNED,
	P2OWNED
}
