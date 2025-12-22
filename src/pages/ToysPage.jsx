import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'

const ToysPage = () => {
  const { toys, loading } = useData()
  const { theme } = useTheme()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [inStockFilter, setInStockFilter] = useState(false)
  const [sortBy, setSortBy] = useState('name')

  const categories = useMemo(() => {
    return [...new Set(toys.map(t => t.category))]
  }, [toys])

  const filteredAndSorted = useMemo(() => {
    let filtered = toys

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter)
    }

    if (inStockFilter) {
      filtered = filtered.filter(t => t.inStock)
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 }
        return order[a.difficulty] - order[b.difficulty]
      }
      return 0
    })
  }, [toys, categoryFilter, inStockFilter, sortBy])

  if (loading.toys) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading toys...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Toys</h1>
        <Link to="/toys/new">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Create New Toy
          </button>
        </Link>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center`}>
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`px-4 py-2 border rounded ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'}`}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className={`flex items-center gap-2 cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <input
            type="checkbox"
            checked={inStockFilter}
            onChange={(e) => setInStockFilter(e.target.checked)}
            className="w-4 h-4"
          />
          In Stock Only
        </label>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className={`px-4 py-2 border rounded ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'}`}
        >
          <option value="name">Sort by Name</option>
          <option value="difficulty">Sort by Difficulty</option>
        </select>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>ID</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Difficulty</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>In Stock</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              {filteredAndSorted.map(toy => (
                <tr key={toy.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{toy.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link 
                      to={`/toys/${toy.id}`}
                      className={`font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      {toy.name}
                    </Link>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{toy.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{toy.difficulty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      toy.inStock 
                        ? (theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                        : (theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                    }`}>
                      {toy.inStock ? 'Yes' : 'No'}
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

export default ToysPage
