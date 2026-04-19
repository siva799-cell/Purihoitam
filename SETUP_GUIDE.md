# Purohit Registration Backend - Setup & Integration Guide

## Overview
This backend system handles Purohit registration with photo uploads and stores all form data in MongoDB.

## Files Created

### 1. **server.js** - Main Express Server
   - Configures Express app
   - Sets up MongoDB connection
   - Handles file uploads with Multer
   - Manages routes and middleware
   - Handles CORS for cross-origin requests

### 2. **models/purohit.js** - MongoDB Schema
   - Defines database structure for Purohit registration
   - Includes validation for phone, email, password
   - Stores: photo, name, phone, email, password, DOB, vedas, sub-vedas, etc.

### 3. **routes/register.js** - API Routes
   - `POST /api/register` - Register new Purohit
   - `GET /api/purohits` - Get all Purohits
   - `GET /api/purohit/:id` - Get specific Purohit
   - `PUT /api/purohit/:id` - Update Purohit info
   - `DELETE /api/purohit/:id` - Delete Purohit

### 4. **package.json** - Dependencies
   - express, mongoose, bcryptjs, multer, dotenv, cors, express-validator

### 5. **.env.example** - Environment Configuration
   - Copy to `.env` and update values

### 6. **register.html** - Updated Frontend
   - Integrated with backend API
   - Sends form data to server with photo upload

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection string)
- npm or yarn

### Step 1: Install Dependencies
```bash
cd d:\Projects\Purihoitam
npm install
```

### Step 2: Setup Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and update:
# - PORT (default: 5000)
# - MONGODB_URI (e.g., mongodb://localhost:27017/purohit-registration)
# - NODE_ENV (development/production)
```

### Step 3: MongoDB Setup

#### Option A: Local MongoDB
```bash
# Make sure MongoDB service is running
# On Windows: MongoDB should be in Services
# On Mac/Linux: brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in .env:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/purohit-registration
```

### Step 4: Run the Server
```bash
npm start          # Production mode
# OR
npm run dev        # Development mode with auto-reload (requires nodemon)
```

Expected output:
```
Server running on http://localhost:5000
MongoDB connected
```

### Step 5: Test the Server
```bash
# Check health
curl http://localhost:5000/health

# Response: {"status":"Backend is running!"}
```

## API Endpoints Reference

### Register New Purohit
```
POST /api/register
Content-Type: multipart/form-data

Form Fields:
- photo: [image file]
- name: "John Purohit"
- phone: "9876543210"
- email: "john@example.com" (optional)
- password: "securepass123"
- dob: "1990-01-15"
- vedas: {"rigveda": true, "yajurveda": false, "samaveda": true, "atharvaveda": false}
- subVedas: ["Shukla Yajurveda", "Taittiriya"]
- upanayana: "yes"
- married: "no" (only if upanayana is "yes")
- gotram: "Bharadvaja"
- upasana: "Shiva Upasana" (optional)

Response:
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

### Get All Purohits
```
GET /api/purohits

Response: [
  {
    "_id": "...",
    "name": "John Purohit",
    "phone": "9876543210",
    "email": "john@example.com",
    ...
  }
]
```

### Get Single Purohit
```
GET /api/purohit/:id

Response: {
  "_id": "507f1f1f77bcf86cd799439011",
  "name": "John Purohit",
  ...
}
```

### Update Purohit
```
PUT /api/purohit/:id
Content-Type: application/json

Body: {
  "name": "Updated Name",
  "phone": "9876543210",
  ...
}
```

### Delete Purohit
```
DELETE /api/purohit/:id

Response: {"message": "Deleted successfully"}
```

## Frontend Integration (Already Updated)

The `register.html` file is already updated to:
1. Collect all form data
2. Handle photo upload
3. Collect vedas checkboxes
4. Collect sub-vedas tags
5. Send data to backend via POST request

When form is submitted:
```javascript
// Data is sent to: http://localhost:5000/api/register
// Method: POST with multipart/form-data
// Includes: photo file, form fields, vedas, sub-vedas
```

## Database Schema

```javascript
{
  photo: String,                    // Path to uploaded photo
  name: String,                     // Purohit name
  phone: String (unique),           // 10-digit phone number
  email: String (unique, optional), // Email address
  password: String,                 // Hashed password (bcryptjs)
  dob: Date,                        // Date of birth
  vedas: {
    rigveda: Boolean,
    yajurveda: Boolean,
    samaveda: Boolean,
    atharvaveda: Boolean
  },
  subVedas: [String],               // Array of sub-veda names
  upanayana: String,                // "yes" or "no"
  married: String,                  // "yes", "no", or null
  gotram: String,                   // Gotram name
  upasana: String,                  // Upasana type (optional)
  createdAt: Date,                  // Registration timestamp
  updatedAt: Date                   // Last update timestamp
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs (salt: 10 rounds)
2. **Validation**: All inputs are validated using express-validator
3. **File Upload Security**: Only image files allowed, 5MB size limit
4. **Unique Constraints**: Phone number and email are unique in database
5. **CORS**: Configured for controlled cross-origin requests

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Ensure MongoDB service is running
- Windows: Check Services (mongodb)
- Or use MongoDB Atlas (cloud)
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
Solution: Change PORT in .env or kill process using port 5000
- Windows: netstat -ano | findstr :5000
```

### CORS Error in Frontend
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Already configured in server.js, but ensure:
- Backend running on http://localhost:5000
- Frontend on http://localhost (or same domain)
```

### Photo Upload Not Working
```
Error: File too large or invalid format
Solution: 
- Max file size: 5MB
- Allowed formats: JPEG, JPG, PNG, GIF
- Check 'uploads' folder exists
```

## Deployment Guide

### For Production (Heroku Example)

1. Create `Procfile`:
```
web: node server.js
```

2. Update `.env`:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
```

3. Deploy:
```bash
heroku create purohit-registration
git push heroku main
```

### For Production (DigitalOcean, AWS, etc.)

1. Install Node.js and MongoDB on server
2. Clone repo to server
3. Install dependencies: `npm install`
4. Setup PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

## Monitoring & Maintenance

### View Recent Registrations
```javascript
// In MongoDB shell or MongoDB Compass
db.purohits.find().sort({createdAt: -1}).limit(10)
```

### Backup Database
```bash
mongodump --uri="mongodb://localhost:27017/purohit-registration"
```

### Check Server Logs
```bash
# If using PM2
pm2 logs server.js
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup MongoDB
3. ✅ Configure .env file
4. ✅ Run server: `npm start`
5. ✅ Test registration at `register.html`
6. ✅ Monitor database in MongoDB Compass/Atlas

---

For issues or questions, check the console output for detailed error messages.
