const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">&copy; {currentYear} Santa's Workshop. All rights reserved.</p>
        <p className="text-gray-400">Made with ❤️ for Christmas</p>
      </div>
    </footer>
  )
}

export default Footer
