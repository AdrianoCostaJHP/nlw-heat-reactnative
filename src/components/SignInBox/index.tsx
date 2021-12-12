import React from "react"
import { View } from "react-native"
import { useAuth } from "../../hooks/useAuth"
import { COLORS } from "../../theme"
import Button from "../Button"
import { styles } from "../Header/styles"

const SignInBox = () => {

  const {signIn, isSigninIn} = useAuth()

  return (
    <View style={styles.container}>
      <Button 
        title="ENTRAR COM GITHUB"
        color={COLORS.BLACK_PRIMARY} 
        backgroundColor={COLORS.YELLOW}
        icon="github"
        onPress={signIn}
        isLoading={isSigninIn}
      />
    </View>
  )
}

export default SignInBox