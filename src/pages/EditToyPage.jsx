import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toysService } from '../api/toysService'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { validateToy } from '../utils/validators'

const EditToyPage = () => {
  const { toyId } = useParams()
  const navigate = useNavigate()
  const { toys, refreshToys } = useData()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    difficulty: 'Easy',
    inStock: true
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadToy = async () => {
      try {
        const foundToy = toys.find(t => t.id === toyId)
        if (foundToy) {
          setFormData({
            name: foundToy.name || '',
            category: foundToy.category || '',
            difficulty: foundToy.difficulty || 'Easy',
            inStock: foundToy.inStock !== undefined ? foundToy.inStock : true
          })
          setLoading(false)
        } else {
          const data = await toysService.getById(toyId)
          setFormData({
            name: data.name || '',
            category: data.category || '',
            difficulty: data.difficulty || 'Easy',
            inStock: data.inStock !== undefined ? data.inStock : true
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading toy:', error)
        alert('Failed to load toy. Redirecting...')
        navigate('/toys')
      }
    }
    loadToy()
  }, [toyId, toys, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateToy(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await toysService.update(toyId, formData)
      await refreshToys()
      navigate(`/toys/${toyId}`)
    } catch (error) {
      console.error('Error updating toy:', error)
      alert('Failed to update toy. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Edit Toy</h1>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Toy Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name 
                  ? 'border-red-500' 
                  : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.name && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.name}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category 
                  ? 'border-red-500' 
                  : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.category && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.category}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty *
            </label>
            <select 
              name="difficulty" 
              value={formData.difficulty} 
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              In Stock
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Updating...' : 'Update Toy'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/toys/${toyId}`)}
              className={`w-full sm:w-auto px-4 md:px-6 py-2 rounded transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditToyPage

