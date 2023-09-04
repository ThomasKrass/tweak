import type { NextPage } from 'next'
import Head from 'next/head'

import CustomizableStreamPlayer from 'components/customizable-stream-player'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          {`Customizable Stream - ${process.env.NEXT_PUBLIC_APP_NAME}`}
        </title>
      </Head>
      <CustomizableStreamPlayer />
    </>
  )
}

export default Index
