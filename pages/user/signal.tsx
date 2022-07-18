import type { NextPage } from 'next'
import Head from 'next/head'
import { Suspense } from 'react'
import Layout from 'components/Layout'
import SignalUserList from 'components/SignalUserList'

const UserSignalPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Reach Signal</title>
        <meta name='description' content='Helping Hand' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <h1 className='mb-8 text-[calc(1em+8vh)] font-serif'>Signal</h1>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8'>
          <Suspense fallback={`loading...`}>
            <SignalUserList />
          </Suspense>
        </div>
      </Layout>
    </>
  )
}

export default UserSignalPage
