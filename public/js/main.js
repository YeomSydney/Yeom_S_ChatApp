// Imports will always go at the top
import ChatMsg from './components/ChatMessage.js';

const socket = io();
const chatForm = document.getElementById('chat_form');
const chatMessages = document.querySelector('.chat_messages');

// Utility functions for Socket
function setUserID({ sID }) {
    vm.socketID = sID;
}

function showNewMessage({ message }) {
    vm.messages.push(message);
}

function handleUserTyping(user) {
    console.log('Somebody is typing something');
}

// Extra functions added for Socket
// Message is caught from app.js
socket.on('message', message => {
    console.log(message);
    showNewMessage({ message });

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

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
            username: '',
            room: ''
        }
    },

    methods: {
        dispatchMessage() {
            // debugger;
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
        newmsg: ChatMsg
    }
}).mount('#app');

socket.addEventListener('connected', setUserID);
socket.addEventListener('new_message', showNewMessage);
socket.addEventListener('typing', handleUserTyping);