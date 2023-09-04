import 'styles/globals.css'
import 'styles/scrollbar.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

import { AppContext } from 'contexts/appContext'
import useStreamEvent from 'hooks/useStreamEvent'
import SkeletonLayout from 'layouts/skeleton'
import { NewChatMessageEventData } from 'types/stream-event'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [newChatMessages, setNewChatMessages] = useState<
    NewChatMessageEventData[]
  >([])

  useEffect(() => {
    const eventBridgeUrl = process.env.NEXT_PUBLIC_EVENT_BRIDGE_URL || null
    if (eventBridgeUrl == null) return

    const socketIo = io(eventBridgeUrl)
    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [])

  // At most, the specified amount of chat messages is displayed.
  // Older messages are automatically deleted from the live chat.
  const maximumNumberOfDisplayedChatMessages =
    Number(process.env.NEXT_PUBLIC_MAXIMUM_NUMBER_OF_DISPLAYED_CHAT_MESSAGES) ??
    100

  useStreamEvent(
    socket,
    'newChatMessage',
    (chatMessage: NewChatMessageEventData) => {
      setNewChatMessages((previousMessages) => {
        const allMessages = [...previousMessages, chatMessage]
        return allMessages.slice(-maximumNumberOfDisplayedChatMessages)
      })
    },
  )

  const queryClient = new QueryClient()

  return (
    <AppContext.Provider value={{ socket, newChatMessages }}>
      <QueryClientProvider client={queryClient}>
        <SkeletonLayout>
          <Component {...pageProps} />
        </SkeletonLayout>
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
