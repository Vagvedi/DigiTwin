import { useState } from 'react'

const DataInputForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    sleepHours: '',
    attendancePercentage: '',
    studyHours: '',
    stressLevel: '',
    deadlinesCount: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      sleepHours: parseFloat(formData.sleepHours),
      attendancePercentage: parseFloat(formData.attendancePercentage),
      studyHours: parseFloat(formData.studyHours),
      stressLevel: parseFloat(formData.stressLevel),
      deadlinesCount: parseInt(formData.deadlinesCount)
    }
    onSubmit(data)
    // Reset form
    setFormData({
      sleepHours: '',
      attendancePercentage: '',
      studyHours: '',
      stressLevel: '',
      deadlinesCount: ''
    })
  }

  const fields = [
    {
      name: 'sleepHours',
      label: 'Sleep Hours',
      icon: '😴',
      type: 'number',
      step: '0.5',
      min: '0',
      max: '24',
      placeholder: 'e.g., 7.5'
    },
    {
      name: 'attendancePercentage',
      label: 'Attendance %',
      icon: '📊',
      type: 'number',
      step: '0.1',
      min: '0',
      max: '100',
      placeholder: 'e.g., 85.5'
    },
    {
      name: 'studyHours',
      label: 'Study Hours',
      icon: '📚',
      type: 'number',
      step: '0.5',
      min: '0',
      max: '24',
      placeholder: 'e.g., 4.5'
    },
    {
      name: 'stressLevel',
      label: 'Stress Level',
      icon: '😰',
      type: 'number',
      min: '1',
      max: '10',
      placeholder: '1-10'
    },
    {
      name: 'deadlinesCount',
      label: 'Deadlines',
      icon: '📅',
      type: 'number',
      min: '0',
      placeholder: 'e.g., 3'
    }
  ]

  return (
    <div className="card p-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="mr-3 text-3xl">📝</span>
          Daily Data Input
        </h2>
        <p className="text-gray-600">Enter your daily metrics to get personalized predictions</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {fields.map((field) => (
            <div key={field.name} className="animate-slide-up" style={{ animationDelay: `${fields.indexOf(field) * 50}ms` }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2 text-lg">{field.icon}</span>
                {field.label}
              </label>
              <input
                type={field.type}
                step={field.step}
                min={field.min}
                max={field.max}
                required
                className="input-field"
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            '✨ Submit & Get Predictions'
          )}
        </button>
      </form>
    </div>
  )
}

export default DataInputForm
