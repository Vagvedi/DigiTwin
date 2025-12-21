const PredictionCards = ({ predictions }) => {
  const getBurnoutColor = (risk) => {
    if (risk === 'Low') return 'bg-green-100 text-green-800'
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getAttendanceColor = (risk) => {
    if (risk < 30) return 'text-green-600'
    if (risk < 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Burnout Risk</h3>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBurnoutColor(predictions.burnoutRisk)}`}>
          {predictions.burnoutRisk}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on your recent activity patterns
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Attendance Risk</h3>
        <div className={`text-3xl font-bold ${getAttendanceColor(predictions.attendanceRisk)}`}>
          {predictions.attendanceRisk.toFixed(1)}%
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Probability of attendance issues
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Exam Performance</h3>
        <div className="text-3xl font-bold text-indigo-600">
          {predictions.examPerformance.toFixed(1)}%
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Predicted exam score
        </p>
      </div>
    </div>
  )
}

export default PredictionCards

