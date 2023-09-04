export default function getRelativeFontSizeInPixels(
  fontSizeRange: { from: number; to: number },
  percentageBasedFontSize: number,
): number {
  const rangeDelta = fontSizeRange.to - fontSizeRange.from

  return fontSizeRange.from + rangeDelta * percentageBasedFontSize
}
