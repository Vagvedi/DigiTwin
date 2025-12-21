# Quick Setup Guide

## Step-by-Step Setup

### 1. Database Setup (MySQL)

**Install MySQL:**
- **Windows**: Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- **Mac**: `brew install mysql` or download installer
- **Linux**: `sudo apt-get install mysql-server` (Ubuntu/Debian) or `sudo yum install mysql-server` (CentOS/RHEL)

**Start MySQL Service:**
- **Windows**: Start MySQL service from Services (services.msc) or use MySQL Workbench
- **Mac/Linux**: `sudo systemctl start mysql` or `brew services start mysql`

**Create Database:**
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE digital_twin;

# Exit MySQL
EXIT;
```

**Verify MySQL is running:**
```bash
# Check MySQL status
mysqladmin -u root -p status

# Or connect to verify
mysql -u root -p -e "SHOW DATABASES;"
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp env.example .env

# Edit .env with your MySQL credentials:
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=digital_twin
# DB_USER=root
# DB_PASSWORD=your_mysql_password

# Then start backend:
npm start
```

### 3. ML Service Setup

```bash
cd ml-service
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. (Optional) Seed Data

```bash
cd backend
node scripts/seed.js
```

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Service: http://localhost:8000

## Test Credentials (after seeding)

- Email: test@example.com
- Password: password123

## Troubleshooting

### Port Already in Use
- Change ports in respective config files
- Update ML_SERVICE_URL in backend/.env if ML service port changes

### Database Connection Issues
- Verify MySQL is running:
  - **Windows**: Check Services or MySQL Workbench
  - **Mac/Linux**: `sudo systemctl status mysql` or `brew services list`
- Check credentials in backend/.env
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;" | grep digital_twin`
- Verify MySQL user has proper permissions:
  ```sql
  GRANT ALL PRIVILEGES ON digital_twin.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```
- Check MySQL error logs for connection issues
- Verify MySQL port (default: 3306) is not blocked by firewall

### ML Service Not Training
- Check Python version: `python --version` (needs 3.8+)
- Verify all dependencies: `pip list`
- Check logs for errors

### Common MySQL Issues

**Access Denied Error:**
- Verify username and password in `.env`
- Reset MySQL root password if needed:
  ```bash
  sudo mysql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
  FLUSH PRIVILEGES;
  ```

**Can't Connect to MySQL Server:**
- Ensure MySQL service is running
- Check if MySQL is listening on port 3306: `netstat -an | grep 3306`
- Verify `DB_HOST` in `.env` matches your MySQL configuration

**Table Creation Errors:**
- Ensure database exists: `CREATE DATABASE IF NOT EXISTS digital_twin;`
- Check user permissions
- Verify foreign key constraints are supported (InnoDB engine)
