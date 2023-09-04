import { PropsWithChildren } from 'react'

import Header from 'layouts/skeleton/header'
import LeftSidebar from 'layouts/skeleton/left-sidebar'

type SkeletonLayoutProps = PropsWithChildren

export default function SkeletonLayout({ children }: SkeletonLayoutProps) {
  return (
    <>
      <Header className="fixed z-10 top-0 left-0 right-0 h-[50px] bg-white" />
      <LeftSidebar className="fixed bottom-0 left-0 top-[50px] w-[50px]" />
      <main className="ml-[50px] pt-[50px]">{children}</main>
    </>
  )
}
