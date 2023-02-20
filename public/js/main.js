// Imports will always go at the top
// import ChatMsg from './components/ChatMessage.js';

const socket = io();

// New functions
const chatForm = document.getElementById('chat_form');
const chatMessages = document.querySelector('.chat_messages');

// Utility functions for Socket
// Socket ID
function setUserID({ sID }) {
    vm.socketID = sID;
}

// Show New Msg
// function showNewMessage({ message }) {
//     vm.messages.push(message);
// }

// Someone's typing
function handleUserTyping(user) {
    console.log('Somebody is typing something');
}

// Extra functions added for Socket
// Message is caught from app.js
// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Output Messages
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = 
    `
    <section class="message_outputs message_box">
        <div class="msg_data">
            <p class="msg_name">${ message.username }</p>
            <p class="msg_time">${ message.time }</p>
        </div>
        <p class="msg_text">${ message.text }</p>
    </section>
    `;
    document.querySelector('.chat_messages').appendChild(div);
}

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    console.log(msg);
    socket.emit('chatMessage', msg);

    // Clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Vue
const { createApp } = Vue;

const vm = createApp({
    data(){
        return {
            socketID: '',
            message: '',
            messages: [],
            username: ''
        }
    },

    methods: {
        dispatchMessage() {
            socket.emit('chat_message', {
                content: this.message,
                name: this.username || 'anonymous',
                id: this.socketID
            });

            this.message = "";
        },

        catchTextFocus() {
            // Emit a custom typing event and broadcast it to the server.
            socket.emit('user_typing', {
                name: this.username || 'anonymous'
            })
        }
    },

    components: {
        // newmsg: ChatMsg
    }
}).mount('#app');

socket.addEventListener('connected', setUserID);
socket.addEventListener('typing', handleUserTyping);
// socket.addEventListener('new_message', showNewMessage);