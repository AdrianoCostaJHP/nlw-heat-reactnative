import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react"
import * as AuthSessions from "expo-auth-session"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "../services/api"

const CLIENT_ID = "2747b242b2df652fede3"
const SCOPE = "read:user"
const USER_STORAGE="@nlwheat:user"
const TOKEN_STORAGE="@nlwheat:token"

type User = {
  id: string
  avatar_url: string
  name: string
  login: string
}

type AuthContextProps = {
  user: User | null
  isSigninIn: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}

type AuthResponse = {
  token: string
  user: User
}

type AuthorizationResponse = {
  params:{
    code?:string
    error?:string
  }
  type?: string
}

export const AuthContext = createContext({} as AuthContextProps)

const AuthProvider = ({children}: AuthProviderProps ) =>{
  const [isSigninIn, setIsSigninIn] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  
  const signIn = useCallback( async ()=> {
    try {
      setIsSigninIn(true)
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
      const authSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse
    
      if(authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access_denied'){
        const authResponse = await api.post<AuthResponse>('/authenticate', { code: authSessionResponse?.params?.code})
        const { token, user } = authResponse.data

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
        await AsyncStorage.setItem(TOKEN_STORAGE, token)

        setUser(user)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSigninIn(false)
    }
  },[])

  const signOut = useCallback( async ()=> {
    setUser(null)
    await AsyncStorage.removeItem(USER_STORAGE)
    await AsyncStorage.removeItem(TOKEN_STORAGE)
  },[])

  useEffect(()=> {
    const loadUserStorageData = async () => {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE)
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE)

      if( userStorage && tokenStorage){
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`
        setUser(JSON.parse(userStorage))
      }

      setIsSigninIn(false)
    }
    loadUserStorageData()
  },[])

  return(
    <AuthContext.Provider value={{
      signIn,
      signOut,
      user,
      isSigninIn
    }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}

export  { AuthProvider, useAuth}