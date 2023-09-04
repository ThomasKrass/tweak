import { useEffect, useRef } from 'react'

import useAppContext from 'hooks/useAppContext'
import TextInputPlaceholder from 'layouts/skeleton/text-input-placeholder'
import colorForUsername from 'utils/colorForUsername'

interface LiveChatMessageProps {
  username: string
  message: string
}

function LiveChatMessage({ username, message }: LiveChatMessageProps) {
  return (
    <div>
      <strong className="text-sm" style={{ color: colorForUsername(username) }}>
        {username}
      </strong>
      : <span className="text-sm">{message}</span>
    </div>
  )
}

export default function LiveChat() {
  const { newChatMessages } = useAppContext()

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to the bottom of the chat whenever a new message comes in.
  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer == null) return

    chatContainer.scrollTop = chatContainer.scrollHeight
  }, [newChatMessages])

  if (newChatMessages == null) return null

  return (
    <div className="relative flex flex-col h-full">
      <h4 className="absolute top-0 left-0 right-0 h-8 px-2 font-bold bg-white text-md">
        Chat
      </h4>
      <div className="flex flex-col justify-between h-full">
        <div
          ref={chatContainerRef}
          className="flex flex-col flex-shrink gap-1 pt-8 pb-8 pr-2 mt-2 mb-2 ml-2 overflow-y-scroll custom-scrollbar"
        >
          {newChatMessages.map(({ username, message }, index) => (
            <LiveChatMessage
              key={index}
              username={username}
              message={message}
            />
          ))}
        </div>
      </div>
      <TextInputPlaceholder className="absolute bottom-0 left-0 right-0 h-8" />
    </div>
  )
}
