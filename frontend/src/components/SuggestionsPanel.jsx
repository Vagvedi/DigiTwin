const SuggestionsPanel = ({ predictions }) => {
  if (!predictions) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
        <div className="text-gray-500 text-sm">
          Submit your daily data to get personalized recommendations.
        </div>
      </div>
    )
  }

  const suggestions = []

  // Burnout suggestions
  if (predictions.burnoutRisk === 'High') {
    suggestions.push({
      icon: '🔥',
      title: 'High Burnout Risk',
      text: 'Consider taking breaks, reducing study hours, and prioritizing sleep. Schedule rest days.'
    })
  } else if (predictions.burnoutRisk === 'Medium') {
    suggestions.push({
      icon: '⚡',
      title: 'Moderate Burnout Risk',
      text: 'Monitor your stress levels. Ensure adequate sleep and maintain work-life balance.'
    })
  }

  // Attendance suggestions
  if (predictions.attendanceRisk > 60) {
    suggestions.push({
      icon: '📊',
      title: 'Attendance Alert',
      text: 'Your attendance is at risk. Focus on attending classes regularly to maintain good standing.'
    })
  } else if (predictions.attendanceRisk > 30) {
    suggestions.push({
      icon: '📈',
      title: 'Attendance Warning',
      text: 'Monitor your attendance patterns. Consider setting reminders for classes.'
    })
  }

  // Exam performance suggestions
  if (predictions.examPerformance < 60) {
    suggestions.push({
      icon: '📚',
      title: 'Study Plan Needed',
      text: 'Your predicted performance is low. Increase study hours and focus on weak areas. Consider seeking help.'
    })
  } else if (predictions.examPerformance < 75) {
    suggestions.push({
      icon: '🎯',
      title: 'Improvement Opportunity',
      text: 'You can improve your performance. Review study materials regularly and practice more.'
    })
  }

  if (suggestions.length === 0) {
    suggestions.push({
      icon: '✅',
      title: 'All Good!',
      text: 'You\'re on track! Keep maintaining your current routine.'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <div className="flex items-start">
              <span className="text-2xl mr-3">{suggestion.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{suggestion.title}</div>
                <div className="text-sm text-gray-600 mt-1">{suggestion.text}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuggestionsPanel

