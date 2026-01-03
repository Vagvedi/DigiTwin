import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

const WhatIfSimulatorTab = ({ baselinePrediction }) => {
  const [values, setValues] = useState({
    sleepHours: 7,
    studyHours: 5,
    attendancePercentage: 85,
    stressLevel: 5,
    deadlinesCount: 2
  })

  const [simulatedPrediction, setSimulatedPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceTimer = useRef(null)

  // Debounced prediction call
  const fetchSimulatedPrediction = useCallback(async (data) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.post('/api/predict', {
          ...data,
          simulate: true // Flag to indicate simulation mode
        })
        setSimulatedPrediction({
          burnoutRisk: res.data.burnoutRisk,
          attendanceRisk: res.data.attendanceRisk,
          examPerformance: res.data.examPerformance
        })
      } catch (err) {
        setError('Failed to generate simulation. Please try again.')
        console.error('Simulation error:', err)
      } finally {
        setLoading(false)
      }
    }, 500) // 500ms debounce
  }, [])

  // Fetch prediction when values change
  useEffect(() => {
    fetchSimulatedPrediction(values)
    
    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [values, fetchSimulatedPrediction])

  const handleSliderChange = (field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }))
  }

  const getChangeIndicator = (baseline, simulated, type) => {
    if (!baseline || !simulated) return null

    let baselineValue, simulatedValue

    if (type === 'burnout') {
      const baselineNum = baseline.burnoutRisk === 'High' ? 100 : baseline.burnoutRisk === 'Medium' ? 50 : 0
      const simulatedNum = simulated.burnoutRisk === 'High' ? 100 : simulated.burnoutRisk === 'Medium' ? 50 : 0
      baselineValue = baselineNum
      simulatedValue = simulatedNum
    } else if (type === 'attendance') {
      baselineValue = baseline.attendanceRisk
      simulatedValue = simulated.attendanceRisk
    } else {
      baselineValue = baseline.examPerformance
      simulatedValue = simulated.examPerformance
    }

    const diff = simulatedValue - baselineValue
    if (Math.abs(diff) < 0.1) return null

    const isImprovement = type === 'performance' 
      ? diff > 0 
      : type === 'attendance' 
        ? diff < 0 
        : diff < 0

    return {
      diff: Math.abs(diff),
      isImprovement,
      percentage: type === 'burnout' ? null : diff.toFixed(1)
    }
  }

  const sliders = [
    {
      id: 'sleepHours',
      label: 'Sleep Hours',
      icon: '😴',
      min: 0,
      max: 12,
      step: 0.5,
      value: values.sleepHours,
      color: 'primary'
    },
    {
      id: 'studyHours',
      label: 'Study Hours',
      icon: '📚',
      min: 0,
      max: 12,
      step: 0.5,
      value: values.studyHours,
      color: 'success'
    },
    {
      id: 'attendancePercentage',
      label: 'Attendance %',
      icon: '📊',
      min: 0,
      max: 100,
      step: 1,
      value: values.attendancePercentage,
      color: 'warning'
    },
    {
      id: 'stressLevel',
      label: 'Stress Level',
      icon: '😰',
      min: 1,
      max: 10,
      step: 1,
      value: values.stressLevel,
      color: 'danger'
    },
    {
      id: 'deadlinesCount',
      label: 'Deadlines',
      icon: '📅',
      min: 0,
      max: 10,
      step: 1,
      value: values.deadlinesCount,
      color: 'accent'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="mr-3 text-4xl">🔮</span>
              What-If Simulator
            </h2>
            <p className="text-gray-600">
              Adjust the sliders below to see how different habits affect your predictions
            </p>
          </div>
          <div className="px-4 py-2 bg-warning-50 border border-warning-200 rounded-lg">
            <p className="text-sm font-semibold text-warning-800 flex items-center">
              <span className="mr-2">⚠️</span>
              Simulation – No data is saved
            </p>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="card p-8 mb-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <div key={slider.id} className="animate-slide-up" style={{ animationDelay: `${sliders.indexOf(slider) * 50}ms` }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2 text-xl">{slider.icon}</span>
                {slider.label}
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.value}
                    onChange={(e) => handleSliderChange(slider.id, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${
                        slider.color === 'primary' ? '#0ea5e9' :
                        slider.color === 'success' ? '#22c55e' :
                        slider.color === 'warning' ? '#f59e0b' :
                        slider.color === 'danger' ? '#ef4444' :
                        '#d946ef'
                      } 0%, ${
                        slider.color === 'primary' ? '#0ea5e9' :
                        slider.color === 'success' ? '#22c55e' :
                        slider.color === 'warning' ? '#f59e0b' :
                        slider.color === 'danger' ? '#ef4444' :
                        '#d946ef'
                      } ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e5e7eb ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                <div className="w-20 text-center">
                  <span className="text-lg font-bold text-gray-900">
                    {slider.id === 'attendancePercentage' 
                      ? `${slider.value}%`
                      : slider.id === 'sleepHours' || slider.id === 'studyHours'
                        ? `${slider.value}h`
                        : slider.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions Display */}
      {loading && (
        <div className="card p-8 mb-6">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <div className="text-gray-600 font-medium">Calculating predictions...</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="card p-6 mb-6 bg-danger-50 border border-danger-200">
          <p className="text-danger-700">{error}</p>
        </div>
      )}

      {simulatedPrediction && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
          {/* Burnout Risk */}
          <div className="card p-6 border-2">
            {(() => {
              const change = getChangeIndicator(baselinePrediction, simulatedPrediction, 'burnout')
              const riskColor = simulatedPrediction.burnoutRisk === 'High' 
                ? 'border-danger-500 bg-danger-50' 
                : simulatedPrediction.burnoutRisk === 'Medium' 
                  ? 'border-warning-500 bg-warning-50'
                  : 'border-success-500 bg-success-50'
              
              return (
                <div className={`rounded-lg p-6 border-2 ${riskColor} transition-all duration-500`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Burnout Risk</div>
                    {change && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full animate-pulse ${
                        change.isImprovement 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        {change.isImprovement ? '↓' : '↑'} {change.isImprovement ? 'Better' : 'Worse'}
                      </span>
                    )}
                  </div>
                  <div className="text-4xl font-bold mb-2">{simulatedPrediction.burnoutRisk}</div>
                  {baselinePrediction && (
                    <div className="text-xs text-gray-500">
                      Baseline: {baselinePrediction.burnoutRisk}
                    </div>
                  )}
                  {!baselinePrediction && (
                    <div className="text-xs text-gray-400 italic">
                      No baseline available
                    </div>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Attendance Risk */}
          <div className="card p-6 border-2">
            {(() => {
              const change = getChangeIndicator(baselinePrediction, simulatedPrediction, 'attendance')
              const riskLevel = simulatedPrediction.attendanceRisk < 30 
                ? 'border-success-500 bg-success-50'
                : simulatedPrediction.attendanceRisk < 60
                  ? 'border-warning-500 bg-warning-50'
                  : 'border-danger-500 bg-danger-50'
              
              return (
                <div className={`rounded-lg p-6 border-2 ${riskLevel} transition-all duration-500`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Attendance Risk</div>
                    {change && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        change.isImprovement 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        {change.isImprovement ? '↓' : '↑'} {change.percentage}%
                      </span>
                    )}
                  </div>
                  <div className="text-4xl font-bold mb-2">{simulatedPrediction.attendanceRisk.toFixed(1)}%</div>
                  {baselinePrediction && (
                    <div className="text-xs text-gray-500">
                      Baseline: {baselinePrediction.attendanceRisk.toFixed(1)}%
                    </div>
                  )}
                  {!baselinePrediction && (
                    <div className="text-xs text-gray-400 italic">
                      No baseline available
                    </div>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Exam Performance */}
          <div className="card p-6 border-2">
            {(() => {
              const change = getChangeIndicator(baselinePrediction, simulatedPrediction, 'performance')
              const perfLevel = simulatedPrediction.examPerformance >= 80
                ? 'border-success-500 bg-success-50'
                : simulatedPrediction.examPerformance >= 70
                  ? 'border-primary-500 bg-primary-50'
                  : simulatedPrediction.examPerformance >= 60
                    ? 'border-warning-500 bg-warning-50'
                    : 'border-danger-500 bg-danger-50'
              
              return (
                <div className={`rounded-lg p-6 border-2 ${perfLevel} transition-all duration-500`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Exam Performance</div>
                    {change && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        change.isImprovement 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        {change.isImprovement ? '↑' : '↓'} {change.percentage}%
                      </span>
                    )}
                  </div>
                  <div className="text-4xl font-bold mb-2">{simulatedPrediction.examPerformance.toFixed(1)}%</div>
                  {baselinePrediction && (
                    <div className="text-xs text-gray-500">
                      Baseline: {baselinePrediction.examPerformance.toFixed(1)}%
                    </div>
                  )}
                  {!baselinePrediction && (
                    <div className="text-xs text-gray-400 italic">
                      No baseline available
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-6 card p-6 bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
        <div className="flex items-start">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">How to use the simulator</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Adjust any slider to see real-time prediction changes</li>
              <li>• Compare simulated results with your baseline predictions</li>
              <li>• Green indicators show improvements, red shows regressions</li>
              <li>• No data is saved - this is purely for exploration</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default WhatIfSimulatorTab

