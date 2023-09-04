import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import ProfileIconPlaceholder from 'layouts/skeleton/profile-icon-placeholder'
import SearchBoxPlaceholder from 'layouts/skeleton/search-box-placeholder'
import TextPlaceholder from 'layouts/skeleton/text-placeholder'

interface HeaderProps {
  className?: string
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={classNames(
        'flex flex-row items-center justify-between shadow-md flex-nowrap pl-2 pr-2',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-start w-1/4 gap-6">
        <Link href="/">
          <Image
            src="/favicon.ico"
            alt="Tweak Icon"
            width={35}
            height={35}
            priority
          />
        </Link>
        <TextPlaceholder />
        <TextPlaceholder />
      </div>
      <div className="flex flex-row items-center justify-center">
        <SearchBoxPlaceholder />
      </div>
      <div className="flex flex-row items-center justify-end w-1/4 gap-6">
        <TextPlaceholder />
        <ProfileIconPlaceholder />
      </div>
    </header>
  )
}

export default Header
