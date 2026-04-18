# Purohit Registration Backend

A complete backend system for Purohit registration with photo uploads and database storage.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB
- **Local**: Ensure MongoDB is running
- **Cloud**: Use MongoDB Atlas and update `.env`

### 3. Configure Environment
```bash
# Edit .env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/purohit-registration
NODE_ENV=development
```

### 4. Start Server
```bash
npm start              # Production
npm run dev            # Development (auto-reload)
```

### 5. Test
Open `register.html` and submit the form. Data will be stored in MongoDB.

## Features

✅ Photo upload with validation  
✅ Password hashing (bcryptjs)  
✅ Phone number uniqueness  
✅ Email validation  
✅ Vedas selection (Rigveda, Yajurveda, Samaveda, Atharvaveda)  
✅ Sub-vedas tagging  
✅ Upanayana and marriage status  
✅ Gotram and Upasana recording  
✅ CORS support for cross-origin requests  
✅ Input validation  
✅ Error handling  

## Database Fields

- **photo**: Uploaded image file path
- **name**: Purohit name
- **phone**: 10-digit phone (unique)
- **email**: Email address (optional, unique if provided)
- **password**: Hashed password
- **dob**: Date of birth
- **vedas**: Object with rigveda, yajurveda, samaveda, atharvaveda booleans
- **subVedas**: Array of sub-veda names
- **upanayana**: "yes" or "no"
- **married**: "yes", "no", or null
- **gotram**: Gotram name
- **upasana**: Upasana type (optional)
- **createdAt**: Registration timestamp
- **updatedAt**: Last update timestamp

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/register` | Register new Purohit |
| GET | `/api/purohits` | Get all Purohits |
| GET | `/api/purohit/:id` | Get specific Purohit |
| PUT | `/api/purohit/:id` | Update Purohit |
| DELETE | `/api/purohit/:id` | Delete Purohit |
| GET | `/health` | Health check |

## Project Structure

```
Purihoitam/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── register.html          # Frontend form
├── models/
│   └── purohit.js         # Database schema
├── routes/
│   └── register.js        # API routes
├── uploads/               # Photo storage (auto-created)
└── SETUP_GUIDE.md         # Detailed setup guide
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB service is running or use MongoDB Atlas |
| Port 5000 already in use | Change PORT in .env or kill process using the port |
| CORS error | Backend and frontend must be on compatible domains |
| Photo upload fails | Check file size (<5MB) and format (JPEG, PNG, GIF) |

## Security

- Passwords hashed with bcryptjs (10 salt rounds)
- Input validation on all fields
- File upload restrictions (size, type)
- Unique constraints on phone and email
- CORS configured for safety

## For More Details

See **SETUP_GUIDE.md** for comprehensive documentation.

---

**Version**: 1.0.0  
**Node Version**: 14+  
**Database**: MongoDB  
