const socket = io();
const videos = document.getElementById('videos');
const peers = {};
let localStream;

// Initialize webcam
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        videos.appendChild(video);
    })
    .catch(err => console.error('Media error:', err));

socket.on('user-connected', userId => {
    console.log('User connected:', userId);
    connectToNewUser(userId);
});

socket.on('offer', async ({ from, offer }) => {
    const pc = createPeer(from);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', { to: from, answer });
});

socket.on('answer', async ({ from, answer }) => {
    await peers[from].setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', ({ from, candidate }) => {
    peers[from].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) {
        peers[userId].close();
        delete peers[userId];
        const video = document.getElementById(userId);
        if (video) video.remove();
    }
});

function connectToNewUser(userId) {
    const pc = createPeer(userId);

    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
    });

    pc.createOffer()
        .then(offer => {
            pc.setLocalDescription(offer);
            socket.emit('offer', { to: userId, offer });
        });
}

function createPeer(userId) {
    const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = e => {
        if (e.candidate) {
            socket.emit('ice-candidate', { to: userId, candidate: e.candidate });
        }
    };

    pc.ontrack = e => {
        const video = document.createElement('video');
        video.srcObject = e.streams[0];
        video.autoplay = true;
        video.id = userId;
        videos.appendChild(video);
    };

    peers[userId] = pc;
    return pc;
}
