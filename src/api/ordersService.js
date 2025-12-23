import { 
  collection, 
  getDocs, 
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

export const ordersService = {
  getAll: async () => {
    try {
      const ordersCollection = collection(db, 'orders')
      const ordersSnapshot = await getDocs(ordersCollection)
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return orders
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw new Error('Failed to fetch orders')
    }
  },

  getById: async (id) => {
    try {
      const orderDoc = doc(db, 'orders', id)
      const orderSnapshot = await getDoc(orderDoc)
      
      if (!orderSnapshot.exists()) {
        throw new Error('Order not found')
      }
      
      return {
        id: orderSnapshot.id,
        ...orderSnapshot.data()
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      throw new Error('Failed to fetch order')
    }
  },

  create: async (orderData) => {
    try {
      const ordersCollection = collection(db, 'orders')
      const newOrder = {
        ...orderData,
        status: 'Pending',
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(ordersCollection, newOrder)
      return {
        id: docRef.id,
        ...newOrder
      }
    } catch (error) {
      console.error('Error creating order:', error)
      throw new Error('Failed to create order')
    }
  },

  update: async (id, orderData) => {
    try {
      const orderDoc = doc(db, 'orders', id)
      await updateDoc(orderDoc, orderData)
      
      const updatedSnapshot = await getDoc(orderDoc)
      return {
        id: updatedSnapshot.id,
        ...updatedSnapshot.data()
      }
    } catch (error) {
      console.error('Error updating order:', error)
      throw new Error('Failed to update order')
    }
  },

  delete: async (id) => {
    try {
      const orderDoc = doc(db, 'orders', id)
      await deleteDoc(orderDoc)
      return true
    } catch (error) {
      console.error('Error deleting order:', error)
      throw new Error('Failed to delete order')
    }
  }
}
