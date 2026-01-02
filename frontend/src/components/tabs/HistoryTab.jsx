import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const HistoryTab = ({ history, loading, error, onRefresh }) => {
  const [showChart, setShowChart] = useState(true)

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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading History</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathe">
          <span className="text-5xl">📈</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Prediction History</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Your prediction history will appear here once you start submitting daily data.
        </p>
      </div>
    )
  }

  // Prepare chart data (reverse to show chronological order)
  const chartData = [...history].reverse().map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    burnout: item.burnoutRisk === 'High' ? 100 : item.burnoutRisk === 'Medium' ? 50 : 0,
    attendance: parseFloat(item.attendanceRisk) || 0,
    performance: parseFloat(item.examPerformance) || 0
  }))

  // Group by type
  const burnoutHistory = history.map(item => ({
    date: new Date(item.createdAt).toLocaleString(),
    risk: item.burnoutRisk,
    createdAt: item.createdAt
  }))

  const attendanceHistory = history.map(item => ({
    date: new Date(item.createdAt).toLocaleString(),
    risk: parseFloat(item.attendanceRisk || 0).toFixed(1) + '%',
    createdAt: item.createdAt
  }))

  const performanceHistory = history.map(item => ({
    date: new Date(item.createdAt).toLocaleString(),
    score: parseFloat(item.examPerformance || 0).toFixed(1) + '%',
    createdAt: item.createdAt
  }))

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Prediction History</h2>
          <p className="text-gray-600">
            View all your past predictions and track trends over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowChart(!showChart)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showChart ? 'Hide' : 'Show'} Chart
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Trend Chart */}
      {showChart && (
        <div className="card p-6 mb-6 bg-gradient-to-br from-gray-50 to-white animate-slide-down">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Overview</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="burnout" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Burnout Risk (0=Low, 50=Med, 100=High)"
                dot={{ r: 5, fill: '#ef4444' }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Attendance Risk %"
                dot={{ r: 5, fill: '#f59e0b' }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#22c55e" 
                strokeWidth={3}
                name="Performance Score %"
                dot={{ r: 5, fill: '#22c55e' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Grouped History Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burnout History */}
        <div className="card overflow-hidden animate-scale-in" style={{ animationDelay: '0ms' }}>
          <div className="bg-gradient-to-r from-danger-50 to-danger-100 px-6 py-4 border-b border-danger-200">
            <h3 className="font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">🔥</span>
              Burnout Predictions
            </h3>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {burnoutHistory.slice(0, 15).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.risk === 'High' ? 'bg-danger-100 text-danger-800' :
                        item.risk === 'Medium' ? 'bg-warning-100 text-warning-800' :
                        'bg-success-100 text-success-800'
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
        <div className="card overflow-hidden animate-scale-in" style={{ animationDelay: '100ms' }}>
          <div className="bg-gradient-to-r from-warning-50 to-warning-100 px-6 py-4 border-b border-warning-200">
            <h3 className="font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Attendance Predictions
            </h3>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.slice(0, 15).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {item.risk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance History */}
        <div className="card overflow-hidden animate-scale-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-success-50 to-success-100 px-6 py-4 border-b border-success-200">
            <h3 className="font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Performance Predictions
            </h3>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceHistory.slice(0, 15).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {history.length > 15 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing latest 15 predictions. Total: <span className="font-semibold">{history.length}</span> predictions
        </div>
      )}
    </div>
  )
}

export default HistoryTab
