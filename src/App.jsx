import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ToysPage from './pages/ToysPage'
import ToyDetailsPage from './pages/ToyDetailsPage'
import NewToyPage from './pages/NewToyPage'
import EditToyPage from './pages/EditToyPage'
import OrdersPage from './pages/OrdersPage'
import NewOrderPage from './pages/NewOrderPage'
import EditOrderPage from './pages/EditOrderPage'
import ElvesPage from './pages/ElvesPage'
import ElfProfilePage from './pages/ElfProfilePage'
import NewElfPage from './pages/NewElfPage'
import EditElfPage from './pages/EditElfPage'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/toys" element={<Layout><ToysPage /></Layout>} />
                <Route path="/toys/new" element={<Layout><NewToyPage /></Layout>} />
                <Route path="/toys/:toyId" element={<Layout><ToyDetailsPage /></Layout>} />
                <Route path="/toys/:toyId/edit" element={<Layout><ProtectedRoute requireAdmin><EditToyPage /></ProtectedRoute></Layout>} />
                <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
                <Route path="/orders/new" element={<Layout><NewOrderPage /></Layout>} />
                <Route path="/orders/:orderId/edit" element={<Layout><ProtectedRoute requireAdmin><EditOrderPage /></ProtectedRoute></Layout>} />
                <Route path="/elves" element={<Layout><ElvesPage /></Layout>} />
                <Route path="/elves/new" element={<Layout><ProtectedRoute requireAdmin><NewElfPage /></ProtectedRoute></Layout>} />
                <Route path="/elves/:elfId" element={<Layout><ElfProfilePage /></Layout>} />
                <Route path="/elves/:elfId/edit" element={<Layout><ProtectedRoute requireAdmin><EditElfPage /></ProtectedRoute></Layout>} />
                <Route path="/elves/:elfId/tasks" element={<Layout><ElfProfilePage /></Layout>} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
