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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Daily Data Input</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 7.5"
              value={formData.sleepHours}
              onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendance Percentage
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 85.5"
              value={formData.attendancePercentage}
              onChange={(e) => setFormData({ ...formData, attendancePercentage: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Study Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 4.5"
              value={formData.studyHours}
              onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stress Level (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 6"
              value={formData.stressLevel}
              onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upcoming Deadlines Count
            </label>
            <input
              type="number"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 3"
              value={formData.deadlinesCount}
              onChange={(e) => setFormData({ ...formData, deadlinesCount: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit & Get Predictions'}
        </button>
      </form>
    </div>
  )
}

export default DataInputForm

