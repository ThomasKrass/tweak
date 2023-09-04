import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

import { StreamEvent } from 'types/stream-event'

export default function useStreamEvent<T>(
  socket: Socket | null,
  event: StreamEvent,
  handler: (eventData: T) => void,
) {
  useEffect(() => {
    if (socket == null) return

    socket.on(event, handler)

    return () => {
      socket.off(event)
    }
  }, [socket, event, handler])
}
