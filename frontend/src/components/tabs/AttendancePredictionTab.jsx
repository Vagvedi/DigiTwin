import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AttendancePredictionTab = ({ prediction, loading, error }) => {
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
        <div className="w-24 h-24 bg-gradient-to-br from-warning-100 to-warning-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathe">
          <span className="text-5xl">📊</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Attendance Prediction Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Submit your daily data to get your first attendance risk prediction and actionable insights.
        </p>
      </div>
    )
  }

  const getRiskLevel = (risk) => {
    if (risk < 30) return { level: 'Low', color: 'text-success-600 bg-success-50 border-success-200' }
    if (risk < 60) return { level: 'Moderate', color: 'text-warning-600 bg-warning-50 border-warning-200' }
    return { level: 'High', color: 'text-danger-600 bg-danger-50 border-danger-200' }
  }

  const riskInfo = getRiskLevel(prediction.attendanceRisk)

  const getRecommendations = (risk) => {
    if (risk >= 60) {
      return [
        { icon: '✅', text: 'Attend all classes without exception this week' },
        { icon: '⏰', text: 'Set multiple reminders for class times' },
        { icon: '👥', text: 'Find an accountability partner' },
        { icon: '📋', text: 'Review your class schedule and prioritize attendance' }
      ]
    } else if (risk >= 30) {
      return [
        { icon: '📅', text: 'Maintain consistent attendance patterns' },
        { icon: '🔔', text: 'Set calendar reminders for all classes' },
        { icon: '📊', text: 'Track your attendance weekly' }
      ]
    } else {
      return [
        { icon: '🎉', text: 'Keep up the excellent attendance!' },
        { icon: '🔄', text: 'Maintain your current routine' },
        { icon: '⭐', text: 'Continue prioritizing class attendance' }
      ]
    }
  }

  const chartData = [
    { name: 'Risk Level', value: prediction.attendanceRisk }
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Attendance Risk Analysis</h2>
        <p className="text-gray-600">
          Probability of experiencing attendance issues based on your patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Percentage Card */}
        <div className={`card p-8 border-2 ${riskInfo.color} animate-scale-in`}>
          <div className="text-sm font-semibold mb-3 uppercase tracking-wide">Attendance Risk</div>
          <div className="text-5xl font-bold mb-3">{prediction.attendanceRisk.toFixed(1)}%</div>
          <div className="text-sm opacity-75">
            {riskInfo.level} Risk Level
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="card p-8 bg-gradient-to-br from-gray-50 to-white">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Risk Visualization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
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
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={prediction.attendanceRisk >= 60 ? "#ef4444" : prediction.attendanceRisk >= 30 ? "#f59e0b" : "#22c55e"} 
                strokeWidth={4}
                dot={{ r: 8, fill: prediction.attendanceRisk >= 60 ? "#ef4444" : prediction.attendanceRisk >= 30 ? "#f59e0b" : "#22c55e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-8 bg-gradient-to-br from-warning-50 to-primary-50 border border-warning-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">💡</span>
          Actionable Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getRecommendations(prediction.attendanceRisk).map((rec, index) => (
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

export default AttendancePredictionTab
