const USERNAME_COLORS = [
  '#ff0000',
  '#0000ff',
  '#008000',
  '#b22222',
  '#ff7f50',
  '#9acd32',
  '#ff4500',
  '#2e8b57',
  '#daa520',
  '#d2691e',
  '#5f9ea0',
  '#1e90ff',
  '#ff69b4',
  '#8a2be2',
  '#00ff7f',
]

/**
 * Returns a color for the given username. The same color is always returned
 *  for the same username.
 * The colors are based on colors found inside the Twitch chat.
 */
export default function colorForUsername(username: string): string {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i)
    hash = hash & hash
  }

  const index = Math.abs(hash) % USERNAME_COLORS.length

  return USERNAME_COLORS[index]
}
