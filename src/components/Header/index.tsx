import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'
import LogoSvg from '../../assets/logo.svg'
import Avatar from '../Avatar'
import { useAuth } from '../../hooks/useAuth'

const Header = () => {
  const {signOut, user} = useAuth()

  return (
    <View style={styles.container}>
      <LogoSvg />
      <View style={styles.logoutButton}>
        { user && (
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        )}
        <Avatar imageUri={user?.avatar_url} />
      </View>
    </View>
  )
}

export default Header