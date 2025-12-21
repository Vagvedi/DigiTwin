/**
 * Seed script to populate database with sample student data
 * Run with: node scripts/seed.js
 */

import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'digital_twin',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function seed() {
  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    // Check if user exists, if not insert
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['test@example.com']
    )

    let userId
    if (existingUser.length > 0) {
      userId = existingUser[0].id
      console.log(`Found existing user with ID: ${userId}`)
    } else {
      const [userResult] = await connection.query(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        ['test@example.com', hashedPassword, 'Test Student']
      )
      userId = userResult.insertId
      console.log(`Created user with ID: ${userId}`)
    }

    // Generate sample student data for the last 30 days
    const sampleData = []
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Generate realistic variations
      const sleepHours = 6.5 + Math.random() * 2.5 // 6.5-9 hours
      const attendancePercentage = 75 + Math.random() * 20 // 75-95%
      const studyHours = 3 + Math.random() * 4 // 3-7 hours
      const stressLevel = Math.floor(3 + Math.random() * 5) // 3-7
      const deadlinesCount = Math.floor(Math.random() * 5) // 0-4

      sampleData.push({
        userId,
        sleepHours,
        attendancePercentage,
        studyHours,
        stressLevel,
        deadlinesCount,
        date
      })
    }

    // Insert sample data
    for (const data of sampleData) {
      await connection.query(
        `INSERT INTO student_data 
         (user_id, sleep_hours, attendance_percentage, study_hours, stress_level, deadlines_count, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.userId,
          data.sleepHours,
          data.attendancePercentage,
          data.studyHours,
          data.stressLevel,
          data.deadlinesCount,
          data.date
        ]
      )
    }

    console.log(`Inserted ${sampleData.length} sample data entries`)

    await connection.commit()
    console.log('✓ Seed data created successfully!')
    console.log('\nTest credentials:')
    console.log('Email: test@example.com')
    console.log('Password: password123')
  } catch (error) {
    await connection.rollback()
    console.error('Error seeding database:', error)
    throw error
  } finally {
    connection.release()
    await pool.end()
  }
}

seed().catch(console.error)
