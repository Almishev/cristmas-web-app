import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc,
  addDoc,
  deleteDoc
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

  update: async (id, toyData) => {
    try {
      const toyDoc = doc(db, 'toys', id)
      await updateDoc(toyDoc, toyData)
      
      const updatedSnapshot = await getDoc(toyDoc)
      return {
        id: updatedSnapshot.id,
        ...updatedSnapshot.data()
      }
    } catch (error) {
      console.error('Error updating toy:', error)
      throw new Error('Failed to update toy')
    }
  },

  delete: async (id) => {
    try {
      const toyDoc = doc(db, 'toys', id)
      await deleteDoc(toyDoc)
      return true
    } catch (error) {
      console.error('Error deleting toy:', error)
      throw new Error('Failed to delete toy')
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
