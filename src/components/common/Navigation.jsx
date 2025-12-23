import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const Navigation = () => {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold hover:text-blue-300 transition-colors">
            🎅 Santa's Workshop
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-4 lg:gap-6 items-center">
            <li>
              <Link 
                to="/" 
                className={`px-3 lg:px-4 py-2 rounded transition-colors ${
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
                className={`px-3 lg:px-4 py-2 rounded transition-colors ${
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
                className={`px-3 lg:px-4 py-2 rounded transition-colors ${
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
                className={`px-3 lg:px-4 py-2 rounded transition-colors ${
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
                className="px-3 lg:px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-gray-900 transition-colors text-lg lg:text-xl"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              className="px-3 py-2 border-2 border-white rounded hover:bg-white hover:text-gray-900 transition-colors text-lg"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <ul className="md:hidden mt-4 pb-4 space-y-2">
            <li>
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded transition-colors ${
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
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded transition-colors ${
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
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded transition-colors ${
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
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded transition-colors ${
                  isActive('/elves') 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Elves
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Navigation
