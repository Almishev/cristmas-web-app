import { useTheme } from '../../context/ThemeContext'
import Navigation from './Navigation'
import Footer from './Footer'

const Layout = ({ children }) => {
  const { theme } = useTheme()

  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors ${
        theme === 'dark' 
          ? 'bg-gray-900 text-gray-100' 
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
