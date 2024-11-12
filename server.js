const WebSocket = require('ws');
const express = require('express');
const http = require('http');

// Create an Express application
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (like the client HTML)
app.use(express.static('public'));

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        
        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log('A client disconnected');
    });
});

// Start the server on the specified port
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
