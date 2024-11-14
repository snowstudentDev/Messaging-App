const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let servers = {}; // Store server details

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createServer', ({ serverName, password }) => {
        if (!servers[serverName]) {
            servers[serverName] = { password, users: [] };
            socket.join(serverName);
            socket.emit('serverCreated', { serverName });
        } else {
            socket.emit('error', 'Server already exists');
        }
    });

    socket.on('joinServer', ({ serverName, password }) => {
        const server = servers[serverName];
        if (server && server.password === password) {
            socket.join(serverName);
            server.users.push(socket.id);
            io.to(serverName).emit('userList', server.users);
            socket.emit('joinedServer', { serverName });
        } else {
            socket.emit('error', 'Invalid server name or password');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        for (const serverName in servers) {
            const server = servers[serverName];
            const index = server.users.indexOf(socket.id);
            if (index !== -1) {
                server.users.splice(index, 1);
                io.to(serverName).emit('userList', server.users);
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
