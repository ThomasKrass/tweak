/**
 * Checks if the given aspect ratio is wider than the aspect ratio to compare against.
 *
 * @param aspectRatioToCompareTo the aspect ratio to compare against
 * @param inputAspectRatio the given aspect ratio
 *
 * @returns true if it is wider, false otherwise
 */
export default function isWiderThanAspectRatio(
  aspectRatioToCompareTo: number,
  inputAspectRatio: number,
): boolean {
  const aspectRatioDelta = aspectRatioToCompareTo - inputAspectRatio

  return aspectRatioDelta > 0
}
