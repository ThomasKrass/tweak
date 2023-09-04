import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElementAttributeProps } from 'types/element'
import getAbsoluteSourceVideoCoordinates from 'utils/getAbsoluteSourceVideoCoordinates'
import isWiderThanAspectRatio from 'utils/isWiderThanAspectRatio'

enum VideoDestinationResolution {
  WIDTH = 1920,
  HEIGHT = 1080,
}

/**
 * A video source for playing a part of the HLS video stream.
 */
export default function VideoSource({
  attribute,
}: StreamElementAttributeProps) {
  const { hlsPlayerHtmlElement } = useCustomizablePlayerContext()

  const [
    isCanvasParentAspectRatioWiderThanVideoAspectRatio,
    setIsCanvasParentAspectRatioWiderThanVideoAspectRatio,
  ] = useState<boolean | null>(null)

  const canvasParentRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const videoUpdateRateInMilliseconds = (() => {
    const framerate = Number(process.env.NEXT_PUBLIC_VIDEO_FRAMERATE) || 30

    return 1000 / framerate
  })()

  useEffect(() => {
    if (hlsPlayerHtmlElement == null) return
    if (attribute.resources.videoStream == null) return

    const { x0, y0, x1, y1 } = getAbsoluteSourceVideoCoordinates(
      {
        width: hlsPlayerHtmlElement.videoWidth,
        height: hlsPlayerHtmlElement.videoHeight,
      },
      attribute.resources.videoStream,
    )

    const [destinationX, destinationY, destinationWidth, destinationHeight] = [
      0,
      0,
      VideoDestinationResolution.WIDTH,
      VideoDestinationResolution.HEIGHT,
    ]

    if (!hlsPlayerHtmlElement) return

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasContext = canvas.getContext('2d')
    if (!canvasContext) return

    const intervalId = setInterval(() => {
      if (
        hlsPlayerHtmlElement.readyState !==
        hlsPlayerHtmlElement.HAVE_ENOUGH_DATA
      )
        return

      canvasContext.drawImage(
        hlsPlayerHtmlElement,
        x0,
        y0,
        x1 - x0,
        y1 - y0,
        destinationX,
        destinationY,
        destinationWidth,
        destinationHeight,
      )
    }, videoUpdateRateInMilliseconds)

    return () => {
      clearInterval(intervalId)
    }
  }, [
    attribute.resources.videoStream,
    hlsPlayerHtmlElement,
    videoUpdateRateInMilliseconds,
  ])

  // Depending on the canvas parent's aspect ratio, the canvas inside it must either
  //  adjust it's width or height to maintain its correct aspect ratio.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsCanvasParentAspectRatioWiderThanVideoAspectRatio(
          isWiderThanAspectRatio(
            16 / 9,
            entry.contentRect.width / entry.contentRect.height,
          ),
        )
      }
    })

    const canvasParentRefHtmlElement = canvasParentRef.current

    if (canvasParentRefHtmlElement) {
      resizeObserver.observe(canvasParentRefHtmlElement)
    }

    return () => {
      if (canvasParentRefHtmlElement) {
        resizeObserver.unobserve(canvasParentRefHtmlElement)
      }
    }
  }, [])

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      ref={canvasParentRef}
    >
      <canvas
        ref={canvasRef}
        className={classNames('aspect-video', {
          ['w-full h-auto']: isCanvasParentAspectRatioWiderThanVideoAspectRatio,
          ['w-auto h-full']:
            !isCanvasParentAspectRatioWiderThanVideoAspectRatio,
        })}
        width={VideoDestinationResolution.WIDTH}
        height={VideoDestinationResolution.HEIGHT}
      />
    </div>
  )
}
