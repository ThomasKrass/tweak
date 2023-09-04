import { StreamElementLocation } from 'types/element'

/**
 * Converts a given location (relative from 0 to 1) to absolute coordinates
 *  respective to the given elements container.
 */
export default function relativeToAbsoluteLocation(
  location: StreamElementLocation,
  elementsContainer: HTMLElement,
): StreamElementLocation | null {
  if (!elementsContainer) return null

  const elementsContainerWidth = elementsContainer.clientWidth
  const elementsContainerHeight = elementsContainer.clientHeight

  return {
    x0: location.x0 * elementsContainerWidth,
    y0: location.y0 * elementsContainerHeight,
    x1: location.x1 * elementsContainerWidth,
    y1: location.y1 * elementsContainerHeight,
  }
}
