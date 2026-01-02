import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'

const Landing = () => {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showFeatures, setShowFeatures] = useState(false)

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <div className="text-gray-500 font-medium">Loading...</div>
        </div>
      </div>
    )
  }

  // Redirect logged-in users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const scrollToFeatures = () => {
    setShowFeatures(true)
    setTimeout(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white text-lg font-bold">DT</span>
              </div>
              <span className="text-xl font-bold gradient-text">Digital Twin</span>
            </Link>

            {/* Nav Items */}
            <div className="flex items-center space-x-8">
              <button
                onClick={scrollToFeatures}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors hidden sm:block"
              >
                Features
              </button>
              <button
                onClick={handleGetStarted}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6 lg:px-8 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)] -z-10"></div>
        
        {/* Content */}
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-8 animate-slide-down">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
            AI-Powered Student Analytics
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Predict Your Academic
            <br />
            <span className="gradient-text">Success</span>
          </h1>

          {/* Subtext */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Track daily habits, predict burnout risks, and optimize performance with 
            <span className="font-semibold text-gray-900"> AI-powered insights</span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              className="btn-primary px-8 py-4 text-lg w-full sm:w-auto"
            >
              Get Started Free
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto"
            >
              Learn More
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-success-500 mr-2">✓</span>
              No credit card required
            </div>
            <div className="flex items-center">
              <span className="text-success-500 mr-2">✓</span>
              Free forever
            </div>
            <div className="flex items-center">
              <span className="text-success-500 mr-2">✓</span>
              Setup in 2 minutes
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent -z-10"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to
              <span className="gradient-text"> succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI-driven predictions to help you stay on track and achieve your goals
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Burnout Prediction */}
            <div className="card-hover p-8 group animate-scale-in" style={{ animationDelay: '0ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-danger-100 to-danger-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Burnout Prediction</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Get early warnings about burnout risk based on your sleep, stress levels, and study patterns.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">→</span>
                  Real-time risk assessment
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">→</span>
                  Personalized recommendations
                </li>
              </ul>
            </div>

            {/* Attendance Risk */}
            <div className="card-hover p-8 group animate-scale-in" style={{ animationDelay: '100ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-warning-100 to-warning-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Attendance Risk</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Monitor attendance patterns and receive alerts when you're at risk of falling behind.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">→</span>
                  Pattern analysis
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">→</span>
                  Proactive alerts
                </li>
              </ul>
            </div>

            {/* Performance Prediction */}
            <div className="card-hover p-8 group animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Performance Prediction</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Predict exam performance and get personalized study recommendations to improve your scores.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">→</span>
                  Score forecasting
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">→</span>
                  Study optimization
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works */}
          <div className="card p-12 bg-gradient-to-br from-gray-50 to-white animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Get started in three simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Submit Daily Data',
                  description: 'Enter your sleep hours, attendance, study time, stress level, and deadlines each day.',
                  icon: '📝'
                },
                {
                  step: '2',
                  title: 'Get AI Predictions',
                  description: 'Receive instant predictions for burnout risk, attendance risk, and exam performance.',
                  icon: '🤖'
                },
                {
                  step: '3',
                  title: 'Take Action',
                  description: 'Follow personalized recommendations to optimize your academic performance.',
                  icon: '✨'
                }
              ].map((item, index) => (
                <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft hover:shadow-medium transition-shadow">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to transform your academic journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join students who are already using AI to predict and optimize their performance
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-50 shadow-large transform hover:scale-105 transition-all duration-200"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">DT</span>
            </div>
            <span className="text-gray-600 font-medium">Digital Twin</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2024 Digital Twin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
