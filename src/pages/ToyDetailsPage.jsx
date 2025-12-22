import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toysService } from '../api/toysService'
import { useData } from '../context/DataContext'

const ToyDetailsPage = () => {
  const { toyId } = useParams()
  const navigate = useNavigate()
  const { toys, setToys } = useData()
  const [toy, setToy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchToy = async () => {
      try {
        const foundToy = toys.find(t => t.id === toyId)
        if (foundToy) {
          setToy(foundToy)
          setLoading(false)
        } else {
          const data = await toysService.getById(toyId)
          setToy(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching toy:', error)
        setLoading(false)
      }
    }
    fetchToy()
  }, [toyId, toys])

  const handleToggleStock = async () => {
    setUpdating(true)
    
    const updatedToy = { ...toy, inStock: !toy.inStock }
    setToy(updatedToy)
    
    setToys(prevToys => 
      prevToys.map(t => t.id === toyId ? updatedToy : t)
    )

    try {
      await toysService.toggleStock(toyId)
    } catch (error) {
      console.error('Error toggling stock:', error)
      setToy(toy)
      setToys(prevToys => 
        prevToys.map(t => t.id === toyId ? toy : t)
      )
      alert('Failed to update stock. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }
  
  if (!toy) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600 dark:text-gray-400">Toy not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/toys')}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        ← Back
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{toy.name}</h1>
        
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">ID:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{toy.id}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Category:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{toy.category}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Difficulty:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{toy.difficulty}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">In Stock:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
              toy.inStock 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {toy.inStock ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleToggleStock}
          disabled={updating}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {updating ? 'Updating...' : `Toggle Stock (${toy.inStock ? 'Out' : 'In'})`}
        </button>
      </div>
    </div>
  )
}

export default ToyDetailsPage
