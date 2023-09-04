import { HeartIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

import ProfileIconPlaceholder from 'layouts/skeleton/profile-icon-placeholder'

interface LeftSidebarProps {
  className?: string
}

export default function LeftSidebar({ className }: LeftSidebarProps) {
  return (
    <aside
      className={classNames(
        'flex flex-col items-center justify-start w-12 gap-3 p-4 bg-gray-200',
        className,
      )}
    >
      <HeartIcon className="text-black/50" />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <VideoCameraIcon className="text-black/50" />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <VideoCameraIcon className="text-black/50" />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
      <ProfileIconPlaceholder darker />
    </aside>
  )
}
