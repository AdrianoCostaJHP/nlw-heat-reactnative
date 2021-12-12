import React, { useEffect, useState } from "react";
import Message, { MessageProps } from "../Message";
import { io } from "socket.io-client"
import { ScrollView} from "react-native";
import { api } from "../../services/api";
import { styles } from "./styles";

let messageQueue: MessageProps[] = []

const socket = io(String(api.defaults.baseURL))
socket.on('new_message', (newMessage) => {
  messageQueue.push(newMessage)
})

const MessageList = () => {

  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([])

  useEffect(()=>{
    const fetchMessages = async () => {
      const messagesResponse = await api.get<MessageProps[]>('/messages/last3')
      setCurrentMessages(messagesResponse.data)
    } 
    fetchMessages()
  },[])

  useEffect(()=> {
    const timer = setInterval(()=> {
      if(messageQueue.length > 0){
        setCurrentMessages((rest) => [messageQueue[0], rest[0], rest[1] ])
        messageQueue.shift()
      }
    })
    return () => clearInterval(timer)
  })

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map((message) =>  <Message key={message?.id} data={message}/>)}
      
    </ScrollView>
  )
}

export default MessageList