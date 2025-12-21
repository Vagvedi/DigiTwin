const AlertsPanel = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Alerts</h2>
        <div className="text-gray-500 text-sm">No alerts at this time.</div>
      </div>
    )
  }

  const getAlertColor = (type) => {
    if (type === 'warning') return 'bg-yellow-50 border-yellow-200'
    if (type === 'danger') return 'bg-red-50 border-red-200'
    return 'bg-blue-50 border-blue-200'
  }

  const getIcon = (type) => {
    if (type === 'warning') return '⚠️'
    if (type === 'danger') return '🚨'
    return 'ℹ️'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Alerts</h2>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start">
              <span className="text-2xl mr-3">{getIcon(alert.type)}</span>
              <div>
                <div className="font-medium text-gray-900">{alert.title}</div>
                <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPanel

