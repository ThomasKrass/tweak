/**
 * This function generates a unique number from a specified string.
 * It is based on djb2 (see https://gist.github.com/eplawless/52813b1d8ad9af510d85)
 *
 * @param inputString the string to generate a unique number from
 * @returns a unique number for the specified string
 */
export function stringToUniqueNumber(inputString: string): number {
  const stringLength = inputString.length
  let h = 5381

  for (let i = 0; i < stringLength; i++) {
    h = (h * 33) ^ inputString.charCodeAt(i)
  }

  return h >>> 0
}
