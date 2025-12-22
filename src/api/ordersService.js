import { 
  collection, 
  getDocs, 
  addDoc,
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
  }
}
