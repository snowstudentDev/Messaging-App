const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('setName', (name) => {
        socket.username = name;
        io.emit('userJoined', name);
    });

    socket.on('createGroup', (groupName) => {
        const groupId = Math.random().toString(36).substring(2, 15);
        socket.join(groupId); // Automatically join the creator to the group
        io.emit('groupCreated', { groupName, groupId });
    });

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        io.to(groupId).emit('userJoinedGroup', socket.username);
    });

    socket.on('sendMessage', (data) => {
        const { groupId, message } = data;
        io.to(groupId).emit('receiveMessage', { user: socket.username, message });
    });

    socket.on('disconnect', () => {
        console.log('User  disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
