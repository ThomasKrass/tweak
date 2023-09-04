import { createContext } from 'react'
import { Socket } from 'socket.io-client'

import { NewChatMessageEventData } from 'types/stream-event'

export type AppContextValue = {
  socket: Socket | null
  newChatMessages: NewChatMessageEventData[] | null
}

const defaultValue: AppContextValue = {
  socket: null,
  newChatMessages: null,
}

export const AppContext = createContext<AppContextValue>(defaultValue)
