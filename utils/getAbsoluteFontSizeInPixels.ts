/**
 * Returns the correct font size for the current size of the video player.
 *
 * Font sizes in pixels are always relative to a player size of 1920x1080 pixels.
 * If the player size changes, the font size must scale accordingly.
 *
 * @param relativeFontSize the font size relative to a player size of 1920x1080 pixels.
 * @param elementsContainerHtmlElement the HTMLElement of the video player (only the canvas).
 * @returns the correct font size based on the player's dimensions.
 */
export default function getAbsoluteFontSizeInPixels(
  relativeFontSize: number,
  elementsContainerHtmlElement: HTMLElement,
): number {
  const basePlayerWidth = 1920
  const elementsContainerWidth = elementsContainerHtmlElement.clientWidth

  const delta = elementsContainerWidth / basePlayerWidth

  return relativeFontSize * delta
}
