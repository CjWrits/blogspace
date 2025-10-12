# 🚀 Blogspace - Space-Themed Blog Platform

A modern, interactive blog platform with a stunning space theme, featuring dark/light modes, easter eggs, and real-time authentication.

## ✨ Features

- 🌌 Beautiful space-themed UI with animated backgrounds
- 🌓 Dark/Light mode toggle
- 🔐 JWT authentication with MongoDB
- 📝 Create, read, update, delete blog posts
- 🏷️ Tag-based blog organization
- 👤 User profiles with post history
- 🔍 Real-time search functionality
- 🎮 Hidden easter eggs (dark mode only)
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/blogspace.git
cd blogspace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
```

### 4. Start the server
```bash
npm run dev
```

Server runs on http://localhost:5001

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Blogs
- GET `/api/blogs` - Get all blogs
- GET `/api/blogs/:id` - Get single blog
- POST `/api/blogs` - Create blog (auth required)
- PUT `/api/blogs/:id` - Update blog (auth required)
- DELETE `/api/blogs/:id` - Delete blog (auth required)

### Users
- GET `/api/users/profile` - Get user profile (auth required)
