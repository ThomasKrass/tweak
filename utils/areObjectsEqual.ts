/**
 * Checks if two (complex) objects are equal based on their content.
 * Important: This is **not** a reference-based comparison!
 *
 * @param a oject 1 to compare
 * @param b oject 2 to compare
 *
 * @returns true, if both objects are equal, false otherwise.
 */
export default function areObjectsEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
