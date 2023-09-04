export default function getAbsoluteTimeBasedOnRange(
  timeRange: { from: number; to: number },
  percentageBasedTime: number,
): number {
  const rangeDelta = timeRange.to - timeRange.from

  return timeRange.from + rangeDelta * percentageBasedTime
}
