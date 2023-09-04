import { ForwardedRef, MutableRefObject } from 'react'

/**
 * Type guard for checking if the forwarded ref is of type `MutableRefObject<HTMLVideoElement>`.
 */
export function isMutableRefObjectHtmlVideoElement(
  forwardedRef: ForwardedRef<HTMLVideoElement>,
): forwardedRef is MutableRefObject<HTMLVideoElement> {
  return (forwardedRef as MutableRefObject<HTMLVideoElement>)['current'] != null
}
