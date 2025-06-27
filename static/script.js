document.addEventListener('DOMContentLoaded', () => {
    const travelForm = document.getElementById('travel-form');
    const initialInputContainer = document.getElementById('initial-input-container');
    const chatContainer = document.getElementById('chat-container');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Handle initial travel form submission
    travelForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const dates = document.getElementById('dates').value;
        const budget = document.getElementById('budget').value;
        const preferences = document.getElementById('preferences').value;

        // Basic validation
        if (!dates || !budget || !preferences) {
            alert('Please fill in all fields.');
            return;
        }

        const initialPrompt = `Plan a trip with dates: ${dates}, budget: ${budget}, preferences: ${preferences}.`;

        // Hide initial form and show chat interface
        initialInputContainer.style.display = 'none';
        chatContainer.style.display = 'block';

        // Display user's initial prompt in chat (optional, but good for UX)
        addMessageToChatBox(initialPrompt, 'user');

        // Send the initial prompt to the backend (to be implemented)
        // For now, we'll just simulate a bot response
        await handleUserMessage(initialPrompt);
    });

    // Handle chat message sending
    sendButton.addEventListener('click', handleSendChatMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendChatMessage();
        }
    });

    async function handleSendChatMessage() {
        const messageText = userInput.value.trim();
        if (messageText) {
            addMessageToChatBox(messageText, 'user');
            userInput.value = '';
            await handleUserMessage(messageText);
        }
    }

    // Function to add messages to the chat box
    function addMessageToChatBox(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }

    // Function to handle sending message to backend and receiving response
    async function handleUserMessage(messageText) {
        addMessageToChatBox("Thinking...", 'bot-thinking'); // Optional: show a thinking indicator

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText })
            });

            // Remove "Thinking..." message
            const thinkingMessage = chatBox.querySelector('.bot-thinking');
            if (thinkingMessage) {
                chatBox.removeChild(thinkingMessage);
            }

            if (!response.ok) {
                const errorData = await response.json();
                addMessageToChatBox(`Error: ${errorData.error || response.statusText}`, 'bot');
                return;
            }

            const data = await response.json();
            const botResponse = data.reply;
            addMessageToChatBox(botResponse, 'bot');

        } catch (error) {
            // Remove "Thinking..." message if it's still there
            const thinkingMessage = chatBox.querySelector('.bot-thinking');
            if (thinkingMessage) {
                chatBox.removeChild(thinkingMessage);
            }
            console.error('Error sending message to backend:', error);
            addMessageToChatBox('Sorry, something went wrong while connecting to the server.', 'bot');
        }
    }

    // Add a class for the "Thinking..." message for potential styling
    const style = document.createElement('style');
    style.innerHTML = `
        .bot-thinking {
            background-color: #f0f0f0;
            color: #777;
            font-style: italic;
            text-align: left;
            margin-right: auto;
            max-width: 70%;
        }
    `;
    document.head.appendChild(style);

});
