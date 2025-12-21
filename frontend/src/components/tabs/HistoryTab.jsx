import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const HistoryTab = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prediction History</h3>
        <p className="text-gray-600 mb-4">
          Your prediction history will appear here once you start submitting daily data.
        </p>
      </div>
    )
  }

  // Prepare chart data (reverse to show chronological order)
  const chartData = [...history].reverse().map((item, index) => ({
    date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    burnout: item.burnoutRisk === 'High' ? 100 : item.burnoutRisk === 'Medium' ? 50 : 0,
    attendance: item.attendanceRisk,
    performance: item.examPerformance
  }))

  // Group by type
  const burnoutHistory = history.map(item => ({
    date: new Date(item.createdAt).toLocaleString(),
    risk: item.burnoutRisk,
    createdAt: item.createdAt
  }))

  const attendanceHistory = history.map(item => ({
    date: new Date(item.createdAt).toLocaleString(),
    risk: item.attendanceRisk.toFixed(1) + '%',
    createdAt: item.createdAt
  }))

  const performanceHistory = history.map(item => ({
    date: new Date(item.createdAt).toLocaleString(),
    score: item.examPerformance.toFixed(1) + '%',
    createdAt: item.createdAt
  }))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prediction History</h2>
        <p className="text-gray-600">
          View all your past predictions and track trends over time
        </p>
      </div>

      {/* Trend Chart */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="burnout" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Burnout Risk (0=Low, 50=Med, 100=High)"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Attendance Risk %"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Performance Score %"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grouped History Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burnout History */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-red-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">🔥 Burnout Predictions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {burnoutHistory.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.risk === 'High' ? 'bg-red-100 text-red-800' :
                        item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-yellow-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">📊 Attendance Predictions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.risk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance History */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">🎯 Performance Predictions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceHistory.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {history.length > 10 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing latest 10 predictions. Total: {history.length} predictions
        </div>
      )}
    </div>
  )
}

export default HistoryTab

