import { ChangeEventHandler } from 'react'

import Tooltip from 'components/core/tooltip'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElement } from 'types/element'
import getRelativeFontSizeInPixels from 'utils/getRelativeFontSizeInPixels'
import getStreamElementAttribute from 'utils/getStreamElementAttribute'
import relativeFontSizeToPercentageBasedOnRange from 'utils/relativeFontSizeToPercentageBasedOnRange'

export interface OpacityControlProps {
  elementInstanceId: StreamElement['instanceId']
}

/**
 * A control for customizing the given element's text size.
 *
 * @param elementInstanceId the instanceId of the element to customize
 */
export default function TextSizeControl({
  elementInstanceId,
}: OpacityControlProps) {
  const { streamConfig, customize, getElementData } =
    useCustomizablePlayerContext()

  if (streamConfig == null) return null
  if (customize == null) return null
  if (getElementData == null) return null

  const elementData = getElementData(elementInstanceId)

  if (elementData == null) return null

  // Get the range in which the font size can be adjusted from the config.
  const fontSizeRange = getStreamElementAttribute(elementData, 'text_source')
    ?.resources.fontSizeRange

  if (fontSizeRange == null) return null

  const fontSize = getRelativeFontSizeInPixels(
    fontSizeRange,
    elementData.config.fontSize,
  )

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const relativeFontSizeInPixels = Number(event.target.value)

    customize(
      elementInstanceId,
      'fontSize',
      relativeFontSizeToPercentageBasedOnRange(
        fontSizeRange,
        relativeFontSizeInPixels,
      ),
    )
  }

  return (
    <div className="flex flex-col">
      <Tooltip
        content={`Text Size: ${Math.round(fontSize)}px`}
        hideOnClick={false}
      >
        <input
          type="range"
          className="accent-editing hover:cursor-grab active:cursor-grabbing"
          min={fontSizeRange.from}
          max={fontSizeRange.to}
          value={fontSize}
          onChange={handleChange}
        />
      </Tooltip>
    </div>
  )
}
