var tileSize = 75;
var movingPiece;
var whitesMove = true;
var moveCounter = 10;
var images = [];
var whiteAI = false;
var blackAI = true;

var depthPara;
var depthPlus;
var depthMinus;
var tempMaxDepth = 3;

var test;
var moveHistory = [];

function setup() {
    createCanvas(800, 600);

    for (var i = 1; i < 10; i++) {
        images.push(loadImage("./assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"));
    }
    for (var i = 10; i < 13; i++) {
        images.push(loadImage("./assets/2000px-Chess_Pieces_Sprite_" + i + ".png"));
    }
    test = new Board();

    var resetButton = select('#resetButton');
    resetButton.mousePressed(resetBoard);
}

function resetBoard() {
    // Clear the move history
    moveHistory = [];

    // Recreate the initial game board
    test = new Board();

    whitesMove = true;

    // Clear the game result message
    displayGameResult("");
}

function draw() {
    background(100);
    showGrid();
    test.show();
    displayMoveHistory();
}

function showGrid() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if ((i + j) % 2 == 1) {
                fill(0);
            } else {
                fill(240);
            }
            noStroke();
            rect(i * tileSize, j * tileSize, tileSize, tileSize);

        }
    }

}

function displayGameResult(result) {
    var gameResultElement = select('#gameResult');
    gameResultElement.html(result);
}

var moving = false;

function mousePressed() {
    var x = floor(mouseX / tileSize);
    var y = floor(mouseY / tileSize);
    if (!test.isDone()) {
        if (!moving) {
            movingPiece = test.getPieceAt(x, y);
            if (movingPiece != null && movingPiece.white == whitesMove) {

                movingPiece.movingThisPiece = true;
                startX = movingPiece.matrixPosition.x;
                startY = movingPiece.matrixPosition.y;
            } else {
                return;
            }
        } else {
            if (movingPiece.canMove(x, y, test)) {
                var takenPiece = test.getPieceAt(x, y);
                if (takenPiece != null) {
                    takenPiece.taken = true;
                }
                movingPiece.move(x, y, test);
                movingPiece.movingThisPiece = false;
                whitesMove = !whitesMove;
                moveHistory.push({
                    piece: movingPiece,
                    from: { x: startX, y: startY },
                    to: { x: x, y: y },
                    taken: takenPiece
                });
                print(moveHistory[0].piece.letter + ' moved ' + x + " " + y);

            } else {
                movingPiece.movingThisPiece = false;

            }
        }
        moving = !moving;

    }
    // Check for a winning condition and display the result
    else {
        if (whitesMove) {
            displayGameResult("Black wins!");
            print("Black Wins");
        } else {
            displayGameResult("White wins!");
            print("White Wins");
        }
        return; // Return to prevent further moves
    }
}


function displayMoveHistory() {
    fill(255);
    textSize(20);
    textAlign(LEFT);
    var yPosition = 20;

    for (var i = 0; i < moveHistory.length; i++) {
        var move = moveHistory[i];
        var notation = getMoveNotation(move.piece, move.from, move.to, move.taken);
        text(notation, width - 110, yPosition);
        yPosition += 30;
    }
}

function getMoveNotation(piece, from, to, takenPiece) {
    var notation = "";

    // Check if the piece is a pawn
    if (piece.letter == 'p') {
        // If the pawn moved to a square with a taken piece, indicate the capture
        if (takenPiece) {
            notation += getSquareNotation(from).slice(0, 1);
            notation += "x";
        }
        notation += getSquareNotation(to);
    }
    // Check if the piece is a knight
    else if (piece.letter == 'Kn') {
        // If the knight moved to a square with a taken piece, indicate the capture

        if (takenPiece) {
            notation += "Nx";
        }
        else {
            notation += "N";
        }
        notation += getSquareNotation(to);
    }
    // For other pieces (rook, bishop, queen, king)
    else {
        notation += piece.letter;
        // If the piece moved to a square with a taken piece, indicate the capture
        if (takenPiece) {
            notation += "x";
        }
        notation += getSquareNotation(to);
    }

    return notation;
}



function getSquareNotation(square) {
    //abcdefgh
    var file = String.fromCharCode('a'.charCodeAt(0) + square.x);
    //rank are the rows
    var rank = 8 - square.y; // Adjust the rank calculation
    return file + rank;
}
