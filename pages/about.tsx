import Head from 'next/head'
import Layout from 'components/Layout'

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About - Reach Signal</title>
        <meta name='description' content='Helping Hand' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <main className='container mx-auto max-w-6xl'>
          <h1 className='mb-8 text-[calc(1em+8vh)] font-serif'>About</h1>
          <p>
            this web app is made to connect comunity when somtehing like natural
            disaster happen, or just any individual need help from people
          </p>
          <p>
            here i am live in indonsia surounding by many volcanic mount ,
            erupstion frequlenly hapenning
          </p>
          <p>
            it would be esaaasier if people can get information or connect to
            other so they can go where safe place, and people know what they can
            do to help
          </p>
        </main>
      </Layout>
    </>
  )
}

export default AboutPage