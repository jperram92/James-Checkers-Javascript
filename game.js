document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('board');
    const boardWrapper = document.getElementById('board-wrapper');
    const rows = 8;
    const cols = 8;
    let currentPlayer = 'red';
    let selectedPiece = null;
    let validMoves = [];
    let isBoardFlipped = false;
    let currentRotation = 0;

    // 🛡️ Flip Board
    window.flipBoard = function () {
        isBoardFlipped = !isBoardFlipped;
        boardWrapper.style.transform = isBoardFlipped
            ? 'rotateX(30deg) rotateY(180deg)'
            : 'rotateX(30deg) rotateY(0deg)';
    };

    // 🌀 Rotate Board
    window.rotateBoard = function (degrees) {
        currentRotation = degrees;
        boardWrapper.style.transform = `rotateX(30deg) rotateY(${degrees}deg)`;
    };

    // 🛡️ Adjust Row/Column Based on Flip State
    function adjustForFlip(row, col) {
        if (isBoardFlipped) {
            return { row: 7 - row, col: 7 - col };
        }
        return { row, col };
    }

    // 🛡️ Initialize the Board
    function createBoard() {
        board.innerHTML = '';
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const square = document.createElement('div');
                square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;

                if ((row + col) % 2 !== 0) {
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

                square.addEventListener('click', handleSquareClick);
                board.appendChild(square);
            }
        }
    }

    // 🛡️ Handle Square Click
    function handleSquareClick(event) {
        const square = event.currentTarget;
        let row = parseInt(square.dataset.row);
        let col = parseInt(square.dataset.col);
        ({ row, col } = adjustForFlip(row, col));

        if (square.firstChild && square.firstChild.classList.contains('piece')) {
            handlePieceSelection(square, row, col);
        } else if (validMoves.some(move => move.row === row && move.col === col)) {
            movePiece(square, row, col);
        } else {
            clearSelection();
        }
    }

    // 🛡️ Handle Piece Selection
    function handlePieceSelection(square, row, col) {
        const piece = square.firstChild;
        if (!piece.classList.contains(currentPlayer)) return;

        clearSelection();

        selectedPiece = { piece, row, col };
        square.classList.add('active');

        validMoves = calculateValidMoves(row, col, piece.classList.contains('king'), currentPlayer);
        highlightValidMoves(validMoves);
    }

    // 🛡️ Calculate Valid Moves
    function calculateValidMoves(row, col, isKing, player) {
        let moves = [];
        let directions = [
            [1, -1], [1, 1], // Forward
            [-1, -1], [-1, 1] // Backward (only for king)
        ];

        directions.forEach(([dr, dc]) => {
            if (!isKing && player === 'red' && dr === -1) return;
            if (!isKing && player === 'black' && dr === 1) return;

            let newRow = row + dr;
            let newCol = col + dc;
            ({ row: newRow, col: newCol } = adjustForFlip(newRow, newCol));

            if (isValidSquare(newRow, newCol) && !isOccupied(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
            } else if (isValidSquare(newRow, newCol) && isOpponent(newRow, newCol, player)) {
                let jumpRow = newRow + dr;
                let jumpCol = newCol + dc;
                ({ row: jumpRow, col: jumpCol } = adjustForFlip(jumpRow, jumpCol));

                if (isValidSquare(jumpRow, jumpCol) && !isOccupied(jumpRow, jumpCol)) {
                    moves.push({ row: jumpRow, col: jumpCol, capture: { row: newRow, col: newCol } });
                }
            }
        });

        return moves;
    }

    // 🛡️ Move Piece
    function movePiece(square, row, col) {
        if (!selectedPiece) return;

        square.appendChild(selectedPiece.piece);

        const move = validMoves.find(move => move.row === row && move.col === col);
        if (move && move.capture) {
            const captureSquare = document.querySelector(
                `[data-row="${move.capture.row}"][data-col="${move.capture.col}"]`
            );
            captureSquare.innerHTML = '';
        }

        if ((currentPlayer === 'red' && row === 7) || (currentPlayer === 'black' && row === 0)) {
            selectedPiece.piece.classList.add('king');
        }

        clearSelection();
        checkWinCondition();
        currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    }

    // 🛡️ Highlight Valid Moves
    function highlightValidMoves(moves) {
        moves.forEach(move => {
            const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            if (square) {
                square.classList.add('valid-move');
            }
        });
    }

    // 🛡️ Clear Selection
    function clearSelection() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('active', 'valid-move');
        });
        selectedPiece = null;
        validMoves = [];
    }

    // 🛡️ Helper Functions
    function isValidSquare(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    function isOccupied(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.firstChild;
    }

    function isOpponent(row, col, player) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.firstChild?.classList.contains(player) === false;
    }

    // 🛡️ Check Win Condition
    function checkWinCondition() {
        if (!document.querySelectorAll('.piece.red').length) alert('Black Wins!');
        if (!document.querySelectorAll('.piece.black').length) alert('Red Wins!');
    }

    createBoard();
});
