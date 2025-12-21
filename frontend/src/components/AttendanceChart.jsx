import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AttendanceChart = ({ history }) => {
  // Process history data for the last 7 entries
  const chartData = history
    .slice(-7)
    .map((entry, index) => ({
      day: `Day ${index + 1}`,
      attendance: entry.attendancePercentage
    }))

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No attendance data available yet. Submit your daily data to see trends.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="attendance" stroke="#4F46E5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default AttendanceChart

