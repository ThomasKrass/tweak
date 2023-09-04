import { useEffect, useRef, useState, PropsWithChildren } from 'react'

import ElementEditingOverlay from 'components/customization-options/element-editing-overlay'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElement } from 'types/element'
import relativeToAbsoluteLocation from 'utils/relativeToAbsoluteCoordinates'

export interface StreamElementWrapperProps extends PropsWithChildren {
  elementInstanceId: StreamElement['instanceId']
}

/**
 * The wrapper component each element needs to use.
 * Provides the customization menu.
 */
export default function StreamElementWrapper({
  children,
  elementInstanceId,
}: StreamElementWrapperProps) {
  const {
    areCustomizationOptionsEnabled,
    elementsContainerHtmlElement,
    getElementData,
  } = useCustomizablePlayerContext()

  const resizeObserver = useRef<ResizeObserver | null>(null)

  const [, setElementSize] = useState({
    width: elementsContainerHtmlElement?.clientWidth,
    height: elementsContainerHtmlElement?.clientHeight,
  })

  // Listen for changes to the HTMLElement's size that contains all StreamElements.
  // When the size changes, all StreamElements' absolute dimensions must be recomputed.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setElementSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    if (elementsContainerHtmlElement) {
      resizeObserver.current.observe(elementsContainerHtmlElement)
    }

    return () => {
      if (resizeObserver.current && elementsContainerHtmlElement) {
        resizeObserver.current.unobserve(elementsContainerHtmlElement)
      }
    }
  }, [elementsContainerHtmlElement])

  if (elementsContainerHtmlElement == null) return null
  if (getElementData == null) return null

  const elementData = getElementData(elementInstanceId)

  if (elementData == null) return null

  const { location, isEnabled, layer } = elementData.config

  if (!isEnabled) return null

  const absoluteLocation = relativeToAbsoluteLocation(
    location,
    elementsContainerHtmlElement,
  )

  if (absoluteLocation == null) return null

  // Retrieve absolute top, bottom, right and left positions.
  const [left, top, right, bottom] = [
    absoluteLocation.x0,
    absoluteLocation.y0,
    elementsContainerHtmlElement.clientWidth - absoluteLocation.x1,
    elementsContainerHtmlElement.clientHeight - absoluteLocation.y1,
  ]

  const zIndex = layer

  const opacity = getElementData?.(elementInstanceId)?.config.opacity

  return (
    <div className="absolute" style={{ left, top, right, bottom, zIndex }}>
      <div className="relative z-0 w-full h-full">
        {areCustomizationOptionsEnabled && (
          <ElementEditingOverlay elementInstanceId={elementInstanceId} />
        )}
        <div className="relative z-0 w-full h-full" style={{ opacity }}>
          {children}
        </div>
      </div>
    </div>
  )
}
