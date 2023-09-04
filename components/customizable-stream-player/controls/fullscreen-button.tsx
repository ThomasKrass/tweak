import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'

import IconButton from 'components/core/icon-button'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'

/**
 * This button toggles the fullscreen mode of the customizable video player.
 */
export default function FullscreenButton() {
  const { playerContainerHtmlElement } = useCustomizablePlayerContext()

  const handleClick = async () => {
    if (playerContainerHtmlElement == null) return null

    try {
      if (!document.fullscreenElement) {
        await playerContainerHtmlElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    } catch {
      /* empty */
    }
  }

  return (
    <IconButton
      icon={<ArrowsPointingOutIcon />}
      tooltip="Fullscreen"
      onClick={handleClick}
    />
  )
}
