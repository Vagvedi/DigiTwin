import { useState, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import DataInputForm from '../components/DataInputForm'
import BurnoutPredictionTab from '../components/tabs/BurnoutPredictionTab'
import AttendancePredictionTab from '../components/tabs/AttendancePredictionTab'
import PerformancePredictionTab from '../components/tabs/PerformancePredictionTab'
import HistoryTab from '../components/tabs/HistoryTab'
import FocusModeTab from '../components/tabs/FocusModeTab'
import WhatIfSimulatorTab from '../components/tabs/WhatIfSimulatorTab'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('burnout')
  const [latestPrediction, setLatestPrediction] = useState(null)
  const [predictionHistory, setPredictionHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingPredictions, setFetchingPredictions] = useState(true)
  const [error, setError] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState(null)

  const fetchLatestPrediction = useCallback(async () => {
    setFetchingPredictions(true)
    setError(null)
    try {
      const res = await axios.get('/api/predict/latest')
      setLatestPrediction(res.data)
    } catch (err) {
      if (err.response?.status === 404) {
        // No predictions yet - this is expected
        setLatestPrediction(null)
      } else {
        setError('Failed to load predictions. Please try again.')
        console.error('Failed to fetch latest prediction:', err)
      }
    } finally {
      setFetchingPredictions(false)
    }
  }, [])

  const fetchPredictionHistory = useCallback(async () => {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const res = await axios.get('/api/predict/history')
      setPredictionHistory(res.data || [])
    } catch (err) {
      setHistoryError('Failed to load prediction history. Please try again.')
      console.error('Failed to fetch prediction history:', err)
      setPredictionHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLatestPrediction()
    fetchPredictionHistory()
  }, [fetchLatestPrediction, fetchPredictionHistory])

  const handleDataSubmit = async (data) => {
    setLoading(true)
    setError(null)
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
      const errorMessage = err.response?.data?.message || 'Failed to submit data. Please try again.'
      setError(errorMessage)
      console.error('Failed to submit data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'burnout', label: 'Burnout', icon: '🔥', color: 'danger' },
    { id: 'attendance', label: 'Attendance', icon: '📊', color: 'warning' },
    { id: 'performance', label: 'Performance', icon: '🎯', color: 'success' },
    { id: 'simulator', label: 'What-If', icon: '🔮', color: 'accent' },
    { id: 'focus', label: 'Focus Mode', icon: '🧘', color: 'accent' },
    { id: 'history', label: 'History', icon: '📈', color: 'primary' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">DT</span>
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">Digital Twin</div>
                <div className="text-xs text-gray-500">Student Analytics</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span>Welcome, {user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg flex items-center justify-between animate-slide-down">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-danger-500 hover:text-danger-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Data Input Form */}
        <div className="mb-8 animate-fade-in">
          <DataInputForm onSubmit={handleDataSubmit} loading={loading} />
        </div>

        {/* Tabs Navigation */}
        <div className="card mb-6 overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {tabs.map((tab) => {
                const getActiveClasses = () => {
                  if (activeTab !== tab.id) {
                    return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                  switch (tab.color) {
                    case 'danger':
                      return 'border-danger-500 text-danger-600 bg-danger-50/50'
                    case 'warning':
                      return 'border-warning-500 text-warning-600 bg-warning-50/50'
                    case 'success':
                      return 'border-success-500 text-success-600 bg-success-50/50'
                    case 'accent':
                      return 'border-accent-500 text-accent-600 bg-accent-50/50'
                    default:
                      return 'border-primary-500 text-primary-600 bg-primary-50/50'
                  }
                }
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-shrink-0 py-4 px-6 text-center border-b-2 font-medium text-sm
                      transition-all duration-300 whitespace-nowrap
                      ${getActiveClasses()}
                    `}
                  >
                    <span className="mr-2 text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card p-8 animate-scale-in">
          {activeTab === 'burnout' && (
            <BurnoutPredictionTab 
              prediction={latestPrediction} 
              loading={fetchingPredictions}
              error={error}
            />
          )}
          {activeTab === 'attendance' && (
            <AttendancePredictionTab 
              prediction={latestPrediction} 
              loading={fetchingPredictions}
              error={error}
            />
          )}
          {activeTab === 'performance' && (
            <PerformancePredictionTab 
              prediction={latestPrediction} 
              loading={fetchingPredictions}
              error={error}
            />
          )}
          {activeTab === 'simulator' && (
            <WhatIfSimulatorTab baselinePrediction={latestPrediction} />
          )}
          {activeTab === 'focus' && (
            <FocusModeTab />
          )}
          {activeTab === 'history' && (
            <HistoryTab 
              history={predictionHistory} 
              loading={historyLoading}
              error={historyError}
              onRefresh={fetchPredictionHistory}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
