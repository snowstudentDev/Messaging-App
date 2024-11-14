const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (username) => {
        users.push({ id: socket.id, name: username });
        io.emit('userList', users); // Send updated user list to all clients
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.id !== socket.id);
        io.emit('userList', users); // Update user list on disconnect
        console.log('User  disconnected');
    });
});

server.listen(process.env.PORT || 10000, () => {
    console.log('Server is running');
});
