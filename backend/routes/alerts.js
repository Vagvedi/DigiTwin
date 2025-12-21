import express from 'express'
import pool from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get alerts for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id

    // Get latest predictions to generate alerts
    const [predictionResult] = await pool.query(
      `SELECT burnout_risk, attendance_risk, exam_performance
       FROM predictions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    )

    const alerts = []

    if (predictionResult.length > 0) {
      const prediction = predictionResult[0]

      // Burnout alerts
      if (prediction.burnout_risk === 'High') {
        alerts.push({
          type: 'danger',
          title: 'High Burnout Risk Detected',
          message: 'Your current patterns indicate a high risk of burnout. Please prioritize rest and consider adjusting your schedule.'
        })
      } else if (prediction.burnout_risk === 'Medium') {
        alerts.push({
          type: 'warning',
          title: 'Moderate Burnout Risk',
          message: 'You\'re showing signs of moderate burnout risk. Monitor your stress levels and ensure adequate rest.'
        })
      }

      // Attendance alerts
      if (prediction.attendance_risk > 60) {
        alerts.push({
          type: 'danger',
          title: 'Critical Attendance Risk',
          message: `Your attendance risk is ${prediction.attendance_risk.toFixed(1)}%. Focus on attending classes regularly to maintain good standing.`
        })
      } else if (prediction.attendance_risk > 30) {
        alerts.push({
          type: 'warning',
          title: 'Attendance Warning',
          message: `Your attendance risk is ${prediction.attendance_risk.toFixed(1)}%. Consider improving your attendance patterns.`
        })
      }

      // Exam performance alerts
      if (prediction.exam_performance < 60) {
        alerts.push({
          type: 'danger',
          title: 'Low Exam Performance Prediction',
          message: `Your predicted exam score is ${prediction.exam_performance.toFixed(1)}%. Consider increasing study hours and seeking help.`
        })
      } else if (prediction.exam_performance < 75) {
        alerts.push({
          type: 'warning',
          title: 'Exam Performance Below Average',
          message: `Your predicted exam score is ${prediction.exam_performance.toFixed(1)}%. There's room for improvement.`
        })
      }
    }

    // Get stored alerts from database
    const [storedAlertsResult] = await pool.query(
      `SELECT type, title, message, created_at
       FROM alerts
       WHERE user_id = ? AND is_read = FALSE
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    )

    // Combine dynamic and stored alerts
    const allAlerts = [...alerts, ...storedAlertsResult.map(row => ({
      type: row.type,
      title: row.title,
      message: row.message
    }))]

    res.json(allAlerts)
  } catch (error) {
    console.error('Get alerts error:', error)
    res.status(500).json({ message: 'Server error while fetching alerts' })
  }
})

export default router

