import { StreamElementAttributeResources } from 'types/element'
import { HLSVideoSourceResolution } from 'types/hls-stream'

/**
 * Converts the specified relative video coordinates to absolute coordinated,
 *  based on the resolution of the HLS stream.
 *
 * @example `(0, 0) (1, 1) at 1920x1080 -> (0, 0), (1920, 1080)`
 */
export default function getAbsoluteSourceVideoCoordinates(
  { width, height }: HLSVideoSourceResolution,
  {
    x0,
    y0,
    x1,
    y1,
  }: NonNullable<StreamElementAttributeResources['videoStream']>,
): NonNullable<StreamElementAttributeResources['videoStream']> {
  const absoluteX0 = x0 * width
  const absoluteX1 = x1 * width

  const absoluteY0 = y0 * height
  const absoluteY1 = y1 * height

  return { x0: absoluteX0, y0: absoluteY0, x1: absoluteX1, y1: absoluteY1 }
}
