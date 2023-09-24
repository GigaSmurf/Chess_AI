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
let movesData;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://GigaSmurf:mongobongo@cluster0.5zvdfps.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);


function setup() {
    createCanvas(800, 600);

    for (var i = 1; i < 10; i++) {
        images.push(loadImage("./assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"));
    }
    for (var i = 10; i < 13; i++) {
        images.push(loadImage("./assets/2000px-Chess_Pieces_Sprite_" + i + ".png"));
    }
    test = new Board();
    // // Create a 2D array to represent the chessboard state
    // const chessboardState = [];

    // // Iterate through the initial state of the `test` object
    // for (var i = 0; i < 8; i++) {
    //     chessboardState.push([]);
    //     for (var j = 0; j < 8; j++) {
    //         const piece = test.getPieceAt(i, j);
    //         if (piece) {
    //             const player = piece.white ? "White" : "Black";
    //             const move = ""; // Initial position, so no move notation
    //             const x = i;
    //             const y = j;
    //             const pieceLetter = piece.letter;

    //             // Record the initial position of the piece into the database
    //             recordChessMove(player, move, x, y, pieceLetter);
    //             console.log("finished");
    //         }
    //     }
    // }

    var resetButton = select('#resetButton');
    resetButton.mousePressed(resetBoard);

    startPolling();

}

function startPolling() {
    // Poll the server for updates initially and set up the polling interval
    loadChessMovesData(); // Initial fetch
    pollingInterval = setInterval(loadChessMovesData, 5000); // Poll every 5 seconds (adjust the interval as needed)
}

function loadChessMovesData() {
    loadJSON('/api/chess-moves', function (data) {
        gotMovesData(data);
        console.log(movesData);
        updateChessboardState(data[data.length - 1].boardState);
        //if prev is white, then black turn next
        if(data[data.length-1].player == "White"){
            whitesMove = false;
        }
        else{
            whitesMove = true;
        }
    });
}

function updateChessboardState(boardStateJSON) {
    // Clear the current board state
    clearBoard();

    // if(Array.isArray(boardStateJSON)){
    //     console.log("works");
    // }
    // else{
    //     console.error("not an array");
    //     console.error("")
    // }
    // Iterate through the board state JSON and recreate the pieces on the board
    for (let i = 0; i < boardStateJSON.length; i++) {
        for (let j = 0; j < boardStateJSON[i].length; j++) {
            const square = boardStateJSON[i][j];
            if (square) {
                const player = square.player;
                const pieceLetter = square.pieceLetter;

                // Create the appropriate chess piece based on the piece letter
                let piece;
                switch (pieceLetter) {
                    case 'p':
                        piece = new Pawn(i, j, player === "White");
                        break;
                    case 'K':
                        piece = new King(i, j, player === "White");
                        break;
                    case 'Q':
                        piece = new Queen(i, j, player === "White");
                        break;
                    case 'Kn':
                        piece = new Knight(i, j, player == "White");
                        break;
                    case 'B':
                        piece = new Bishop(i, j, player == "White");
                        break;
                    case 'R':
                        piece = new Rook(i, j, player == "White");
                        break;
                    default:
                        console.error('Unknown piece type:', pieceLetter);
                        continue; // Skip processing this piece
                }

                // Add the piece to the corresponding player's pieces array
                if (player === "White") {
                    test.whitePieces.push(piece);
                } else {
                    test.blackPieces.push(piece);
                }
            }
        }
    }
}





function gotMovesData(data) {
    movesData = data;
}

function resetBoard() {
    // Clear the move history
    moveHistory = [];

    // Recreate the initial game board
    test = new Board();

    whitesMove = true;

    // Clear the game result message
    displayGameResult("");

    // Call the API to clear chess move data from the database
    clearChessMovesData();
}

function clearBoard() {
    // Clear both white and black pieces arrays
    test.whitePieces = [];
    test.blackPieces = [];
    // Iterate through the board and set all squares to null
    // for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //         test.board[i][j] = null;
    //     }
    // }
}


async function clearChessMovesData() {
    try {
        // socket.emit('reset');
        const response = await fetch('/api/clear-chess-moves', {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Chess move data cleared from the database.');
        } else {
            console.error('Failed to clear chess move data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error clearing chess move data:', error);
    }
}


function draw() {
    background(100);
    showGrid();
    test.show();
    displayMoveHistory();
    // displayFetchedMoves();
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


async function recordChessMove(player, move, boardState, x, y, piece) {
    try {
        // Send the player, move, and board state to the server
        const response = await fetch('/api/record-chess-move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player, move, boardState, x, y, piece }),
        });

        if (response.ok) {
            console.log('Move recorded:', player, move);
        } else {
            console.error('Failed to record move:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error recording chess move:', error);
    }
}

function getBoardStateAsJSON() {
    const boardState = [];
    for (let i = 0; i < 8; i++) {
        boardState.push([]);
        for (let j = 0; j < 8; j++) {
            const piece = test.getPieceAt(i, j);
            if (piece) {
                boardState[i][j] = {
                    pieceLetter: piece.letter,
                    player: piece.white ? "White" : "Black",
                };
            } else {
                boardState[i][j] = null;
            }
        }
    }
    console.log(boardState);
    return boardState;
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
                const player = whitesMove ? "White" : "Black";
                whitesMove = !whitesMove;
                moveHistory.push({
                    piece: movingPiece,
                    from: { x: startX, y: startY },
                    to: { x: x, y: y },
                    taken: takenPiece
                });
                print(moveHistory[0].piece.letter + ' moved ' + x + " " + y);

                // Record the move and board state in MongoDB
                const moveString = getMoveNotation(movingPiece, { x: startX, y: startY }, { x: x, y: y }, takenPiece);
                const piece = movingPiece.letter;
                const boardState = getBoardStateAsJSON(); // Get the entire board state
                // var notation = getMoveNotation(move.piece, move.from, move.to, move.taken);
                recordChessMove(player, moveString, boardState, x, y, piece);


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

function displayFetchedMoves() {
    // Display the fetched moves on your p5.js sketch
    if (movesData) {
        fill(255);
        textSize(20);
        textAlign(LEFT);
        let yPosition = 20;

        for (let i = 0; i < movesData.length; i++) {
            const move = movesData[i];
            text(move, width - 110, yPosition);
            yPosition += 30;
        }
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


