import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { elvesService } from '../api/elvesService'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { validateElf } from '../utils/validators'

const EditElfPage = () => {
  const { elfId } = useParams()
  const navigate = useNavigate()
  const { elves, refreshElves } = useData()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    energy: 50
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadElf = async () => {
      try {
        const foundElf = elves.find(e => e.id === elfId)
        if (foundElf) {
          setFormData({
            name: foundElf.name || '',
            role: foundElf.role || '',
            energy: foundElf.energy !== undefined ? foundElf.energy : 50
          })
          setLoading(false)
        } else {
          const data = await elvesService.getById(elfId)
          setFormData({
            name: data.name || '',
            role: data.role || '',
            energy: data.energy !== undefined ? data.energy : 50
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading elf:', error)
        alert('Failed to load elf. Redirecting...')
        navigate('/elves')
      }
    }
    loadElf()
  }, [elfId, elves, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'energy' ? parseInt(value) || 0 : value 
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateElf(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await elvesService.update(elfId, formData)
      await refreshElves()
      navigate(`/elves/${elfId}`)
    } catch (error) {
      console.error('Error updating elf:', error)
      alert('Failed to update elf. Please try again.')
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
      <h1 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Edit Elf</h1>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Elf Name *
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
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Toy Maker, Quality Control, Packaging"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.role 
                  ? 'border-red-500' 
                  : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.role && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.role}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Energy (0-100) *
            </label>
            <input
              type="number"
              name="energy"
              value={formData.energy}
              onChange={handleChange}
              min="0"
              max="100"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.energy 
                  ? 'border-red-500' 
                  : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.energy && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.energy}</p>
            )}
            <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Current energy level: {formData.energy}/100
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Updating...' : 'Update Elf'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/elves/${elfId}`)}
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

export default EditElfPage

