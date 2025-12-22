import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

const OrdersPage = () => {
  const { orders, loading } = useData()
  const { theme } = useTheme()
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredOrders = useMemo(() => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Orders</h1>
        <Link to="/orders/new">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Create New Order
          </button>
        </Link>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Packed', 'Shipped'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded transition-colors ${
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

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>ID</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Child Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Country</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
