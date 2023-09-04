export default function relativeFontSizeToPercentageBasedOnRange(
  fontSizeRange: { from: number; to: number },
  relativeFontSize: number,
) {
  const rangeDelta = fontSizeRange.to - fontSizeRange.from

  return (relativeFontSize - fontSizeRange.from) / rangeDelta
}
