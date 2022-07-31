import Head from 'next/head'
import Layout from 'src/components/Layout'
import FormCreateSignal from 'src/components/FormCreateSignal'
import { signIn, useSession } from 'next-auth/react'

const CreateSignalPage = () => {
  const { status } = useSession()

  if (status === 'unauthenticated')
    return (
      <button
        onClick={() => signIn()}
        className='text-center text-xl text-white hover:underline'
      >
        Sign In
      </button>
    )

  return (
    <>
      <Head>
        <title>Create Signal - Reach Signal</title>
        <meta name='description' content='reate Signal' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <main className='container mx-auto max-w-7xl px-4'>
          <h1 className='mb-8 font-serif text-[calc(1em+8vh)] text-white'>
            Create Signal
          </h1>
          <FormCreateSignal />
        </main>
      </Layout>
    </>
  )
}

export default CreateSignalPage
