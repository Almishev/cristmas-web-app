import { createContext, useContext, useState, useEffect } from 'react'
import { toysService } from '../api/toysService'
import { ordersService } from '../api/ordersService'
import { elvesService } from '../api/elvesService'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [toys, setToys] = useState([])
  const [orders, setOrders] = useState([])
  const [elves, setElves] = useState([])
  const [loading, setLoading] = useState({ toys: true, orders: true, elves: true })
  const [error, setError] = useState({ toys: null, orders: null, elves: null })

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

  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(prev => ({ ...prev, orders: true }))
      setError(prev => ({ ...prev, orders: null }))
      try {
        const data = await ordersService.getAll()
        setOrders(data)
      } catch (err) {
        setError(prev => ({ ...prev, orders: err.message }))
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(prev => ({ ...prev, orders: false }))
      }
    }
    fetchOrders()
  }, [])

  
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
      const data = await ordersService.getAll()
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
