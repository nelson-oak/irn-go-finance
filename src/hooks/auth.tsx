import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as GoogleAuth from 'expo-google-app-auth'
import * as AppleAuth from 'expo-apple-authentication'

interface IAuthProviderProps {
  children: ReactNode
}

interface IUser {
  id: string
  name: string
  email: string
  photo?: string
}

interface IAuthContextData {
  user: IUser
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
  isAuthStorageLoaded: boolean
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: IAuthProviderProps) {
  const [isAuthStorageLoaded, setIsAuthStorageLoaded] = useState(false)
  const [user, setUser] = useState({} as IUser)

  const userStorageKey = '@gofinances:user'

  async function signInWithGoogle() {
    try {
      const response = await GoogleAuth.logInAsync({
        androidClientId: '',
        iosClientId: '',
        scopes: ['profile', 'email']
      })

      if (response.type === 'success') {
        const userLogged = {
          id: response.user.id!,
          email: response.user.email!,
          name: response.user.name!,
          photo: response.user.photoUrl!
        }

        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
        setUser(userLogged)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async function signInWithApple() {
    try {
      const userData = await AppleAuth.signInAsync({
        requestedScopes: [
          AppleAuth.AppleAuthenticationScope.FULL_NAME,
          AppleAuth.AppleAuthenticationScope.EMAIL
        ]
      })

      if (userData) {
        const name = userData.fullName!.givenName!
        const photo = `https://ui-avatars.com/api/?name=${name}?length=1`

        const userLogged = {
          id: userData.user,
          email: userData.email!,
          name,
          photo
        }

        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
        setUser(userLogged)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem(userStorageKey)
    setUser({} as IUser)
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userData = await AsyncStorage.getItem(userStorageKey)

      if (userData) {
        const userLogged = JSON.parse(userData)

        setUser(userLogged)
      }

      setIsAuthStorageLoaded(true)
    }
    
    loadUserStorageData()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple,
      signOut,
      isAuthStorageLoaded
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
