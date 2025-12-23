import { createContext, useContext, useState, useEffect } from 'react'
import { toysService } from '../api/toysService'
import { ordersService } from '../api/ordersService'
import { elvesService } from '../api/elvesService'
import { auth, db } from '../api/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getSessionId } from '../utils/sessionStorage'
import { doc, getDoc } from 'firebase/firestore'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [toys, setToys] = useState([])
  const [orders, setOrders] = useState([])
  const [elves, setElves] = useState([])
  const [loading, setLoading] = useState({ toys: true, orders: true, elves: true })
  const [error, setError] = useState({ toys: null, orders: null, elves: null })
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchToys = async () => {
      setLoading(prev => ({ ...prev, toys: true }))
      setError(prev => ({ ...prev, toys: null }))
      try {
        const data = await toysService.getAll()
        setToys(data)
      } catch (err) {
        setError(prev => ({ ...prev, toys: err.message }))
        console.error('Error fetching toys:', err)
      } finally {
        setLoading(prev => ({ ...prev, toys: false }))
      }
    }
    fetchToys()
  }, [])

  
  // Слушаме за промени в authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        // Зареждаме ролята на потребителя
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === 'admin')
          } else {
            setIsAdmin(false)
          }
        } catch (err) {
          console.error('Error loading user role:', err)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(prev => ({ ...prev, orders: true }))
      setError(prev => ({ ...prev, orders: null }))
      try {
        // Ако има логнат потребител, използваме userId, иначе sessionId
        const userId = currentUser?.uid || null
        const sessionId = currentUser ? null : getSessionId()
        const data = await ordersService.getAll(userId, isAdmin, sessionId)
        setOrders(data)
      } catch (err) {
        setError(prev => ({ ...prev, orders: err.message }))
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(prev => ({ ...prev, orders: false }))
      }
    }
    fetchOrders()
  }, [currentUser, isAdmin])

  
  useEffect(() => {
    const fetchElves = async () => {
      setLoading(prev => ({ ...prev, elves: true }))
      setError(prev => ({ ...prev, elves: null }))
      try {
        const data = await elvesService.getAll()
        setElves(data)
      } catch (err) {
        setError(prev => ({ ...prev, elves: err.message }))
        console.error('Error fetching elves:', err)
      } finally {
        setLoading(prev => ({ ...prev, elves: false }))
      }
    }
    fetchElves()
  }, [])

  
  const refreshToys = async () => {
    setLoading(prev => ({ ...prev, toys: true }))
    try {
      const data = await toysService.getAll()
      setToys(data)
    } catch (err) {
      setError(prev => ({ ...prev, toys: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, toys: false }))
    }
  }

  const refreshOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }))
    try {
      // Ако има логнат потребител, използваме userId, иначе sessionId
      const userId = currentUser?.uid || null
      const sessionId = currentUser ? null : getSessionId()
      const data = await ordersService.getAll(userId, isAdmin, sessionId)
      setOrders(data)
    } catch (err) {
      setError(prev => ({ ...prev, orders: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, orders: false }))
    }
  }

  const refreshElves = async () => {
    setLoading(prev => ({ ...prev, elves: true }))
    try {
      const data = await elvesService.getAll()
      setElves(data)
    } catch (err) {
      setError(prev => ({ ...prev, elves: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, elves: false }))
    }
  }

  const value = {
    toys,
    setToys,
    orders,
    setOrders,
    elves,
    setElves,
    loading,
    error,
    refreshToys,
    refreshOrders,
    refreshElves
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
