// Room and Peer Management
const socket = io(); // Would connect to signaling server in real implementation
const roomId = new URLSearchParams(window.location.search).get('room');
let localStream;
let peers = {};
let screenStream;

// DOM Elements
const videoGrid = document.getElementById('video-grid');
const localVideo = document.getElementById('local-video');
const sharedMovie = document.getElementById('shared-movie');
const toggleVideoBtn = document.getElementById('toggle-video');
const toggleMicBtn = document.getElementById('toggle-mic');
const shareScreenBtn = document.getElementById('share-screen');
const toggleMovieBtn = document.getElementById('toggle-movie');
const leaveRoomBtn = document.getElementById('leave-room');
const chatPanel = document.getElementById('chat-panel');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const moviePlayer = document.getElementById('movie-player');

// Initialize the app
async function init() {
    try {
        // Get user media
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;

        // Connect to signaling server (simulated)
        connectToRoom();

        // Set up event listeners
        setupEventListeners();
    } catch (err) {
        console.error('Error initializing:', err);
        alert('Could not access camera/microphone. Please check permissions.');
    }
}

// Simulated signaling server connection
function connectToRoom() {
    console.log(`Connected to room ${roomId}`);
    // In real implementation, would connect to WebSocket server
}

// Set up UI event listeners
function setupEventListeners() {
    // Toggle video
    toggleVideoBtn.addEventListener('click', () => {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            toggleVideoBtn.classList.toggle('bg-red-600', !videoTrack.enabled);
            toggleVideoBtn.innerHTML = videoTrack.enabled ? 
                '<i class="fas fa-video"></i>' : 
                '<i class="fas fa-video-slash"></i>';
        }
    });

    // Toggle microphone
    toggleMicBtn.addEventListener('click', () => {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            toggleMicBtn.classList.toggle('bg-red-600', !audioTrack.enabled);
            toggleMicBtn.innerHTML = audioTrack.enabled ? 
                '<i class="fas fa-microphone"></i>' : 
                '<i class="fas fa-microphone-slash"></i>';
        }
    });

    // Share screen
    shareScreenBtn.addEventListener('click', toggleScreenShare);

    // Toggle movie player
    toggleMovieBtn.addEventListener('click', () => {
        moviePlayer.classList.toggle('hidden');
        videoGrid.classList.toggle('hidden');
    });

    // Leave room
    leaveRoomBtn.addEventListener('click', leaveRoom);

    // Chat functionality
    chatBtn.addEventListener('click', () => chatPanel.classList.toggle('hidden'));
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Emoji picker
    emojiBtn.addEventListener('click', () => {
        emojiPicker.classList.toggle('hidden');
        if (!emojiPicker.innerHTML) {
            loadEmojis();
        }
    });
}

// Screen sharing functionality
async function toggleScreenShare() {
    if (screenStream) {
        // Stop screen share
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
        shareScreenBtn.classList.remove('bg-green-600');
        shareScreenBtn.innerHTML = '<i class="fas fa-desktop mr-2"></i> Share Screen';
    } else {
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false
            });
            shareScreenBtn.classList.add('bg-green-600');
            shareScreenBtn.innerHTML = '<i class="fas fa-stop mr-2"></i> Stop Sharing';
            
            // In real implementation, would send screen stream to peers
            console.log('Screen sharing started');
        } catch (err) {
            console.error('Error sharing screen:', err);
        }
    }
}

// Chat functions
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // In real implementation, would send to server
        addMessage('You', message);
        chatInput.value = '';
    }
}

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <span class="font-bold text-blue-400">${sender}:</span>
        <span class="ml-2">${text}</span>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Emoji functions
function loadEmojis() {
    const emojis = ['😀', '😂', '😍', '😎', '👍', '❤️', '🔥', '🎉'];
    emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'text-2xl hover:scale-125 transition-transform';
        btn.textContent = emoji;
        btn.addEventListener('click', () => {
            chatInput.value += emoji;
            emojiPicker.classList.add('hidden');
        });
        emojiPicker.appendChild(btn);
    });
}

// Clean up when leaving room
function leaveRoom() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
    }
    // In real implementation, would notify server
    window.location.href = '6-digit-verification.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);