// Helper функции за теми
export const getThemeClasses = (theme, lightClass, darkClass) => {
  return theme === 'dark' ? darkClass : lightClass
}

export const getBgClass = (theme) => {
  return theme === 'dark' ? 'bg-gray-800' : 'bg-white'
}

export const getTextClass = (theme) => {
  return theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
}

export const getTextSecondaryClass = (theme) => {
  return theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
}

