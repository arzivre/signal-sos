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
          <p className='text-gray-400'>
            Natural disaster frequently happening it would be easier if people
            can get information or connect to other so they can go where
            safeplace, and team rescue know where they need to go for fetch
            people need help
          </p>
          <br />
          <p className='text-gray-400'>
            This app is made to connect community when something like natural
            disaster happen, people who need help can create signal SOS, and
            people who provide help can create signal SHELTER so people know
            where to get help
          </p>
        </main>
      </Layout>
    </>
  )
}

export default AboutPage
