document.addEventListener('DOMContentLoaded', () => {
    // Note: travelForm and initialInputContainer are removed from the HTML or no longer used for switching views.
    // const travelForm = document.getElementById('travel-form'); // No longer exists with this ID for submission
    // const initialInputContainer = document.getElementById('initial-input-container'); // Removed
    const chatContainer = document.getElementById('chat-container'); // Still used, but always visible
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Parameters are now part of the main interface
    const datesInput = document.getElementById('dates');
    const budgetInput = document.getElementById('budget');
    const preferencesInput = document.getElementById('preferences');

    // No longer need to hide initial form or show chat interface, it's always visible.
    // travelForm event listener is removed.

    // Handle chat message sending
    sendButton.addEventListener('click', handleSendChatMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendChatMessage();
        }
    });

    async function handleSendChatMessage() {
        const userMessageText = userInput.value.trim();
        const dates = datesInput.value.trim();
        const budget = budgetInput.value.trim();
        const preferences = preferencesInput.value.trim();

        if (!userMessageText) {
            alert('Please enter a message to chat.');
            return;
        }

        let fullPrompt = "";

        // Construct the prompt including parameters if they are filled
        // We can decide if parameters are only for the "first" message or always prepended.
        // For this iteration, let's prepend them if available, making them context for any message.
        let paramsProvided = false;
        if (dates || budget || preferences) {
            paramsProvided = true;
            fullPrompt += `Considering these trip parameters: `;
            if (dates) fullPrompt += `Dates: ${dates}. `;
            if (budget) fullPrompt += `Budget: ${budget}. `;
            if (preferences) fullPrompt += `Preferences: ${preferences}. `;
            fullPrompt += "\n\n"; // Add a separator
        }

        fullPrompt += `User's message: "${userMessageText}"`;

        // Display what the user typed, or a summary if parameters were also included.
        // For simplicity, we'll just display the user's direct message in the chatbox as 'user'.
        // The full context (with parameters) is sent to the bot.
        addMessageToChatBox(userMessageText, 'user');
        userInput.value = ''; // Clear the input field

        // If it's the first time user sends a message and parameters were empty,
        // we might want to remind them to fill parameters.
        // For now, we allow sending messages even if parameters are empty.

        await handleUserMessage(fullPrompt); // Send the potentially augmented prompt
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
