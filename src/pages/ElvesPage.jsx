import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { elvesService } from '../api/elvesService'

const ElvesPage = () => {
  const { elves, loading, error, refreshElves } = useData()
  const { theme } = useTheme()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this elf?')) {
      return
    }

    setDeleting(id)
    try {
      await elvesService.delete(id)
      await refreshElves()
    } catch (error) {
      console.error('Error deleting elf:', error)
      alert('Failed to delete elf. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading.elves) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading elves...</div>
      </div>
    )
  }

  if (error.elves) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className={`text-xl font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          Error loading elves
        </div>
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {error.elves}
        </div>
        <button
          onClick={refreshElves}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (elves.length === 0) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Elves</h1>
          {isAdmin() && (
            <Link to="/elves/new">
              <button className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm md:text-base">
                Create New Elf
              </button>
            </Link>
          )}
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No elves found. {isAdmin() && 'Create your first elf!'}
          </p>
        </div>
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Elves</h1>
        {isAdmin() && (
          <Link to="/elves/new">
            <button className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm md:text-base">
              Create New Elf
            </button>
          </Link>
        )}
      </div>
      
      {/* Desktop Table View */}
      <div className={`hidden md:block ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Role</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Energy</th>
                {isAdmin() && (
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                )}
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
                  {isAdmin() && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/elves/${elf.id}/edit`)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            theme === 'dark' 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(elf.id)}
                          disabled={deleting === elf.id}
                          className={`px-3 py-1 text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            theme === 'dark' 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {deleting === elf.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {elves.map(elf => (
          <div 
            key={elf.id} 
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 space-y-3`}
          >
            <div className="flex justify-between items-start">
              <Link 
                to={`/elves/${elf.id}`}
                className={`font-semibold text-base ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
              >
                {elf.name}
              </Link>
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Role: {elf.role}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Energy</span>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{elf.energy}/100</span>
              </div>
              <div className={`w-full rounded-full h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-3 rounded-full ${getEnergyColor(elf.energy)}`}
                  style={{ width: `${elf.energy}%` }}
                ></div>
              </div>
            </div>
            {isAdmin() && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/elves/${elf.id}/edit`)}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                    theme === 'dark' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(elf.id)}
                  disabled={deleting === elf.id}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {deleting === elf.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ElvesPage
