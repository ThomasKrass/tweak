import classNames from 'classnames'
import { DragEvent, DragEventHandler, MouseEventHandler, useState } from 'react'

import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElement, StreamElementLocation } from 'types/element'
import absoluteToRelativeLocation from 'utils/absoluteToRelativeCoordinates'
import relativeToAbsoluteLocation from 'utils/relativeToAbsoluteCoordinates'

interface CursorPosition {
  x: number
  y: number
}

export interface ElementEditingOverlayProps {
  elementInstanceId: StreamElement['instanceId']
}

/**
 * An overlay that displays the red border around each element when the user hovers
 *  over the element in editing mode.
 * Provides functionality such as changing the element's position or its dimensions.
 */
export default function ElementEditingOverlay({
  elementInstanceId,
}: ElementEditingOverlayProps) {
  const {
    customize,
    elementsContainerHtmlElement,
    getElementData,
    instanceIDOfHighlightedElement,
    setInstanceIDOfHighlightedElement,
    instanceIDOfSelectedElement,
    setInstanceIDOfSelectedElement,
    isShowingElementSettingsMenu,
    setIsShowingElementSettingsMenu,
    isResizingElement,
    setIsResizingElement,
    isRepositioningElement,
    setIsRepositioningElement,
  } = useCustomizablePlayerContext()

  const [repositionStartCursorPosition, setRepositionStartCursorPosition] =
    useState<CursorPosition | null>(null)

  const [resizeStartCursorPosition, setResizeStartCursorPosition] =
    useState<CursorPosition | null>(null)

  const handleRepositionStart: DragEventHandler<HTMLDivElement> = (event) => {
    if (setIsRepositioningElement == null) return

    const cursorPosition: CursorPosition = {
      x: event.clientX,
      y: event.clientY,
    }

    setRepositionStartCursorPosition(cursorPosition)
    setIsRepositioningElement(true)
  }

  const handleReposition: DragEventHandler<HTMLDivElement> = (event) => {
    if (elementsContainerHtmlElement == null) return
    if (customize == null) return
    if (repositionStartCursorPosition == null) return
    if (getElementData == null) return

    const elementData = getElementData(elementInstanceId)

    if (elementData == null) return

    const cursorPosition: CursorPosition = {
      x: event.clientX,
      y: event.clientY,
    }

    const deltaX = repositionStartCursorPosition.x - cursorPosition.x
    const deltaY = repositionStartCursorPosition.y - cursorPosition.y

    const newLocation: StreamElementLocation | null = (() => {
      const previousAbsoluteLocation = relativeToAbsoluteLocation(
        elementData.config.location,
        elementsContainerHtmlElement,
      )

      if (previousAbsoluteLocation == null) return null

      const newAbsoluteLocation: StreamElementLocation = {
        x0: previousAbsoluteLocation.x0 - deltaX,
        x1: previousAbsoluteLocation.x1 - deltaX,
        y0: previousAbsoluteLocation.y0 - deltaY,
        y1: previousAbsoluteLocation.y1 - deltaY,
      }

      const newLocation = absoluteToRelativeLocation(
        newAbsoluteLocation,
        elementsContainerHtmlElement,
      )

      return newLocation
    })()

    if (newLocation == null) return

    setRepositionStartCursorPosition({
      x: cursorPosition.x,
      y: cursorPosition.y,
    })

    customize(elementInstanceId, 'location', newLocation)
  }

  const handleRepositionEnd: DragEventHandler<HTMLDivElement> = () => {
    if (setIsRepositioningElement == null) return

    setIsRepositioningElement(false)
  }

  const handleClick = () => {
    if (setInstanceIDOfSelectedElement == null) return
    if (setIsShowingElementSettingsMenu == null) return

    // Hide settings menu instead if it is already open and the currently selected
    //  element is the same as the element this settings button is belonging to.
    if (
      isShowingElementSettingsMenu &&
      instanceIDOfSelectedElement === elementInstanceId
    ) {
      setIsShowingElementSettingsMenu(false)
      return
    }

    setInstanceIDOfSelectedElement(elementInstanceId)
    setIsShowingElementSettingsMenu(true)
  }

  const handleMouseOver = () => {
    if (setInstanceIDOfHighlightedElement == null) return

    if (isResizingElement) return
    if (isRepositioningElement) return

    setInstanceIDOfHighlightedElement(elementInstanceId)
  }

  const handleMouseOut = () => {
    if (setInstanceIDOfHighlightedElement == null) return

    if (isResizingElement) return
    if (isRepositioningElement) return

    setInstanceIDOfHighlightedElement(null)
  }

  const handleResizeStart: MouseEventHandler<HTMLDivElement> = (event) => {
    if (setIsResizingElement == null) return

    const cursorPosition: CursorPosition = {
      x: event.clientX,
      y: event.clientY,
    }

    setResizeStartCursorPosition(cursorPosition)
    setIsResizingElement(true)
  }

  const handleResize = (
    event: DragEvent<HTMLDivElement>,
    dragHandleLocation: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw',
  ) => {
    if (elementsContainerHtmlElement == null) return
    if (customize == null) return
    if (resizeStartCursorPosition == null) return
    if (getElementData == null) return

    const elementData = getElementData(elementInstanceId)

    if (elementData == null) return

    const cursorPosition: CursorPosition = {
      x: event.clientX,
      y: event.clientY,
    }

    const deltaX = resizeStartCursorPosition.x - cursorPosition.x
    const deltaY = resizeStartCursorPosition.y - cursorPosition.y

    const newLocation: StreamElementLocation | null = (() => {
      const previousAbsoluteLocation = relativeToAbsoluteLocation(
        elementData.config.location,
        elementsContainerHtmlElement,
      )

      if (previousAbsoluteLocation == null) return null

      let newAbsoluteLocation: StreamElementLocation | null = null
      switch (dragHandleLocation) {
        case 'n': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0,
            x1: previousAbsoluteLocation.x1,
            y0: previousAbsoluteLocation.y0 - deltaY,
            y1: previousAbsoluteLocation.y1,
          }
          break
        }
        case 'ne': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0,
            x1: previousAbsoluteLocation.x1 - deltaX,
            y0: previousAbsoluteLocation.y0 - deltaY,
            y1: previousAbsoluteLocation.y1,
          }
          break
        }
        case 'e': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0,
            x1: previousAbsoluteLocation.x1 - deltaX,
            y0: previousAbsoluteLocation.y0,
            y1: previousAbsoluteLocation.y1,
          }
          break
        }
        case 'se': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0,
            x1: previousAbsoluteLocation.x1 - deltaX,
            y0: previousAbsoluteLocation.y0,
            y1: previousAbsoluteLocation.y1 - deltaY,
          }
          break
        }
        case 's': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0,
            x1: previousAbsoluteLocation.x1,
            y0: previousAbsoluteLocation.y0,
            y1: previousAbsoluteLocation.y1 - deltaY,
          }
          break
        }
        case 'sw': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0 - deltaX,
            x1: previousAbsoluteLocation.x1,
            y0: previousAbsoluteLocation.y0,
            y1: previousAbsoluteLocation.y1 - deltaY,
          }
          break
        }
        case 'w': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0 - deltaX,
            x1: previousAbsoluteLocation.x1,
            y0: previousAbsoluteLocation.y0,
            y1: previousAbsoluteLocation.y1,
          }
          break
        }
        case 'nw': {
          newAbsoluteLocation = {
            x0: previousAbsoluteLocation.x0 - deltaX,
            x1: previousAbsoluteLocation.x1,
            y0: previousAbsoluteLocation.y0 - deltaY,
            y1: previousAbsoluteLocation.y1,
          }
          break
        }
      }

      const newLocation = absoluteToRelativeLocation(
        newAbsoluteLocation,
        elementsContainerHtmlElement,
      )

      setResizeStartCursorPosition({ x: cursorPosition.x, y: cursorPosition.y })

      return newLocation
    })()

    if (newLocation == null) return

    customize(elementInstanceId, 'location', newLocation)
    setRepositionStartCursorPosition(null)
  }

  const handleResizeEnd: DragEventHandler<HTMLDivElement> = () => {
    if (setIsResizingElement == null) return

    setIsResizingElement(false)
  }

  const isCustomizationOptionChangeDimensionsEnabledByPlatformVendor =
    process.env.NEXT_PUBLIC_CUSTOMIZATION_OPTION_CHANGE_DIMENSIONS_ENABLED ===
    'true'

  const isCustomizationOptionChangePositionEnabledByPlatformVendor =
    process.env.NEXT_PUBLIC_CUSTOMIZATION_OPTION_CHANGE_POSITION_ENABLED ===
    'true'

  return (
    <div
      className="z-0"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {isCustomizationOptionChangeDimensionsEnabledByPlatformVendor && (
        <>
          <div
            className={classNames(
              'absolute top-0 left-[calc(50%-.5rem)] z-20 w-4 h-4 -mt-[calc(.5rem-2px)] bg-elementHighlight cursor-n-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 'n')}
            onDragEnd={handleResizeEnd}
          />
          <div
            className={classNames(
              'absolute top-0 right-0 z-20 w-4 h-4 -mt-[calc(.5rem-2px)] -mr-[calc(.5rem-2px)] bg-elementHighlight cursor-ne-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 'ne')}
            onDragEnd={handleResizeEnd}
          />
          <div
            className={classNames(
              'absolute top-[calc(50%-.5rem)] right-0 z-20 w-4 h-4 -mr-[calc(.5rem-2px)] bg-elementHighlight cursor-e-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 'e')}
            onDragEnd={handleResizeEnd}
          />
          <div
            className={classNames(
              'absolute bottom-0 right-0 z-20 w-4 h-4 -mb-[calc(.5rem-2px)] -mr-[calc(.5rem-2px)] bg-elementHighlight cursor-se-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 'se')}
            onDragEnd={handleResizeEnd}
          />
          <div
            className={classNames(
              'absolute bottom-0 left-[calc(50%-.5rem)] z-20 w-4 h-4 -mb-[calc(.5rem-2px)] bg-elementHighlight cursor-s-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 's')}
            onDragEnd={handleResizeEnd}
          />
          <div
            className={classNames(
              'absolute bottom-0 left-0 z-20 w-4 h-4 -mb-[calc(.5rem-2px)] -ml-[calc(.5rem-2px)] bg-elementHighlight cursor-sw-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 'sw')}
            onDragEnd={handleResizeEnd}
          />
          <div
            className={classNames(
              'absolute top-[calc(50%-.5rem)] left-0 z-20 w-4 h-4 -ml-[calc(.5rem-2px)] bg-elementHighlight cursor-w-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 'w')}
            onDragEnd={handleResizeEnd}
          />
          <div
            className={classNames(
              'absolute top-0 left-0 z-20 w-4 h-4 -mt-[calc(.5rem-2px)] -ml-[calc(.5rem-2px)] bg-elementHighlight cursor-nw-resize transition-colors duration-150',
              instanceIDOfHighlightedElement === elementInstanceId
                ? 'bg-elementHighlight'
                : 'bg-transparent',
            )}
            draggable
            onDragStart={handleResizeStart}
            onDrag={(event) => handleResize(event, 'nw')}
            onDragEnd={handleResizeEnd}
          />
        </>
      )}
      <div
        className={classNames(
          'absolute inset-0 z-10 flex flex-row items-start justify-end gap-1 p-1 transition-colors duration-150 border-4 cursor-pointer',
          instanceIDOfHighlightedElement === elementInstanceId
            ? 'border-elementHighlight'
            : 'border-transparent',
        )}
        draggable={isCustomizationOptionChangePositionEnabledByPlatformVendor}
        onDragStart={handleRepositionStart}
        onDrag={handleReposition}
        onDragEnd={handleRepositionEnd}
        onClick={handleClick}
      />
    </div>
  )
}
