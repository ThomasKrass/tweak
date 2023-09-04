import {
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  InformationCircleIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import { cloneElement } from 'react'

import { StreamElementIdentifier } from 'types/element'

const elementIdentifierIconMapping: Record<
  StreamElementIdentifier,
  JSX.Element | null
> = {
  digital_captured_content: <ComputerDesktopIcon />,
  streamer_representation: <VideoCameraIcon />,
  chat_overlay: <ChatBubbleLeftRightIcon />,
  information_about_the_streamed_content: <InformationCircleIcon />,
  currently_playing_music: <MusicalNoteIcon />,
  background_music: null,
  the_streamers_voice: null,
}

export default function elementIconFor(
  elementIdentifier: StreamElementIdentifier,
): JSX.Element | null {
  const icon = elementIdentifierIconMapping[elementIdentifier]

  if (icon == null) return null

  return cloneElement(icon, {
    className: 'w-5 h-5',
  })
}
