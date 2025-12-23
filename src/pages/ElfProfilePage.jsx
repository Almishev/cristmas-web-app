import { useState, useEffect } from 'react'
import { useParams, useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import { elvesService } from '../api/elvesService'
import { useData } from '../context/DataContext'

const ElfProfilePage = () => {
  const { elfId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { elves } = useData()
  const [elf, setElf] = useState(null)
  const [energy, setEnergy] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchElf = async () => {
      try {
        const foundElf = elves.find(e => e.id === elfId)
        if (foundElf) {
          setElf(foundElf)
          setEnergy(foundElf.energy)
        } else {
          const data = await elvesService.getById(elfId)
          setElf(data)
          setEnergy(data.energy)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching elf:', error)
        setLoading(false)
      }
    }
    fetchElf()
  }, [elfId, elves])

  const handleBoostEnergy = () => {
    if (energy < 100) {
      const newEnergy = Math.min(energy + 10, 100)
      setEnergy(newEnergy)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }
  
  if (!elf) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600 dark:text-gray-400">Elf not found</p>
      </div>
    )
  }

  const isTasksPage = location.pathname.includes('/tasks')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/elves')}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        ← Back
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{elf.name}</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Role:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{elf.role}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Energy:</span>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    energy >= 80 ? 'bg-green-500' : 
                    energy >= 50 ? 'bg-yellow-500' : 
                    energy >= 20 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${energy}%` }}
                ></div>
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{energy}/100</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/elves/${elfId}/edit`)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit Elf
          </button>
          <button 
            onClick={handleBoostEnergy}
            disabled={energy >= 100}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Boost Energy (+10)
          </button>
        </div>

        <nav className="mt-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <Link 
            to={`/elves/${elfId}`}
            className={`px-4 py-2 font-medium transition-colors ${
              !isTasksPage
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Profile
          </Link>
          <Link 
            to={`/elves/${elfId}/tasks`}
            className={`px-4 py-2 font-medium transition-colors ${
              isTasksPage
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Tasks
          </Link>
        </nav>

        <div className="mt-6">
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Profile Information</h2>
                <p className="text-gray-700 dark:text-gray-300">More details about {elf.name}...</p>
              </div>
            } />
            <Route path="tasks" element={
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Tasks</h2>
                <p className="text-gray-700 dark:text-gray-300">Tasks for {elf.name} will be listed here...</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default ElfProfilePage
