const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { networkInterfaces } = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Broadcast and handle WebRTC signaling
io.on('connection', socket => {
    console.log('✅ New user connected:', socket.id);
    socket.broadcast.emit('user-connected', socket.id);

    socket.on('offer', data => {
        socket.to(data.to).emit('offer', {
            from: socket.id,
            offer: data.offer
        });
    });

    socket.on('answer', data => {
        socket.to(data.to).emit('answer', {
            from: socket.id,
            answer: data.answer
        });
    });

    socket.on('ice-candidate', data => {
        socket.to(data.to).emit('ice-candidate', {
            from: socket.id,
            candidate: data.candidate
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', socket.id);
    });
});

// Dynamically get your local IP (for LAN access)
function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address; // Example: 192.168.100.12
            }
        }
    }
    return 'localhost';
}

const PORT = process.env.PORT || 3000;
const LOCAL_IP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n🔗 Video Call Server is Running:');
    console.log(`→ Localhost:     http://localhost:${PORT}`);
    console.log(`→ Local IP:      http://${LOCAL_IP}:${PORT}   (use on same Wi-Fi)`);
    console.log('🌐 Use this IP on your phone or other devices in the same network.\n');
});

// Gracefully handle port in use
server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use another port.`);
        process.exit(1);
    } else {
        throw err;
    }
});
