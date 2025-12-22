import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Четем темата от localStorage при инициализация
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme
      }
      return 'light'
    } catch (error) {
      return 'light'
    }
  })

  // Запазваме темата в localStorage при промяна
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  }, [theme])

  const setTheme = (value) => {
    setThemeState(value)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
