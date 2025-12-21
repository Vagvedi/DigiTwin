# Digital Twin of a Student

A production-ready full-stack application that builds a digital twin of a student using daily academic and lifestyle data. The system predicts burnout risk, attendance risk, and exam performance, providing early alerts and personalized recommendations.

## 🏗️ Architecture

The application follows a strict 3-layer architecture:

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express (REST APIs)
- **ML Service**: Python (FastAPI) for predictions
- **Database**: MySQL

**Communication Flow:**
- Frontend → Backend (only)
- Backend → ML Service

## 📁 Project Structure

```
DigiTwin/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Node.js + Express
├── ml-service/        # Python + FastAPI
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Database Setup

1. Install MySQL if not already installed
2. Start MySQL service:
   - **Windows**: Start MySQL service from Services
   - **Mac/Linux**: `sudo systemctl start mysql` or `brew services start mysql`
3. Create a new database:
```sql
CREATE DATABASE digital_twin;
```

4. Note your database credentials (host, port, user, password)

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=digital_twin
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

ML_SERVICE_URL=http://localhost:8000
```

Start the backend:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will automatically create all necessary tables on first run.

### 3. ML Service Setup

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the ML service:
```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```

The ML service will train models on startup (takes a few seconds).

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 5. (Optional) Seed Sample Data

To populate the database with sample student data:

```bash
cd backend
node scripts/seed.js
```

This creates a test user:
- Email: `test@example.com`
- Password: `password123`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Student Data
- `POST /api/student/data` - Submit daily student data (protected)
- `GET /api/student/history` - Get student data history (protected)

### Predictions
- `POST /api/predict` - Get predictions (protected)

### Alerts
- `GET /api/alerts` - Get alerts and recommendations (protected)

## 🎯 Features

### Dashboard Components

1. **Daily Data Input Form**
   - Sleep hours
   - Attendance percentage
   - Study hours
   - Stress level (1-10)
   - Upcoming deadlines count

2. **Prediction Cards**
   - Burnout Risk (Low/Medium/High)
   - Attendance Risk (% probability)
   - Exam Performance (predicted score)

3. **Visualizations**
   - Burnout gauge (circular progress)
   - Attendance trend line chart
   - Exam score prediction bar chart

4. **Alerts Panel**
   - Real-time alerts based on predictions
   - Color-coded by severity

5. **Suggestions Panel**
   - Personalized recommendations
   - Actionable advice based on predictions

## 🧠 ML Models

The ML service uses Random Forest models for:

1. **Burnout Risk Classification** (Low/Medium/High)
   - Features: sleep, stress, deadlines, study hours
   - Feature engineering: sleep deficit, deadline pressure, stress-study ratio

2. **Attendance Risk Regression** (0-100% probability)
   - Based on current attendance and stress factors

3. **Exam Performance Regression** (0-100% score)
   - Considers study hours, attendance, stress, sleep quality

Models are trained on synthetic data at startup. In production, replace with real historical data.

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT-based authentication
- Protected routes require valid tokens
- Input validation on all endpoints

## 🛠️ Development

### Environment Variables

Each service has its own environment configuration:

- **Backend**: `backend/.env` (see `.env.example`)
- **ML Service**: Uses default values (can be extended)

### Running in Development

1. Start MySQL service
2. Start ML Service: `cd ml-service && python main.py`
3. Start Backend: `cd backend && npm run dev`
4. Start Frontend: `cd frontend && npm run dev`

### Database Migrations

Tables are automatically created on first backend startup. The schema is defined in `backend/config/database.js`.

## 📊 Database Schema

- **users**: User accounts (email, password, name)
- **student_data**: Daily student metrics
- **predictions**: Prediction history
- **alerts**: Stored alerts

See `backend/config/database.js` for full schema definitions.

## 🧪 Testing

1. Register a new account or use the seeded test account
2. Login and navigate to the dashboard
3. Submit daily data to see predictions
4. View alerts and suggestions

## 🚨 Troubleshooting

### Backend can't connect to database
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `digital_twin` exists
- Verify MySQL user has proper permissions

### ML Service not responding
- Check if service is running on port 8000
- Verify Python dependencies are installed
- Check ML service logs for errors

### Frontend can't reach backend
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify proxy configuration in `vite.config.js`

## 📦 Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment-specific database credentials
5. Train ML models on production data
6. Build frontend: `cd frontend && npm run build`
7. Serve frontend build with a web server (nginx, etc.)

## 📄 License

This project is provided as-is for educational and development purposes.

## 🤝 Contributing

This is a production-ready scaffold. Extend it with:
- Real ML model training on historical data
- Email notifications for alerts
- Mobile app integration
- Advanced analytics and reporting
- Multi-student support (admin dashboard)

---

Built with ❤️ for student success and well-being.

