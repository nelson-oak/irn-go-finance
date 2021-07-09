import React, { createContext, ReactNode, useContext } from 'react'

import * as Google from 'expo-google-app-auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'

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
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState({} as IUser)

  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        androidClientId: '',
        iosClientId: '',
        scopes: ['profile', 'email']
      })

      if (result.type === 'success') {
        const userLogged = {
          id: result.user.id!,
          email: result.user.email!,
          name: result.user.name!,
          photo: result.user.photoUrl!
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
      signInWithGoogle
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
