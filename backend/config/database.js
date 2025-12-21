import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'digital_twin',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// Test connection
export const connectDB = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('Database connected successfully')
    connection.release()
    
    // Initialize tables
    await initializeTables()
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

// Initialize database tables
const initializeTables = async () => {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // Student data table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        sleep_hours DECIMAL(4,2) NOT NULL,
        attendance_percentage DECIMAL(5,2) NOT NULL,
        study_hours DECIMAL(4,2) NOT NULL,
        stress_level INT NOT NULL,
        deadlines_count INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_student_data_user_id (user_id),
        INDEX idx_student_data_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // Predictions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        student_data_id INT,
        burnout_risk VARCHAR(20) NOT NULL,
        attendance_risk DECIMAL(5,2) NOT NULL,
        exam_performance DECIMAL(5,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (student_data_id) REFERENCES student_data(id) ON DELETE CASCADE,
        INDEX idx_predictions_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // Alerts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_alerts_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    await connection.commit()
    console.log('Database tables initialized successfully')
  } catch (error) {
    await connection.rollback()
    console.error('Error initializing tables:', error)
    throw error
  } finally {
    connection.release()
  }
}

export default pool
