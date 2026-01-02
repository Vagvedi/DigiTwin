import { useState, useEffect, useRef } from 'react'

const FocusModeTab = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(25)
  const [sessionType, setSessionType] = useState('focus') // 'focus' or 'break'
  const intervalRef = useRef(null)

  const durations = [
    { minutes: 5, label: 'Quick Break', type: 'break' },
    { minutes: 15, label: 'Short Focus', type: 'focus' },
    { minutes: 25, label: 'Pomodoro', type: 'focus' },
    { minutes: 45, label: 'Deep Work', type: 'focus' },
    { minutes: 60, label: 'Extended', type: 'focus' }
  ]

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsPaused(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, isPaused])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(selectedDuration * 60)
  }

  const handleDurationSelect = (minutes, type) => {
    setSelectedDuration(minutes)
    setSessionType(type)
    setTimeLeft(minutes * 60)
    setIsRunning(false)
    setIsPaused(false)
  }

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100
  const isComplete = timeLeft === 0

  const getMotivationalMessage = () => {
    if (isComplete) {
      return sessionType === 'focus' 
        ? "🎉 Great work! Take a well-deserved break."
        : "✨ Break complete! Ready to focus again?"
    }
    if (isRunning && !isPaused) {
      return sessionType === 'focus'
        ? "💪 Stay focused. You've got this!"
        : "😌 Take this time to recharge."
    }
    if (isPaused) {
      return "⏸️ Paused. Ready to continue?"
    }
    return sessionType === 'focus'
      ? "🎯 Choose a duration and start your focus session"
      : "🧘 Choose a break duration to recharge"
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Focus Mode</h2>
        <p className="text-gray-600">
          Take a mindful break or dive into deep focus with our concentration timer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <div className="card p-12 bg-gradient-to-br from-accent-50 via-primary-50 to-accent-50 border-2 border-accent-200">
            {/* Timer Circle */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="transform -rotate-90 w-64 h-64">
                {/* Background Circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                {/* Progress Circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className={`transition-all duration-1000 ${
                    sessionType === 'focus' ? 'text-primary-600' : 'text-accent-600'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-5xl font-bold mb-2 ${
                    sessionType === 'focus' ? 'text-primary-700' : 'text-accent-700'
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {sessionType === 'focus' ? 'Focus Time' : 'Break Time'}
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 font-medium animate-pulse-slow">
                {getMotivationalMessage()}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  ▶️ Start
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePause}
                    className="btn-secondary px-8 py-4 text-lg"
                  >
                    {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    🔄 Reset
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Duration Selector */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Session Duration</h3>
            <div className="space-y-3">
              {durations.map((duration) => (
                <button
                  key={duration.minutes}
                  onClick={() => handleDurationSelect(duration.minutes, duration.type)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedDuration === duration.minutes
                      ? duration.type === 'focus'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{duration.label}</div>
                      <div className="text-sm opacity-75">{duration.minutes} minutes</div>
                    </div>
                    <span className="text-xl">
                      {duration.type === 'focus' ? '🎯' : '🧘'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="card p-6 bg-gradient-to-br from-success-50 to-primary-50 border border-success-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Tips for Success
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Eliminate distractions during focus sessions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Take breaks to maintain productivity</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Stay hydrated and comfortable</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use breaks for light movement or meditation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-6 card p-6 bg-gradient-to-r from-success-100 to-primary-100 border-2 border-success-300 animate-scale-in">
          <div className="text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Session Complete!</h3>
            <p className="text-gray-700">
              {sessionType === 'focus' 
                ? "Great job staying focused! Consider taking a short break now."
                : "Break complete! Ready to get back to work?"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FocusModeTab

