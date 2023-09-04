import { ChangeEventHandler } from 'react'

import Tooltip from 'components/core/tooltip'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElement } from 'types/element'

export interface OpacityControlProps {
  elementInstanceId: StreamElement['instanceId']
}

/**
 * A control for customizing the given element's opacity.
 *
 * @param elementInstanceId the instanceId of the element to customize
 */
export default function OpacityControl({
  elementInstanceId,
}: OpacityControlProps) {
  const { streamConfig, customize, getElementData } =
    useCustomizablePlayerContext()

  if (streamConfig == null) return null
  if (customize == null) return null
  if (getElementData == null) return null

  const elementData = getElementData(elementInstanceId)

  if (elementData == null) return null

  const opacity = elementData.config.opacity * 100

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    customize(elementInstanceId, 'opacity', Number(event.target.value) * 0.01)
  }

  return (
    <div className="flex flex-col">
      <Tooltip content={`Opacity: ${Math.round(opacity)}%`} hideOnClick={false}>
        <input
          type="range"
          className="accent-editing hover:cursor-grab active:cursor-grabbing"
          min={0}
          max={100}
          value={opacity}
          onChange={handleChange}
        />
      </Tooltip>
    </div>
  )
}
