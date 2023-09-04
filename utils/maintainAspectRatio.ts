export type MaintainAspectRatioOptions = {
  aspectRatio?: number
}

export default function maintainAspectRatio(
  parentContainer: HTMLElement,
  element: HTMLElement,
  options?: MaintainAspectRatioOptions,
) {
  const aspectRatio = options?.aspectRatio ?? 16 / 9

  const parentContainerAspectRatio =
    parentContainer.clientWidth / parentContainer.clientHeight

  // If parent is wider than aspect ratio, take full height and computed width
  // Otherwise, take full width and computed height
  const aspectRatioDelta = parentContainerAspectRatio - aspectRatio

  let newWidth = 0
  let newHeight = 0

  if (aspectRatioDelta < 0) {
    newWidth = parentContainer.clientWidth
    newHeight = newWidth / aspectRatio
  } else {
    newHeight = parentContainer.clientHeight
    newWidth = newHeight * aspectRatio
  }

  element.style.width = `${newWidth}px`
  element.style.height = `${newHeight}px`
}
