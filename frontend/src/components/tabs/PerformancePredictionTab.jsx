import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PerformancePredictionTab = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Performance Prediction Yet</h3>
        <p className="text-gray-600">
          Submit your daily data to get your first exam performance prediction.
        </p>
      </div>
    )
  }

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600 bg-green-50', barColor: '#10B981' }
    if (score >= 70) return { level: 'Good', color: 'text-blue-600 bg-blue-50', barColor: '#3B82F6' }
    if (score >= 60) return { level: 'Fair', color: 'text-yellow-600 bg-yellow-50', barColor: '#F59E0B' }
    return { level: 'Needs Improvement', color: 'text-red-600 bg-red-50', barColor: '#EF4444' }
  }

  const perfInfo = getPerformanceLevel(prediction.examPerformance)

  const getRecommendations = (score) => {
    if (score < 60) {
      return [
        'Increase study hours to at least 5-6 hours daily',
        'Focus on understanding core concepts rather than memorization',
        'Seek help from professors or tutors for difficult topics',
        'Create a structured study plan and stick to it',
        'Join study groups for collaborative learning',
        'Review past exam papers and practice problems'
      ]
    } else if (score < 70) {
      return [
        'Maintain consistent study schedule',
        'Focus on areas where you struggle most',
        'Practice active recall techniques',
        'Take regular practice tests',
        'Review and revise regularly'
      ]
    } else if (score < 80) {
      return [
        'You\'re on the right track!',
        'Continue maintaining your study routine',
        'Focus on fine-tuning weak areas',
        'Consider advanced topics for extra credit'
      ]
    } else {
      return [
        'Excellent work! Keep up the momentum',
        'Maintain your current study habits',
        'Consider helping peers or teaching concepts',
        'Continue balancing study with rest'
      ]
    }
  }

  const chartData = [
    { name: 'Predicted Score', value: prediction.examPerformance }
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Performance Prediction</h2>
        <p className="text-gray-600">
          Predicted exam score based on your study patterns and attendance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Card */}
        <div className={`rounded-lg p-6 ${perfInfo.color}`}>
          <div className="text-sm font-medium mb-2">Predicted Exam Score</div>
          <div className="text-4xl font-bold mb-2">{prediction.examPerformance.toFixed(1)}%</div>
          <div className="text-sm opacity-75">
            {perfInfo.level} Performance
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Performance Visualization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={perfInfo.barColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <ul className="space-y-2">
          {getRecommendations(prediction.examPerformance).map((rec, index) => (
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

export default PerformancePredictionTab

