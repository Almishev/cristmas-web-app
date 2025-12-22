import { useCountdown } from '../../hooks/useCountdown'
import { useTheme } from '../../context/ThemeContext'

const CountdownWidget = () => {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()
  const christmasDate = new Date(currentYear, 11, 25).toISOString()
  const { days, hours, minutes, seconds } = useCountdown(christmasDate)

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 border-2 border-red-500`}>
      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Countdown to Christmas</h3>
      <div className={`text-2xl font-mono ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
        {days}d {hours}h {minutes}m {seconds}s
      </div>
    </div>
  )
}

export default CountdownWidget
