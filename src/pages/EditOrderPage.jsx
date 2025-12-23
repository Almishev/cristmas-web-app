import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ordersService } from '../api/ordersService'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { validateOrder } from '../utils/validators'

const EditOrderPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, toys, refreshOrders } = useData()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    childName: '',
    country: '',
    toyId: '',
    priority: 'Normal',
    status: 'Pending'
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const foundOrder = orders.find(o => o.id === orderId)
        if (foundOrder) {
          setFormData({
            childName: foundOrder.childName || '',
            country: foundOrder.country || '',
            toyId: foundOrder.toyId || '',
            priority: foundOrder.priority || 'Normal',
            status: foundOrder.status || 'Pending'
          })
          setLoading(false)
        } else {
          const data = await ordersService.getById(orderId)
          setFormData({
            childName: data.childName || '',
            country: data.country || '',
            toyId: data.toyId || '',
            priority: data.priority || 'Normal',
            status: data.status || 'Pending'
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading order:', error)
        alert('Failed to load order. Redirecting...')
        navigate('/orders')
      }
    }
    loadOrder()
  }, [orderId, orders, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateOrder(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await ordersService.update(orderId, formData)
      await refreshOrders()
      navigate('/orders')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order. Please try again.')
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
      <h1 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Edit Order</h1>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Child Name (min 2 chars) *
            </label>
            <input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.childName 
                  ? 'border-red-500' 
                  : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.childName && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.childName}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.country 
                  ? 'border-red-500' 
                  : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.country && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.country}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Toy *
            </label>
            <select 
              name="toyId" 
              value={formData.toyId} 
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.toyId 
                  ? 'border-red-500' 
                  : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="">Select a toy</option>
              {toys.map(toy => (
                <option key={toy.id} value={toy.id}>{toy.name}</option>
              ))}
            </select>
            {errors.toyId && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.toyId}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Priority
            </label>
            <select 
              name="priority" 
              value={formData.priority} 
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="Pending">Pending</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Updating...' : 'Update Order'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
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

export default EditOrderPage

