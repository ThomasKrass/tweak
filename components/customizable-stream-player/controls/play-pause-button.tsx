import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline'

import IconButton from 'components/core/icon-button'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'

export default function PlayPauseButton() {
  const { isPlaying, setIsPlaying } = useCustomizablePlayerContext()

  if (isPlaying == null) return null
  if (setIsPlaying == null) return null

  const handleClick = () => {
    setIsPlaying((v) => !v)
  }

  return (
    <IconButton
      icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
      tooltip={isPlaying ? 'Pause' : 'Play'}
      onClick={handleClick}
    />
  )
}
