import Head from 'next/head'
import Layout from 'components/Layout'
import FormCreateSignal from 'components/FormCreateSignal'

const CreateSignalPage = () => {
  return (
    <>
      <Head>
        <title>Create Signal - Reach Signal</title>
        <meta name='description' content='reate Signal' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <main className='container mx-auto max-w-6xl px-4'>
          <h1 className='mb-8 text-[calc(1em+8vh)] font-serif'>
            Create Signal
          </h1>
          <FormCreateSignal />
        </main>
      </Layout>
    </>
  )
}

export default CreateSignalPage
