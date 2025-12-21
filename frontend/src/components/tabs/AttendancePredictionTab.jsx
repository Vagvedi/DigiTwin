import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AttendancePredictionTab = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Attendance Prediction Yet</h3>
        <p className="text-gray-600">
          Submit your daily data to get your first attendance risk prediction.
        </p>
      </div>
    )
  }

  const getRiskLevel = (risk) => {
    if (risk < 30) return { level: 'Low', color: 'text-green-600 bg-green-50' }
    if (risk < 60) return { level: 'Moderate', color: 'text-yellow-600 bg-yellow-50' }
    return { level: 'High', color: 'text-red-600 bg-red-50' }
  }

  const riskInfo = getRiskLevel(prediction.attendanceRisk)

  const getRecommendations = (risk) => {
    if (risk >= 60) {
      return [
        'Attend all classes without exception this week',
        'Set multiple reminders for class times',
        'Consider finding an accountability partner',
        'Review your class schedule and prioritize attendance',
        'Speak with your advisor about attendance policies'
      ]
    } else if (risk >= 30) {
      return [
        'Maintain consistent attendance patterns',
        'Set calendar reminders for all classes',
        'Plan your schedule to avoid conflicts',
        'Track your attendance weekly'
      ]
    } else {
      return [
        'Keep up the excellent attendance!',
        'Maintain your current routine',
        'Continue prioritizing class attendance'
      ]
    }
  }

  // Create chart data for visualization
  const chartData = [
    { name: 'Risk Level', value: prediction.attendanceRisk }
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Attendance Risk Prediction</h2>
        <p className="text-gray-600">
          Probability of experiencing attendance issues based on your patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Percentage Card */}
        <div className={`rounded-lg p-6 ${riskInfo.color}`}>
          <div className="text-sm font-medium mb-2">Attendance Risk</div>
          <div className="text-4xl font-bold mb-2">{prediction.attendanceRisk.toFixed(1)}%</div>
          <div className="text-sm opacity-75">
            {riskInfo.level} Risk
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Risk Level Visualization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={prediction.attendanceRisk >= 60 ? "#EF4444" : prediction.attendanceRisk >= 30 ? "#F59E0B" : "#10B981"} 
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <ul className="space-y-2">
          {getRecommendations(prediction.attendanceRisk).map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {prediction.createdAt && (
        <div className="mt-4 text-sm text-gray-500">
          Last updated: {new Date(prediction.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  )
}

export default AttendancePredictionTab

