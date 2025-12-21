import BurnoutGauge from '../BurnoutGauge'

const BurnoutPredictionTab = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔥</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Burnout Prediction Yet</h3>
        <p className="text-gray-600">
          Submit your daily data to get your first burnout risk prediction.
        </p>
      </div>
    )
  }

  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-green-600 bg-green-50'
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getRecommendations = (risk) => {
    if (risk === 'High') {
      return [
        'Take immediate breaks and reduce study hours',
        'Prioritize 7-8 hours of sleep nightly',
        'Consider speaking with a counselor or advisor',
        'Schedule rest days and avoid overcommitting',
        'Practice stress-reduction techniques (meditation, exercise)'
      ]
    } else if (risk === 'Medium') {
      return [
        'Monitor your stress levels closely',
        'Ensure adequate sleep (7+ hours)',
        'Take regular breaks during study sessions',
        'Maintain a balanced schedule',
        'Consider reducing non-essential commitments'
      ]
    } else {
      return [
        'Maintain your current healthy balance',
        'Continue prioritizing sleep and rest',
        'Keep monitoring your stress levels',
        'Stay consistent with your routine'
      ]
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Burnout Risk Prediction</h2>
        <p className="text-gray-600">
          Based on your recent activity patterns and lifestyle data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Level Card */}
        <div className={`rounded-lg p-6 ${getRiskColor(prediction.burnoutRisk)}`}>
          <div className="text-sm font-medium mb-2">Current Risk Level</div>
          <div className="text-4xl font-bold mb-2">{prediction.burnoutRisk}</div>
          <div className="text-sm opacity-75">
            {prediction.burnoutRisk === 'High' && 'Immediate attention recommended'}
            {prediction.burnoutRisk === 'Medium' && 'Monitor closely'}
            {prediction.burnoutRisk === 'Low' && 'You\'re doing well!'}
          </div>
        </div>

        {/* Gauge Visualization */}
        <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
          <BurnoutGauge risk={prediction.burnoutRisk} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <ul className="space-y-2">
          {getRecommendations(prediction.burnoutRisk).map((rec, index) => (
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

export default BurnoutPredictionTab

