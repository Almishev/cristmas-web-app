import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc,
  addDoc
} from 'firebase/firestore'
import { db } from './firebase'

export const toysService = {
  getAll: async () => {
    try {
      const toysCollection = collection(db, 'toys')
      const toysSnapshot = await getDocs(toysCollection)
      const toys = toysSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return toys
    } catch (error) {
      console.error('Error fetching toys:', error)
      throw new Error('Failed to fetch toys')
    }
  },

  getById: async (id) => {
    try {
      const toyDoc = doc(db, 'toys', id)
      const toySnapshot = await getDoc(toyDoc)
      
      if (!toySnapshot.exists()) {
        throw new Error('Toy not found')
      }
      
      return {
        id: toySnapshot.id,
        ...toySnapshot.data()
      }
    } catch (error) {
      console.error('Error fetching toy:', error)
      throw new Error('Failed to fetch toy')
    }
  },

  create: async (toyData) => {
    try {
      const toysCollection = collection(db, 'toys')
      const docRef = await addDoc(toysCollection, {
        ...toyData,
        inStock: toyData.inStock !== undefined ? toyData.inStock : true
      })
      return {
        id: docRef.id,
        ...toyData,
        inStock: toyData.inStock !== undefined ? toyData.inStock : true
      }
    } catch (error) {
      console.error('Error creating toy:', error)
      throw new Error('Failed to create toy')
    }
  },

  toggleStock: async (id) => {
    try {
      const toyDoc = doc(db, 'toys', id)
      const toySnapshot = await getDoc(toyDoc)
      
      if (!toySnapshot.exists()) {
        throw new Error('Toy not found')
      }
      
      const currentStock = toySnapshot.data().inStock
      await updateDoc(toyDoc, {
        inStock: !currentStock
      })
      
      return {
        id: toySnapshot.id,
        ...toySnapshot.data(),
        inStock: !currentStock
      }
    } catch (error) {
      console.error('Error toggling stock:', error)
      throw new Error('Failed to toggle stock')
    }
  }
}
