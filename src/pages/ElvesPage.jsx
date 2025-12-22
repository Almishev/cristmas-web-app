import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

const ElvesPage = () => {
  const { elves, loading } = useData()
  const { theme } = useTheme()

  if (loading.elves) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading elves...</div>
      </div>
    )
  }

  const getEnergyColor = (energy) => {
    if (energy >= 80) return 'bg-green-500'
    if (energy >= 50) return 'bg-yellow-500'
    if (energy >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Elves</h1>
        <Link to="/elves/new">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Create New Elf
          </button>
        </Link>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Role</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Energy</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              {elves.map(elf => (
                <tr key={elf.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link 
                      to={`/elves/${elf.id}`}
                      className={`font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      {elf.name}
                    </Link>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{elf.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-24 rounded-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-2 rounded-full ${getEnergyColor(elf.energy)}`}
                          style={{ width: `${elf.energy}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{elf.energy}/100</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ElvesPage
