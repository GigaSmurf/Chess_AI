const express = require('express');
const app = express();
const port = 3000;


app.use(express.static(__dirname));

// Define your routes here

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

app.get('/play-ai', (req, res) => {
    res.sendFile(__dirname + '/play-ai.html');
});

app.get('/play-multiplayer', (req, res) => {
    res.sendFile(__dirname + '/play-multiplayer.html');
});
