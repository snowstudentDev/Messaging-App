const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connectedUsers = [];

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    
    // Add new user to the list
    connectedUsers.push(ws);
    
    // Notify all clients about the connected users
    broadcastConnectedUsers();

    // Handle messages from clients
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'request-connected-users') {
            ws.send(JSON.stringify({ type: 'connected-users', users: connectedUsers.length }));
        }
    });

    // Remove user from the list on disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        connectedUsers = connectedUsers.filter(client => client !== ws);
        broadcastConnectedUsers();
    });
});

// Broadcast connected users to all clients
function broadcastConnectedUsers() {
    const userCount = connectedUsers.length;
    const message = JSON.stringify({ type: 'connected-users', users: Array(userCount).fill('User ') });
    
    connectedUsers.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
