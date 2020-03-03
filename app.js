/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
    constructor(p1, p2, height = 6, width = 7) {
        this.players = [p1, p2];
        this.height = height;
        this.width = width;
        this.currentPlayer = p1;
        this.makeBoard();
        this.makeHtmlBoard();
        this.gameOver = false;
    }

    makeBoard() {
        // TODO: set "board" to empty HEIGHT x WIDTH matrix array
        this.board = [];
        for (let y = 0; y < this.height; y++) {
            this.board.push(Array.from({ length: this.width }));
        }
    }

    /** makeHtmlBoard: make HTML table and row of column tops. */
    makeHtmlBoard() {
        const displayBoard = document.querySelector('#board');
        displayBoard.innerHTML = ''; // prevent from reloading html elements again

        // this.handleGameClick has to be outside the loop other wise removeEventListener won't work.
        this.handleGameClick = this.handleClick.bind(this);
        for (let y = 0; y < this.height; y++) {
            const trRow = document.createElement("tr");
            for (let x = 0; x < this.width; x++) {
                const tdCol = document.createElement("td");
                tdCol.setAttribute('id', `${y}-${x}`);
                tdCol.addEventListener('click', this.handleGameClick);
                trRow.append(tdCol);
            }
            displayBoard.append(trRow);
        }
    }

    /** findSpotForCol: given column x, return top empty y (null if filled) */
    findSpotForCol(x) {
        // TODO: write the real version of this, rather than always returning 0
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    /** placeInTable: update DOM to place piece into HTML table of board */
    placeInTable(y, x) {
        // TODO: make a div and insert into correct table cell
        const divMark = document.createElement('div');
        divMark.classList.add('piece');
        divMark.style.backgroundColor = this.currentPlayer.color;
        // divMark.setAttribute('id', `${y}-${x}`);   /// need to added this or  idsStr 
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(divMark);
    }

    /** endGame: announce game end */
    endGame(msg) {
        alert(msg);
        // remove all event listeners once game is over!
        const tdColumnArr = document.querySelectorAll('td');
        tdColumnArr.forEach(column => {
            column.removeEventListener('click', this.handleGameClick);
        });
    }

    handleClick(e) {
        // retrieve x co-ordinate from id="y-x"
        const idStr = e.target.id;
        const x = Number(idStr.slice(-1));

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);

        // place piece in board and add to HTML table
        this.board[y][x] = this.currentPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            this.gameOver = true;
            return this.endGame(`Player ${this.currentPlayer.color} won!`);
        }

        // check for tie
        if (this.board.every(row => row.every(col => col))) {
            return this.endGame('Game Tie!!!!');
        }

        // switch players
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];

        const tdColumnArr = document.querySelectorAll('td');
        tdColumnArr.forEach(column => {
            // remove event listener once spot is occupied
            if (column.hasChildNodes()) {
                column.removeEventListener('click', this.handleGameClick);
            }
        });


    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    checkForWin() {

        // function win(cells) {
        //     // Check four cells to see if they're all color of current player
        //     //  - cells: list of four (y, x) cells
        //     //  - returns true if all are legal coordinates & all match currPlayer

        const win = (cells => cells.every(([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === this.currentPlayer
        ));

        // TODO: read and understand this code. Add comments to help you.

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const horiz = [
                    [y, x],
                    [y, x + 1],
                    [y, x + 2],
                    [y, x + 3]
                ];
                const vert = [
                    [y, x],
                    [y + 1, x],
                    [y + 2, x],
                    [y + 3, x]
                ];
                const diagDR = [
                    [y, x],
                    [y + 1, x + 1],
                    [y + 2, x + 2],
                    [y + 3, x + 3]
                ];
                const diagDL = [
                    [y, x],
                    [y + 1, x - 1],
                    [y + 2, x - 2],
                    [y + 3, x - 3]
                ];

                if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

class Player {
    constructor(color) {
        this.color = color;
    }
}

let startButton = document.getElementById('start-btn');
startButton.addEventListener('click', () => {
    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);

    new Game(p1, p2);
});