import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PerformancePredictionTab = ({ prediction, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Prediction</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathe">
          <span className="text-5xl">🎯</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Performance Prediction Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Submit your daily data to get your first exam performance prediction and study recommendations.
        </p>
      </div>
    )
  }

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-success-600 bg-success-50 border-success-200', barColor: '#22c55e' }
    if (score >= 70) return { level: 'Good', color: 'text-primary-600 bg-primary-50 border-primary-200', barColor: '#0ea5e9' }
    if (score >= 60) return { level: 'Fair', color: 'text-warning-600 bg-warning-50 border-warning-200', barColor: '#f59e0b' }
    return { level: 'Needs Improvement', color: 'text-danger-600 bg-danger-50 border-danger-200', barColor: '#ef4444' }
  }

  const perfInfo = getPerformanceLevel(prediction.examPerformance)

  const getRecommendations = (score) => {
    if (score < 60) {
      return [
        { icon: '📚', text: 'Increase study hours to at least 5-6 hours daily' },
        { icon: '🎯', text: 'Focus on understanding core concepts' },
        { icon: '👨‍🏫', text: 'Seek help from professors or tutors' },
        { icon: '📝', text: 'Create a structured study plan' },
        { icon: '👥', text: 'Join study groups for collaborative learning' }
      ]
    } else if (score < 70) {
      return [
        { icon: '📅', text: 'Maintain consistent study schedule' },
        { icon: '🔍', text: 'Focus on areas where you struggle most' },
        { icon: '🧠', text: 'Practice active recall techniques' },
        { icon: '📊', text: 'Take regular practice tests' }
      ]
    } else if (score < 80) {
      return [
        { icon: '✅', text: 'You\'re on the right track!' },
        { icon: '🔄', text: 'Continue maintaining your study routine' },
        { icon: '🎯', text: 'Focus on fine-tuning weak areas' }
      ]
    } else {
      return [
        { icon: '🎉', text: 'Excellent work! Keep up the momentum' },
        { icon: '⭐', text: 'Maintain your current study habits' },
        { icon: '🤝', text: 'Consider helping peers or teaching concepts' }
      ]
    }
  }

  const chartData = [
    { name: 'Predicted Score', value: prediction.examPerformance }
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Exam Performance Analysis</h2>
        <p className="text-gray-600">
          Predicted exam score based on your study patterns and attendance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Score Card */}
        <div className={`card p-8 border-2 ${perfInfo.color} animate-scale-in`}>
          <div className="text-sm font-semibold mb-3 uppercase tracking-wide">Predicted Exam Score</div>
          <div className="text-5xl font-bold mb-3">{prediction.examPerformance.toFixed(1)}%</div>
          <div className="text-sm opacity-75">
            {perfInfo.level} Performance
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="card p-8 bg-gradient-to-br from-gray-50 to-white">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Performance Visualization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis domain={[0, 100]} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={perfInfo.barColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-8 bg-gradient-to-br from-success-50 to-primary-50 border border-success-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">💡</span>
          Study Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getRecommendations(prediction.examPerformance).map((rec, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-2xl">{rec.icon}</span>
              <span className="text-gray-700 flex-1">{rec.text}</span>
            </div>
          ))}
        </div>
      </div>

      {prediction.createdAt && (
        <div className="mt-6 text-sm text-gray-500 flex items-center justify-center">
          <span className="mr-2">🕒</span>
          Last updated: {new Date(prediction.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  )
}

export default PerformancePredictionTab
