import classNames from 'classnames'

import LiveChat from 'components/customizable-stream-player/live-chat'
import SourcesList from 'components/customization-options/sources-list'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'

export interface SidebarProps {
  className?: string
}

/**
 * The sidebar on the right side of the video player.
 */
export default function Sidebar({ className }: SidebarProps) {
  const { areCustomizationOptionsEnabled } = useCustomizablePlayerContext()

  return (
    <div className={classNames('w-full h-full p-2', className)}>
      {areCustomizationOptionsEnabled ? <SourcesList /> : <LiveChat />}
    </div>
  )
}
