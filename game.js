document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('board');
    const rows = 8;
    const cols = 8;

    let isFlipped = false; // Tracks if the board is flipped

    function flipBoard() {
        const boardWrapper = document.getElementById('board-wrapper');
        boardWrapper.classList.toggle('flip');
    }

    // ✅ Flip Board Function
    window.flipBoard = function() {
        isFlipped = !isFlipped;
        if (isFlipped) {
            board.style.transform = 'rotateX(180deg) rotateY(180deg)';
        } else {
            board.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    };

    // ✅ Create the board
    function createBoard() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                    if (row < 3) {
                        const piece = document.createElement('div');
                        piece.classList.add('piece', 'red');
                        square.appendChild(piece);
                    } else if (row > 4) {
                        const piece = document.createElement('div');
                        piece.classList.add('piece', 'black');
                        square.appendChild(piece);
                    }
                }
                board.appendChild(square);
            }
        }
    }

    createBoard();
});
