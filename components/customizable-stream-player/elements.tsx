import { DragEventHandler, ForwardedRef, forwardRef } from 'react'

import ChatOverlay from 'components/elements/chat-overlay'
import CurrentlyPlayingMusic from 'components/elements/currently-playing-music'
import DigitalCapturedContent from 'components/elements/digital-captured-content'
import InformationAboutTheStreamedContent from 'components/elements/information-about-the-streamed-content'
import StreamerRepresentation from 'components/elements/streamer-representation'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import {
  StreamElement,
  StreamElementIdentifier,
  StreamElementProps,
} from 'types/element'

function spawnElement(element: StreamElement): JSX.Element | null {
  const identifierComponentMapping: Record<
    StreamElementIdentifier,
    ((props: StreamElementProps) => JSX.Element | null) | null
  > = {
    digital_captured_content: DigitalCapturedContent,
    streamer_representation: StreamerRepresentation,
    chat_overlay: ChatOverlay,
    information_about_the_streamed_content: InformationAboutTheStreamedContent,
    currently_playing_music: CurrentlyPlayingMusic,
    background_music: null,
    the_streamers_voice: null,
  }

  const { identifier } = element

  if (!Object.keys(identifierComponentMapping).includes(identifier)) return null

  const Element = identifierComponentMapping[identifier]

  if (Element == null) return null

  return (
    <Element key={element.instanceId} elementInstanceId={element.instanceId} />
  )
}

/**
 * Container with all elements inside the stream player.
 */
const ElementsContainer = forwardRef(function ElementsContainer(
  _props: unknown,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { streamConfig } = useCustomizablePlayerContext()
  const elements = streamConfig?.elements ?? null

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.dropEffect = 'move'
    event.preventDefault()
  }

  return (
    <div
      ref={ref}
      className="relative z-0 overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
    >
      {elements != null && elements.map(spawnElement)}
    </div>
  )
})

export default ElementsContainer
