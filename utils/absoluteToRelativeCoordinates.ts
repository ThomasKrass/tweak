import { StreamElementLocation } from 'types/element'

/**
 * Converts an absolute given location to relative coordinates (from 0 to 1)
 *  respective to the given elements container.
 */
export default function absoluteToRelativeLocation(
  absoluteLocation: StreamElementLocation,
  elementsContainer: HTMLElement,
): StreamElementLocation | null {
  if (!elementsContainer) return null

  const elementsContainerWidth = elementsContainer.clientWidth
  const elementsContainerHeight = elementsContainer.clientHeight

  return {
    x0: absoluteLocation.x0 / elementsContainerWidth,
    y0: absoluteLocation.y0 / elementsContainerHeight,
    x1: absoluteLocation.x1 / elementsContainerWidth,
    y1: absoluteLocation.y1 / elementsContainerHeight,
  }
}
