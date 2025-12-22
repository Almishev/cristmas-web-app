import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const Navigation = () => {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-blue-300 transition-colors">
            🎅 Santa's Workshop
          </Link>
          
          <ul className="flex gap-6 items-center">
            <li>
              <Link 
                to="/" 
                className={`px-4 py-2 rounded transition-colors ${
                  isActive('/') && location.pathname === '/' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/toys" 
                className={`px-4 py-2 rounded transition-colors ${
                  isActive('/toys') 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Toys
              </Link>
            </li>
            <li>
              <Link 
                to="/orders" 
                className={`px-4 py-2 rounded transition-colors ${
                  isActive('/orders') 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/elves" 
                className={`px-4 py-2 rounded transition-colors ${
                  isActive('/elves') 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Elves
              </Link>
            </li>
            <li>
              <button 
                className="px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-gray-900 transition-colors text-xl"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
