let canvasWidth = 400;
let canvasHeight = 300;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(220);

    // Create "Play Against AI" button
    let playAgainstAIButton = createButton('Play Against AI');
    playAgainstAIButton.position(canvasWidth / 2 -50, canvasHeight / 2 - 20);
    playAgainstAIButton.mousePressed(playAgainstAI);

    // Create "Play Against Another Person" button
    let playAgainstPersonButton = createButton('Play Against Another Person');
    playAgainstPersonButton.position(canvasWidth / 2 - 90, canvasHeight / 2 + 20);
    playAgainstPersonButton.mousePressed(playAgainstPerson);
}

function draw() {
    // Display a title
    textSize(24);
    textAlign(CENTER);
    fill(0);
    text('Chess Game', canvasWidth / 2, canvasHeight / 3);
}

function playAgainstAI() {
    // Redirect to the AI game page or perform necessary actions
    window.location.href = '/play-ai'; // Replace with your actual route
}

function playAgainstPerson() {
    // Redirect to the multiplayer game lobby or perform necessary actions
    window.location.href = '/play-multiplayer'; // Replace with your actual route
}
