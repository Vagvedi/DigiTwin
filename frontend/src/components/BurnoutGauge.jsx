const BurnoutGauge = ({ risk }) => {
  const getRiskValue = (risk) => {
    if (risk === 'Low') return 33
    if (risk === 'Medium') return 66
    return 100
  }

  const getColor = (risk) => {
    if (risk === 'Low') return 'text-green-500'
    if (risk === 'Medium') return 'text-yellow-500'
    return 'text-red-500'
  }

  const value = getRiskValue(risk)
  const circumference = 2 * Math.PI * 90
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-64 h-64">
        <svg className="transform -rotate-90 w-64 h-64">
          <circle
            cx="128"
            cy="128"
            r="90"
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="128"
            cy="128"
            r="90"
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-500 ${getColor(risk)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getColor(risk)}`}>
              {risk}
            </div>
            <div className="text-sm text-gray-500 mt-2">Risk Level</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BurnoutGauge

