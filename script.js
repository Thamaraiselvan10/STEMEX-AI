
        const messageContainer = document.getElementById('message-container');
        const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const conversationList = document.getElementById('conversation-list');

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keyup', (event) => { if (event.key === 'Enter') sendMessage(); });

        function sendMessage() {
            const userMessage = userInput.value;
            if (userMessage.trim() === '') return;

            appendMessage(userMessage, 'user');
            userInput.value = '';
            showTypingIndicator();

            fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            })
            .then(response => response.json())
            .then(data => {
                hideTypingIndicator();
                appendMessage(data.reply, 'bot');
                if (messageContainer.children.length <= 3) {
                    updateConversationHistory(userMessage);
                }
            })
            .catch(error => {
                hideTypingIndicator();
                appendMessage("Sorry, an error occurred. Please check the console and try again.", 'bot');
                console.error('Error:', error);
            });
        }

        function appendMessage(message, sender) {
            const messageWrapper = document.createElement('div');
            messageWrapper.classList.add('chat-message', `${sender}-message`);

            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');

            if (sender === 'bot') {
    
                const avatar = document.createElement('div');
                avatar.classList.add('avatar');
                avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="m14.2 19.8.4-4.2-3.6-3.6 4.2-.4L17 8l1.8 3.6.4 4.2-3.6 3.6Z"/></svg>`;
                messageWrapper.appendChild(avatar); 

        
                messageContent.innerHTML = marked.parse(message, { gfm: true, breaks: true });
                messageContent.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
                messageWrapper.appendChild(messageContent); 
            } else {
               
                messageContent.textContent = message;
                messageWrapper.appendChild(messageContent);
            }
        
            messageContainer.appendChild(messageWrapper);
            scrollToBottom();
        }

        function showTypingIndicator() {
            if (document.getElementById('typing-indicator')) return;
            const indicator = document.createElement('div');
            indicator.id = 'typing-indicator';
            indicator.classList.add('chat-message', 'bot-message');
            indicator.innerHTML = `
                <div class="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="m14.2 19.8.4-4.2-3.6-3.6 4.2-.4L17 8l1.8 3.6.4 4.2-3.6 3.6Z"/></svg>
                </div>
                <div class="message-content">
                    <div class="typing-indicator-content"><span></span><span></span><span></span></div>
                </div>`;
            messageContainer.appendChild(indicator);
            scrollToBottom();
        }

        function hideTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
        }
        
        function updateConversationHistory(userMsg) {
            const historyItem = document.createElement('div');
            historyItem.classList.add('conversation-item');
            historyItem.textContent = userMsg.length > 25 ? userMsg.substring(0, 25) + '...' : userMsg;
            conversationList.prepend(historyItem);
        }

        function startNewChat() {
            messageContainer.innerHTML = `
                <div class="chat-message bot-message">
                    <div class="avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="m14.2 19.8.4-4.2-3.6-3.6 4.2-.4L17 8l1.8 3.6.4 4.2-3.6 3.6Z"/></svg>
                    </div>
                    <div class="message-content"><p>Hello! How can I assist you today?</p></div>
                </div>`;
        }
        
        function scrollToBottom() {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
