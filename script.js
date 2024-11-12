const socket = new WebSocket('wss://echo.websocket.org'); // Public WebSocket echo server

socket.onopen = function() {
    console.log('Connected to the WebSocket server');
};

socket.onmessage = function(event) {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML += `<div>${event.data}</div>`;
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
};

document.getElementById('sendButton').onclick = function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        socket.send(message);
        chatContainer.innerHTML += `<div>You: ${message}</div>`;
        messageInput.value = '';
    }
};
