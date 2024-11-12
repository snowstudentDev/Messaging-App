let socket;
let currentRoom = '';
let username = '';

document.getElementById('createRoomButton').onclick = function() {
    const roomName = document.getElementById('roomNameInput').value;
    const roomPassword = document.getElementById('roomPasswordInput').value;
    username = document.getElementById('usernameInput').value;

    if (roomName && roomPassword && username) {
        currentRoom = roomName; // Set the current room
        socket = new WebSocket('wss://echo.websocket.org'); // Use a public WebSocket server

        socket.onopen = function() {
            console.log('Connected to the WebSocket server');
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'block';
            document.getElementById('messageInput').style.display = 'block';
            document.getElementById('sendButton').style.display = 'block';
        };

        socket.onmessage = function(event) {
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML += `<div>${event.data}</div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
        };

        socket.send(`${username} joined the room ${currentRoom}`);
    } else {
        alert('Please fill in all fields.');
    }
};

document.getElementById('joinRoomButton').onclick = function() {
    const roomName = document.getElementById('roomNameInput').value;
    const roomPassword = document.getElementById('roomPasswordInput').value;
    username = document.getElementById('usernameInput').value;

    if (roomName && roomPassword && username) {
        currentRoom = roomName; // Set the current room
        socket = new WebSocket('wss://echo.websocket.org'); // Use a public WebSocket server

        socket.onopen = function() {
            console.log('Connected to the WebSocket server');
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'block';
            document.getElementById('messageInput').style.display = 'block';
            document.getElementById('sendButton').style.display = 'block';
        };

        socket.onmessage = function(event) {
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML += `<div>${event.data}</div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
        };

        socket.send(`${username} joined the room ${currentRoom}`);
    } else {
        alert('Please fill in all fields.');
    }
};

document.getElementById('sendButton').onclick = function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        socket.send(`${username}: ${message}`);
        messageInput.value = '';
    }
};
