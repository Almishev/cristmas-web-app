import { useTheme } from '../../context/ThemeContext'

const NoticeBoard = () => {
  const { theme } = useTheme()
  const notices = [
    'Workshop will be closed on Dec 25th',
    'New toy delivery expected tomorrow',
    'Elf training session at 2 PM',
    'Remember to check stock levels daily',
    'Holiday bonus announced!'
  ]

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 border-2 border-green-500`}>
      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Workshop Notice Board</h3>
      <ul className="space-y-2">
        {notices.map((notice, index) => (
          <li key={index} className={`border-l-4 border-green-500 pl-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {notice}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NoticeBoard
