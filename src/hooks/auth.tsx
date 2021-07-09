import React, { createContext, ReactNode, useContext, useState } from 'react'
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
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState({} as IUser)

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

        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
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
        const userLogged = {
          id: userData.user,
          email: userData.email!,
          name: userData.fullName!.givenName!,
          photo: undefined
        }

        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
        setUser(userLogged)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple
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
