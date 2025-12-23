import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../api/firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Функция за зареждане на ролята на потребителя
  const loadUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data().role || 'user'
      }
      // Ако потребителят няма документ, създаваме го с роля 'user'
      await setDoc(doc(db, 'users', uid), {
        role: 'user',
        createdAt: new Date()
      })
      return 'user'
    } catch (error) {
      console.error('Error loading user role:', error)
      return 'user'
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const role = await loadUserRole(firebaseUser.uid)
        setUser(firebaseUser)
        setUserRole(role)
      } else {
        setUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const role = await loadUserRole(userCredential.user.uid)
      setUserRole(role)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // Създаваме документ за потребителя с роля 'user' по подразбиране
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        role: 'user',
        email: email,
        createdAt: new Date()
      })
      setUserRole('user')
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setUserRole(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isAdmin = () => userRole === 'admin'

  const value = {
    user,
    userRole,
    loading,
    login,
    register,
    logout,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

