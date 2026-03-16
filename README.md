# AI-Powered Student Learning Platform 🚀

A comprehensive MERN stack educational platform designed to help students learn better through real-time localized doubt solving, AI-driven summarization, and an intelligent chatbot assistant.

## ✨ Key Features

* **🔐 User Authentication:** Secure login and registration flows with JWT.
* **❓ Doubt Resolution System:** 
  * Post your doubts and questions.
  * Specialized views for doubt details and answers.
* **🤖 AI Integration:**
  * **AI Chatbot:** Real-time AI assistant for instant help using Gemini/AIML APIs.
  * **Smart Document Summarizer:** Upload lengthy texts or documents and get concise AI-generated summaries.
* **💬 Real-Time Chat:** Integrated socket.io for real-time messaging and peer-to-peer interactions.
* **📱 Responsive UI:** Built with React and Vite for a lightning-fast, modern user experience.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* Context API (AuthContext, SocketContext)
* React Router

**Backend:**
* Node.js
* Express.js
* MongoDB / Mongoose
* Socket.IO (for real-time chat)

**AI & Third-Party:**
* Google Gemini API / AIML APIs

## 📂 Project Structure

```text
SEPM/
├── Client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Socket)
│   │   ├── pages/          # Main application views (Login, Chatbot, Doubts, etc.)
│   │   └── services/       # API integration layers
│   └── package.json
│
└── server/                 # Node.js Express Backend
    ├── controllers/        # Business logic (auth, doubt, ai, answers)
    ├── middleware/         # Express middlewares (auth extraction)
    ├── models/             # Mongoose DB schemas
    ├── routes/             # API routing
    └── server.js           # Server entry point
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas Cluster)
* AI Provider API Keys (e.g., Gemini)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# API Keys for AI features
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the Client folder:
```bash
cd Client
npm install
```
Create a `.env` file in the `Client` directory (if needed by your Vite setup):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the Vite development server:
```bash
npm run dev
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

