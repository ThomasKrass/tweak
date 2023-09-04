export type StreamEvent = 'newChatMessage' | 'updatedStreamerConfig'

export type NewChatMessageEventData = { username: string; message: string }
