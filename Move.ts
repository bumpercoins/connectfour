export class Move {
	isForP1: boolean;
	columnIdx: number;
        constructor(isForP1: boolean, columnIdx: number) {
                this.isForP1 = isForP1;
                this.columnIdx = columnIdx;
        }

	clone(): Move {
		return new Move(this.isForP1, this.columnIdx);
	}
}
