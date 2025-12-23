import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { ordersService } from '../api/ordersService'

const OrdersPage = () => {
  const { orders, loading, refreshOrders } = useData()
  const { theme } = useTheme()
  const { isAdmin, user } = useAuth()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('All')
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return
    }

    setDeleting(id)
    try {
      await ordersService.delete(id)
      await refreshOrders()
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const filteredOrders = useMemo(() => {
    // Филтрирането по userId вече се прави в ordersService.getAll()
    // Тук само прилагаме status filter
    if (statusFilter === 'All') {
      return orders
    }
    return orders.filter(order => order.status === statusFilter)
  }, [orders, statusFilter])

  if (loading.orders) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading orders...</div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
      case 'Packed':
        return theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
      case 'Shipped':
        return theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
      default:
        return theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {isAdmin() ? 'Orders' : user ? 'My Orders' : 'Orders'}
        </h1>
        <Link to="/orders/new">
          <button className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm md:text-base">
            Create New Order
          </button>
        </Link>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-3 md:p-4`}>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Packed', 'Shipped'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 md:px-4 py-2 rounded transition-colors text-sm md:text-base ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className={`hidden md:block ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>ID</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Child Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Country</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                {isAdmin() && (
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              {filteredOrders.map(order => (
                <tr key={order.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{order.id}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{order.childName}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{order.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  {isAdmin() && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            theme === 'dark' 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={deleting === order.id}
                          className={`px-3 py-1 text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            theme === 'dark' 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {deleting === order.id ? 'Deleting...' : 'Delete'}
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
        {filteredOrders.map(order => (
          <div 
            key={order.id} 
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 space-y-2`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {order.childName}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {order.country}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              ID: {order.id}
            </p>
            {isAdmin() && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/orders/${order.id}/edit`)}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                    theme === 'dark' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  disabled={deleting === order.id}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {deleting === order.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
