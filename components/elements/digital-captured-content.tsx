import VideoSource from 'components/elements/attributes/video-source'
import StreamElementWrapper from 'components/elements/element'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElementProps } from 'types/element'
import getStreamElementAttribute from 'utils/getStreamElementAttribute'

/**
 * The element Digital Captured Content.
 */
export default function DigitalCapturedContent({
  elementInstanceId,
}: StreamElementProps) {
  const { getElementData } = useCustomizablePlayerContext()

  if (getElementData == null) return null
  const elementData = getElementData(elementInstanceId)

  if (elementData == null) return null

  const videoSourceAttribute = getStreamElementAttribute(
    elementData,
    'video_source',
  )

  if (videoSourceAttribute == null) return null

  return (
    <StreamElementWrapper elementInstanceId={elementInstanceId}>
      <VideoSource attribute={videoSourceAttribute} />
    </StreamElementWrapper>
  )
}
