import { useEffect, useRef } from 'react'

import StreamElementWrapper from 'components/elements/element'
import useAppContext from 'hooks/useAppContext'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElementProps } from 'types/element'
import colorForUsername from 'utils/colorForUsername'
import getAbsoluteFontSizeInPixels from 'utils/getAbsoluteFontSizeInPixels'
import getRelativeFontSizeInPixels from 'utils/getRelativeFontSizeInPixels'
import getStreamElementAttribute from 'utils/getStreamElementAttribute'

interface ChatOverlayMessageProps {
  username: string
  message: string
  fontSize: string
}

function ChatOverlayMessage({
  username,
  message,
  fontSize,
}: ChatOverlayMessageProps) {
  return (
    <strong>
      <span
        className="leading-[150%] drop-shadow-md"
        style={{
          color: colorForUsername(username),
          fontSize,
        }}
      >
        {username}
      </span>{' '}
      <span
        className="leading-[150%] text-white drop-shadow-md"
        style={{ fontSize }}
      >
        {message}
      </span>
    </strong>
  )
}

/**
 * The element Chat Overlay.
 */
export default function ChatOverlay({ elementInstanceId }: StreamElementProps) {
  const { newChatMessages } = useAppContext()
  const { getElementData, elementsContainerHtmlElement } =
    useCustomizablePlayerContext()

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to the bottom of the chat whenever a new message comes in.
  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer == null) return

    chatContainer.scrollTop = chatContainer.scrollHeight
  }, [newChatMessages])

  if (newChatMessages == null) return null

  if (getElementData == null) return null
  const elementData = getElementData(elementInstanceId)

  if (elementData == null) return null
  if (elementsContainerHtmlElement == null) return null

  const fontSizeRange = getStreamElementAttribute(elementData, 'text_source')
    ?.resources.fontSizeRange

  if (fontSizeRange == null) return null

  const fontSize =
    getAbsoluteFontSizeInPixels(
      getRelativeFontSizeInPixels(fontSizeRange, elementData.config.fontSize),
      elementsContainerHtmlElement,
    ) + 'px'

  return (
    <StreamElementWrapper elementInstanceId={elementInstanceId}>
      <div
        ref={chatContainerRef}
        className="flex flex-col flex-shrink w-full h-full overflow-y-auto custom-scrollbar"
      >
        {newChatMessages.map(({ username, message }, index) => (
          <ChatOverlayMessage
            key={index}
            username={username}
            message={message}
            fontSize={fontSize}
          />
        ))}
      </div>
    </StreamElementWrapper>
  )
}
