import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'

export const elvesService = {
  getAll: async () => {
    try {
      const elvesCollection = collection(db, 'elves')
      const elvesSnapshot = await getDocs(elvesCollection)
      const elves = elvesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return elves
    } catch (error) {
      console.error('Error fetching elves:', error)
      throw new Error('Failed to fetch elves')
    }
  },

  getById: async (id) => {
    try {
      const elfDoc = doc(db, 'elves', id)
      const elfSnapshot = await getDoc(elfDoc)
      
      if (!elfSnapshot.exists()) {
        throw new Error('Elf not found')
      }
      
      return {
        id: elfSnapshot.id,
        ...elfSnapshot.data()
      }
    } catch (error) {
      console.error('Error fetching elf:', error)
      throw new Error('Failed to fetch elf')
    }
  },

  create: async (elfData) => {
    try {
      const elvesCollection = collection(db, 'elves')
      const docRef = await addDoc(elvesCollection, {
        ...elfData,
        energy: elfData.energy !== undefined ? Math.min(Math.max(elfData.energy, 0), 100) : 50
      })
      return {
        id: docRef.id,
        ...elfData,
        energy: elfData.energy !== undefined ? Math.min(Math.max(elfData.energy, 0), 100) : 50
      }
    } catch (error) {
      console.error('Error creating elf:', error)
      throw new Error('Failed to create elf')
    }
  },

  update: async (id, elfData) => {
    try {
      const elfDoc = doc(db, 'elves', id)
      const updateData = {
        ...elfData,
        energy: elfData.energy !== undefined ? Math.min(Math.max(elfData.energy, 0), 100) : elfData.energy
      }
      await updateDoc(elfDoc, updateData)
      
      const updatedSnapshot = await getDoc(elfDoc)
      return {
        id: updatedSnapshot.id,
        ...updatedSnapshot.data()
      }
    } catch (error) {
      console.error('Error updating elf:', error)
      throw new Error('Failed to update elf')
    }
  },

  delete: async (id) => {
    try {
      const elfDoc = doc(db, 'elves', id)
      await deleteDoc(elfDoc)
      return true
    } catch (error) {
      console.error('Error deleting elf:', error)
      throw new Error('Failed to delete elf')
    }
  }
}
