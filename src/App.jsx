import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import ToysPage from './pages/ToysPage'
import ToyDetailsPage from './pages/ToyDetailsPage'
import NewToyPage from './pages/NewToyPage'
import OrdersPage from './pages/OrdersPage'
import NewOrderPage from './pages/NewOrderPage'
import ElvesPage from './pages/ElvesPage'
import ElfProfilePage from './pages/ElfProfilePage'
import NewElfPage from './pages/NewElfPage'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/toys" element={<ToysPage />} />
                <Route path="/toys/new" element={<NewToyPage />} />
                <Route path="/toys/:toyId" element={<ToyDetailsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/new" element={<NewOrderPage />} />
                <Route path="/elves" element={<ElvesPage />} />
                <Route path="/elves/new" element={<NewElfPage />} />
                <Route path="/elves/:elfId" element={<ElfProfilePage />} />
                <Route path="/elves/:elfId/tasks" element={<ElfProfilePage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ErrorBoundary>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App
