import Head from 'next/head'
import Layout from 'src/components/Layout'

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About - Reach Signal</title>
        <meta name='description' content='Helping Hand' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <main className='container mx-auto my-20 max-w-7xl px-4 text-2xl text-gray-50'>
          <h1 className='mb-8 font-serif text-[calc(1em+8vh)]'>About</h1>
          <p>natural disaster frenquently happeing</p>
          <p>
            it would be esasier if people can get information or connect to
            other so they can go where safe place, and people know where they
            need to go
          </p>
          <p>
            This app is made to connect comunity when something like natural
            disaster happen, any individual need help from people create signal
            so people know where to go
          </p>
        </main>
      </Layout>
    </>
  )
}

export default AboutPage
