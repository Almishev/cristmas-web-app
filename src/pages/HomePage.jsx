import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import CountdownWidget from '../components/common/CountdownWidget'
import NoticeBoard from '../components/common/NoticeBoard'

const HomePage = () => {
  const { toys, orders, elves, loading } = useData()
  const { theme } = useTheme()

  if (loading.toys || loading.orders || loading.elves) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</div>
      </div>
    )
  }

  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const activeElves = elves.filter(e => e.energy > 0).length

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Santa's Workshop Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6 border-l-4 border-blue-500`}>
          <h3 className={`text-base md:text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Toys</h3>
          <p className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{toys.length}</p>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6 border-l-4 border-yellow-500`}>
          <h3 className={`text-base md:text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pending Orders</h3>
          <p className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{pendingOrders}</p>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6 border-l-4 border-green-500`}>
          <h3 className={`text-base md:text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Active Elves</h3>
          <p className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{activeElves}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CountdownWidget />
        <NoticeBoard />
      </div>
    </div>
  )
}

export default HomePage
