# Local Testing Guide for Blogspace

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
copy .env.example .env
```

Edit `.env` with your values:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/blogspace
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=optional_for_oauth
GOOGLE_CLIENT_SECRET=optional_for_oauth
GITHUB_CLIENT_ID=optional_for_oauth
GITHUB_CLIENT_SECRET=optional_for_oauth
```

### 3. Start MongoDB
**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at mongodb.com
- Create cluster and get connection string
- Replace MONGODB_URI in .env

### 4. Start the Application
```bash
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

### 5. Open Frontend
Open `index.html` in your browser or use Live Server extension in VS Code.

## Testing Checklist

### ✅ Backend API Testing
1. **Server Health**: Visit `http://localhost:5001` - should show "Blogspace API is running!"
2. **Database Connection**: Check console for "Connected to MongoDB" message

### ✅ Authentication Testing
1. **Register**: Create new account with name, email, university, password
2. **Login**: Sign in with registered credentials
3. **Token Persistence**: Refresh page - should stay logged in
4. **Logout**: Should clear session and redirect

### ✅ Blog Functionality Testing
1. **Create Blog**: Write post with title, content, tags
2. **View Blogs**: See all posts on home page
3. **Blog Detail**: Click on blog to view full content
4. **User Profile**: Check profile page shows user stats and posts
5. **Search**: Test search functionality with keywords

### ✅ UI/UX Testing
1. **Responsive Design**: Test on different screen sizes
2. **Dark/Light Mode**: Toggle theme switcher
3. **Navigation**: Test all page transitions
4. **Form Validation**: Try submitting empty forms

## Common Issues & Solutions

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"

# Or for newer versions
mongosh --eval "db.adminCommand('ismaster')"
```

### Port Already in Use
```bash
# Kill process on port 5001
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F
```

### CORS Issues
- Ensure frontend is served from `http://localhost` or `http://127.0.0.1`
- Check CORS configuration in server.js

## Development Tools

### Recommended VS Code Extensions
- Live Server (for frontend)
- REST Client (for API testing)
- MongoDB for VS Code

### API Testing with REST Client
Create `test.http` file:
```http
### Health Check
GET http://localhost:5001

### Register User
POST http://localhost:5001/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@university.edu",
  "university": "Test University",
  "password": "password123"
}

### Login
POST http://localhost:5001/auth/login
Content-Type: application/json

{
  "email": "test@university.edu",
  "password": "password123"
}
```

## Database Management

### View Data in MongoDB
```bash
# Connect to MongoDB
mongosh

# Switch to blogspace database
use blogspace

# View collections
show collections

# View users
db.users.find().pretty()

# View blogs
db.blogs.find().pretty()
```

### Reset Database (if needed)
```bash
mongosh
use blogspace
db.dropDatabase()
```

## Performance Testing

### Load Testing with curl
```bash
# Test multiple requests
for i in {1..10}; do curl http://localhost:5001/blogs & done
```

## Deployment Testing

### Test Production Build
```bash
# Set NODE_ENV to production
set NODE_ENV=production
npm start
```

## Troubleshooting Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rmdir /s node_modules
del package-lock.json
npm install

# Check running processes
netstat -ano | findstr :5001
```

## Success Indicators
- ✅ Server starts without errors
- ✅ MongoDB connection established
- ✅ Frontend loads without console errors
- ✅ User registration/login works
- ✅ Blog CRUD operations function
- ✅ Search and filtering work
- ✅ Profile page displays correctly