# Purohit Registration - Complete Backend Integration Guide

## 🚀 Quick Start (Choose One)

### Option A: Node.js + MongoDB (Recommended)
```bash
npm install
npm start
```

### Option B: Python + SQLite/PostgreSQL
```bash
pip install -r requirements.txt
python server_python.py
```

---

## 📋 Complete Setup Instructions

### Prerequisites
- Node.js v14+ (for Node backend) OR Python 3.8+ (for Python backend)
- MongoDB (for Node.js backend) OR any SQL database (for Python backend)
- npm or pip package manager

---

## 🔧 Setup Option A: Node.js + Express + MongoDB

### Step 1: Install Dependencies
```bash
cd d:\Projects\Purihoitam
npm install
```

### Step 2: Setup MongoDB

#### Local MongoDB Setup (Windows)
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Verify: Open MongoDB Compass or run `mongosh` in terminal

#### MongoDB Atlas (Cloud - Recommended for simplicity)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/purohit-registration
NODE_ENV=development
```

### Step 3: Create `.env` File
```bash
# Copy from .env.example or create new:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/purohit-registration
NODE_ENV=development
```

### Step 4: Start Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

✅ Server should show: `Server running on http://localhost:5000`

---

## 🐍 Setup Option B: Python + Flask + SQLite

### Step 1: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment
Create `.env` file:
```env
PORT=5000
DATABASE_URL=sqlite:///purohit_registration.db
NODE_ENV=development
```

Or for PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@localhost/purohit_registration
```

### Step 4: Start Server
```bash
python server_python.py
```

✅ Server should show: `Running on http://127.0.0.1:5000`

---

## 📁 Project Structure

```
Purihoitam/
│
├─ Node.js Backend
│  ├── server.js                 # Main Express server
│  ├── package.json              # Dependencies
│  ├── .env                       # Environment config
│  ├── models/
│  │   └── purohit.js            # MongoDB schema
│  └── routes/
│      └── register.js           # API routes
│
├─ Python Backend (Alternative)
│  ├── server_python.py          # Flask app
│  ├── requirements.txt          # Python dependencies
│  ├── .env                      # Environment config
│  └── purohit_registration.db   # SQLite database (auto-created)
│
├─ Frontend
│  ├── register.html             # Registration form
│  ├── config.js                 # API configuration
│
└─ Documentation
   ├── README_BACKEND.md         # Backend overview
   ├── SETUP_GUIDE.md            # Detailed setup
   └── API_REFERENCE.md          # API endpoints
```

---

## 🔌 API Endpoints (Both Backends)

All endpoints work the same for both Node.js and Python backends.

### 1. Register New Purohit
```http
POST /api/register
Content-Type: multipart/form-data

Fields:
- photo: [image file]
- name: "John Purohit"
- phone: "9876543210"
- email: "john@example.com"
- password: "secure123"
- dob: "1990-01-15"
- vedas: {"rigveda": true, "yajurveda": false, ...}
- subVedas: ["Shukla Yajurveda", "Taittiriya"]
- upanayana: "yes"
- married: "no"
- gotram: "Bharadvaja"
- upasana: "Shiva"
```

**Response (201):**
```json
{
  "message": "Registration successful!",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Purohit",
    "phone": "9876543210",
    "email": "john@example.com"
  }
}
```

### 2. Get All Purohits
```http
GET /api/purohits
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Purohit",
    "phone": "9876543210",
    ...
  }
]
```

### 3. Get Single Purohit
```http
GET /api/purohit/:id
```

### 4. Update Purohit
```http
PUT /api/purohit/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210"
}
```

### 5. Delete Purohit
```http
DELETE /api/purohit/:id
```

### 6. Health Check
```http
GET /health
```

---

## 🧪 Testing the Backend

### Using cURL

**1. Register New Purohit:**
```bash
curl -X POST http://localhost:5000/api/register \
  -F "photo=@path/to/photo.jpg" \
  -F "name=John Purohit" \
  -F "phone=9876543210" \
  -F "email=john@example.com" \
  -F "password=secure123" \
  -F "dob=1990-01-15" \
  -F "vedas={\"rigveda\":true,\"yajurveda\":false}" \
  -F "subVedas=[\"Shukla Yajurveda\"]" \
  -F "upanayana=yes" \
  -F "married=no" \
  -F "gotram=Bharadvaja"
```

**2. Get All Purohits:**
```bash
curl http://localhost:5000/api/purohits
```

**3. Health Check:**
```bash
curl http://localhost:5000/health
```

### Using Postman

1. Import the API endpoints
2. Set request type (POST/GET/PUT/DELETE)
3. Add form data for photo upload
4. Send request

---

## 💾 Database Schemas

### Node.js (MongoDB) Schema
```javascript
{
  _id: ObjectId,
  photo: String,
  name: String,
  phone: String (unique),
  email: String (unique, optional),
  password: String (hashed),
  dob: Date,
  vedas: {
    rigveda: Boolean,
    yajurveda: Boolean,
    samaveda: Boolean,
    atharvaveda: Boolean
  },
  subVedas: [String],
  upanayana: String,
  married: String,
  gotram: String,
  upasana: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Python (SQL) Schema
```sql
CREATE TABLE purohits (
  id INTEGER PRIMARY KEY,
  photo VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(10) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  vedas JSON,
  sub_vedas JSON,
  upanayana VARCHAR(10) NOT NULL,
  married VARCHAR(10),
  gotram VARCHAR(255) NOT NULL,
  upasana VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🔐 Security Features

✅ Password hashing (bcryptjs for Node, werkzeug for Python)  
✅ Input validation on all fields  
✅ File upload validation (size, type)  
✅ Unique constraints on phone/email  
✅ CORS protection  
✅ SQL injection prevention  

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Error** | Ensure MongoDB is running or use MongoDB Atlas cloud |
| **Port 5000 Already in Use** | Change PORT in .env or kill process using port 5000 |
| **File Upload Not Working** | Check file size (<5MB), format (JPEG/PNG/GIF), uploads folder exists |
| **CORS Error** | Ensure backend and frontend are on compatible domains |
| **Python Module Not Found** | Run `pip install -r requirements.txt` again |
| **Email Not Sending** | Configure SMTP settings (optional feature) |

### Kill Port 5000 (Windows)
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Kill Port 5000 (Mac/Linux)
```bash
lsof -ti:5000 | xargs kill -9
```

---

## 🚀 Deployment

### Deploy on Heroku

**Node.js:**
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create purohit-registration
git push heroku main
```

**Python:**
```bash
# Create Procfile
echo "web: gunicorn server_python:app" > Procfile

# Deploy
heroku create purohit-registration
git push heroku main
```

### Deploy on DigitalOcean, AWS, or VPS
1. Install Node.js/Python on server
2. Clone repository
3. Install dependencies
4. Use PM2 (Node) or systemd (Python) for process management
5. Setup reverse proxy with Nginx

---

## 📊 Monitoring

### View Recent Registrations

**Node.js (MongoDB):**
```bash
# Using MongoDB Compass or Atlas UI
db.purohits.find().sort({createdAt: -1}).limit(10)
```

**Python (SQLite):**
```bash
# Using DB Browser for SQLite
SELECT * FROM purohits ORDER BY created_at DESC LIMIT 10;
```

### Check Server Logs
```bash
# Node.js
npm run dev    # Shows all logs

# Python
python server_python.py  # Shows all logs
```

---

## 📞 Frontend Integration

The `register.html` is already configured to work with the backend!

### How It Works
1. User fills registration form
2. JavaScript collects all data including photo
3. Sends FormData to `http://localhost:5000/api/register`
4. Backend stores in database
5. Shows success/error message to user

### Edit API URL (if needed)
Edit in `register.html` - Line ~324:
```javascript
fetch("http://localhost:5000/api/register", {
  method: "POST",
  body: formData
})
```

Or use `config.js`:
```javascript
fetch(API_CONFIG.getApiUrl() + "/api/register", {
  method: "POST",
  body: formData
})
```

---

## ✅ Verification Checklist

- [ ] Node.js/Python installed
- [ ] Dependencies installed (npm/pip)
- [ ] `.env` file configured
- [ ] MongoDB/Database running
- [ ] Server started successfully
- [ ] Health check endpoint works (`/health`)
- [ ] Can access registration form
- [ ] Photo upload works
- [ ] Form submission successful
- [ ] Data appears in database

---

## 📚 Additional Resources

- **Node.js**: https://nodejs.org/
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://www.mongodb.com/
- **Python Flask**: https://flask.palletsprojects.com/
- **SQLAlchemy**: https://www.sqlalchemy.org/

---

## 🆘 Need Help?

1. Check console output for error messages
2. Review SETUP_GUIDE.md for detailed instructions
3. Verify all environment variables are correct
4. Ensure database is running
5. Check firewall/port access

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Supported Backends**: Node.js + MongoDB, Python + SQLite/PostgreSQL
