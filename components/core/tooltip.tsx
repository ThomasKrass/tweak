import Tippy from '@tippyjs/react'
import React from 'react'
import 'tippy.js/dist/tippy.css'

interface TooltipProps {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  hideOnClick?: boolean
  children: React.ReactElement
}

export default function Tooltip({
  content,
  children,
  placement = 'top',
  hideOnClick = true,
}: TooltipProps) {
  if (content == null) return children

  return (
    <Tippy
      content={content}
      placement={placement}
      appendTo="parent"
      hideOnClick={hideOnClick}
    >
      {children}
    </Tippy>
  )
}
