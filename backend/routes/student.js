import express from 'express'
import pool from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Submit daily student data
router.post('/data', async (req, res) => {
  try {
    const { sleepHours, attendancePercentage, studyHours, stressLevel, deadlinesCount } = req.body
    const userId = req.user.id

    // Validate input
    if (
      sleepHours === undefined ||
      attendancePercentage === undefined ||
      studyHours === undefined ||
      stressLevel === undefined ||
      deadlinesCount === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Validate ranges
    if (sleepHours < 0 || sleepHours > 24) {
      return res.status(400).json({ message: 'Sleep hours must be between 0 and 24' })
    }
    if (attendancePercentage < 0 || attendancePercentage > 100) {
      return res.status(400).json({ message: 'Attendance percentage must be between 0 and 100' })
    }
    if (studyHours < 0 || studyHours > 24) {
      return res.status(400).json({ message: 'Study hours must be between 0 and 24' })
    }
    if (stressLevel < 1 || stressLevel > 10) {
      return res.status(400).json({ message: 'Stress level must be between 1 and 10' })
    }
    if (deadlinesCount < 0) {
      return res.status(400).json({ message: 'Deadlines count must be non-negative' })
    }

    // Insert student data
    const [result] = await pool.query(
      `INSERT INTO student_data 
       (user_id, sleep_hours, attendance_percentage, study_hours, stress_level, deadlines_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, sleepHours, attendancePercentage, studyHours, stressLevel, deadlinesCount]
    )

    // Get the inserted data
    const [dataRows] = await pool.query(
      'SELECT * FROM student_data WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({
      message: 'Data submitted successfully',
      data: dataRows[0]
    })
  } catch (error) {
    console.error('Submit data error:', error)
    res.status(500).json({ message: 'Server error while submitting data' })
  }
})

// Get student data history
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id
    const limit = parseInt(req.query.limit) || 30

    const [result] = await pool.query(
      `SELECT 
        id,
        sleep_hours as sleepHours,
        attendance_percentage as attendancePercentage,
        study_hours as studyHours,
        stress_level as stressLevel,
        deadlines_count as deadlinesCount,
        created_at as createdAt
       FROM student_data
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    )

    res.json(result)
  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({ message: 'Server error while fetching history' })
  }
})

export default router

