## 📹 Multi-User Video Calling App (WebRTC + Node.js + Socket.io)

This is a simple real-time **video calling application** built using **WebRTC**, **Socket.io**, and **Node.js**, allowing multiple users on the same Wi-Fi network to join a shared video room.

### 🚀 Features

* ✅ Peer-to-peer video calling using WebRTC
* ✅ Real-time signaling with Socket.io
* ✅ Supports multiple users in the same room
* ✅ Responsive UI using plain HTML/CSS
* ✅ Works over LAN (via IP address)

### 🛠️ Technologies Used

* Node.js (Express server)
* Socket.io (WebSocket signaling)
* WebRTC (for video/audio streams)
* Vanilla JavaScript (frontend logic)

### 🧪 Usage

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   node server.js
   ```

3. **Open the app on your browser:**

   ```
   http://localhost:3000
   ```

4. **To test on multiple devices on the same Wi-Fi:**

   Use your IP address like:

   ```
   http://192.168.1.5:3000
   ```

### ⚠️ Notes

* WebRTC works best in **modern browsers** (Chrome, Firefox).
* Works only over **local Wi-Fi** unless deployed with HTTPS and STUN/TURN servers.

### 📂 Folder Structure

```
.
├── server.js          # Node.js server with Socket.io
├── public/
│   ├── index.html     # UI layout
│   ├── script.js      # Frontend WebRTC + Socket logic
│   └── style.css      # Basic styling
```

---


