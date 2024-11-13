const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the client.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html'); // Ensure this path is correct
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle setting the username
    socket.on('set name', (name) => {
        socket.username = name; // Store the username in the socket
        socket.broadcast.emit('user connected', name); // Notify others
    });

    // Handle sending messages
    socket.on('send message', (data) => {
        // Emit the message to all clients
        io.emit('message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
