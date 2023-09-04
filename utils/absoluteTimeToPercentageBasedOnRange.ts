export default function absoluteTimeToPercentageBasedOnRange(
  timeRange: { from: number; to: number },
  absoluteTime: number,
) {
  const rangeDelta = timeRange.to - timeRange.from

  return (absoluteTime - timeRange.from) / rangeDelta
}
