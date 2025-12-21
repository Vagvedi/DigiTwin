import { Link, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Landing = () => {
  const { user, loading } = useContext(AuthContext)

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Redirect logged-in users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-indigo-600">
              Digital Twin
            </div>
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Academic Success, Predicted
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Track your daily habits, predict burnout risks, monitor attendance patterns, 
            and optimize your exam performance with AI-powered insights.
          </p>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Get personalized recommendations to help you stay on track and achieve your academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-indigo-600 shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Burnout Prediction</h3>
            <p className="text-gray-600 leading-relaxed">
              Get early warnings about burnout risk based on your sleep, stress levels, and study patterns. 
              Receive actionable recommendations to prevent burnout before it happens.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Attendance Risk</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your attendance patterns and receive alerts when you're at risk of falling behind. 
              Stay on track with personalized attendance strategies.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Performance Prediction</h3>
            <p className="text-gray-600 leading-relaxed">
              Predict your exam performance based on study hours, attendance, and stress levels. 
              Get personalized study recommendations to improve your scores.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit Daily Data</h3>
              <p className="text-gray-600 text-sm">
                Enter your sleep hours, attendance, study time, stress level, and deadlines each day.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get AI Predictions</h3>
              <p className="text-gray-600 text-sm">
                Receive instant predictions for burnout risk, attendance risk, and exam performance.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Take Action</h3>
              <p className="text-gray-600 text-sm">
                Follow personalized recommendations to optimize your academic performance and well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
