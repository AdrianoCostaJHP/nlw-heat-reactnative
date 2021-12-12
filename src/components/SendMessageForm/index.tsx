import React, { useCallback, useState } from "react"
import { Alert, Keyboard, TextInput, View } from "react-native"
import { api } from "../../services/api"
import { COLORS } from "../../theme"
import Button from "../Button"
import { styles } from "./styles"

const SendMessageForm = () => {
  const [message, setMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const handleMessageSubmit = useCallback( async () => {
    const messageFormatted = message.trim()

    if(messageFormatted.length > 0){
      setSendingMessage(true)

      await api.post('/messages', { message: messageFormatted })
      setMessage('')
      Keyboard.dismiss()
      setSendingMessage(false)
      Alert.alert('Mensagem enviada com sucesso!')


    }else{
      Alert.alert('A mensagem não pode estar vazia!')
    }

  },[])

  return (
    <View style={styles.container}>
      <TextInput 
        keyboardAppearance="dark" 
        placeholder="Qual sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        editable={!sendingMessage}
        style={styles.input}
      />
      <Button 
        title="ENVIAR MENSAGEM" 
        color={COLORS.WHITE} 
        backgroundColor={COLORS.PINK}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />

    </View>
  )
}
export default SendMessageForm