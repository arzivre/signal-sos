import Layout from 'components/Layout'
import SignalList from 'components/SignalList'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <h1 className='mb-8 text-[calc(1em+8vh)] font-serif'>Signal</h1>
        <div className='my-10 container mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8'>
          <SignalList />
        </div>
      </Layout>
    </>
  )
}

export default Home
