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

var moving = false;

function mousePressed() {
    var x = floor(mouseX / tileSize);
    var y = floor(mouseY / tileSize);
    if (!test.isDone()) {
        if (!moving) {
            movingPiece = test.getPieceAt(x, y);
            if (movingPiece != null && movingPiece.white == whitesMove) {

                movingPiece.movingThisPiece = true;
            } else {
                return;
            }
        } else {
            if (movingPiece.canMove(x, y, test)) {
                movingPiece.move(x, y, test);
                movingPiece.movingThisPiece = false;
                whitesMove = !whitesMove;
                moveHistory.push({
                    piece: movingPiece,
                    from: { x: movingPiece.matrixPosition.x, y: movingPiece.matrixPosition.y },
                    to: { x: x, y: y }
                });
                print(moveHistory[0].piece.letter + ' moved ' + x + " " + y);
            } else {
                movingPiece.movingThisPiece = false;

            }
        }
        moving = !moving;
    }
}


function displayMoveHistory() {
    fill(255);
    textSize(20);
    textAlign(LEFT);
    var yPosition = 20;

    for (var i = 0; i < moveHistory.length; i++) {
        var move = moveHistory[i];
        var notation = getMoveNotation(move.piece, move.from, move.to);
        text(notation, width - 115, yPosition);
        yPosition += 30;
    }
}

function getMoveNotation(piece, from, to) {
    // Check if piece has a 'type' property
    if (piece.letter == 'p') {
        return getSquareNotation(to);
    }
    else if(piece.letter == 'Kn'){
        return "N" + getSquareNotation(to);
    }
    else {
        return piece.letter + "" + getSquareNotation(to);
    }
}

function getSquareNotation(square) {
    //abcdefgh
    var file = String.fromCharCode('a'.charCodeAt(0) + square.x);
    //rank are the rows
    var rank = 8 - square.y; // Adjust the rank calculation
    return file + rank;
}
