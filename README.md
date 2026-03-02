# 💬 FullStack Real-Time Chat App

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO. Supports private messaging, user authentication with JWT refresh tokens, and live user search.

---

## 🖥️ Screenshots

---

## ✨ Features

- 🔐 **JWT Authentication** — Access tokens + refresh tokens with secure httpOnly cookies
- 💬 **Real-Time Messaging** — Instant private messaging powered by Socket.IO
- 🔍 **User Search** — Find and start conversations with any registered user
- 📜 **Chat History** — Persisted messages loaded on conversation open
- 🚪 **Logout** — Invalidates refresh tokens server-side
- 📱 **Responsive UI** — Clean, minimal interface built with React + Sass

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Socket.IO Client | Real-time WebSocket communication |
| Axios | HTTP client with interceptor-based token refresh |
| Sass | Component styling |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | REST API server |
| Socket.IO | WebSocket server for real-time events |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens | Stateless authentication |
| bcryptjs | Password hashing |

---

### Auth Flow

```
1. User logs in → Server returns access token (15m) + sets refresh token cookie (7d)
2. Frontend stores access token in localStorage
3. Axios interceptor attaches token to every request
4. On 401 response → interceptor calls /auth/refresh → gets new access token
5. Logout → server deletes refresh token from DB + clears cookie
```

### Real-Time Flow

```
1. User connects → Socket.IO registers userId → socketId mapping
2. Sender emits 'private_message' with { sender, receiver, message }
3. Server persists message to MongoDB
4. Server looks up receiver's socketId → emits 'private_message_from_backend'
5. Receiver's React state updates instantly
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2. Backend Setup

```bash
cd chat-backend
npm install
```

Create a `.env` file in `chat-backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ChatApp
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd chat-frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---


## ⚠️ Known Limitations

- Socket connections are not authenticated (userId is trusted from client)
- Access token is stored in `localStorage` (susceptible to XSS)
- No input validation on API endpoints
- No rate limiting on auth routes
- Chat list does not show last message preview or timestamps in sidebar
- No pagination — loads last 100 messages per conversation

---

## 🔮 Planned Improvements

- [ ] Socket.IO authentication middleware using JWT
- [ ] Typing indicators
- [ ] Online/offline user status
- [ ] Message read receipts
- [ ] Input validation with `express-validator`
- [ ] Rate limiting with `express-rate-limit`
- [ ] Security headers with `helmet`
- [ ] Message pagination
- [ ] Unit and integration tests

---

## 📄 License

MIT
