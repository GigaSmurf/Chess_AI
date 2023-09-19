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
function setup() {
    createCanvas(600, 600);

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
            } else {
                movingPiece.movingThisPiece = false;

            }
        }
        moving = !moving;
    }
}