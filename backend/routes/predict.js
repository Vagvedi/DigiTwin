import express from 'express'
import axios from 'axios'
import pool from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get predictions from ML service
router.post('/', async (req, res) => {
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

    // Prepare data for ML service
    const mlServiceData = {
      sleep_hours: sleepHours,
      attendance_percentage: attendancePercentage,
      study_hours: studyHours,
      stress_level: stressLevel,
      deadlines_count: deadlinesCount
    }

    // Call ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000'
    let predictions

    try {
      const mlResponse = await axios.post(`${mlServiceUrl}/predict`, mlServiceData, {
        timeout: 10000 // 10 second timeout
      })
      predictions = mlResponse.data
    } catch (mlError) {
      console.error('ML service error:', mlError.message)
      // Fallback to simple rule-based predictions if ML service is unavailable
      predictions = generateFallbackPredictions(mlServiceData)
    }

    // Get the latest student data entry for this user
    const [dataResult] = await pool.query(
      'SELECT id FROM student_data WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    )

    const studentDataId = dataResult.length > 0 ? dataResult[0].id : null

    // Store prediction in database
    if (studentDataId) {
      await pool.query(
        `INSERT INTO predictions 
         (user_id, student_data_id, burnout_risk, attendance_risk, exam_performance)
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          studentDataId,
          predictions.burnout_risk,
          predictions.attendance_risk,
          predictions.exam_performance
        ]
      )
    }

    // Return predictions in frontend-friendly format
    res.json({
      burnoutRisk: predictions.burnout_risk,
      attendanceRisk: predictions.attendance_risk,
      examPerformance: predictions.exam_performance
    })
  } catch (error) {
    console.error('Prediction error:', error)
    res.status(500).json({ message: 'Server error while generating predictions' })
  }
})

// Get prediction history for the logged-in user
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id
    const limit = parseInt(req.query.limit) || 100

    const [result] = await pool.query(
      `SELECT 
        id,
        burnout_risk as burnoutRisk,
        attendance_risk as attendanceRisk,
        exam_performance as examPerformance,
        created_at as createdAt
       FROM predictions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    )

    res.json(result)
  } catch (error) {
    console.error('Get prediction history error:', error)
    res.status(500).json({ message: 'Server error while fetching prediction history' })
  }
})

// Get latest prediction for the logged-in user
router.get('/latest', async (req, res) => {
  try {
    const userId = req.user.id

    const [result] = await pool.query(
      `SELECT 
        id,
        burnout_risk as burnoutRisk,
        attendance_risk as attendanceRisk,
        exam_performance as examPerformance,
        created_at as createdAt
       FROM predictions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    )

    if (result.length === 0) {
      return res.status(404).json({ message: 'No predictions found' })
    }

    res.json(result[0])
  } catch (error) {
    console.error('Get latest prediction error:', error)
    res.status(500).json({ message: 'Server error while fetching latest prediction' })
  }
})

// Fallback prediction function (simple rule-based)
function generateFallbackPredictions(data) {
  const { sleep_hours, attendance_percentage, study_hours, stress_level, deadlines_count } = data

  // Burnout risk classification
  let burnoutRisk = 'Low'
  const burnoutScore = 
    (sleep_hours < 6 ? 30 : sleep_hours < 7 ? 20 : 0) +
    (stress_level > 7 ? 30 : stress_level > 5 ? 15 : 0) +
    (study_hours > 8 ? 20 : 0) +
    (deadlines_count > 5 ? 20 : deadlines_count > 3 ? 10 : 0)

  if (burnoutScore >= 60) {
    burnoutRisk = 'High'
  } else if (burnoutScore >= 30) {
    burnoutRisk = 'Medium'
  }

  // Attendance risk (probability)
  let attendanceRisk = 0
  if (attendance_percentage < 70) {
    attendanceRisk = 80
  } else if (attendance_percentage < 80) {
    attendanceRisk = 50
  } else if (attendance_percentage < 85) {
    attendanceRisk = 30
  } else {
    attendanceRisk = 10
  }

  // Exam performance (regression score)
  let examPerformance = 50 // Base score
  examPerformance += (study_hours * 3) // Study hours contribute
  examPerformance += (attendance_percentage * 0.3) // Attendance contributes
  examPerformance -= (stress_level * 2) // Stress reduces performance
  examPerformance += (sleep_hours >= 7 ? 10 : sleep_hours >= 6 ? 5 : -5) // Sleep quality
  examPerformance -= (deadlines_count * 2) // Too many deadlines reduce performance

  // Clamp between 0 and 100
  examPerformance = Math.max(0, Math.min(100, examPerformance))

  return {
    burnout_risk: burnoutRisk,
    attendance_risk: attendanceRisk,
    exam_performance: examPerformance
  }
}

export default router
