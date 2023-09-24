const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// const http = require('http');
// const socketIo = require('socket.io');
// const server = http.createServer(app);
// const io = socketIo(server);

app.use(express.static(__dirname));

// Define your routes here
// Store the list of connected clients
// const clients = new Set();

// io.on('connection', (socket) => {
//     console.log('Client connected');

//     // Add the client to the list of connected clients
//     clients.add(socket);

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');

//         // Remove the client from the list of connected clients
//         clients.delete(socket);
//     });

//     // Handle incoming move messages
//     socket.on('move', (move) => {
//         // Broadcast the move to all connected clients
//         io.emit('move', move);
//     });

//     // Handle reset messages
//     socket.on('reset', () => {
//         // Broadcast the reset message to all connected clients
//         io.emit('reset');
//     });
// });

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

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://GigaSmurf:mongobongo@cluster0.5zvdfps.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

// Define an API endpoint to retrieve chess move data
app.get('/api/chess-moves', async (req, res) => {
    try {
        // Connect to your MongoDB database here
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();

        // Assuming you have a collection named 'chessMoves' in your database
        const db = client.db("Chess");
        const collection = db.collection("Board");

        // Query the database to retrieve chess move data
        const moves = await collection.find({}).toArray();

        // Send the chess move data as JSON response
        res.json(moves);
    } catch (error) {
        console.error("Error retrieving chess moves:", error);
        res.status(500).json({ error: "Unable to retrieve chess moves" });
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
});


app.post('/api/record-chess-move', express.json(), async (req, res) => {
    try {
        const { player, move, boardState, x, y, piece } = req.body;

        // Connect to your MongoDB database here
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();

        // Access the database
        const db = client.db("Chess");

        // Assuming you have a collection named 'Board' in your database
        const collection = db.collection("Board");

        // Create a new document to insert into the collection
        const newMove = {
            player: player,
            move: move,
            boardState: boardState, // Store the entire board state
            x: x,
            y: y,
            piece: piece
        };

        // Insert the new move document into the collection
        await collection.insertOne(newMove);

        console.log("Move recorded:", player, move);

        // Respond with success
        res.status(200).json({ message: 'Move recorded successfully' });
    } catch (error) {
        console.error('Error recording chess move:', error);
        res.status(500).json({ error: 'Unable to record chess move' });
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
});


// Define an API endpoint to clear the chess move data from the database
app.delete('/api/clear-chess-moves', async (req, res) => {
    try {
        // Connect to your MongoDB database here
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();

        // Access the database
        const db = client.db("Chess");

        // Assuming you have a collection named 'Board' in your database
        const collection = db.collection("Board");

        // Delete all documents from the collection (clear the database)
        await collection.deleteMany({});

        console.log("Chess move data cleared from the database.");

        // Respond with success
        res.status(200).json({ message: 'Chess move data cleared successfully' });
    } catch (error) {
        console.error('Error clearing chess move data:', error);
        res.status(500).json({ error: 'Unable to clear chess move data' });
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
});
