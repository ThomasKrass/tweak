import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { ChangeEventHandler } from 'react'

import IconButton from 'components/core/icon-button'
import Tooltip from 'components/core/tooltip'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElement } from 'types/element'

export interface VolumeControlProps {
  elementInstanceId: StreamElement['instanceId']
  withNameOfElement?: boolean
}

/**
 * A control for customizing the given element's volume.
 *
 * @param elementInstanceId the instanceId of the element to customize
 */
export default function VolumeControl({
  elementInstanceId,
  withNameOfElement,
}: VolumeControlProps) {
  const { streamConfig, customize, getElementData } =
    useCustomizablePlayerContext()

  if (streamConfig == null) return null
  if (customize == null) return null
  if (getElementData == null) return null

  const elementData = getElementData(elementInstanceId)

  if (elementData == null) return null

  const volume = elementData.config.volume * 100
  const isVolumeMuted = elementData.config.isVolumeMuted

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    customize(elementInstanceId, 'volume', Number(event.target.value) * 0.01)
  }

  const handleMuteClick = () => {
    customize(elementInstanceId, 'isVolumeMuted', !isVolumeMuted)
  }

  return (
    <div className="flex flex-row items-center justify-start gap-2">
      <IconButton
        icon={isVolumeMuted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
        tooltip={isVolumeMuted ? 'Unmute' : 'Mute'}
        onClick={handleMuteClick}
      />
      <Tooltip content={`Volume: ${Math.round(volume)}%`} hideOnClick={false}>
        <input
          type="range"
          className="accent-editing hover:cursor-grab active:cursor-grabbing"
          min={0}
          max={100}
          value={volume}
          onChange={handleChange}
          disabled={isVolumeMuted}
        />
      </Tooltip>
      {withNameOfElement && <span>{elementData.title}</span>}
    </div>
  )
}
