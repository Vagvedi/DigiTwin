import BurnoutGauge from '../BurnoutGauge'

const BurnoutPredictionTab = ({ prediction, loading, error }) => {
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
        <div className="w-24 h-24 bg-gradient-to-br from-danger-100 to-danger-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathe">
          <span className="text-5xl">🔥</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Burnout Prediction Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Submit your daily data to get your first burnout risk prediction and personalized recommendations.
        </p>
      </div>
    )
  }

  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-success-600 bg-success-50 border-success-200'
    if (risk === 'Medium') return 'text-warning-600 bg-warning-50 border-warning-200'
    return 'text-danger-600 bg-danger-50 border-danger-200'
  }

  const getRecommendations = (risk) => {
    if (risk === 'High') {
      return [
        { icon: '🛌', text: 'Prioritize 7-8 hours of sleep nightly' },
        { icon: '🧘', text: 'Practice stress-reduction techniques daily' },
        { icon: '📅', text: 'Schedule mandatory rest days' },
        { icon: '💬', text: 'Consider speaking with a counselor or advisor' },
        { icon: '⚖️', text: 'Reduce non-essential commitments' }
      ]
    } else if (risk === 'Medium') {
      return [
        { icon: '👀', text: 'Monitor your stress levels closely' },
        { icon: '😴', text: 'Ensure adequate sleep (7+ hours)' },
        { icon: '⏸️', text: 'Take regular breaks during study sessions' },
        { icon: '📊', text: 'Maintain a balanced schedule' }
      ]
    } else {
      return [
        { icon: '✅', text: 'Maintain your current healthy balance' },
        { icon: '😴', text: 'Continue prioritizing sleep and rest' },
        { icon: '📈', text: 'Keep monitoring your stress levels' },
        { icon: '🔄', text: 'Stay consistent with your routine' }
      ]
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Burnout Risk Analysis</h2>
        <p className="text-gray-600">
          Based on your recent activity patterns and lifestyle data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Level Card */}
        <div className={`card p-8 border-2 ${getRiskColor(prediction.burnoutRisk)} animate-scale-in`}>
          <div className="text-sm font-semibold mb-3 uppercase tracking-wide">Current Risk Level</div>
          <div className="text-5xl font-bold mb-3">{prediction.burnoutRisk}</div>
          <div className="text-sm opacity-75">
            {prediction.burnoutRisk === 'High' && '⚠️ Immediate attention recommended'}
            {prediction.burnoutRisk === 'Medium' && '👀 Monitor closely'}
            {prediction.burnoutRisk === 'Low' && '✨ You\'re doing well!'}
          </div>
        </div>

        {/* Gauge Visualization */}
        <div className="card p-8 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <BurnoutGauge risk={prediction.burnoutRisk} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">💡</span>
          Personalized Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getRecommendations(prediction.burnoutRisk).map((rec, index) => (
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

export default BurnoutPredictionTab
