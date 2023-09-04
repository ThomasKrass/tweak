import StreamElementWrapper from 'components/elements/element'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElementProps } from 'types/element'
import getAbsoluteFontSizeInPixels from 'utils/getAbsoluteFontSizeInPixels'
import getRelativeFontSizeInPixels from 'utils/getRelativeFontSizeInPixels'
import getStreamElementAttribute from 'utils/getStreamElementAttribute'

export default function InformationAboutTheStreamedContent({
  elementInstanceId,
}: StreamElementProps) {
  const { getElementData, elementsContainerHtmlElement } =
    useCustomizablePlayerContext()

  if (getElementData == null) return null
  const elementData = getElementData(elementInstanceId)
  if (elementData == null) return null

  const textAttribute = getStreamElementAttribute(elementData, 'text_source')
  if (textAttribute == null) return null

  if (elementsContainerHtmlElement == null) return null

  const fontSizeRange = textAttribute.resources.fontSizeRange
  if (fontSizeRange == null) return null

  const text = textAttribute.resources.text
  if (text == null) return null

  const fontSize =
    getAbsoluteFontSizeInPixels(
      getRelativeFontSizeInPixels(fontSizeRange, elementData.config.fontSize),
      elementsContainerHtmlElement,
    ) + 'px'

  return (
    <StreamElementWrapper elementInstanceId={elementInstanceId}>
      <div className="flex flex-row items-center w-full h-full ">
        <strong className="text-white drop-shadow-md" style={{ fontSize }}>
          {text}
        </strong>
      </div>
    </StreamElementWrapper>
  )
}
