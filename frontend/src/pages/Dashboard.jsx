import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import DataInputForm from '../components/DataInputForm'
import BurnoutPredictionTab from '../components/tabs/BurnoutPredictionTab'
import AttendancePredictionTab from '../components/tabs/AttendancePredictionTab'
import PerformancePredictionTab from '../components/tabs/PerformancePredictionTab'
import HistoryTab from '../components/tabs/HistoryTab'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('burnout')
  const [latestPrediction, setLatestPrediction] = useState(null)
  const [predictionHistory, setPredictionHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingPredictions, setFetchingPredictions] = useState(true)

  useEffect(() => {
    fetchLatestPrediction()
    fetchPredictionHistory()
  }, [])

  const fetchLatestPrediction = async () => {
    setFetchingPredictions(true)
    try {
      const res = await axios.get('/api/predict/latest')
      setLatestPrediction(res.data)
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch latest prediction:', err)
      }
      // 404 is expected if no predictions exist yet
    } finally {
      setFetchingPredictions(false)
    }
  }

  const fetchPredictionHistory = async () => {
    try {
      const res = await axios.get('/api/predict/history')
      setPredictionHistory(res.data)
    } catch (err) {
      console.error('Failed to fetch prediction history:', err)
    }
  }

  const handleDataSubmit = async (data) => {
    setLoading(true)
    try {
      // Submit daily data
      await axios.post('/api/student/data', data)
      
      // Get predictions
      const predRes = await axios.post('/api/predict', data)
      const newPrediction = {
        burnoutRisk: predRes.data.burnoutRisk,
        attendanceRisk: predRes.data.attendanceRisk,
        examPerformance: predRes.data.examPerformance,
        createdAt: new Date().toISOString()
      }
      setLatestPrediction(newPrediction)
      
      // Refresh history
      await fetchPredictionHistory()
    } catch (err) {
      console.error('Failed to submit data:', err)
      alert('Failed to submit data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'burnout', label: 'Burnout Prediction', icon: '🔥' },
    { id: 'attendance', label: 'Attendance Prediction', icon: '📊' },
    { id: 'performance', label: 'Performance Prediction', icon: '🎯' },
    { id: 'history', label: 'History', icon: '📈' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-indigo-600">
              Digital Twin Dashboard
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Input Form - Always visible */}
        <div className="mb-6">
          <DataInputForm onSubmit={handleDataSubmit} loading={loading} />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm
                    transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {fetchingPredictions && activeTab !== 'history' ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading predictions...</div>
            </div>
          ) : (
            <>
              {activeTab === 'burnout' && (
                <BurnoutPredictionTab prediction={latestPrediction} />
              )}
              {activeTab === 'attendance' && (
                <AttendancePredictionTab prediction={latestPrediction} />
              )}
              {activeTab === 'performance' && (
                <PerformancePredictionTab prediction={latestPrediction} />
              )}
              {activeTab === 'history' && (
                <HistoryTab history={predictionHistory} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
